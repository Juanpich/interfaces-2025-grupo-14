class Tablero {
  constructor() {
    this.estado = [
      [-1, -1, 1, 1, 1, -1, -1],//0
      [-1, -1, 1, 1, 1, -1, -1],//1
      [1, 1, 1, 1, 1, 1, 1],//2
      [1, 1, 1, 0, 1, 1, 1],//3
      [1, 1, 1, 1, 1, 1, 1],//4
      [-1, -1, 1, 1, 1, -1, -1],//5
      [-1, -1, 1, 1, 1, -1, -1] //6
      //0   1   2   3   4   5   6
    ];
   
    this.fichas = this.generarMatrizFichas();
  }

  generarMatrizFichas() {
    const matriz = [];

    for (let fila = 0; fila < this.estado.length; fila++) {
      const filaFichas = [];

      for (let col = 0; col < this.estado[fila].length; col++) {
        const valor = this.estado[fila][col];

        if (valor === 1) {
          filaFichas.push(new Ficha(fila, col));
        } else {
          filaFichas.push(null); // vacío o deshabilitado
        }
      }

      matriz.push(filaFichas);
    }

    return matriz;
  }

  obtenerFicha(fila, col) {
    return this.fichas?.[fila]?.[col];
  }
  obtenerEstado(fila, col) {
    return this.estado?.[fila]?.[col];
  }

  moverFicha(origenFila, origenCol, destinoFila, destinoCol) {
    const fichaOrigen = this.obtenerFicha(origenFila, origenCol);
    const fichaDestino = this.obtenerFicha(destinoFila, destinoCol);
    const filaIntermedia = (origenFila + destinoFila) / 2;
    const colIntermedia = (origenCol + destinoCol) / 2;
    const fichaIntermedia = this.obtenerFicha(filaIntermedia, colIntermedia);

    if (
      fichaOrigen?.estaActiva() &&
      !fichaDestino &&
      fichaIntermedia?.estaActiva() &&
      (Math.abs(origenFila - destinoFila) === 2 || Math.abs(origenCol - destinoCol) === 2)
    ) {
      this.estado[origenFila][origenCol] = 0;
      this.estado[destinoFila][destinoCol] = 1;
      this.estado[filaIntermedia][colIntermedia] = 0;

      fichaOrigen.fila = destinoFila;
      fichaOrigen.columna = destinoCol;
      this.fichas[destinoFila][destinoCol] = fichaOrigen;
      this.fichas[origenFila][origenCol] = null;
      fichaIntermedia.eliminar();
      this.fichas[filaIntermedia][colIntermedia] = null;

      return true;
    }

    return false;
  }

  imprimirEstado() {
    console.table(this.estado);
  }

  imprimirFichas() {
    const matriz = this.fichas.map(fila =>
      fila.map(f => (f ? (f.activa ? '🟢' : '⚫') : '⬛'))
    );
    console.table(matriz);
  }
  obtenerMovimientosValidos(fila, col) {
    const movimientos = [];

    const direcciones = [
      { df: -2, dc: 0 }, // arriba
      { df: 2, dc: 0 },  // abajo
      { df: 0, dc: -2 }, // izquierda
      { df: 0, dc: 2 }   // derecha
    ];

    for (const { df, dc } of direcciones) {
      const destinoFila = fila + df;
      const destinoCol = col + dc;
      const interFila = fila + df / 2;
      const interCol = col + dc / 2;

      if (
        this.estado?.[destinoFila]?.[destinoCol] === 0 &&
        this.estado?.[interFila]?.[interCol] === 1
      ) {
        movimientos.push({ fila: destinoFila, col: destinoCol });
      }
    }

    return movimientos;
  }
  hayMovimientosDisponibles() {
    for (let fila = 0; fila < this.estado.length; fila++) {
      for (let col = 0; col < this.estado[fila].length; col++) {
        const ficha = this.obtenerFicha(fila, col);
        if (ficha?.estaActiva()) {
          const movimientos = this.obtenerMovimientosValidos(fila, col);
          if (movimientos.length > 0) {
            return true; // hay al menos un movimiento posible
          }
        }
      }
    }
    return false; // no hay ningún movimiento
  }

  contarFichasActivas() {
    let contador = 0;
    for (let fila of this.fichas) {
      for (let f of fila) {
        if (f?.estaActiva()) contador++;
      }
    }
    return contador;
  }

}