import * as AWS from "aws-sdk";
import { decode as jwtDecode } from "jsonwebtoken";

import { corsHeaders } from "./constants";

const DEPOSITS_TABLE_NAME = process.env.DEPOSITS_TABLE_NAME || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any = {}): Promise<any> => {
  const userObject = jwtDecode(event.headers["Authorization"].split(" ")[1]);

  const params = {
    TableName: DEPOSITS_TABLE_NAME,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": userObject?.sub,
    },
  };

  try {
    const response = await db.query(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(response.Items),
      headers: corsHeaders,
    };
  } catch (dbError: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: dbError.message,
        userId: userObject?.sub,
      }),
      headers: corsHeaders,
    };
  }
};
