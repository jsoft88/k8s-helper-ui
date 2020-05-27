import { K8sComponentApi } from 'src/core/k8s-component-api';
import { K8sComponentKind } from 'src/core/k8s-component-kind';
import { K8sComponentMetadata } from 'src/core/k8s-component-metadata';
import { K8sComponentPodSpec } from 'src/core/k8s-component-pod-spec';
import { UIComponentFactory } from './utils';
import { TemplateDefinitions } from './template-definitions';
import { K8sConceptComponent } from 'src/core/k8s-concept-component';

export class PodDefinition extends TemplateDefinitions {

    constructor(coreDefinition?: K8sConceptComponent[]) {
        super(coreDefinition);
    }

    protected assembleUIDefinition(): void {
        this.coreDefinition.push(new K8sComponentApi());
        this.coreDefinition.push(new K8sComponentKind());
        this.coreDefinition.push(new K8sComponentMetadata());
        this.coreDefinition.push(new K8sComponentPodSpec());

        this.uiDefinition.setLabel('Pod Definition');
        this.uiDefinition.setDescription('Template for defining a Pod.');
        this.uiDefinition.setCategoryComponents(this.coreDefinition.map(cd => {
            return UIComponentFactory.getCategoryComponent(cd);
        }));
    }
}
