import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

interface MenuSection {
  title: string;
  icon: string;
  expanded: boolean;
  items: MenuItem[];
  roles: UserRole[];
}

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.css']
})
export class AppLayout {
  menuSections: MenuSection[] = [
    {
      title: 'Dashboard',
      icon: '📊',
      expanded: true,
      roles: ['CLIENT'],
      items: [
        { label: 'Overview', route: '/client', icon: '🏠' }
      ]
    },
    {
      title: 'Purchase Orders',
      icon: '➕',
      expanded: false,
      roles: ['CLIENT'],
      items: [
        { label: 'Create Purchase Order', route: '/client/purchase-orders/create', icon: '➕' },
        { label: 'Manage Purchase Orders', route: '/client/purchase-orders', icon: '📋' }
      ]
    },
    {
      title: 'Sales Orders',
      icon: '📦',
      expanded: false,
      roles: ['CLIENT'],
      items: [
        { label: 'View Sales Orders', route: '/client/orders', icon: '📝' },
        { label: 'Create Sales Order', route: '/client/orders/create', icon: '➕' }
      ]
    },
    {
      title: 'Shipments',
      icon: '🚚',
      expanded: false,
      roles: ['CLIENT'],
      items: [
        { label: 'All Shipments', route: '/client/shipments', icon: '📦' },
        { label: 'Create Shipment', route: '/client/shipments/create', icon: '➕' },
        { label: 'Ship Order', route: '/client/shipments/ship', icon: '🚀' },
        { label: 'Mark Delivered', route: '/client/shipments/deliver', icon: '✅' }
      ]
    },
    {
      title: 'Warehouses',
      icon: '🏭',
      expanded: false,
      roles: ['CLIENT'],
      items: [
        { label: 'Manage Warehouses', route: '/client/warehouses', icon: '🏢' }
      ]
    },
    {
      title: 'Warehouse Manager',
      icon: '📦',
      expanded: false,
      roles: ['WAREHOUSE_MANAGER'],
      items: [
        { label: 'Dashboard', route: '/warehouse', icon: '🏠' },
        { label: 'Shipments', route: '/warehouse/shipments', icon: '🚚' }
      ]
    },
    {
      title: 'Admin',
      icon: '⚙️',
      expanded: false,
      roles: ['ADMIN'],
      items: [
        { label: 'Dashboard', route: '/admin', icon: '🏠' }
      ]
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleSection(section: MenuSection): void {
    section.expanded = !section.expanded;
  }

  hasRole(roles: UserRole[]): boolean {
    return roles.some(role => this.authService.hasRole(role));
  }

  // Sidebar Shipments filter
  selectedShipmentStatus: string = 'ALL';

  onShipmentStatusChange(status: string): void {
    this.selectedShipmentStatus = status;
    const queryParams = status === 'ALL' ? {} : { status };
    this.router.navigate(['/client/shipments'], { queryParams });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
