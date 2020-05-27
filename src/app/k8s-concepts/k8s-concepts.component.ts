import { Component, OnInit } from '@angular/core';
import { UiComponents } from 'src/backend/ui-components';

@Component({
  selector: 'app-k8s-concepts',
  templateUrl: './k8s-concepts.component.html',
  styleUrls: ['./k8s-concepts.component.css']
})
export class K8sConceptsComponent implements OnInit {
  uiComponents: UiComponents;

  constructor() {
    this.uiComponents = new UiComponents();
  }

  ngOnInit() {
  }

}
