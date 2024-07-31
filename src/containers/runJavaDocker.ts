import createContainer from "./containerFactory";
import { JAVA_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runJava(code: string, inputTestCase: string) {
    const rawBuffer: Buffer[]  =[];
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

    console.log("Intializing Java container");

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
        rawBuffer.push(chunk.toString());
    })

    await new Promise((res) => {
        loggerStream.on("end", () => {
            console.log("Python container logs ended");
            const completeBuffer = Buffer.concat(rawBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodedStream);
        })
    })

    await javaDockerContainer.remove();
}

export default runJava;