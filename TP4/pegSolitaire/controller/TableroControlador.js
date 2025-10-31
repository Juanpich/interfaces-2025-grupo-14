class TableroControlador {
  constructor(tablero, vista) {
    this.tablero = tablero;
    this.vista = vista;

    this.fichaArrastrada = null;
    this.offset = { x: 0, y: 0 };

    // Enganchar eventos de la vista
    this.vista.onMouseDown = this.iniciarArrastre.bind(this);
    this.vista.onMouseMove = this.moverArrastre.bind(this);
    this.vista.onMouseUp   = this.soltarArrastre.bind(this);

    this.vista.dibujar();
  }

  iniciarArrastre(e) {
    const { fila, col } = this.vista.obtenerCeldaDesdeEvento(e);
    const ficha = this.tablero.obtenerFicha(fila, col);

    if (ficha?.estaActiva()) {
      this.fichaArrastrada = ficha;
      this.offset = {
        x: e.offsetX - col * this.vista.tamanioCelda,
        y: e.offsetY - fila * this.vista.tamanioCelda
      };

      const destinos = this.tablero.obtenerMovimientosValidos(fila, col);
      this.vista.setDestinosValidos(destinos);
      this.vista.dibujar(this.fichaArrastrada, this.offset, e.offsetX, e.offsetY);
    }
  }

  moverArrastre(e) {
    if (this.fichaArrastrada) {
      this.vista.dibujar(this.fichaArrastrada, this.offset, e.offsetX, e.offsetY);
    }
  }

  soltarArrastre(e) {
    if (!this.fichaArrastrada) return;

    const { fila, col } = this.vista.obtenerCeldaDesdeEvento(e);
    const origenFila = this.fichaArrastrada.fila;
    const origenCol = this.fichaArrastrada.columna;

    const exito = this.tablero.moverFicha(origenFila, origenCol, fila, col);

    if (!exito) {
      // Restaurar si no fue válido
      this.tablero.estado[origenFila][origenCol] = 1;
      this.tablero.fichas[origenFila][origenCol] = this.fichaArrastrada;
    }

    this.fichaArrastrada = null;
    this.vista.setDestinosValidos([]);
    this.vista.dibujar();
  }
}