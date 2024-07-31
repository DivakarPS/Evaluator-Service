import createContainer from "./containerFactory";
import { CPP_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runCpp(code: string, inputTestCase: string) {
    const rawBuffer: Buffer[]  =[];
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

    console.log("Intializing Java container");

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | stdbuf -oL -eL ./main`;
    console.log(runCommand);
    const cppDockerContainer = await createContainer(CPP_IMAGE, [
        'bin/sh',
        '-c',
        runCommand
    ]);

    await cppDockerContainer.start();

    const loggerStream = await cppDockerContainer.logs({
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

    await cppDockerContainer.remove();
}

export default runCpp;