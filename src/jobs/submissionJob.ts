import { Job } from "bullmq";
import  { IJob }  from "../types/bullmqJobDefinition";
import { submissionPayload } from "../types/submissionPayload";
import runPython from "../containers/runPythonDocker";

export default class SubmissionJob implements IJob {
    name: string
    payload: Record<string,submissionPayload>
    constructor(payload: Record<string,submissionPayload>){
        this.payload = payload;
        this.name = this.constructor.name;
    }
    handle = async (job?: Job ) => {
        console.log("Handler of the job called");
        if(job){
            console.log(job.id, job.name,job.data);
        }
        console.log(Object.keys(this.payload));
        const key = Object.keys(this.payload)[0];
        if(this.payload[key].language == "python"){
            const evaluatedResponse = await runPython(this.payload[key].code, "");
            console.log("Evaluated response is: ", evaluatedResponse);
        }
    };
    failed = (job?: Job) : void => {
        console.log("Job failed");
        if(job){
            console.log(job.id);
        }
    };
}
