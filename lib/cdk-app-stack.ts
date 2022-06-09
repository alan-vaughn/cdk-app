import { join } from 'path'

import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi, CfnAuthorizer, LambdaIntegration, AuthorizationType, Cors } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

import EnvironmentAwareStack, { EnvironmentAwareStackProps } from './environment-aware-stack';
import AuthorizationStack from './authorization-stack';

interface APIStackProps extends EnvironmentAwareStackProps {
  authorizationStack: AuthorizationStack;
}

export class CdkAppStack extends EnvironmentAwareStack {
  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    // create our single database table (can move into its own stack)
    const dynamoTable = new Table(this, `${this.deployEnvironment}-deposits`, {
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'depositId',
        type: AttributeType.STRING,
      },
      tableName: `${this.deployEnvironment}-deposits`,
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for real code
    });

    // define our lambda functions
    const basicFunction = new NodejsFunction(this, `${this.deployEnvironment}-basicResponseFunction`, {
      entry: join(__dirname, '..', 'api', 'testEndpoint.js'),
      runtime: Runtime.NODEJS_16_X
    });

    const getBalancesFunction = new NodejsFunction(this, `${this.deployEnvironment}-getBalancesFunction`, {
      entry: join(__dirname, '..', 'api', 'getBalances.ts'),
      runtime: Runtime.NODEJS_16_X,
      environment: {
        DEPOSITS_TABLE_NAME: dynamoTable.tableName
      }
    });

    const addBalanceFuncton = new NodejsFunction(this, `${this.deployEnvironment}-addBalanceFunction`, {
      entry: join(__dirname, '..', 'api', 'addBalance.ts'),
      runtime: Runtime.NODEJS_16_X,
      environment: {
        DEPOSITS_TABLE_NAME: dynamoTable.tableName
      }
    });

    // set up table permissions
    dynamoTable.grantReadWriteData(getBalancesFunction)
    dynamoTable.grantReadWriteData(addBalanceFuncton)

    // api definition
    const basicRestApi = new LambdaRestApi(this, `${this.deployEnvironment}-restApi`, {
      restApiName: `${this.deployEnvironment} REST API`,
      handler: basicFunction,
      proxy: false,
      // from: https://bobbyhadz.com/blog/add-cors-api-aws-cdk
      defaultCorsPreflightOptions: {
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: Cors.ALL_METHODS,
        allowCredentials: true,
        allowOrigins: Cors.ALL_ORIGINS,
      }
    });

    const userPool = props.authorizationStack.userPool;

    // Authorizer for the API that uses the
    // Cognito User pool to Authorize users.
    const authorizer = new CfnAuthorizer(this, `${this.deployEnvironment}-cfnAuth`, {
      restApiId: basicRestApi.restApiId,
      name: `${this.deployEnvironment}-BasicRestAPIAuthorizor`,
      type: 'COGNITO_USER_POOLS',
      identitySource: 'method.request.header.Authorization',
      providerArns: [userPool.userPoolArn],
    })

    // add our two endpoints to the api
    const balances = basicRestApi.root.addResource('balances')
    balances.addMethod('GET', new LambdaIntegration(getBalancesFunction), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.ref
      }
    })
    balances.addMethod('POST', new LambdaIntegration(addBalanceFuncton), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.ref
      }
    })
  }
}
