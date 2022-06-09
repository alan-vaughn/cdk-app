import { StackProps, RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import EnvironmentAwareStack, { EnvironmentAwareStackProps } from './environment-aware-stack';

export default class AuthorizationStack extends EnvironmentAwareStack {
  public readonly userPool: UserPool;
  public readonly client: UserPoolClient;

  constructor(scope: Construct, id: string, props: EnvironmentAwareStackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, `${this.deployEnvironment}-userPool`, {
      removalPolicy: RemovalPolicy.DESTROY,
      signInAliases: {
        email: true
      }
    });

    const client = userPool.addClient(`${this.deployEnvironment}-webClient`, {
      userPoolClientName: "webClient",
      idTokenValidity: Duration.days(1),
      accessTokenValidity: Duration.days(1),
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
      },
    });

    this.userPool = userPool;
    this.client = client;

    new CfnOutput(this, "CognitoUserPoolId", {
      value: userPool.userPoolId,
      description: "userPoolId required for frontend settings",
    });
    new CfnOutput(this, "CognitoUserPoolWebClientId", {
      value: client.userPoolClientId,
      description: "clientId required for frontend settings",
    });
  }
}