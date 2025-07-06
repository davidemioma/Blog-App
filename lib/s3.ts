import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const uploadFileToS3 = async ({
  key,
  contentType,
  file,
}: {
  file: Buffer;
  key: string;
  contentType: string;
}) => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: key,
      ContentType: contentType,
      Body: file,
    });

    const fileStatus = await s3Client.send(putObjectCommand);

    if (fileStatus["$metadata"].httpStatusCode !== 200) {
      console.log("Error sending file to AWS!");

      return null;
    }

    return `${process.env.AWS_CLOUD_FRONT_STREAM_URL}/${key}#1`;
  } catch (err) {
    console.log("Error sending file to AWS!", err);
  }
};

export const deleteFileFromS3 = async (key: string): Promise<boolean> => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || "",
        Key: key,
      })
    );

    return true;
  } catch (err) {
    console.error("S3 delete error:", err);

    return false;
  }
};
