import { K8sConceptComponent } from './k8s-concept-component';
import { K8sComponentSimple } from './k8s-component-simple';

export class K8sComponentMetadata implements K8sConceptComponent {
    label = 'metadata';
    description = `
        Metadata around the object to be created. For example, possible entry in metadata field
        might be "name", as the name to set to a pod. This can also include labels, annotations, etc.
        This will be clearer when prompted to provide values for metadata when creating some k8s concept.
    `;
    values: K8sConceptComponent[] = [];

    constructor() {
        const metadataAnnotations = new K8sComponentSimple();
        metadataAnnotations.label = 'annotations';
        metadataAnnotations.description = `
        Annotations is an unstructured key value map stored with a resource that may be set
        by external tools to store and retrieve arbitrary metadata.
        `;

        const metadataName = new K8sComponentSimple();
        metadataName.label = 'name';
        metadataName.description = 'Name for the concept being created';

        const metadataNamespace = new K8sComponentSimple();
        metadataNamespace.label = 'namespace';
        metadataNamespace.description = `
            Namespace defines the space within each name must be unique.
            An empty namespace is equivalent to the "default" namespace
        `;

        const metadataLabel = new K8sComponentSimple();
        metadataLabel.label = 'labels';
        metadataLabel.description = `
        Map of string keys and values that can be used to organize and categorize (scope and select) objects.
        May match selectors of replication controllers and services
        `;

        this.values.push(metadataNamespace);
        this.values.push(metadataAnnotations);
        this.values.push(metadataName);
        this.values.push(metadataLabel);
    }
}
