import {decode as jwtDecode } from 'jsonwebtoken'

export const handler = async (event) => {
  const userId = jwtDecode(event.headers['Authorization'].split(' ')[1])

  return { 
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(userId)
  };
};
