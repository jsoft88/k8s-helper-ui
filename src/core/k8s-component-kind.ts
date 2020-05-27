import { K8sConceptComponent } from './k8s-concept-component';

export class K8sComponentKind implements K8sConceptComponent {
    label = 'kind';
    description = `
        What kind of component for a given concept is being defined in this file.
        Example: PersistentVolume, Service, Pod, etc.`;
    values = [];
}
