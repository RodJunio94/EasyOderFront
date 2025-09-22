import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EasyOderFront';
  http = inject(HttpClient);
  urlApi = 'https://localhost:7110';
  products$?: Observable<Product[]>;
  
  ngOnInit(): void {
    this.ProductList();
  }

  ProductList() {
    this.products$ = this.http.get<Product[]>(`${this.urlApi}/api/product`)
  }
}