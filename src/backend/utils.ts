import { K8sComponentApi } from 'src/core/k8s-component-api';
import { CategoryComponent, CategoryComponentWrapper, CategoryComponentMetadataDef } from './ui-components';
import { K8sConceptComponent } from 'src/core/k8s-concept-component';
import { K8sComponentKind } from 'src/core/k8s-component-kind';
import { K8sComponentContainer } from 'src/core/k8s-component-container';
import { K8sComponentMetadata } from 'src/core/k8s-component-metadata';
import { K8sComponentPodSpec } from 'src/core/k8s-component-pod-spec';
import { K8sComponentContainerPort } from 'src/core/k8s-component-container-port';
import { K8sComponentVolumeMount } from 'src/core/k8s-component-volume-mount';
import { YamlEntry } from 'src/core/yaml-block';
import { PodDefinition } from './pod-definition';
import { TemplateDefinitions } from './template-definitions';
import { SimpleDefinition } from './simple-definition';

/**
 * Static class containg different methods that can be used throughout the application
 */
export class Utils {
    /**
     * This method returns the number of categories components wrappers' that can be fit in a row (or page)
     * considering the page size
     * @param pages number of pages
     * @param elementsPerPage number of elements to fit per page
     * @param allElements the elements to paginate
     * @returns A key/value pair, where the key is the page number and the value is an array containing the
     * elements to fit in that page.
     *
     * *TODO*: consider allElements as `any` and it could be used for other types as well
     */
    public static paginatedStructure(
        pages: number, elementsPerPage: number, allElements: CategoryComponentWrapper[]): Map<number, CategoryComponentWrapper[]> {
            const retVal = new Map();
            for (let i = 0; i < pages; ++i) {
                retVal.set(i, allElements.slice(elementsPerPage * i, elementsPerPage * i + elementsPerPage));
            }

            return retVal;
    }
}

/**
 * Possible legacy class. To be decided whether it should be @deprecated in favor
 * of the method in @class `CategoryComponent` @method `getUIDefinition2Yaml`.
 */
export class UIComponent2YamlDoc {
    public static yamlEntryBuilder(categoryComponent: CategoryComponent): YamlEntry {
        const yamlEntry = new YamlEntry();
        yamlEntry.value = categoryComponent.categoryComponentValue;
        yamlEntry.key = categoryComponent.categoryComponentLabel;

        if (categoryComponent.categoryComponents.length === 0) {
            yamlEntry.isNested = false;
            return yamlEntry;
        }

        if (categoryComponent.categoryComponents.length === 1) {
            yamlEntry.isNested = true;
        }
        yamlEntry.values = [];
        for (const cc of categoryComponent.categoryComponents) {
            yamlEntry.values.push(this.yamlEntryBuilder(cc));
        }

        return yamlEntry;
    }
}

/**
 * Factory class for getting category components.
 * As new category component wrappers are added, include it in this class.
 * Also, a caching mechanism is in place to reuse the components and avoid recreating them every time.
 */
export class UIComponentFactory {
    static K8S_API = 'api';
    static K8S_CONTAINER_PORT = 'container-port';
    static K8S_CONTAINER = 'container';
    static K8S_KIND = 'kind';
    static K8S_METADATA = 'metadata';
    static K8S_POD_SPEC = 'pod-spec';
    static K8S_VOLUME_MOUNT = 'volume-mount';
    static K8S_PREDEFINED_POD = 'predefined-pod';

    private static componentCaching: Map<string, CategoryComponentWrapper> = new Map();
    private static ALL_TYPES = [
        UIComponentFactory.K8S_API,
        UIComponentFactory.K8S_CONTAINER_PORT,
        UIComponentFactory.K8S_CONTAINER,
        UIComponentFactory.K8S_KIND,
        UIComponentFactory.K8S_METADATA,
        UIComponentFactory.K8S_POD_SPEC,
        UIComponentFactory.K8S_VOLUME_MOUNT
    ];

    private static predefinedCaching: Map<string, CategoryComponentWrapper> = new Map();
    private static ALL_PREDEFINED_CONCEPTS = [
        UIComponentFactory.K8S_PREDEFINED_POD
    ];

    static getCategoryComponent(k8sComponent: K8sConceptComponent): CategoryComponent {
        const retVal: CategoryComponent = new CategoryComponent();
        retVal.categoryComponentLabel = k8sComponent.label;
        retVal.categoryComponentDescription = k8sComponent.description;
        retVal.categoryComponents = [];

        if (k8sComponent.values.length === 0) {
            return retVal;
        }

        for (const val of k8sComponent.values) {
            retVal.categoryComponents.push(this.getCategoryComponent(val));
        }

        return retVal;
    }

    private static getOrCreate(type: string): CategoryComponentWrapper {
        let k8sComponent: K8sConceptComponent = null;
        if (UIComponentFactory.componentCaching.has(type)) {
            return UIComponentFactory.componentCaching.get(type);
        }
        let icon = '';
        switch (type) {
            case this.K8S_API:
                k8sComponent = new K8sComponentApi();
                icon = 'swap_vert';
                break;
            case this.K8S_KIND:
                k8sComponent = new K8sComponentKind();
                icon = 'class';
                break;
            case this.K8S_CONTAINER:
                k8sComponent = new K8sComponentContainer();
                icon = 'flip_to_back';
                break;
            case this.K8S_CONTAINER_PORT:
                k8sComponent = new K8sComponentContainerPort();
                icon = 'sync';
                break;
            case this.K8S_VOLUME_MOUNT:
                k8sComponent = new K8sComponentVolumeMount();
                icon = 'unarchive';
                break;
            case this.K8S_METADATA:
                k8sComponent = new K8sComponentMetadata();
                icon = 'dynamic_feed';
                break;
            case this.K8S_POD_SPEC:
                k8sComponent = new K8sComponentPodSpec();
                icon = 'create';
                break;
        }
        const componentTemplateDef = new SimpleDefinition(k8sComponent);
        const uiDefComponent = componentTemplateDef.getUIDefinition();
        uiDefComponent.addMetadata(CategoryComponentMetadataDef.ICON_METADATA, icon);
        UIComponentFactory.componentCaching.set(type, uiDefComponent);
        return uiDefComponent;
    }

    private static getOrCreatePredefinedConcept(type: string): CategoryComponentWrapper {
        if (UIComponentFactory.predefinedCaching.has(type)) {
            return UIComponentFactory.predefinedCaching.get(type);
        }

        let aux: TemplateDefinitions;
        let icon = '';
        switch (type) {
            case this.K8S_PREDEFINED_POD:
                aux = new PodDefinition();
                icon = 'sort';
                break;
        }
        const ccw = aux.getUIDefinition();
        ccw.addMetadata(CategoryComponentMetadataDef.ICON_METADATA, icon);
        UIComponentFactory.predefinedCaching.set(type, ccw);
        return ccw;
    }

    static getUIComponentByType(type: string): CategoryComponentWrapper {
        return UIComponentFactory.getOrCreate(type);
    }

    static getPredefinedConceptByType(type: string): CategoryComponentWrapper {
        return UIComponentFactory.getOrCreatePredefinedConcept(type);
    }

    static getAllComponents(): CategoryComponentWrapper[] {
        return UIComponentFactory.ALL_TYPES.map((t: string) => {
            return UIComponentFactory.getUIComponentByType(t);
        });
    }

    static getAllPredefined(): CategoryComponentWrapper[] {
        return UIComponentFactory.ALL_PREDEFINED_CONCEPTS.map(pc => {
            return UIComponentFactory.getPredefinedConceptByType(pc);
        });
    }
}
