import { ContainerProvider } from '../ContainerProvider';
import { ThumbnailContainerLifecycleListener } from '../../lifecycle/impl/ThumbnailContainerLifecycleListener';
import { Container } from '../../Container';

export class ThumbnailContainerProvider extends ContainerProvider {
    public getContainers() {
        return super._getContainers('.thumbnail');
    }

    public createContainerLifecycleListener(container: Container) {
        return new ThumbnailContainerLifecycleListener(container);
    }
}
