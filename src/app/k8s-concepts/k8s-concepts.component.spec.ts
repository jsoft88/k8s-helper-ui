import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sConceptsComponent } from './k8s-concepts.component';

describe('K8sConceptsComponent', () => {
  let component: K8sConceptsComponent;
  let fixture: ComponentFixture<K8sConceptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sConceptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
