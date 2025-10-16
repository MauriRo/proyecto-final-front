import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoriaResponse } from '../../models/Categoria.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoriasService } from '../../services/categorias.service';
import { AuthService } from '../../services/auth.service';
import { Roles } from '../../constants/constants';
declare var bootstrap: any;

@Component({
  selector: 'app-categorias',
  standalone: false,
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit, AfterViewInit {
  
  categorias: CategoriaResponse[] = [];
  categoriaForm: FormGroup;
  modalText: string = 'Nueva Categoría';
  selectedCategoria: CategoriaResponse | null = null;
  isEditMode: boolean = false;
  showActions: boolean = false;

  @ViewChild('categoriaModalRef') categoriaModalEl!: ElementRef;
  private modalInstance!: any;

  constructor(private categoriasService: CategoriasService, private formBuilder: FormBuilder,
    private authService: AuthService) {
    this.categoriaForm = formBuilder.group({
      id: [null],
      nombre: ['', [
        Validators.required, Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(/^(?!\s*$).+/)
      ]],
      descripcion: ['', [Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  ngOnInit(): void {
    this.listarCategorias();
    if(this.authService.hasRole(Roles.ADMIN)) {
      this.showActions = true;
    }
  }

  ngAfterViewInit(): void {
    // Inicializa modal desde el CDN
    this.modalInstance = new bootstrap.Modal(this.categoriaModalEl.nativeElement, { keyboard: false });

    // Resetea formulario al cerrar el modal
    this.categoriaModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  listarCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: resp => {
        this.categorias = resp;
      }
    });
  }

  toggleForm(): void {
    this.resetForm();
    this.modalText = 'Nueva Categoría';
    this.modalInstance.show();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedCategoria = null;
    this.categoriaForm.reset();
  }

  editCategoria(categoria: CategoriaResponse): void {
    this.isEditMode = true;
    this.selectedCategoria = categoria;
    this.modalText = 'Editando Categoría ' + categoria.nombre;
    this.categoriaForm.patchValue({ ...categoria });
    this.modalInstance.show();
  }

  onSumbmit(): void {
    if(this.categoriaForm.valid) {
      const categoriaData = this.categoriaForm.value;
      if(this.isEditMode) {
        this.categoriasService.putCategoria(categoriaData, categoriaData.id).subscribe({
          next: categoria => {
            const index = this.categorias.findIndex(cat => cat.id === categoria.id);
            if(index !== -1) {
              this.categorias[index] = categoria;
            }
            Swal.fire({
              icon: 'success',
              title: 'Categoría Actualizada',
              text: 'La categoría ha sido actualizada exitósamente'
            });
            this.resetForm();
            this.modalInstance.hide();
          }
        });
      } else {
        this.categoriasService.postCategoria(categoriaData).subscribe({
          next: categoria => {
            this.categorias.push(categoria);
            Swal.fire({
              icon: 'success',
              title: 'Categoría Registrada',
              text: 'La categoría ha sido registrada exitósamente'
            });
            this.resetForm();
            this.modalInstance.hide();
          }
        });
      }
    }
  }

  deleteCategoria(categoriaId: number): void {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar la categoría?',
      text: 'Eliminar categoría',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true
    }).then(resp => {
      if(resp.isConfirmed) {
        this.categoriasService.deleteCategoria(categoriaId).subscribe({
          next: deletedCategoria => {
            this.categorias = this.categorias.filter(cat => cat.id !== categoriaId);
            Swal.fire({
              title: 'Categoría ' + deletedCategoria.nombre +' eliminada',
              text: 'La categoría fue eliminada correctamente',
              icon: 'success'
            })
          }
        });
      }
    });
  }
}
