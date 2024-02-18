import { S3Client , PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'accessKeyId';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'secret';
// Configure AWS SDK with your credentials
const s3Client = new S3Client({
  region: 'us-east-2', // Replace with your AWS region
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Define bucket name and file details
const bucketName = 'techandtribe-safe';

// Upload image to S3 bucket
const uploadDataToS3 = async (fileName:string,fileData:any,ext:string) => {
  // const {convertedImageBuffer,ext} = await convertToPng(fileData);
  // const binaryBuffer = Buffer.from(fileData, 'base64');
  const base64Data = Buffer.from(fileData.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // const imageBuffer = await Jimp.read(binaryBuffer);
  const uploadParams = {
    Bucket: bucketName,
    Key: `${fileName}`,
    Body: base64Data,
    ContentEncoding: 'base64',
    ContentType: `image/${ext}`
  };
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Image uploaded successfully. Location:', data);
    return `https://${bucketName}.s3.us-east-2.amazonaws.com/${fileName}`;
    // console.log('Object URL:', objectUrl);
    
  } catch (err) {
    console.error('Error uploading image:', err);
  }
};



export default uploadDataToS3;
