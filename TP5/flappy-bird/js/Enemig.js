class EnemyBird {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.posX = container.clientWidth;
        this.posY = 0;
        this.width = 50;
        this.height = 50;
        this.velocidad = 200; // velocidad a la que se mueve el pajaro
        this.activo = false;
        this.radius = this.width / 2;
    }

    // genera el pajaro en una pos y aleatoria
    generar() {
        if (this.activo) return; // Ya hay uno activo

        this.element = document.createElement("div");
        this.element.className = "enemy-bird";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.position = "absolute";
        this.element.style.zIndex = "1000";

        // pos Y aleatoria
        const margen = 50;
        this.posY = margen + Math.random() * (this.container.clientHeight - this.height - margen * 2);
        this.posX = this.container.clientWidth;

        this.element.style.left = this.posX + "px";
        this.element.style.top = this.posY + "px";

        this.container.appendChild(this.element);
        this.activo = true;
    }

    // actualizar el enemigo
    actualizar(dt) {
        if (!this.activo) return;

        const segundos = dt / 1000;
        this.posX -= this.velocidad * segundos;
        this.element.style.left = this.posX + "px";

        // Eliminar si sale de la pantalla
        if (this.posX + this.width < 0) {
            this.destruir();
        }
    }

    // Obtiene el círculo de colisión
    getCircle() {
        if (!this.activo) return null;

        const containerRect = this.container.getBoundingClientRect();

        return {
            x: containerRect.left + this.posX + this.width / 2,
            y: containerRect.top + this.posY + this.height / 2,
            r: this.radius
        };
    }


    // Destruye el pájaro enemigo
    destruir() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.activo = false;
        this.element = null;
    }

    // Verifica si está activo
    estaActivo() {
        return this.activo;
    }
}
