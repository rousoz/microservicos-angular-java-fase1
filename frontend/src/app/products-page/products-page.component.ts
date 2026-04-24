import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { PaginatedResponse } from '../models/paginated-response.model';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  error = '';
  loading = false;
  productForm!: FormGroup;

  // Paginação
  currentPage = 1;
  pageSize = 3;
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [3, 5, 10, 15];

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Product>) => {
        this.products = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        // Sincroniza a página atual com o que veio do servidor (opcional)
        this.currentPage = response.number + 1; 
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar produtos.';
        this.loading = false;
      }
    });
  }

/*
  loadProducts(): void {
    this.loading = true;
    this.productService.getAllPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Product> | Product[]) => {
        if (Array.isArray(response)) {
          this.products = response;
          this.totalItems = response.length;
          this.totalPages = 1;
          this.currentPage = 1;
        } else {
          this.products = response.data ?? [];
          this.totalItems = response.totalItems ?? this.products.length;
          this.totalPages = response.totalPages ?? 1;
          this.currentPage = response.currentPage ?? 1;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar os produtos. Verifique o backend em http://localhost:8081';
        this.loading = false;
      }
    });
  }
*/
  edit(product: Product): void {
    this.error = '';
    this.productForm.setValue({
      id: product.id ?? null,
      name: product.name,
      description: product.description,
      price: product.price
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  save(): void {
    if (this.productForm.invalid) {
      this.error = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const product: Product = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price)
    };

    const action = product.id ? this.productService.update(product) : this.productService.create(product);
    action.subscribe({
      next: () => {
        this.resetForm();
        this.loadProducts();
      },
      error: () => {
        this.error = 'Erro ao salvar o produto. Confirme se o microserviço está disponível.';
      }
    });
  }

  delete(product: Product): void {
    if (!product.id || !confirm(`Remover o produto "${product.name}"?`)) {
      return;
    }

    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: () => {
        this.error = 'Erro ao remover o produto. Tente novamente.';
      }
    });
  }

  private resetForm(): void {
    this.error = '';
    this.productForm.reset({ id: null, name: '', description: '', price: 0 });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(size: string | number): void {
    this.pageSize = Number(size);
    this.currentPage = 1;
    this.loadProducts();
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

}
