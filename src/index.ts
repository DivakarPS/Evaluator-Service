import express, { Express } from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./worker/SampleWorker";

const app: Express = express();


app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`)

  sampleQueueProducer("SampleJob", {
    name: "divps",
    company: "Oracle"
  });

  SampleWorker("SampleQueue");

})