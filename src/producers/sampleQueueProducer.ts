import sampleQueue from "../queues/sampleQueue";

export default async function(name: string, payload: Record<string, unknown>){
    console.log("into sample queue with :",name, payload);
    await sampleQueue.add(name, payload);
    console.log("successfully added a new job");
}