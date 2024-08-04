import createContainer from "./containerFactory";
import { JAVA_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutorStrategy";


class JavaExecutor implements CodeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
            const rawBuffer: Buffer[]  =[];
        // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

        console.log("Intializing Java container");
        await pullImage(JAVA_IMAGE);

        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.java && javac main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java main`;
        console.log(runCommand);
        const javaDockerContainer = await createContainer(JAVA_IMAGE, [
            'bin/sh',
            '-c',
            runCommand
        ]);

        await javaDockerContainer.start();

        const loggerStream = await javaDockerContainer.logs({
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

            if(codeResponse.trim() === outputTestCase.trim()) { //Comparing TestCase matchings
                return {output: codeResponse, status: "SUCCESS"};
            } else {
                return {output: codeResponse, status: "WA"};
            }
            return {output: codeResponse, status: "COMPLETED"};
        } catch (error) {
            console.log("Error occurred", error);
            if(error === "TLE") {
                await javaDockerContainer.kill();
            }
            return {output: error as string, status: "ERROR"}
        } finally {
            await javaDockerContainer.remove();
        }
    }
    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]) : Promise<string> {
        // TODO: cleanup repisitive fetchDecodedStream
        // TODO: May be moved to the docker helper util'

        return new Promise((res, rej) => {
            const timeout = setTimeout(() => {
                console.log("Timeout called");
                rej("TLE");
            }, 2000);
            loggerStream.on('end', () => {
                // This callback executes when the stream ends
                clearTimeout(timeout);
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



export default JavaExecutor;