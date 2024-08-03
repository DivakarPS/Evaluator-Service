import { Job } from "bullmq";
import  { IJob }  from "../types/bullmqJobDefinition";
import { submissionPayload } from "../types/submissionPayload";
import runPython from "../containers/pythonExecutor";
import runCpp from "../containers/runCppDocker";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutorStrategy";
import createExecutor from "../utils/ExecutorFactory";

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
            console.log(Object.keys(this.payload));
            const key = Object.keys(this.payload)[0];
            const language = this.payload[key].language;
            const code = this.payload[key].code;
            const inputTestCase = this.payload[key].inputTestCase;
            // if(language == "cpp"){
            //     const evaluatedResponse = await runCpp(this.payload[key].code, inputTestCase);
            //     console.log("Evaluated response is: ", evaluatedResponse);
            // }
            const strategy =  createExecutor(language);
            if(strategy != null){
                const response : ExecutionResponse = await strategy.execute(code, "");
                if(response.status == "COMPLETED"){
                    console.log("Code Executed Successfully");
                    console.log(response);
                }else{
                    console.log("Code Execution failed");
                    console.log(response);
                }
            }
        }
    };
    failed = (job?: Job) : void => {
        console.log("Job failed");
        if(job){
            console.log(job.id);
        }
    };
}
