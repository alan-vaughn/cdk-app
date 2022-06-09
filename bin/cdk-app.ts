#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAppStack } from '../lib/cdk-app-stack';
import AuthorizationStack from '../lib/authorization-stack';
import FrontendStack from '../lib/frontend-stack';

const app = new cdk.App();

// staging environment stacks
const stagingAuthStack = new AuthorizationStack(app, 'StagingAuthorizationStack', {
  deployEnviroment: 'staging'
})
new CdkAppStack(app, 'StagingCdkAppStack', {
  authorizationStack: stagingAuthStack,
  deployEnviroment: 'staging'
});
new FrontendStack(app, 'StagingFrontendStack', {
  deployEnviroment: 'staging'
})

// production enviroment stacks
const prodAuthStack = new AuthorizationStack(app, 'ProdAuthorizationStack', {
  deployEnviroment: 'prod'
})
new CdkAppStack(app, 'ProdCdkAppStack', {
  authorizationStack: prodAuthStack,
  deployEnviroment: 'prod'
});
new FrontendStack(app, 'ProdFrontendStack', {
  deployEnviroment: 'prod'
})
