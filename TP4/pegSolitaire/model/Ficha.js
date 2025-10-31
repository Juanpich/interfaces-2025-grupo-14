class Ficha {
  constructor(fila, columna, activa = true) {
    this.fila = fila;
    this.columna = columna;
    this.activa = activa; // true si la ficha está en el tablero
  }

  eliminar() {
    this.activa = false;
  }

  moverA(nuevaFila, nuevaColumna) {
    this.fila = nuevaFila;
    this.columna = nuevaColumna;
  }

  estaActiva() {
    return this.activa;
  }
}