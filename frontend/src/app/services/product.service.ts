import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private readonly baseUrl = environment.productsApiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getAllPaginated(page: number, pageSize: number): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.baseUrl}?page=${page}&pageSize=${pageSize}`
    ); 
  }

  /*
  getAllPaginated(page = 1, pageSize = 10): Observable<PaginatedResponse<Product> | Product[]> {
    const url = `${this.baseUrl}?page=${page}&limit=${pageSize}&pageSize=${pageSize}`;
    return this.http.get<PaginatedResponse<Product> | Product[]>(url);
  }
*/

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${product.id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
