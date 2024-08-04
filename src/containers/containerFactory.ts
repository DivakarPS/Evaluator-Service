//Any file that is responsible for taking some config and creating objects its called as factory in programming

import Docker, { Container } from "dockerode";

async function createContainer(imageName: string, cmdExecutable: string[]): Promise<Container> {
    const docker = new Docker();
    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true,
        AttachStderr: true,
        AttachStdout: true,
        Tty: false,
        HostConfig: {
            Memory: 1024 * 1024 *512; //Handling MLE
        }
        OpenStdin: true
    });
    
    return container;
}

export default createContainer;