import { ApplicationConfig } from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { ProductDetailComponent } from 'src/app/product-detail.component';

const routes: Routes = [
  { path: 'product/:id', component: ProductDetailComponent }
];


export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes)]
};
