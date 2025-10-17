export interface HabitacionRequest {
  numero: number;
  tipo: string;
  descripcion?: string;
  precio: number;
  capacidad: number;
  estado: string; // Disponible, Ocupada, Limpieza, Mantenimiento
}

export interface HabitacionResponse {
  id: number;
  numero: number;
  tipo: string;
  descripcion?: string;
  precio: number;
  capacidad: number;
  estado: string;
}
