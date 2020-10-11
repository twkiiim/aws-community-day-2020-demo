import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as stepf from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import { StackConfig } from './project-config';
import { AppsyncStack } from './appsync-stack';

enum LambdaFunctions {
  stripeWebhook = 'stripeWebhook',
  requestDelivery = 'requestDelivery',
  cancelDelivery = 'cancelDelivery',
  cancelOrder = 'cancelOrder',
  cancelPayment = 'cancelPayment',
  confirmOrder = 'confirmOrder',
  orderTransactionDone = 'orderTransactionDone',
}

export class StepFunctionsStack extends cdk.Stack {

  deployEnv: string = StackConfig.DEPLOY_ENV;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps, refStack?: AppsyncStack) {
    super(scope, id, props);

    const lambdaFuncNames = Object.values(LambdaFunctions);
    const lambdaFuncMap = this.registerTasks(lambdaFuncNames);

    lambdaFuncMap.get(LambdaFunctions.confirmOrder)!.addEnvironment('APPSYNC_API_ENDPOINT_URL', refStack!.APPSYNC_API_ENDPOINT_URL);
    lambdaFuncMap.get(LambdaFunctions.confirmOrder)!.addEnvironment('APPSYNC_API_KEY', refStack!.APPSYNC_API_KEY);
    lambdaFuncMap.get(LambdaFunctions.cancelOrder)!.addEnvironment('APPSYNC_API_ENDPOINT_URL', refStack!.APPSYNC_API_ENDPOINT_URL);
    lambdaFuncMap.get(LambdaFunctions.cancelOrder)!.addEnvironment('APPSYNC_API_KEY', refStack!.APPSYNC_API_KEY);
    lambdaFuncMap.get(LambdaFunctions.orderTransactionDone)!.addEnvironment('APPSYNC_API_ENDPOINT_URL', refStack!.APPSYNC_API_ENDPOINT_URL);
    lambdaFuncMap.get(LambdaFunctions.orderTransactionDone)!.addEnvironment('APPSYNC_API_KEY', refStack!.APPSYNC_API_KEY);

    const taskStates = this.registerTaskStates(lambdaFuncMap, lambdaFuncNames);
    
    const startOrderTransaction = new stepf.Parallel(this, `startOrderTransaction-${this.deployEnv}`, { resultPath: '$.parallelTasks' });
    const compensateOrderTransaction = new stepf.Parallel(this, `compensateOrderTransaction-${this.deployEnv}`, { resultPath: '$.parallelTasks' });

    // set abbreviations
    const lf = LambdaFunctions;
    const ts = taskStates;

    // success flow
    ts.get(lf.stripeWebhook).next(
      startOrderTransaction
        .branch(
          ts.get(lf.confirmOrder), 
          ts.get(lf.requestDelivery),
        )
        .next(ts.get(lf.orderTransactionDone))
    );
    
    // failure flow - stripeWebhook to orderTransactionDone
    ts.get(lf.stripeWebhook).addCatch(compensateOrderTransaction, { resultPath: '$.error' })

    // failure flow - startOrderTransaction to orderTransactionDone
    startOrderTransaction.addCatch(compensateOrderTransaction, { resultPath: '$.error' });
    
    compensateOrderTransaction.branch(
      ts.get(lf.cancelPayment), 
      ts.get(lf.cancelDelivery), 
      ts.get(lf.cancelOrder),
    ).next(ts.get(lf.orderTransactionDone))
    

    // set up Step Functions State Machine
    const stateMachine = new stepf.StateMachine(this, `${StackConfig.PROJ_PREF}-stepf-statemachine-${this.deployEnv}`, {
      stateMachineName: `${StackConfig.PROJ_PREF}-stepf-statemachine-${this.deployEnv}`,
      definition: ts.get(lf.stripeWebhook)
    });

    const apiRole = new iam.Role(this, `${StackConfig.PROJ_PREF}-apigw-stepf-start-execution-role-${this.deployEnv}`, {
      roleName: `${StackConfig.PROJ_PREF}-apigw-stepf-start-execution-role-${this.deployEnv}`,
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
    });

    stateMachine.grantStartExecution(apiRole);

    // API Gateway ( AWS Integration with Step Functions )
    const integration = new apigw.AwsIntegration({
      service: 'states',
      action: 'StartExecution',
      options: {
        credentialsRole: apiRole,
        passthroughBehavior: apigw.PassthroughBehavior.NEVER,
        requestTemplates: {
          'application/json': JSON.stringify({
            stateMachineArn: stateMachine.stateMachineArn,
            input: `$util.escapeJavaScript($input.json('$'))`
          })
        },
        integrationResponses: [
          {
            selectionPattern: '200',
            statusCode: '200',
            responseTemplates: {
              'application/json': `$input.json('$')`
            },
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers': `'*'`,
              'method.response.header.Access-Control-Allow-Origin': `'*'`,
              'method.response.header.Access-Control-Allow-Credentials': `'*'`,
              'method.response.header.Access-Control-Allow-Methods': `'*'`,
            }
          }
        ]
      }
    });

    const methodOption = 
    {
      methodResponses: [
        {
          statusCode: '200',
          responseModels: {'application/json': apigw.Model.EMPTY_MODEL},
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    };


    const api = new apigw.RestApi(this, `${StackConfig.PROJ_PREF}-stepf-http-endpoint-${this.deployEnv}`, {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      },
      deployOptions: {
        stageName: `${this.deployEnv}`,
      },
    });
    const stripeWebhookEndpoint = api.root.addResource('stripe-webhook');
    stripeWebhookEndpoint.addMethod('POST', integration, methodOption);
    
  }
    

  registerTasks(taskNames: string[]) {
    let taskMap = new Map<string, lambda.Function>();

    for(const taskName of taskNames) {
      const task = new lambda.Function(this, `task-${taskName}-${this.deployEnv}`, {
        functionName: `${StackConfig.PROJ_PREF}-${taskName}-${this.deployEnv}`,
        runtime: lambda.Runtime.PYTHON_3_7,
        code: lambda.Code.fromAsset(`handlers/packaged/${taskName}.zip`),
        handler: `${taskName}.handler`,
      });
      taskMap.set(taskName, task);
    }

    return taskMap;
  }

  registerTaskStates(l: Map<string, lambda.Function>, taskNames: string[]) {
    const lf = LambdaFunctions;
    
    let taskStateMap = new Map();

    for(const taskName of taskNames) {
      const taskState = new tasks.LambdaInvoke(this, `state-${taskName}-${this.deployEnv}`, {
        lambdaFunction: l.get(taskName)!,
        retryOnServiceExceptions: false,
      });

      switch( taskName ) {
        case lf.cancelPayment || lf.cancelDelivery || lf.cancelOrder :
          taskState.addRetry({
            maxAttempts: 3,
            backoffRate: 2,
          })
          break;
      }
      taskStateMap.set(taskName, taskState);
    }


    return taskStateMap;
  }
}
