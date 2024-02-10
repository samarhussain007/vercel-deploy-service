import express from "express";
import cors from "cors";
import { Worker } from "bullmq";
import { redisConnection } from "./services/redis";

const app = express();

app.use(cors());

const worker = new Worker(
  "build-queue",
  async (job) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log("New job bitch come and do it ", job.data);
  },
  {
    connection: redisConnection,
  }
);

app.listen(3001, () => {
  console.log("server is listning in the port 3001");
});
