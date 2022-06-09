import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {decode as jwtDecode } from 'jsonwebtoken';

import { corsHeaders } from './constants'

const DEPOSITS_TABLE_NAME = process.env.DEPOSITS_TABLE_NAME || '';

const db = new AWS.DynamoDB.DocumentClient();

const depositsTableName =  process.env.DEPOSITS_TABLE_NAME

export const handler = async (event: any = {}): Promise<any> => {
  const userObject = jwtDecode(event.headers['Authorization'].split(' ')[1])

  if (!event.body) {
    return { 
      statusCode: 400, 
      headers: corsHeaders, 
      body: 'invalid request, you are missing the parameter body' 
    };
  }

  const parsedBody = event.body == 'object' ? event.body : JSON.parse(event.body);
  const item = {
    userId: userObject?.sub,
    depositId: uuidv4(),
    amount: parsedBody.amount,
    note: parsedBody.note,
  }

  const params = {
    TableName: DEPOSITS_TABLE_NAME,
    Item: item
  };

  try {
    await db.put(params).promise();
    return { statusCode: 201, body: '', headers: corsHeaders };
  } catch (dbError: any) {
    return { statusCode: 500, body: dbError.message, headers: corsHeaders };
  }
}
