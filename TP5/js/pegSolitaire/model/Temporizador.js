class Temporizador {
  constructor(modo = "ascendente", duracion = 0) {
    this.modo = modo;                   // "ascendente" o "descendente"
    this.duracion = duracion;           // duración total para modo descendente
    this.tiempoActual = modo === "ascendente" ? 0 : duracion;
    this.intervalo = null;
    this.enEjecucion = false;
    this.onTick = null;                 // callback que recibe tiempo formateado cada segundo
    this.onTerminado = null; 
               // callback al terminar el tiempo en modo descendente
  }

  iniciar() {
    if (this.enEjecucion) return;
    this.enEjecucion = true;
    this.intervalo = setInterval(() => this.actualizar(), 1000);
  }

  pausar() {
    this.enEjecucion = false;
    clearInterval(this.intervalo);
  }

  reiniciar() {
    this.pausar();
    this.tiempoActual = this.modo === "ascendente" ? 0 : this.duracion;
  }

  actualizar() {
    if (this.modo === "ascendente") {
      this.tiempoActual++;
    } else {
      this.tiempoActual--;
      if (this.tiempoActual <= 0) {
        this.tiempoActual = 0;
        this.pausar();
        if (this.onTerminado) this.onTerminado();
      }
    }

    if (this.onTick) this.onTick(this.obtenerTiempoFormateado());
  }

  obtenerTiempoFormateado() {
    const minutos = Math.floor(this.tiempoActual / 60);
    const segundos = this.tiempoActual % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }
}
