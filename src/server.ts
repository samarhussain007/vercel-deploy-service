import express from "express";
import cors from "cors";
import { Worker } from "bullmq";
import { redisConnection } from "./services/redis";
import { downloadS3Folder } from "./services/s3";

const app = express();

app.use(cors());
downloadS3Folder("SKJ4d");
const worker = new Worker(
  "build-queue",
  async (job) => {
    console.log("New job bitch come and do it ", job.data);
  },
  {
    connection: redisConnection,
  }
);

app.listen(3001, () => {
  console.log("server is listning in the port 3001");
});
