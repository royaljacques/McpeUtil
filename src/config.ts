import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.TOKEN!,
  client_id: process.env.CLIENT_ID!,
};