import { K8sConceptComponent } from './k8s-concept-component';
import { K8sComponentSimple } from './k8s-component-simple';

export class K8sComponentContainerPort implements K8sConceptComponent {
    label = 'ports';
    description = 'Ports array to export in the pod.';
    values = [];

    constructor() {
        const containerPortVal = new K8sComponentSimple();
        containerPortVal.label = 'containerPort';
        containerPortVal.description = 'Port to expose on the Pods IP address.';

        const hostPortVal = new K8sComponentSimple();
        hostPortVal.label = 'hostPort';
        hostPortVal.description = 'Port to expose on the host IP address. if provided, must be a number 0<x<65536';

        const protocolVal = new K8sComponentSimple();
        protocolVal.label = 'protocol';
        protocolVal.description = 'Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP"';

        const nameVal = new K8sComponentSimple();
        nameVal.label = 'name';
        nameVal.description = 'Name for the port, that can be referenced by services. Each named port in a pod must be unique.';

        this.values.push(containerPortVal);
        this.values.push(hostPortVal);
        this.values.push(protocolVal);
        this.values.push(nameVal);
    }
}
