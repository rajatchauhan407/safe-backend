import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";


const {createLogger, format, transports} = winston;

// Defining the logger format
const loggerFormat = format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.errors({stack: true}),
    format.splat(),
    format.json()
)


// create a transport for info logs
const errorTransport = new DailyRotateFile({
    level:'error',
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
})

// create a logger instance

const logger = createLogger({   
    format: loggerFormat,
    transports:[
        errorTransport
    ]
});

export default logger;