import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html'
})
export class NuevoUsuarioComponent {
  username: string = '';
  password: string = '';
  roles: string = ''; // "ROLE_ADMIN" o "ROLE_USER"

  constructor(private usuarioService: UsuarioService) {}

  agregarUsuario() {
    const usuario = {
      username: this.username,
      password: this.password,
      roles: [this.roles]
    };

    this.usuarioService.crearUsuario(usuario).subscribe({
      next: (res: any) => {
        alert('Usuario creado con éxito!');
      },
      error: (err: { error: { message: string; }; }) => {
        console.error(err);
        alert('Error al crear usuario: ' + err.error.message);
      }
    });
  }
}
