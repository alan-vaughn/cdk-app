import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

const validEnviroments = ["staging", "prod"];

export interface EnvironmentAwareStackProps extends StackProps {
  deployEnviroment: string;
}

export default class EnvironmentAwareStack extends Stack {
  public readonly deployEnvironment: string;

  constructor(scope: Construct, id: string, props: EnvironmentAwareStackProps) {
    super(scope, id, props);

    // ensure that we're deploying to a supported enviroment
    const deployEnvironment = props.deployEnviroment;
    if (!validEnviroments.includes(deployEnvironment)) {
      throw new Error("Missing deploy enviroment");
    }

    this.deployEnvironment = deployEnvironment;
  }
}
