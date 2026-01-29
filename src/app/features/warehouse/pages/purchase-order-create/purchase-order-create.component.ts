import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { WarehousePurchaseOrderService } from '../../services/warehouse-purchase-order.service';
import { CreatePurchaseOrderRequest } from '../../../../core/models/purchase-order.model';
import { WarehouseService } from '../../../../api/warehouse.service';
import { SupplierService } from '../../../../api/supplier.service';
import { ProductService } from '../../../../api/product.service';
import { Warehouse } from '../../../../core/models/warehouse.model';
import { Supplier } from '../../../../core/models/supplier.model';
import { Product } from '../../../../core/models/product.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-purchase-order-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.css']
})
export class PurchaseOrderCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly purchaseOrderService = inject(WarehousePurchaseOrderService);
  private readonly router = inject(Router);
  private readonly warehouseService = inject(WarehouseService);
  private readonly supplierService = inject(SupplierService);
  private readonly productService = inject(ProductService);

  purchaseOrderForm!: FormGroup;
  submitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  loading = signal<boolean>(false);

  warehouses = signal<Warehouse[]>([]);
  suppliers = signal<Supplier[]>([]);
  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    
    forkJoin({
      warehouses: this.warehouseService.getAdminWarehouses(),
      suppliers: this.supplierService.getWarehouseActiveSuppliers(),
      products: this.productService.getWarehouseProducts()
    }).subscribe({
      next: (data) => {
        this.warehouses.set(data.warehouses);
        this.suppliers.set(data.suppliers);
        this.products.set(data.products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        this.errorMessage.set('Failed to load form data. Please refresh the page.');
        this.loading.set(false);
      }
    });
  }

  initForm(): void {
    this.purchaseOrderForm = this.fb.group({
      supplierId: [null, [Validators.required]],
      warehouseId: [null, [Validators.required]],
      orderDate: ['', [Validators.required]],
      lines: this.fb.array([this.createLineFormGroup()])
    });
  }

  get lines(): FormArray {
    return this.purchaseOrderForm.get('lines') as FormArray;
  }

  createLineFormGroup(): FormGroup {
    return this.fb.group({
      productId: [null, [Validators.required]],
      orderedQuantity: [1, [Validators.required, Validators.min(1)]],
      unitCost: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onProductChange(index: number): void {
    const productId = this.lines.at(index).get('productId')?.value;
    if (productId) {
      const product = this.products().find(p => p.id === Number(productId));
      if (product) {
        this.lines.at(index).patchValue({ 
          unitCost: product.costPrice 
        });
      }
    }
  }

  addLine(): void {
    this.lines.push(this.createLineFormGroup());
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) {
      this.lines.removeAt(index);
    } else {
      this.errorMessage.set('At least one line item is required');
      setTimeout(() => this.errorMessage.set(null), 3000);
    }
  }

  onSubmit(): void {
    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all required fields');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.purchaseOrderForm.value;
    
    const request: CreatePurchaseOrderRequest = {
      supplierId: Number(formValue.supplierId),
      warehouseId: Number(formValue.warehouseId),
      orderDate: formValue.orderDate,
      lines: formValue.lines.map((line: any) => ({
        productId: Number(line.productId),
        orderedQuantity: Number(line.orderedQuantity),
        unitCost: Number(line.unitCost)
      }))
    };

    this.purchaseOrderService.create(request).subscribe({
      next: (purchaseOrder) => {
        this.submitting.set(false);
        this.successMessage.set('Purchase order created successfully!');
        setTimeout(() => {
          this.router.navigate(['/warehouse/purchase-orders', purchaseOrder.id]);
        }, 1000);
      },
      error: (err) => {
        console.error('Failed to create purchase order:', err);
        this.submitting.set(false);
        const message = err.error?.message || 'Failed to create purchase order. Please try again.';
        this.errorMessage.set(message);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/warehouse']);
  }
}
