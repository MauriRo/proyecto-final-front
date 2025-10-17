import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HabitacionesService } from '../../services/habitaciones.service';
import { HabitacionRequest, HabitacionResponse } from '../../models/habitacion.models';
import { AuthService } from '../../services/auth.service'; // ← Importa AuthService
import { Roles } from '../../constants/constants'; // ← Importa Roles
declare var bootstrap: any;

@Component({
  standalone: false,
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html'
})
export class HabitacionesComponent implements OnInit, AfterViewInit {

  habitaciones: HabitacionResponse[] = [];
  habitacionForm: FormGroup;
  editMode: boolean = false;
  selectedHabitacion: HabitacionResponse | null = null;
  showActions: boolean = false; // ahora inicia en falso

  estados = ['Disponible', 'Ocupada', 'Limpieza', 'Mantenimiento'];

  @ViewChild('habitacionModalRef') habitacionModalEl!: ElementRef;
  private modalInstance!: any;

  constructor(
    private servicio: HabitacionesService,
    private fb: FormBuilder,
    private authService: AuthService // ← Inyecta AuthService
  ) {
    this.habitacionForm = this.fb.group({
      id: [null],
      numero: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', [Validators.required, Validators.maxLength(20)]],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(1)]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      estado: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listarHabitaciones();

    // Mostrar acciones solo si el usuario es ADMIN
    this.showActions = this.authService.hasRole(Roles.ADMIN);
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.habitacionModalEl.nativeElement, { keyboard: false });
    this.habitacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => this.resetForm());
  }

  listarHabitaciones(): void {
    this.servicio.getHabitaciones().subscribe({
      next: data => this.habitaciones = data
    });
  }

  toggleForm(): void {
    this.resetForm();
    this.editMode = false;
    this.modalInstance.show();
  }

  editHabitacion(hab: HabitacionResponse): void {
    this.editMode = true;
    this.selectedHabitacion = hab;
    this.habitacionForm.patchValue({ ...hab });
    this.modalInstance.show();
  }

  onSubmit(): void {
    if (this.habitacionForm.invalid) return;

    const data: HabitacionRequest = this.habitacionForm.value;

    if (this.editMode && this.selectedHabitacion) {
      this.servicio.putHabitacion(data, this.selectedHabitacion.id).subscribe({
        next: updated => {
          const idx = this.habitaciones.findIndex(h => h.id === updated.id);
          if (idx !== -1) this.habitaciones[idx] = updated;
          Swal.fire('Actualizado', 'Habitación actualizada correctamente', 'success');
          this.modalInstance.hide();
          this.resetForm();
        }
      });
    } else {
      this.servicio.postHabitacion(data).subscribe({
        next: created => {
          this.habitaciones.push(created);
          Swal.fire('Registrado', 'Habitación registrada correctamente', 'success');
          this.modalInstance.hide();
          this.resetForm();
        }
      });
    }
  }

  deleteHabitacion(id: number): void {
    Swal.fire({
      title: '¿Eliminar esta habitación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(resp => {
      if (resp.isConfirmed) {
        this.servicio.deleteHabitacion(id).subscribe({
          next: () => {
            this.habitaciones = this.habitaciones.filter(h => h.id !== id);
            Swal.fire('Eliminado', 'Habitación eliminada correctamente', 'success');
          }
        });
      }
    });
  }

  resetForm(): void {
    this.editMode = false;
    this.selectedHabitacion = null;
    this.habitacionForm.reset();
  }
}
