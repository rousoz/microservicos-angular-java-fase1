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
  items: InventoryItem[] = [];
  itemsWithNames: any[] = [];
  products: Product[] = [];

  // Variáveis de Paginação
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalItems = 0;
  pageSizeOptions = [3, 5, 10, 20];

  loading = false;
  error = '';

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
    this.itemService.getAllPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // O Spring manda a lista em 'content'
        this.items = response.content;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;

        this.mapItemsWithNames();
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar inventário.';
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  // Adicione o método para mudar o tamanho:
  onPageSizeChange(event: any): void {
    const newSize = Number(event.target.value);
    this.pageSize = newSize;
    this.currentPage = 1; // Reseta para a primeira página ao mudar o tamanho
    this.loadItems();
  }

  // Reaproveitamos a lógica de mapeamento que estabilizou o erro NG0900
  private mapItemsWithNames(): void {
    this.itemsWithNames = this.items.map(item => ({
      ...item,
      productName: this.products.find(p => p.id === item.productId)?.name || `ID: ${item.productId}`
    }));
  }

  // Para gerar os números das páginas no HTML
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

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
