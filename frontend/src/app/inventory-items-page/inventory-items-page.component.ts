import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryItem } from '../models/inventory-item.model';
import { Product } from '../models/product.model';
import { InventoryItemService } from '../services/inventory-item.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-inventory-items-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-items-page.component.html',
  styleUrls: ['./inventory-items-page.component.scss']
})
export class InventoryItemsPageComponent implements OnInit {
  items: any[] = [];
  itemsWithNames: any[] = [];
  products: Product[] = [];
  error = '';
  loading = false;
  itemForm!: FormGroup;

  constructor(
    private itemService: InventoryItemService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.itemForm = this.fb.group({
      id: [null],
      productId: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadItems();
  }

  // Adicione isto abaixo do seu ngOnInit ou loadItems
  trackById(index: number, item: any): number {
    return item.id;
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data: any) => {
        // Força a garantir que é um array para o <select> não quebrar
        this.products = Array.isArray(data) ? data : (data.content || []);
      },
      error: () => (this.error = 'Erro ao carregar produtos')
    });
  }

  loadItems(): void {
    this.loading = true;
    this.itemService.getAll().subscribe({
      next: (response: any) => {
        const rawData = Array.isArray(response) ? response : (response.content || []);

        // Criamos uma nova referência de array (importante para o Angular)
        this.items = [...rawData];

        // Mapeamos os nomes apenas se houver produtos
        this.itemsWithNames = this.items.map(item => ({
          ...item,
          productName: this.products.find(p => p.id === item.productId)?.name || `ID: ${item.productId}`
        }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.items = [];
      }
    });
  }

  // Criamos uma função separada para mapear os nomes
  private mapItemsWithNames(): void {
    if (this.items && this.products.length > 0) {
      this.itemsWithNames = this.items.map((item: InventoryItem) => ({
        ...item,
        productName: this.getProductNameSync(item.productId)
      }));
    } else {
      // Caso os produtos ainda não tenham carregado, usamos os itens puros
      this.itemsWithNames = this.items.map((item: InventoryItem) => ({
        ...item,
        productName: `Carregando... (ID: ${item.productId})`
      }));
    }
  }

  private getProductNameSync(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : `ID: ${productId}`;
  }

  /*
    loadItems(): void {
      this.loading = true;
      this.itemService.getAll().subscribe({
        next: (items) => {
          this.items = items;
          this.loading = false;
        },
        error: () => {
          this.error = 'Não foi possível carregar os itens de inventário. Verifique o backend em http://localhost:8082';
          this.loading = false;
        }
      });
    }
  */

  edit(item: InventoryItem): void {
    this.error = '';
    this.itemForm.setValue({
      id: item.id ?? null,
      productId: item.productId,
      quantity: item.quantity
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  save(): void {
    if (this.itemForm.invalid) {
      this.error = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const item: InventoryItem = {
      ...this.itemForm.value,
      productId: Number(this.itemForm.value.productId),
      quantity: Number(this.itemForm.value.quantity)
    };

    const action = item.id ? this.itemService.update(item) : this.itemService.create(item);
    //const action = item.id ? this.itemService.update(payload) : this.itemService.create(item);
    action.subscribe({
      next: () => {
        this.resetForm();
        this.loadItems();
      },
      error: () => {
        this.error = 'Erro ao salvar o item de inventário. Tente novamente.';
      }
    });
  }

  delete(item: InventoryItem): void {
    if (!item.id || !confirm(`Remover item de inventário com ID ${item.id}?`)) {
      return;
    }

    this.itemService.delete(item.id).subscribe({
      next: () => this.loadItems(),
      error: () => {
        this.error = 'Erro ao remover o item de inventário.';
      }
    });
  }

  getProductName(productId: number): string {
    return this.products.find((product) => product.id === productId)?.name ?? `Produto ${productId}`;
  }

  private resetForm(): void {
    this.error = '';
    this.itemForm.reset({ id: null, productId: null, quantity: 0 });
  }
}
