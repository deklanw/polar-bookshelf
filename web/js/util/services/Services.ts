import { StartableService, StoppableService } from './Service';
import { Logger } from '../../logger/Logger';

const log = Logger.create();

export class Services {
    public static async start(...services: StartableService[]) {
        const promises: Array<Promise<any>> = [];

        services.forEach(service => {
            log.info('Starting service: ' + service.constructor.name);
            promises.push(service.start());
        });

        await Promise.all(promises);
    }

    public static stop(serviceReferences: {
        [name: string]: StoppableService;
    }): void {
        Object.entries(serviceReferences).forEach(serviceReference => {
            const name = serviceReference[0];
            const service = serviceReference[1];

            const message = `Stopping service ${name}...`;

            log.info(message);

            service.stop();

            log.info(message + 'done');
        });
    }
}
