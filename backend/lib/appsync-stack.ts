import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { StackConfig } from './project-config';


enum AppSyncQuery {
  getOrderStatus = 'getOrderStatus',
}

enum AppSyncMutation {
  createOrderReservation = 'createOrderReservation',
  confirmOrderReservation = 'confirmOrderReservation',
  cancelOrderReservation = 'cancelOrderReservation',
  finalizeOrder = 'finalizeOrder',
}

export class AppsyncStack extends cdk.Stack {
  
  deployEnv: string = StackConfig.DEPLOY_ENV;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, `${StackConfig.PROJ_PREF}-appsync-api-${this.deployEnv}`, {
      name: `${StackConfig.PROJ_PREF}-appsync-api-${this.deployEnv}`,
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    // create DynamoDB table
    const orderTableName = `${StackConfig.PROJ_PREF}-order-${this.deployEnv}`;
    const orderTable = new ddb.Table(this, orderTableName, {
      tableName: orderTableName,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    const appsyncLambdaResolver = new lambda.Function(this, `${StackConfig.PROJ_PREF}-appsyncLambdaResolver-${this.deployEnv}`, {
      functionName: `${StackConfig.PROJ_PREF}-appsyncLambdaResolver-${this.deployEnv}`,
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'appsyncLambdaResolver.handler',
      code: lambda.Code.fromAsset(`handlers/packaged/appsyncLambdaResolver.zip`),
      environment: {
        DYNAMODB_ORDER_TABLE_NAME: orderTable.tableName
      }
    });
    
    // set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('appsyncLambdaResolverDS', appsyncLambdaResolver);

    // set Queries and Mutations for AppSync API
    const queries = Object.values(AppSyncQuery);
    const mutations = Object.values(AppSyncMutation);

    for(const query of queries) {
      lambdaDs.createResolver({
        typeName: 'Query',
        fieldName: query
      });
    }

    for(const mutation of mutations) {
      lambdaDs.createResolver({
        typeName: 'Mutation',
        fieldName: mutation
      });
    }

    // enable the Lambda function to access the DynamoDB table (using IAM)
    orderTable.grantFullAccess(appsyncLambdaResolver);


    // print out the AppSync information to the terminal
    new cdk.CfnOutput(this, `GraphQLAPIURL-${this.deployEnv}`, {
      value: api.graphqlUrl
    });
 
    new cdk.CfnOutput(this, `GraphQLAPIKey-${this.deployEnv}`, {
      value: api.apiKey || ''
    });
  }
}