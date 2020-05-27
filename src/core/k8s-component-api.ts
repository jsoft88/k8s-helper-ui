import { K8sConceptComponent } from './k8s-concept-component';

export class K8sComponentApi implements K8sConceptComponent {
    label = 'api';
    description: 'Api version for the component to be defined. Example: v1, v2, etc.';
    values = [];
}
