import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { UiComponents, CategoryComponent, Category, CategoryComponentWrapper, CanvasManager, Canvas } from 'src/backend/ui-components';
import { Utils } from 'src/backend/utils';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  uiComponents: UiComponents;
  activeCategory: number;
  // selectedComponentWrappers: Map<number, CategoryComponentWrapper[]>;
  categories: Category[];
  componentWrappers: Map<string, CategoryComponentWrapper[]>;
  htmlTabPaneActive: string[];
  canvas: Canvas[];
  activeCanvas: number;
  draggingComponentWrapper: CategoryComponentWrapper;
  componentRowBreaker: Map<number, CategoryComponentWrapper[]>;
  yamlPerCanvas: Map<number, string>;
  yamlOutput = '';
  formSchemaPerCanvasPerComponent: Map<number, Map<CategoryComponent, any>>;
  categoryComponentJsonData: Map<CategoryComponent, any>;
  activeCategoryComponentForm: string;
  // Canvas grid
  canvasGrids = [];

  MAX_COMPONENT_PER_ROW = 3;
  CANVAS_COMPONENT_SIZE = 64;
  MAX_COMPONENTS_IN_CANVAS = 14;
  CANVAS_ID_PLCHLDER = 'ID_PLCHLDR';
  CANVAS_CONTAINER_ID = `${this.CANVAS_ID_PLCHLDER}-container`;
  // in px
  FIXED_COMPONENT_CONTAINER_WIDTH = 64;
  FIXED_COMPONENT_CONTAINER_HEIGHT = 64;

  componentFormId: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.uiComponents = new UiComponents();
    this.activeCategory = 0;
    this.componentWrappers = new Map();
    this.categories = this.uiComponents.getCategories();
    this.htmlTabPaneActive = this.categories.map(cat => '');
    this.categories.forEach(cat => this.componentWrappers.set(cat.getCategoryLabel(), cat.getCategoryComponentWrappers()));
    this.htmlTabPaneActive[0] = 'active';
    this.canvas = [];
    this.formSchemaPerCanvasPerComponent = new Map();
    this.yamlPerCanvas = new Map();
    this.componentFormId = 'componentForm';

    this.addCanvas();
  }

  private calculateComponentsBreaker() {
    const rangeValue =
      Math.ceil(this.componentWrappers.get(this.categories[this.activeCategory].getCategoryLabel()).length / this.MAX_COMPONENT_PER_ROW);
    this.componentRowBreaker =
      Utils.paginatedStructure(rangeValue, this.MAX_COMPONENT_PER_ROW, this.categories[this.activeCategory].getCategoryComponentWrappers());
  }

  private addCanvas(): void {
    CanvasManager.addCanvas();
    const auxAC = CanvasManager.getActiveCanvas();
    if (!(auxAC instanceof Error)) {
      this.canvas.push(auxAC as Canvas);
      this.activeCanvas = this.canvas.length - 1;
      // this.selectedComponentWrappers.set(auxAC.getCanvasId(), []);
    }
    // TODO: handle error when adding canvas
  }

  ngOnInit() {
    this.calculateComponentsBreaker();
    // canvas components containers
    this.yamlPerCanvas = new Map();
  }

  ngAfterViewInit() {
    this.calculateNumberOfComponentsContainersInCanvas();
  }

  private calculateNumberOfComponentsContainersInCanvas() {
    // canvas height is fixed, width can vary.
    const activeCanvasContainerId =
      this.CANVAS_CONTAINER_ID.replace(this.CANVAS_ID_PLCHLDER, this.canvas[this.activeCanvas].getCanvasId().toString());
    const canvasContainer = document.getElementById(activeCanvasContainerId);
    const width = document.getElementById('tab-content-canvas').clientWidth;
    const widthOverFixed = width % this.FIXED_COMPONENT_CONTAINER_WIDTH;
    if (widthOverFixed !== 0) {
      canvasContainer.style.width = `${width - widthOverFixed}px`;
    }
    for (let i = 0; i < this.MAX_COMPONENTS_IN_CANVAS * this.MAX_COMPONENTS_IN_CANVAS; ++i) {
      this.canvasGrids.push(i);
    }
  }

  onWindowResized(event: any) {
    // method invoked because canvas div triggered it. Adjust containers inside canvas div.
    this.calculateNumberOfComponentsContainersInCanvas();
  }

  onCategorySelected(event: any, item: Category) {
    this.htmlTabPaneActive[this.activeCategory] = '';
    this.activeCategory = this.uiComponents.getCategories().findIndex(cat => cat.getCategoryLabel() === item.getCategoryLabel());
    this.htmlTabPaneActive[this.activeCategory] = 'active';
  }

  onComponentRemoved(event: any, componentWrapper: CategoryComponentWrapper) {
    if (CanvasManager.getActiveCanvas() instanceof Canvas) {
      (CanvasManager.getActiveCanvas() as Canvas).removeFromCanvas(componentWrapper);
    }
  }

  onComponentDragStart(event: any, ccw: CategoryComponentWrapper) {
    console.log(event);
    this.draggingComponentWrapper = ccw;
    event.dataTransfer.setData('component', event.target.id);
    this.draggingComponentWrapper = ccw;
  }

  onComponentDrop(event: any) {
    // add to active canvas
    (CanvasManager.getActiveCanvas() as Canvas).addToCanvas(this.draggingComponentWrapper);

    // let's just copy this, not move it from components tab into canvas.
    const copiedComponent = document.getElementById(event.dataTransfer.getData('component')).cloneNode(true) as HTMLElement;
    copiedComponent.id = 'canvas-' + copiedComponent.id;

    event.target.appendChild(copiedComponent);

    this.renderer.listen(this.elementRef.nativeElement.querySelector(`#${ copiedComponent.id }`), 'click', (innerEvent) => {
      this.onCanvasComponentClick(innerEvent, this.draggingComponentWrapper);
    });
  }

  onCanvasComponentClick(event: any, categoryComponentWrapper: CategoryComponentWrapper) {
    const vals: Map<CategoryComponent, any> = new Map();
    categoryComponentWrapper
      .getCategoryComponents()
        .forEach(cc => vals.set(cc, JSON.parse(CategoryComponent.getFormSchema(cc))));

    vals.forEach((k, v) => console.log(JSON.stringify(k)));

    this.formSchemaPerCanvasPerComponent.set(this.canvas[this.activeCanvas].getCanvasId(), vals);
    this.categoryComponentJsonData = vals;
    this.activeCategoryComponentForm = (vals.keys().next().value as CategoryComponent).categoryComponentLabel;
    jQuery(`#${ this.componentFormId }`).modal('toggle');
  }

  onCategoryComponentFormFieldClick(event: any, categoryComponent: CategoryComponent) {
    event.preventDefault();
    this.activeCategoryComponentForm = categoryComponent.categoryComponentLabel;
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onAddCanvas(event: any) {
    event.preventDefault();
    this.addCanvas();
  }

  onCategoryTabChange(event: any, selectedCategory: Category) {
    event.preventDefault();
    this.htmlTabPaneActive[this.activeCategory] = '';
    this.activeCategory = this.categories.findIndex(cat => {
      return cat.getCategoryLabel() === selectedCategory.getCategoryLabel();
    });
    this.htmlTabPaneActive[this.activeCategory] = 'active';
    this.calculateComponentsBreaker();
  }

  onCanvasSelected(event: any, canvas: Canvas) {
    event.preventDefault();
    this.activeCanvas = this.canvas.findIndex(cnvas => cnvas.getCanvasId() === canvas.getCanvasId());
  }

  onGenerateYamlClick(event: any) {
    // this.yamlPerCanvas
    //   .set(
    //     this.canvas[this.activeCanvas].getCanvasId(),
    //     this.selectedComponentWrappers
    //       .get(this.canvas[this.activeCanvas].getCanvasId()).map(ccw => {
    //         ccw.getCategoryComponents().forEach(cc => cc.fillInData(jsonData));
    //         ccw.getPodUIDefinition2Yaml().buildDocument();
    //       }).join('\n'));
    // this.yamlOutput = this.yamlPerCanvas.get(this.yamlPerCanvas[this.activeCanvas].getCanvasId());
  }
}
