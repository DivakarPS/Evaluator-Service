import Docker, { Container } from "dockerode";

import createContainer from "./containerFactory";
import { TestCases } from "../types/testCases";
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string, inputTestCase: string) {
    const rawBuffer: Buffer[]  =[];
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

    console.log("Intializing Python container");

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

    const response = await new Promise((res) => {
        loggerStream.on("end", () => {
            console.log("Python container logs ended");
            console.log(rawBuffer);
            const completeBuffer = Buffer.concat(rawBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodedStream);
        })
    })

    await pythonDockerContainer.remove();
    return response;
}

export default runPython;