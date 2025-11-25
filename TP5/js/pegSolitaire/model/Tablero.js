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
    if (!fichaOrigen || fichaDestino) return false;

    const df = destinoFila - origenFila;
    const dc = destinoCol - origenCol;

    const esMovimientoRecto = (df === 0 && dc !== 0) || (dc === 0 && df !== 0);
    if (!esMovimientoRecto) return false;

    // Movimiento simple (una casilla)
    if (Math.abs(df) === 1 || Math.abs(dc) === 1) {
      this.estado[destinoFila][destinoCol] = 1;
      this.estado[origenFila][origenCol] = 0;
      fichaOrigen.fila = destinoFila;
      fichaOrigen.columna = destinoCol;
      this.fichas[destinoFila][destinoCol] = fichaOrigen;
      this.fichas[origenFila][origenCol] = null;
      return true;
    }

    // Movimiento de salto simple (2) o doble (4)
    const distancia = Math.max(Math.abs(df), Math.abs(dc));
    if (distancia !== 2 && distancia !== 4) return false;

    // Calcular fichas intermedias correctamente
    const pasos = [];
    const pasoFila = df === 0 ? 0 : df / distancia;
    const pasoCol = dc === 0 ? 0 : dc / distancia;

    for (let i = 1; i < distancia; i++) {
      pasos.push({
        fila: origenFila + i * pasoFila,
        col: origenCol + i * pasoCol,
      });
    }

    // Verificar fichas intermedias
    const intermedias = pasos
      .map(p => this.obtenerFicha(p.fila, p.col))
      .filter(f => f && f.estaActiva());

    // Si no hay fichas intermedias o demasiadas, no es válido
    if (intermedias.length === 0 || intermedias.length > 2) return false;

    // Mover ficha
    this.estado[origenFila][origenCol] = 0;
    this.estado[destinoFila][destinoCol] = 1;
    fichaOrigen.fila = destinoFila;
    fichaOrigen.columna = destinoCol;
    this.fichas[destinoFila][destinoCol] = fichaOrigen;
    this.fichas[origenFila][origenCol] = null;

    // Eliminar las fichas comidas (una o dos)
    for (const inter of pasos) {
      const f = this.obtenerFicha(inter.fila, inter.col);
      if (f && f.estaActiva()) {
        f.eliminar();
        this.fichas[inter.fila][inter.col] = null;
        this.estado[inter.fila][inter.col] = 0;
      }
    }
    return true;
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

  obtenerMovimientosValidos(fila, col, visitados = new Set(), direccion = null) {
    const movimientos = [];
    const clave = `${fila},${col}`;
    if (visitados.has(clave)) return [];
    visitados.add(clave);

    const direcciones = [
      { df: -2, dc: 0 }, // arriba
      { df: 2, dc: 0 },  // abajo
      { df: 0, dc: -2 }, // izquierda
      { df: 0, dc: 2 }   // derecha
    ];

    for (const { df, dc } of direcciones) {
      if (direccion && (df !== direccion.df || dc !== direccion.dc)) continue
      const destinoFila = fila + df;
      const destinoCol = col + dc;
      const interFila = fila + df / 2;
      const interCol = col + dc / 2;

      // Verificamos si es un salto válido (come una ficha)
      if (
        this.estado?.[destinoFila]?.[destinoCol] === 0 &&
        this.estado?.[interFila]?.[interCol] === 1
      ) {
        movimientos.push({ fila: destinoFila, col: destinoCol });


        const saltosEncadenados = this.obtenerMovimientosValidos(destinoFila, destinoCol, visitados, { df, dc });
        for (const salto of saltosEncadenados) {
          movimientos.push(salto);
        }
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
  fichasFaltantes() {
    let contador = 0;
    for (let fila of this.estado) {
      for (let celda of fila) {
        if (celda === 1) contador++;
      }
    }
    return contador;
  }




}