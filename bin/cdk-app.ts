#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAppStack } from '../lib/cdk-app-stack';
import AuthorizationStack from '../lib/authorization-stack';
import FrontendStack from '../lib/frontend-stack';

const app = new cdk.App();

// staging environment stacks
const authStack = new AuthorizationStack(app, 'StagingAuthorizationStack', {
  deployEnviroment: 'staging'
})
new CdkAppStack(app, 'StagingCdkAppStack', {
  authorizationStack: authStack,
  deployEnviroment: 'staging'
});
new FrontendStack(app, 'StagingFrontendStack', {
  deployEnviroment: 'staging'
})
