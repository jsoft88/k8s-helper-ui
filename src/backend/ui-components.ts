import { UIComponentFactory, UIComponent2YamlDoc } from './utils';
import { Pipe, PipeTransform } from '@angular/core';
import { YamlDocument } from 'src/core/yaml-block';

export class UiComponents {
    private categories: Category[];

    constructor() {
        const categoryBasic = new Category();
        categoryBasic.setCategoryLabel('Basic');
        categoryBasic.setCategoryDescription('Find templates for commonly used k8s concepts such as definitions for pods, services, etc.');
        categoryBasic.setCategoryComponentWrappers(UIComponentFactory.getAllPredefined());

        const categoryCustom = new Category();
        categoryCustom.setCategoryLabel('Custom');
        categoryCustom.setCategoryDescription('Here you have the posibility to create the definitions yourself, with required components.');
        categoryCustom.setCategoryComponentWrappers(UIComponentFactory.getAllComponents());

        this.categories = [categoryBasic, categoryCustom];
    }

    getCategories(): Category[] {
        return this.categories;
    }
}

@Pipe({name: 'canvasGetCanvasId'})
export class CanvasGetCanvasIdPipe implements PipeTransform {
    transform(canvas: Canvas): number {
        return canvas.getCanvasId();
    }
}

export class Canvas {
    private id: number;
    private categoryComponentWrappers: CategoryComponentWrapper[];

    constructor() {
        this.id = new Date().getMilliseconds();
        this.categoryComponentWrappers = [];
    }

    addToCanvas(componentWrapper: CategoryComponentWrapper) {
        this.categoryComponentWrappers.push(componentWrapper);
    }

    removeFromCanvas(componentWrapper: CategoryComponentWrapper) {
        this.categoryComponentWrappers = this.categoryComponentWrappers.filter(ccw => ccw.getLabel() !== componentWrapper.getLabel());
    }

    getCanvasId(): number {
        return this.id;
    }

    getAllComponentsInCanvas(): CategoryComponentWrapper[] {
        return this.categoryComponentWrappers;
    }
}

export class CanvasManager {
    private static canvas: Canvas[] = [];
    private static activeCanvas = -1;

    static addCanvas() {
        CanvasManager.activeCanvas = CanvasManager.canvas.push(new Canvas()) - 1;
    }

    static swithToCanvas(id: number): void | Error {
        CanvasManager.activeCanvas = CanvasManager.canvas.findIndex(c => c.getCanvasId() === id);
        if (CanvasManager.activeCanvas < 0) {
            throw new Error('No canvas has been created');
        }
    }

    static getActiveCanvas(): Canvas | Error {
        if (CanvasManager.activeCanvas < 0) {
            throw new Error('No canvas has been created');
        }

        return CanvasManager.canvas[CanvasManager.activeCanvas];
    }

    static removeCanvas(canvas: Canvas): boolean {
        const canvasIndex = CanvasManager.canvas.findIndex(cnv => cnv.getCanvasId() === canvas.getCanvasId());
        if (canvasIndex < 0) {
            return false;
        }

        CanvasManager.canvas = CanvasManager.canvas.slice(canvasIndex, canvasIndex + 1);
        return true;
    }
}

@Pipe({name: 'categoryGetLabel'})
export class CategoryGetLabelPipe implements PipeTransform {
    transform(category: Category): string {
        return category.getCategoryLabel();
    }
}

@Pipe({name: 'categoryGetDescription'})
export class CategoryGetDescriptionPipe implements PipeTransform {
    transform(category: Category): string {
        return category.getCategoryDescription();
    }
}

export class Category {
    private categoryLabel: string;
    private categoryDescription: string;
    private categoryComponentWrappers: CategoryComponentWrapper[];

    constructor() { }

    getCategoryComponentWrappers(): CategoryComponentWrapper[] {
        return this.categoryComponentWrappers;
    }

    getCategoryLabel(): string {
        return this.categoryLabel;
    }

    getCategoryDescription(): string {
        return this.categoryDescription;
    }

    setCategoryComponentWrappers(categoryComponentWrappers: CategoryComponentWrapper[]): void {
        this.categoryComponentWrappers = categoryComponentWrappers.slice();
    }

    setCategoryLabel(categoryLabel: string): void {
        this.categoryLabel = categoryLabel;
    }

    setCategoryDescription(categoryDescription: string): void {
        this.categoryDescription = categoryDescription;
    }
}

@Pipe({name: 'categoryComponentWrapperGetLabel'})
export class CategoryComponentWrapperGetLabelPipe implements PipeTransform {
    transform(categoryComponentWrapper: CategoryComponentWrapper): string {
        return categoryComponentWrapper.getLabel();
    }
}

@Pipe({name: 'categoryComponentWrapperGetDescription'})
export class CategoryComponentWrapperGetDescriptionPipe implements PipeTransform {
    transform(categoryComponentWrapper: CategoryComponentWrapper): string {
        return categoryComponentWrapper.getDescription();
    }
}

@Pipe({name: 'categoryComponentWrapperGetIcon'})
export class CategoryComponentWrapperGetIconPipe implements PipeTransform {
    // This is just an abstraction for metadata, so we are defining a key for the desired metadata
    transform(categoryComponentWrapper: CategoryComponentWrapper): string {
        return categoryComponentWrapper.getMetadata(CategoryComponentMetadataDef.ICON_METADATA);
    }
}

export class CategoryComponentMetadataDef {
    static ICON_METADATA = 'ICONMETADATA';
}

@Pipe({name: 'categoryComponentWrapperId'})
export class CategoryComponentWrapperIdPipe implements PipeTransform {
    transform(categoryComponentWrapper: CategoryComponentWrapper): string {
        return categoryComponentWrapper.getLabel().replace(' ', '');
    }
}

export class CategoryComponentWrapper {
    private label: string;
    private description: string;
    private categoryComponents: CategoryComponent[];
    private metadata: Map<string, string>;

    constructor() {
        this.categoryComponents = [];
        this.metadata = new Map();
    }

    setCategoryComponents(categoryComponents: CategoryComponent[]): void {
        this.categoryComponents = categoryComponents.slice();
    }

    setLabel(label: string): void {
        this.label = label;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    getCategoryComponents(): CategoryComponent[] {
        return this.categoryComponents;
    }

    getLabel(): string {
        return this.label;
    }

    getDescription(): string {
        return this.description;
    }

    addMetadata(metadataKey: string, metadataValue: string): void {
        this.metadata.set(metadataKey, metadataValue);
    }

    getMetadata(metadataKey: string): string {
        if (this.metadata.has(metadataKey)) {
            return this.metadata.get(metadataKey);
        }

        return '';
    }
}

@Pipe({name: 'categoryComponentGetLabel'})
export class CategoryComponentGetLabelPipe implements PipeTransform {
    transform(categoryComponent: CategoryComponent): string {
        return categoryComponent.categoryComponentLabel;
    }
}

export class CategoryComponent {
    categoryComponentLabel: string;
    categoryComponentDescription: string;
    categoryComponents: CategoryComponent[];
    coreComponentID: string;
    categoryComponentValue?: string;

    constructor() {
        this.categoryComponents = [];
    }

    private static formSchemaHelper(rootComponent: CategoryComponent, addRequired = true): string {
        if (!rootComponent.categoryComponents || rootComponent.categoryComponents.length === 0) {
            return `"${ rootComponent.categoryComponentLabel }": { "type": "string" }`;
        } else if (rootComponent.categoryComponents.length === 1) {
            // nested object
            return ` "${ rootComponent.categoryComponentLabel }": { "type": "object", "properties": {`
                + CategoryComponent.formSchemaHelper(rootComponent.categoryComponents[0], false)
                + `} }`; // , "required": [ "${rootComponent.categoryComponentLabel}" ] }`;
        } else {
            const requiredLabels = [];
            let arrVals = ` "${ rootComponent.categoryComponentLabel }": { "type": "array", "items": { "type": "object", "properties": { `;
            for (const component of rootComponent.categoryComponents) {
                requiredLabels.push(`"${ component.categoryComponentLabel }"`);
                // arrVals = arrVals.concat(` {`);
                arrVals = arrVals.concat(CategoryComponent.formSchemaHelper(component, false));
                arrVals = arrVals.concat(' ,'); // end the array field definition
            }
            arrVals = arrVals.slice(0, arrVals.length - 1);
            arrVals = arrVals.concat(` } }, "required": [${ requiredLabels.join(', ') }] }`);
            return arrVals;
        }
    }

    public static getFormSchema(rootComponent: CategoryComponent, prefix: string = '', addRequired = true, level = 0): string {
        let cpPrefix = prefix;
        if (cpPrefix === '') {
            cpPrefix = cpPrefix.concat('{ "schema": { "type": "object", "properties": {');
        }
        cpPrefix = cpPrefix.concat(CategoryComponent.formSchemaHelper(rootComponent, true));
        cpPrefix = cpPrefix.concat(' }'); // end properties with }
        if (addRequired) {
            // check if required needs to be added
            cpPrefix = cpPrefix.concat(`, "required": ["${ rootComponent.categoryComponentLabel }"]`);
        }
        cpPrefix = cpPrefix.concat(' } }');
        console.log(cpPrefix);
        return cpPrefix;
    }

    public fillInData(component: CategoryComponent = this, jsonData: any) {
        if (!component.categoryComponents || component.categoryComponents.length === 0) {
            component.categoryComponentValue = jsonData[this.categoryComponentLabel];
        } else if (component.categoryComponents.length === 1) {
            this.fillInData(component.categoryComponents[0], jsonData);
        } else {
            for (const subComponent of component.categoryComponents) {
                this.fillInData(subComponent, jsonData);
            }
        }
    }

    public getUIDefinition2Yaml(): YamlDocument {
        const yamlDoc = new YamlDocument(2);
        yamlDoc.addEntry(UIComponent2YamlDoc.yamlEntryBuilder(this));

        return yamlDoc;
    }
}
