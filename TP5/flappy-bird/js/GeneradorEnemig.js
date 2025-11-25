class GeneradorPajarosEnemigos {
    constructor(container, pajaro) {
        this.container = container;
        this.pajaro = pajaro; 
        this.enemigos = [];
        this.tiempoDesdeUltimo = 0;
        this.intervaloGeneracion = 6; 
        this.audioChoque = new Audio("./../audio/choque.mp3");
        this.activo = false;
    }

    iniciar() {
        this.activo = true;
        this.tiempoDesdeUltimo = 0;
    }

    detener() {
        this.activo = false;
        for (const enemigo of this.enemigos) {
            enemigo.destruir();
        }
        this.enemigos = [];
    }

    actualizar(dt) {
        if (!this.activo) return;

        const segundos = dt / 1000;
        this.tiempoDesdeUltimo += segundos;

        // generar enemigo
        if (this.tiempoDesdeUltimo >= this.intervaloGeneracion) {
            this.tiempoDesdeUltimo = 0;
            const enemigo = new EnemyBird(this.container);
            enemigo.generar();
            this.enemigos.push(enemigo);
        }

        // actualizar los vigentes
        for (let i = this.enemigos.length - 1; i >= 0; i--) {
            const enemigo = this.enemigos[i];
            enemigo.actualizar(dt);

            // verificar el choque
            if (enemigo.estaActivo() && this.pajaro && !this.pajaro.invincible && !this.pajaro.isBlinking) {
                if (this._verificarColision(enemigo)) {
                    this.audioChoque.play();
                    this.pajaro.hitPipe();
                    enemigo.destruir(); //
                    this.enemigos.splice(i, 1);
                }
            }

            //si se fue de la pantalla eliminar
            if (!enemigo.estaActivo()) {
                this.enemigos.splice(i, 1);
            }
        }
    }

    // choque entre los enemigos
    _verificarColision(enemigo) {
        const circuloJugador = this.pajaro.getCircle();
        const circuloEnemigo = enemigo.getCircle();
        if (!circuloEnemigo) return false;

        const dx = circuloJugador.x - circuloEnemigo.x;
        const dy = circuloJugador.y - circuloEnemigo.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        return distancia < (circuloJugador.r + circuloEnemigo.r);
    }

    obtenerActivos() {
        return this.enemigos.filter(e => e.estaActivo());
    }
}