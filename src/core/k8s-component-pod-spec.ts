import { K8sConceptComponent } from './k8s-concept-component';
import { K8sComponentContainer } from './k8s-component-container';
import { K8sComponentSimple } from './k8s-component-simple';

export class K8sComponentPodSpec implements K8sConceptComponent {
    label = 'spec';
    description = `
    Specifications for the pod being created. A child of spec could be for example containers, volumes, etc.
    `;
    values = [];

    constructor() {
        const containersSpec = new K8sComponentContainer();
        const volumesSpecValue = new K8sComponentSimple();
        volumesSpecValue.label = 'persistentVolumeClaim';
        volumesSpecValue.description = 'Claim an existent persistent volume.';
        volumesSpecValue.values = [];

        const volumeClaimValue = new K8sComponentSimple();
        volumeClaimValue.label = 'claimName';
        volumeClaimValue.description = 'Name of the persistent volume you wish to claim';

        volumesSpecValue.values.push(volumeClaimValue);

        this.values.push(containersSpec);
        this.values.push(volumesSpecValue);
    }
}
