import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2Output,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// const projectS3 = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: "AKIAQ3EGTAO5QULWTWV5",
//     secretAccessKey: "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",
//   },
// });

const projectS3 = new S3({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIAQ3EGTAO5QULWTWV5",
    secretAccessKey: "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",
  },
});

export const downloadS3Folder = async (id: string) => {
  try {
    if (!id) throw new Error("Id should be valid and present");
    console.log(`output/${id}/`);

    const command = new ListObjectsV2Command({
      Bucket: "samar-dev-bucket",
      Prefix: `output/${id}`,
    });

    const response: ListObjectsV2Output = await projectS3.send(command);

    const allPromises =
      response.Contents?.map(({ Key }) => {
        return new Promise(async (resolve) => {
          if (!Key) {
            resolve("");
            return;
          }

          const outputPath = path.join(
            __dirname.slice(0, __dirname.indexOf("/services")),
            Key
          );
          const outPutStream = fs.createWriteStream(outputPath);
          const stream = new WritableStream({
            write(chunk) {
              outPutStream.write(chunk);
            },
            close() {
              outPutStream.close();
            },
            abort(err) {
              outPutStream.destroy(err);
              throw err;
            },
          });
          const dirName = path.dirname(outputPath);

          if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
          }

          // const objectResponse = await projectS3.getObjecCom({
          //   Bucket: "samar-dev-bucket",
          //   Key: outputPath,
          // })

          const getObjectCommand = new GetObjectCommand({
            Bucket: "samar-dev-bucket",
            Key: Key,
          });

          const item = await projectS3.send(getObjectCommand);
          item.Body?.transformToWebStream()
            .pipeTo(stream)
            .then(() => resolve(""));
          console.log("awaiting");

          await Promise.all(allPromises?.filter((x) => x !== undefined));
        });
      }) || [];

    return response;
  } catch (error) {
    console.log(error);
  }
};
