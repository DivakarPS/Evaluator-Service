import EvaluationQueue from "../queues/evaluationQueue";
import { SUBMISSION_JOB, SUBMISSION_QUEUE } from "../utils/constants";

export default async function(payload: Record<string, unknown>){
    console.log("into sample queue with :", payload);
    await EvaluationQueue.add("EvaluationJob", payload);
    console.log("successfully added a new job");
}