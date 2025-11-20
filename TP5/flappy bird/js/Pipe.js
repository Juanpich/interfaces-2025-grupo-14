class Pipes {
    constructor(container, bird, hud) {
        this.container = container;
        this.bird = bird;
        this.hud = hud;

        this.ANCHO_TUBERIA = 75;
        this.ALTO_TUBERIA = 475;
        this.DISTANCIA_INICIAL = 140;
        this.DISTANCIA_MINIMA = 20;
        this.DISTANCIA = this.DISTANCIA_INICIAL;
        this.TIEMPO_GENERACION = 2000;
        this.PIPE_SPEED = 2;

        this.pipes = []; // {top, bottom, passed}
        this.spawnInterval = null;
        this._stopLoop = false;
        this.audioChoque = new Audio("./../audio/choque.mp3");

    }

    start() {
        if (this.spawnInterval) return;
        this.spawnInterval = setInterval(() => this.crearTuberias(), this.TIEMPO_GENERACION);
        this._stopLoop = false;
        this.gameLoop();
    }

    crearTuberias() {
        const containerHeight = this.container.offsetHeight;
        const minY = 50;
        const maxY = containerHeight - this.DISTANCIA - 50;

        const gapTop = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

        const pipeTop = document.createElement("div");
        pipeTop.classList.add("tuberia-arriba");
        pipeTop.style.left = this.container.offsetWidth + "px";
        pipeTop.style.top = (gapTop - this.ALTO_TUBERIA) + "px";

        const pipeBottom = document.createElement("div");
        pipeBottom.classList.add("tuberia-abajo");
        pipeBottom.style.left = this.container.offsetWidth + "px";
        pipeBottom.style.top = (gapTop + this.DISTANCIA) + "px";

        this.container.appendChild(pipeTop);
        this.container.appendChild(pipeBottom);

        this.pipes.push({ top: pipeTop, bottom: pipeBottom, passed: false });
    }

    gameLoop() {
        const loop = () => {
            if (this._stopLoop) return;
            if (!this.bird || !this.bird.isAlive) return;

            for (let i = this.pipes.length - 1; i >= 0; i--) {
                let pipe = this.pipes[i];
                let x = parseFloat(pipe.top.style.left) - this.PIPE_SPEED;
                pipe.top.style.left = x + "px";
                pipe.bottom.style.left = x + "px";

                // Colisión circular
                const birdCircle = this.bird.getCircle();
                const topRect = pipe.top.getBoundingClientRect();
                const bottomRect = pipe.bottom.getBoundingClientRect();

                if (!this.bird.invincible) {
                    if (this.circleRectCollision(birdCircle, topRect) ||
                        this.circleRectCollision(birdCircle, bottomRect)) {
                        this.audioChoque.play();
                        this.bird.hitPipe();
                    }
                }

                // Contar punto si pasa la tubería
                if (!pipe.passed && x + this.ANCHO_TUBERIA < this.bird.bird.offsetLeft) {
                    pipe.passed = true;
                    document.dispatchEvent(new Event("pipe-passed"));
                    this.aumentarDificultad();
                }

                // Remover tuberías fuera de pantalla
                if (x < -this.ANCHO_TUBERIA) {
                    pipe.top.remove();
                    pipe.bottom.remove();
                    this.pipes.splice(i, 1);
                }
            }

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    circleRectCollision(circle, rect) {
        const closestX = Math.max(rect.left, Math.min(circle.x, rect.right));
        const closestY = Math.max(rect.top, Math.min(circle.y, rect.bottom));

        const dx = circle.x - closestX;
        const dy = circle.y - closestY;

        return (dx * dx + dy * dy) < (circle.r * circle.r);
    }

    aumentarDificultad() {
        if (this.DISTANCIA > this.DISTANCIA_MINIMA) {
            this.DISTANCIA -= 10;
            this.TIEMPO_GENERACION -= 1000
        }
    }

    stop() {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;

        this._stopLoop = true;

        this.pipes.forEach(p => {
            p.top.remove();
            p.bottom.remove();
        });
        this.pipes = [];
    }
}
