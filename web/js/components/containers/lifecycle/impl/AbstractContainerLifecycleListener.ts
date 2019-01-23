/**
 *
 */
import { Container } from '../../Container';
import { ContainerLifecycleListener } from '../ContainerLifecycleListener';
import { ContainerLifecycleState } from '../ContainerLifecycleState';
import { isPresent } from '../../../../Preconditions';

/**
 * Listens to the lifecycle of .page
 */
export abstract class AbstractContainerLifecycleListener
    implements ContainerLifecycleListener {
    protected readonly container: Container;

    // TODO: type this.. not sure what it is yet.
    protected listener: any;

    protected constructor(container: Container) {
        this.container = container;
        this.listener = null;
    }

    public register(callback: any) {
        this.listener = this._createListener(callback);

        const element = this.container.element;

        element.addEventListener('DOMNodeInserted', this.listener, false);
    }

    public _createContainerLifecycleEvent(visible: boolean) {
        return new ContainerLifecycleState({
            container: this.container,
            visible,
        });
    }

    public _createListener(callback: (state: ContainerLifecycleState) => void) {
        return (event: any) => {
            const containerLifecycleState = this.getStateFromEvent(event);

            if (isPresent(containerLifecycleState)) {
                callback(containerLifecycleState!);
            }
        };
    }

    public abstract getStateFromEvent(
        event: any
    ): ContainerLifecycleState | undefined;

    public abstract getState(): ContainerLifecycleState | undefined;

    public unregister() {
        this.container.element.removeEventListener(
            'DOMNodeInserted',
            this.listener,
            false
        );
        this.listener = null;
    }
}
