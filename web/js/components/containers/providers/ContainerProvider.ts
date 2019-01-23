/**
 * @abstract
 */
import { Container } from '../Container';
import { ContainerLifecycleListener } from '../lifecycle/ContainerLifecycleListener';

export class ContainerProvider {
    /**
     * Return all containers in the document indexed by their ID.  For pages
     * and thumbnails this is just going to be the page number.
     *
     * @return {Object<number,Container>}
     */
    public getContainers(): { [key: number]: Container } {
        throw new Error('Not implemented');
    }

    /**
     *
     * @return {Object<number,Container>}
     */
    public _getContainers(selector: string) {
        const result: { [key: number]: Container } = {};

        const elements = Array.from(document.querySelectorAll(selector));

        elements.forEach(element => {
            const id = parseInt(element.getAttribute('data-page-number')!);
            const container = new Container({ id, element });
            result[id] = container;
        });

        return result;
    }

    /**
     * Get the {ContainerLifecycleListener} to use with the container types.
     *
     */
    public createContainerLifecycleListener(
        container: Container
    ): ContainerLifecycleListener {
        throw new Error('Not implemented');
    }
}
