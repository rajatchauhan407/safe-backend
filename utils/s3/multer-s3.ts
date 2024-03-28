// Import necessary libraries
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from "@aws-sdk/client-s3";

// AWS S3 configuration
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Add your secret access key
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Add your access key id
    region: process.env.AWS_REGION, // Add your bucket region
});

const s3 = new S3Client({ region: 'us-east-2' });


export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'techandtribe-safe', // Add your bucket name
        key: function (req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname); // Use date to make filename unique
        },
        
    }),
});
