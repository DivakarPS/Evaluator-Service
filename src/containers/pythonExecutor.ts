import Docker, { Container, Exec } from "dockerode";

import createContainer from "./containerFactory";
import { TestCases } from "../types/testCases";
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutorStrategy";
import DockerStreamOutput from "../types/dockerStreamOutput";


class PythonExecutor implements CodeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
        const rawBuffer: Buffer[]  =[];
        // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

        console.log("Intializing Python container");
        await pullImage(PYTHON_IMAGE);

        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
        const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
            'bin/sh',
            '-c',
            runCommand
        ]);
        console.log("run command:", runCommand);
        await pythonDockerContainer.start();

        
        const loggerStream = await pythonDockerContainer.logs({
            follow: true,
            stdout: true,
            stderr: true,
            timestamps: false
        });
        

        loggerStream.on("data", (chunk) => {
            rawBuffer.push(chunk);
        })

        try {
            const codeResponse : string = await this.fetchDecodedStream(loggerStream, rawBuffer);
            return {output: codeResponse, status: "COMPLETED"};
        } catch (error) {
            return {output: error as string, status: "ERROR"}
        } finally {
            await pythonDockerContainer.remove();
        }
    
    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]) : Promise<string> {
        // TODO: cleanup repisitive fetchDecodedStream
        // TODO: May be moved to the docker helper util'

        return new Promise((res, rej) => {
            // const timeout = setTimeout(() => {
            //     console.log("Timeout called");
            //     rej("TLE");
            // }, 2000);
            loggerStream.on('end', () => {
                // This callback executes when the stream ends
                // clearTimeout(timeout);
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                // console.log(decodedStream);
                // console.log(decodedStream.stdout);
                if(decodedStream.stderr) {
                    rej(decodedStream.stderr);
                } else {
                    res(decodedStream.stdout);
                }
            });
        })
    }
}

export default PythonExecutor;