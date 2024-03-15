import winston, { level } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import WinstonCloudwatch from "winston-cloudwatch";
import dotenv from "dotenv";
import os from "os";
import { info } from "console";

const {createLogger, format, transports} = winston;


dotenv.config();

const cloudWatchInfoTransport = new WinstonCloudwatch({
    logGroupName: 'safe',
    logStreamName: 'safe',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: 'us-east-2',
    level: 'info'
})
const cloudWatchErrorTransport = new WinstonCloudwatch({
    logGroupName: 'safe',
    logStreamName: 'safe',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: 'us-east-2',
    level: 'error'
})
const cloudWatchWarnTransport = new WinstonCloudwatch({
    logGroupName: 'safe',
    logStreamName: 'safe',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: 'us-east-2',
    level: 'warn'
});
const cloudWatchDebugTransport = new WinstonCloudwatch({
    logGroupName: 'safe',
    logStreamName: 'safe',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: 'us-east-2',
    level: 'info'
})


// Defining the logger format
const loggerFormat = format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.errors({stack: true}),
    format.splat(),
    format.json(),
    
)


const logger = createLogger({  
    level: 'info', 
    transports:[
       new transports.Console({
        format:loggerFormat,
        level: 'debug'
       }),
    cloudWatchInfoTransport,
    cloudWatchErrorTransport,
    cloudWatchWarnTransport,
    cloudWatchDebugTransport,
    ]
});

export default logger;