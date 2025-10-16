  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { DashboardComponent } from './components/dashboard/dashboard.component';
  import { CategoriasComponent } from './components/Huespedes/categorias.component';
  import { ProveedoresComponent } from './components/proveedores/proveedores.component';
  import { ProductosComponent } from './components/productos/productos.component';
  import { LoginComponent } from './components/login/login.component';
  import { AuthGuard } from './guards/auth.guard';
import { NuevoUsuarioComponent } from './components/usuario/nuevo-usuario.component';

  const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'nuevo-usuario', component: NuevoUsuarioComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
      { path: 'proveedores', component: ProveedoresComponent, canActivate: [AuthGuard] },
      { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] }
    ]},
    { path: '**', redirectTo: 'dashboard'}
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
