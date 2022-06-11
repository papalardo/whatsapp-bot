import Queue from 'bull';
import config from "../config/index.js";
import { JOBS } from "../jobs/index.js";

export const QUEUE_LIST = {
    DEFAULT: 'DEFAULT'
}

const QueueInstances = () => {
    const instances = {
        DEFAULT: new Queue('default', config.QUEUE.DEFAULT_CONNECTION)
    }

    const work = () => {
        for(let jobName in JOBS) {
            const job = JOBS[jobName];

            const queue = instances[job.queue || 'DEFAULT'];

            if (queue === undefined) {
                throw new Error('Invalid Queue');
            }

            queue.process(jobName, job.concurrency || 1, job.handler);
        }

        for(let queueKey in QUEUE_LIST) {
            instances[QUEUE_LIST[queueKey]].clean(5000);
        }
    }

    work();

    return {
        instances,
        work,
    }
}

export default QueueInstances();