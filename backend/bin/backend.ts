#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StepFunctionsStack } from '../lib/stepf-stack';
import { AppsyncStack } from '../lib/appsync-stack';
import { StackConfig } from '../lib/project-config';

const app = new cdk.App();

let stackName = '';
const deployEnv = StackConfig.DEPLOY_ENV;

const generateStackProps = (stackName: string): cdk.StackProps => {
    return {
        stackName: `${stackName}-${deployEnv}`,
    }
}

stackName = 'appsync-stack';
const appsyncStack = new AppsyncStack(app, stackName, generateStackProps(stackName));

stackName = 'stepf-stack';
const stepfunctionsStack = new StepFunctionsStack(app, stackName, generateStackProps(stackName), appsyncStack);

