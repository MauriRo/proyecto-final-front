import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ProductosComponent } from './components/productos/productos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { ErrorInterceptor } from './shared/error.interceptor';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';

@NgModule({
  declarations: [
    AppComponent,
    ProveedoresComponent,
    HuespedesComponent,
    ProductosComponent,
    DashboardComponent,
    LoginComponent,
    NavbarComponent,
    HabitacionesComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
