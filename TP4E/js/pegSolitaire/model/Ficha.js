class Ficha {
  constructor(fila, columna, activa = true) {
    this.fila = fila;
    this.columna = columna;
    this.activa = activa; // true si la ficha está en el tablero
    this.indiceImg=-1;
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
   getIndiceImg() {
    return this.indiceImg;
  }

  setIndiceImg(indice){
    this.indiceImg=indice;
  }
}