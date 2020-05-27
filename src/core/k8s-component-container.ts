import { K8sConceptComponent } from './k8s-concept-component';
import { K8sComponentSimple } from './k8s-component-simple';
import { K8sComponentContainerPort } from './k8s-component-container-port';

export class K8sComponentContainer implements K8sConceptComponent {
    label = 'containers';
    description = `Specification for creation of a container to run on a pod.`;
    values = [];

    constructor() {
        const imageValue = new K8sComponentSimple();
        imageValue.label = 'image';
        imageValue.description = 'Image for the container to be created.';

        const containerNameValue = new K8sComponentSimple();
        containerNameValue.label = 'name';
        containerNameValue.description = 'Name for the container to be created based on the image';

        const containerEnvValue = new K8sComponentSimple();
        containerEnvValue.label = 'env';
        containerEnvValue.description = 'Key value pairs for setting environment values in the created container';

        const portValue = new K8sComponentContainerPort();

        this.values.push(imageValue);
        this.values.push(containerNameValue);
        this.values.push(containerEnvValue);
        this.values.push(portValue);
    }
}
