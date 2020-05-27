import { K8sConceptComponent } from './k8s-concept-component';
import { K8sComponentSimple } from './k8s-component-simple';

export class K8sComponentVolumeMount implements K8sConceptComponent {
    label = 'volumeMount';
    description = 'Describes a mounting of a Volume within a container.';
    values = [];

    constructor() {
        const mountPathValue = new K8sComponentSimple();
        mountPathValue.label = 'mountPath';
        mountPathValue.description = 'Path within the container at which the volume should be mounted';
        mountPathValue.values = [];

        const mountNameValue = new K8sComponentSimple();
        mountNameValue.label = 'name';
        mountNameValue.description = 'This must match the Name of a Volume';

        this.values.push(mountPathValue);
        this.values.push(mountNameValue);
    }
}
