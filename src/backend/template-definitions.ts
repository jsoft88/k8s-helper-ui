import { CategoryComponentWrapper } from './ui-components';
import { K8sConceptComponent } from 'src/core/k8s-concept-component';

/**
 * This abstract class can be observed as the base class
 * for mapping from a @class which @implements `K8sConceptComponent in @namespace `core`
 * to a @class `CategoryComponentWrapper`. For example, from Pod definition in `core` to 
 * Pod definition for UI.
 */
export abstract class TemplateDefinitions {
    protected uiDefinition: CategoryComponentWrapper;
    protected coreDefinition: K8sConceptComponent[];
    protected typeOfDefinition: string;

    constructor(coreDefinition?: K8sConceptComponent[]) {
        this.coreDefinition = coreDefinition ? coreDefinition.slice() : [];
        this.uiDefinition = new CategoryComponentWrapper();
        this.assembleUIDefinition();
    }

    protected abstract assembleUIDefinition(): void;

    getUIDefinition(): CategoryComponentWrapper {
        return this.uiDefinition;
    }

    getCoreDefinition(): K8sConceptComponent[] {
        return this.coreDefinition;
    }

    setTypeOfTemplateDefinition(type: string) {
        this.typeOfDefinition = type;
    }

    getTypeOfTemplateDefinition(): string {
        return this.typeOfDefinition;
    }
}
