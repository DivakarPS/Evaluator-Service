import { Worker } from "bullmq";

import submissionJob from "../jobs/submissionJob";
import { Job } from "bullmq";

import redisConnection from "../config/redisConfig";
import { SUBMISSION_JOB } from "../utils/constants";

export default async function SubmissionWorker(queueName: string){
    new Worker(
        queueName,
        async (job: Job) => {
            if(job.name === SUBMISSION_JOB){
                const submissionJobInstance = new submissionJob(job.data);
                submissionJobInstance.handle(job);
            }
        },
        {
            connection: redisConnection
        }
    )
}