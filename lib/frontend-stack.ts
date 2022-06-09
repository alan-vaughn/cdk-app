import EnvironmentAwareStack, { EnvironmentAwareStackProps } from './environment-aware-stack';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { OriginAccessIdentity, CloudFrontWebDistribution, PriceClass } from 'aws-cdk-lib/aws-cloudfront';
import * as path from "path";

// started from: https://github.com/aws-samples/aws-react-spa-with-cognito-auth/blob/main/frontend/provisioning/lib/frontend-stack.ts
export default class FrontendStack extends EnvironmentAwareStack {
  constructor(scope: Construct, id: string, props: EnvironmentAwareStackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, `${this.deployEnvironment}-WebsiteBucket`, {
      websiteErrorDocument: "index.html",
      websiteIndexDocument: "index.html",
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
    });

    const websiteIdentity = new OriginAccessIdentity(
      this,
      `${this.deployEnvironment}-WebsiteIdentity`
    );
    websiteBucket.grantRead(websiteIdentity);

    const websiteDistribution = new CloudFrontWebDistribution(
      this,
      `${this.deployEnvironment}-WebsiteDistribution`,
      {
        errorConfigurations: [
          {
            errorCachingMinTtl: 300,
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
              originAccessIdentity: websiteIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
        priceClass: PriceClass.PRICE_CLASS_ALL,
      }
    );

    new BucketDeployment(this, `${this.deployEnvironment}-WebsiteDeploy`, {
      sources: [
        Source.asset(`${path.resolve(__dirname)}/../frontend/build`),
      ],
      destinationBucket: websiteBucket,
      distribution: websiteDistribution,
      distributionPaths: ["/*"],
      memoryLimit: 1024,
    });

    new CfnOutput(this, `${this.deployEnvironment}-endpoint`, {
      description: "Frontend Endpoint",
      value: websiteDistribution.distributionDomainName,
    });
  }
}