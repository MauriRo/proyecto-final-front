import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  hoteles = [
    {
      nombre: 'Hotel Paraíso del Mar',
      descripcion: 'Ubicado frente a la playa con vista al mar y servicios premium.',
      img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
    },
    {
      nombre: 'Hotel Montaña Azul',
      descripcion: 'Rodeado de naturaleza, ideal para descansar y desconectarse.',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    },
    {
      nombre: 'Hotel Urbano Central',
      descripcion: 'En el corazón de la ciudad, con todas las comodidades modernas.',
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
    }
  ];
}
