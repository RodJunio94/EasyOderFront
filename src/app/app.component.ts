import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product';
import { Observable, take, map } from 'rxjs';
import { CreateProductRequest, CreateProductResponse } from './models/create-product';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EasyOderFront';
  http = inject(HttpClient);
  urlApi = 'https://localhost:7110';
  products$?: Observable<Product[]>;
  lastCreatedId?: string;
  deletingId?: string;
  router = inject(Router);
  isCreating = false;
  
  ngOnInit(): void {
    this.ProductList();
  }

  ProductList() {
    this.products$ = this.http.get<any[]>(`${this.urlApi}/api/product`).pipe(
      map(items => items.map(i => ({
        id: i.id ?? i.productId,
        name: i.name,
        description: i.description,
        price: i.price,
        stockQuantity: i.stockQuantity,
        createdAt: i.createdAt
      }) as Product))
    );
  }

  CreateProduct(payload: CreateProductRequest) {
    if (this.isCreating) return;

    this.isCreating = true;
    this.http.post<CreateProductResponse>(`${this.urlApi}/api/product`, payload)
      .pipe(take(1))
      .subscribe({
        next: (r) => {
          this.lastCreatedId = r.productId;
          this.ProductList();
          this.isCreating = false;
          this.router.navigate(['/product', r.productId]);
        },
        error: (err) => {
          console.error('Erro ao criar produto:', err);
          this.isCreating = false;
        }
      });
  }

  DeleteProduct(id: string) {
    if (!id || this.deletingId) return;
    this.deletingId = id;
    this.http.delete(`${this.urlApi}/api/Product/${id}`)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.deletingId = undefined;
          this.ProductList();
        },
        error: (err) => {
          console.error('Erro ao deletar produto:', err);
          this.deletingId = undefined;
        }
      });
  }
}