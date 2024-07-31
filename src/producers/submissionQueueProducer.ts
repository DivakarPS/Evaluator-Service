import submissionQueue from "../queues/submissionQueue";
import { SUBMISSION_JOB, SUBMISSION_QUEUE } from "../utils/constants";

export default async function(payload: Record<string, unknown>){
    console.log("into sample queue with :", payload);
    await submissionQueue.add(SUBMISSION_JOB, payload);
    console.log("successfully added a new job");
}