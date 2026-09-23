import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Necesario para los inputs del formulario
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  errorMessage: string = '';
  
  // Objeto para enlazar con el formulario de nuevo producto
  newProduct = {
    nombre: '',
    precio: 0,
    stock: 0
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCatalog();
  }

  // Método para obtener la lista de productos desde el BFF / Microservicio
  loadCatalog(): void {
    const apiUrl = `${environment.apiUrl}/api/productos`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => { 
        this.products = data; 
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
        this.errorMessage = 'No se pudo cargar el catálogo.';
      }
    });
  }

  // Método para guardar un nuevo producto en la base de datos
  addProduct(): void {
    const apiUrl = `${environment.apiUrl}/api/productos`;
    this.http.post(apiUrl, this.newProduct).subscribe({
      next: () => {
        this.loadCatalog(); // Recargamos la tabla automáticamente
        this.newProduct = { nombre: '', precio: 0, stock: 0 }; // Limpiamos el formulario
      },
      error: (err) => {
        console.error('Error al guardar el producto:', err);
        alert('No se pudo registrar el producto.');
      }
    });
  }
}