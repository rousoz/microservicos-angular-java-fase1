import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemService {
  private readonly baseUrl = environment.inventoryItemsApiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.baseUrl);
  }

  getById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.baseUrl}/${id}`);
  }

  create(item: InventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.baseUrl, item);
  }

  update(item: InventoryItem): Observable<InventoryItem> {
    const payload = {
      productId: item.productId,
      quantity: item.quantity
    };

    //return this.http.put<InventoryItem>(`${this.baseUrl}/${item.id}`, item);
    return this.http.put<InventoryItem>(`${this.baseUrl}/${item.id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
