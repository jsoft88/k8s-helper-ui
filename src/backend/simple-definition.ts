import { TemplateDefinitions } from './template-definitions';
import { K8sConceptComponent } from 'src/core/k8s-concept-component';
import { UIComponentFactory } from './utils';

export class SimpleDefinition extends TemplateDefinitions {
    constructor(coreDefinition: K8sConceptComponent) {
        super([coreDefinition]);
    }

    protected assembleUIDefinition(): void {
        this.uiDefinition.setLabel(this.coreDefinition[0].label);
        this.uiDefinition.setDescription(this.coreDefinition[0].description);
        this.uiDefinition.setCategoryComponents(this.coreDefinition.map(cd => {
            return UIComponentFactory.getCategoryComponent(cd);
        }));
    }

}
