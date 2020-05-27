import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { K8sConceptsComponent } from './k8s-concepts/k8s-concepts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { CategoryGetDescriptionPipe,
  CategoryGetLabelPipe,
  CategoryComponentWrapperGetDescriptionPipe,
  CategoryComponentWrapperGetLabelPipe,
  CanvasGetCanvasIdPipe, CategoryComponentWrapperGetIconPipe,
  CategoryComponentWrapperIdPipe, CategoryComponentGetLabelPipe } from 'src/backend/ui-components';
import { JsonSchemaFormModule, MaterialDesignFrameworkModule } from 'angular2-json-schema-form';

@NgModule({
  declarations: [
    AppComponent,
    K8sConceptsComponent,
    HomeComponent,
    CategoryGetDescriptionPipe,
    CategoryGetLabelPipe,
    CategoryComponentWrapperGetDescriptionPipe,
    CategoryComponentWrapperGetLabelPipe,
    CanvasGetCanvasIdPipe,
    CategoryComponentWrapperGetIconPipe,
    CategoryComponentWrapperIdPipe,
    CategoryComponentGetLabelPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialDesignFrameworkModule,
    JsonSchemaFormModule.forRoot(MaterialDesignFrameworkModule)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
