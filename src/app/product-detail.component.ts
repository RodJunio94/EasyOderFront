import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { ProductDetail } from './models/product-detail';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/">← Voltar para lista</a>
    <div *ngIf="loading">Carregando...</div>
    <div *ngIf="error">{{ error }}</div>
    <ng-container *ngIf="product$ | async as product">
      <h3>Produto</h3>
      <div><strong>ID:</strong> {{ product.productId }}</div>
      <div><strong>Nome:</strong> {{ product.name }}</div>
      <div><strong>Descrição:</strong> {{ product.description }}</div>
      <div><strong>Preço:</strong> {{ product.price }}</div>
      <div><strong>Quantidade:</strong> {{ product.stockQuantity }}</div>
      <div><strong>Criado em:</strong> {{ product.createdAt }}</div>
    </ng-container>
  `
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private urlApi = 'https://localhost:7110';
  
  loading = true;
  error: string | null = null;

  product$: Observable<ProductDetail | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id') ?? '';
      console.log('Buscando produto com ID:', id);
      this.loading = true;
      this.error = null;
      
      return this.http.get<ProductDetail>(`${this.urlApi}/api/Product/${id}`).pipe(
        catchError(err => {
          console.error('Erro ao buscar produto:', err);
          this.loading = false;
          this.error = 'Erro ao carregar produto: ' + err.message;
          return of(null);
        })
      );
    })
  );

  constructor() {
    this.product$.subscribe(product => {
      this.loading = false;
      if (product) {
        console.log('Produto carregado:', product);
      }
    });
  }
}


