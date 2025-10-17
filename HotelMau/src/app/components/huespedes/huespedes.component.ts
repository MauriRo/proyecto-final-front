import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HuespedesService } from '../../services/huespedes.service';
import { AuthService } from '../../services/auth.service';
import { Roles } from '../../constants/constants';
import { HuespedRequest, HuespedResponse } from '../../models/huesped.models';
declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html'
})
export class HuespedesComponent implements OnInit, AfterViewInit {

  huespedes: HuespedResponse[] = [];
  huespedForm: FormGroup;
  modalText: string = 'Nuevo Huésped';
  selectedHuesped: HuespedResponse | null = null;
  isEditMode: boolean = false;
  showActions: boolean = false;

  @ViewChild('huespedModalRef') huespedModalEl!: ElementRef;
  private modalInstance!: any;

  constructor(
    private huespedesService: HuespedesService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.huespedForm = this.formBuilder.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      documento: ['', [Validators.required, Validators.maxLength(20)]],
      nacionalidad: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.listarHuespedes();
    if (this.authService.hasRole(Roles.ADMIN)) {
      this.showActions = true;
    }
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement, { keyboard: false });
    this.huespedModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  listarHuespedes(): void {
    this.huespedesService.getHuespedes().subscribe({
      next: resp => this.huespedes = resp
    });
  }

  toggleForm(): void {
    this.resetForm();
    this.modalText = 'Nuevo Huésped';
    this.modalInstance.show();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedHuesped = null;
    this.huespedForm.reset();
  }

  editHuesped(huesped: HuespedResponse): void {
    this.isEditMode = true;
    this.selectedHuesped = huesped;
    this.modalText = 'Editando Huésped ' + huesped.nombre;
    this.huespedForm.patchValue({ ...huesped });
    this.modalInstance.show();
  }

  onSubmit(): void {
    if (this.huespedForm.valid) {
      const data: HuespedRequest = this.huespedForm.value;

      if (this.isEditMode && this.selectedHuesped) {
        this.huespedesService.putHuesped(data, this.selectedHuesped.id).subscribe({
          next: updated => {
            const index = this.huespedes.findIndex(h => h.id === updated.id);
            if (index !== -1) this.huespedes[index] = updated;
            Swal.fire('Actualizado', 'Huésped actualizado exitosamente', 'success');
            this.resetForm();
            this.modalInstance.hide();
          }
        });
      } else {
        this.huespedesService.postHuesped(data).subscribe({
          next: created => {
            this.huespedes.push(created);
            Swal.fire('Registrado', 'Huésped registrado exitosamente', 'success');
            this.resetForm();
            this.modalInstance.hide();
          }
        });
      }
    }
  }

  deleteHuesped(huespedId: number): void {
    Swal.fire({
      title: '¿Eliminar este huésped?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(resp => {
      if (resp.isConfirmed) {
        this.huespedesService.deleteHuesped(huespedId).subscribe({
          next: () => {
            this.huespedes = this.huespedes.filter(h => h.id !== huespedId);
            Swal.fire('Eliminado', 'Huésped eliminado correctamente', 'success');
          }
        });
      }
    });
  }
}
