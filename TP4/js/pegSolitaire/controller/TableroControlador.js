class TableroControlador {
  constructor(tablero, vista, modo = "Modo Libre", tiempo = 60) {
    this.tablero = tablero;
    this.vista = vista;
    this.modo = modo;
    this.tiempoInicial = tiempo;
    this.tiempoActual = modo === "Contra Reloj" ? tiempo : 0;
    this.fichaArrastrada = null;
    this.offset = { x: 0, y: 0 };
    this.ultimoX = 0;
    this.ultimoY = 0;
    this.contadorMovimientos = 0;
    this.juegoTerminado = false;

    this.vista.onMouseDown = e => this.iniciarArrastre(e);
    this.vista.onMouseMove = e => this.moverArrastre(e);
    this.vista.onMouseUp = e => this.soltarArrastre(e);

    this.temporizador = new Temporizador(
      modo === "Contra Reloj" ? "descendente" : "ascendente",
      tiempo
    );

    this.vista.temporizador = this.temporizador;

    this.temporizador.onTick = tiempoFormateado => {
      this.vista.tiempoActual = tiempoFormateado;
      this.vista.dibujar(this.fichaArrastrada, this.offset, this.ultimoX, this.ultimoY);
    };

    this.temporizador.onTerminado = () => {
      if (this.modo === "Contra Reloj" && !this.juegoTerminado) {
        this.juegoTerminado = true;
        this.vista.mostrarCartelDerrotaTiempo(
          () => this.reiniciarJuego(),
          () => location.reload()
        );
      }
    };

    this.temporizador.iniciar();
    this.vista.dibujar();
  }

  iniciarArrastre(e) {
    if (this.juegoTerminado) return;
    const { fila, col } = this.vista.obtenerCeldaDesdeEvento(e);
    const ficha = this.tablero.obtenerFicha(fila, col);
    if (!ficha?.estaActiva()) return;

    this.fichaArrastrada = ficha;
    this.offset = {
      x: e.offsetX - col * this.vista.tamanioCelda,
      y: e.offsetY - fila * this.vista.tamanioCelda
    };
    this.ultimoX = e.offsetX;
    this.ultimoY = e.offsetY;

    this.vista.setDestinosValidos(this.tablero.obtenerMovimientosValidos(fila, col));
    this.vista.dibujar(this.fichaArrastrada, this.offset, this.ultimoX, this.ultimoY);
  }

  moverArrastre(e) {
    if (!this.fichaArrastrada || this.juegoTerminado) return;
    this.ultimoX = e.offsetX;
    this.ultimoY = e.offsetY;
    this.vista.dibujar(this.fichaArrastrada, this.offset, this.ultimoX, this.ultimoY);
  }

  soltarArrastre(e) {
    if (!this.fichaArrastrada || this.juegoTerminado) return;

    const { fila: filaMouse, col: colMouse } = this.vista.obtenerCeldaDesdeEvento(e);
    const origenFila = this.fichaArrastrada.fila;
    const origenCol = this.fichaArrastrada.columna;

    let destinoValido = null;
    let minDist = Infinity;
    for (let mov of this.tablero.obtenerMovimientosValidos(origenFila, origenCol)) {
      const dx = mov.col - colMouse;
      const dy = mov.fila - filaMouse;
      const dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        destinoValido = mov;
      }
    }

    if (destinoValido && minDist <= 1) {
      const exito = this.tablero.moverFicha(origenFila, origenCol, destinoValido.fila, destinoValido.col);
      if (exito) {
        this.contadorMovimientos++;
        this.vista.setMovimientos(this.contadorMovimientos);
      }
    }

    this.fichaArrastrada = null;
    this.vista.setDestinosValidos([]);
    this.vista.dibujar();
    this.verificarEstadoJuego();
  }

  verificarEstadoJuego() {
    const fichasRestantes = this.tablero.contarFichasActivas();

    if (fichasRestantes === 1) {
      this.juegoTerminado = true;
      this.temporizador.pausar();
      this.vista.mostrarCartelVictoria(
        () => this.reiniciarJuego(),
        () => location.reload()
      );
      return;
    }

    if (!this.tablero.hayMovimientosDisponibles()) {
      this.juegoTerminado = true;
      this.temporizador.pausar();
      this.vista.mostrarCartelDerrotaMovimientos(
        () => this.reiniciarJuego(),
        () => location.reload()
      );
    }
  }

  reiniciarJuego() {
    this.tablero = new Tablero();
    this.vista.tablero = this.tablero;
    this.contadorMovimientos = 0;
    this.juegoTerminado = false;
    this.vista.setMovimientos(0);
    this.temporizador.reiniciar();
    this.temporizador.iniciar();
    this.vista.dibujar();
  }
}
