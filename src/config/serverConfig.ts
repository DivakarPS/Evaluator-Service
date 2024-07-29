import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

export default {
    PORT : process.env.PORT,
    REDIS_PORT : parseInt(process.env.REDIS_PORT || "6379",10),
    REDIS_HOST :  "127.0.0.1"
}