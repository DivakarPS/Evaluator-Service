import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput {

    let offset = 0;
    const output: DockerStreamOutput = { stdout: "", stderr: "" };

    while(offset < buffer.length){
        //we read data in chunks of size 8, where first 4 bytes are type of the steam and next 4 bytes are length of the data which we are going to consume
        const typeOfStream = buffer[offset];
        //we are reading the type of the stream, which will be 1 for stdout and 2 for stderr

        const length = buffer.readUInt32BE(offset + 4);
        //we are reading the length of the data which we are going to consume which is present from [4-8] bytes of the header

        offset += DOCKER_STREAM_HEADER_SIZE;
        //we are moving the offset by 8 bytes as we have already read the header

        if(typeOfStream == 1){
            //if the typeOfStream is 1, then we are reading the data from stdout
            output.stdout += buffer.toString("utf-8", offset, offset + length);
        } else if(typeOfStream == 2){
            //if the typeOfStream is 2, then we are reading the data from stderr
            output.stderr += buffer.toString("utf-8", offset, offset + length);
        }

        offset += length;
        //we are moving the offset by the length of the data which we have read to read the next chunk
    }
    return output;
}