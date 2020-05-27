/**
 * Interface for defining the different components in kubernetes concepts.
 * Each component will create a class implementing this interface.
 * Example components implementing this interface: podSpec, api, metadata, volumeMount, kind, etc.
 */
export interface K8sConceptComponent {
    label: string;
    description: string;
    values: K8sConceptComponent[];
}
