import express, { Express } from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./worker/SampleWorker";
import bodyParser from "body-parser";

import bullBoardAdapter from "./config/bullmqUiConfig";
import sampleQueue from "./queues/sampleQueue";
import runPython from "./containers/runPythonDocker";
import runCpp from "./containers/runCppDocker";
import runJava from "./containers/runJavaDocker";

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());


app.use("/api", apiRouter);

app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  
  console.log(`Server is running on port ${serverConfig.PORT}`)

  
})