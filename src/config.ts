import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.TOKEN!,
  client_id: process.env.CLIENT_ID!,
  DISCORD_DEV_ID: process.env.DISCORD_DEV_ID!,
};