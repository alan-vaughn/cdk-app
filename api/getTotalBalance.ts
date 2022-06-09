import * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const db = new AWS.DynamoDB.DocumentClient();

const depositsTableName =  process.env.DEPOSITS_TABLE_NAME

export const handler = async (event: any = {}): Promise<any> => {
  
}
