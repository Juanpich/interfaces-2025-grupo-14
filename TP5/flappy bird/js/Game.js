class Game {
    constructor() {
        this.container = document.querySelector(".game-container");
        this.bird = null;
        this.coins = null;
        this.hearts = null;
        this.score = 0;
        this.lives = 3;
        this.gameStarted = false;
        this.hud = null;
        this.sonidioCaida = new Audio("./../audio/caida.mp3");


        this.init();
    }

    init() {
        const containerHeight = this.container.offsetHeight;

        // Crear pájaro
        this.bird = new Bird("bird", containerHeight);

        // Crear monedas
        this.coins = new Coin(this.container, document.getElementById("bird"));

        // Crear corazones
        this.hearts = new Heart(this.container, document.getElementById("bird"));

        // Crear HUD
        this.hud = new HUD();
        this.hud.updateScore(this.score);
        this.hud.updateLives(this.lives);

        // Crear tuberías
        // Si existe la nueva clase GeneradorTuberias la usamos. Si no, mantenemos la compatibilidad con Pipes.
        if (window.GeneradorTuberias) {
            // Generador que controla spawn y dificultad dinámica (gap, spacing, velocidad)
            this.generadorTuberias = new GeneradorTuberias({
                contenedor: document.getElementById("pipes-container")
            });
        }

        // Eventos
        document.addEventListener("coin-collected", () => {
            this.score += 3;
            this.hud.updateScore(this.score);
        });
        document.addEventListener("pipe-passed", () => {
            this.score++;
            this.hud.updateScore(this.score);
        });
        document.addEventListener("heart-collected", () => this.gainLife());
        document.addEventListener("hit-limit", () => this.loseLife());

        document.addEventListener("game-started", () => {
            if (!this.gameStarted) {
                this.gameStarted = true;

                // Iniciar tuberías:
                // - Si usamos la clase antigua Pipes, llamamos a su método start() si existe.
                // - Si usamos GeneradorTuberias, no hace falta "start" explícito: empezará a generar cuando reciba updates en el bucle.
                // if (this.pipes && typeof this.pipes.start === "function") {
                //     this.pipes.start();
                // }
                if (this.generadorTuberias) {
                    // Reset opcional para asegurar valores iniciales
                    if (typeof this.generadorTuberias.reset === "function") {
                        this.generadorTuberias.reset();
                    }
                    // Si necesitás un "start" explícito, podés añadirlo a GeneradorTuberias; aquí nos bastará con que el gameLoop llame a update(dt).
                }

                // Iniciar monedas con delay de 2s
                setTimeout(() => this.coins.start(), 2000);

                // Iniciar corazones con delay de 6s
                setTimeout(() => this.hearts.start(), 6000);
            }
        });

        this.gameLoop();
    }

    gainLife() {
        if (this.lives < 3) {
            this.lives++;
            this.hud.updateLives(this.lives);
        }
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            this.hud.updateLives(this.lives);

            // Reset posición pájaro
            this.bird.position = this.container.offsetHeight / 2;
            this.bird.velocity = 0;
            this.bird.bird.style.top = `${this.bird.position}px`;
        }

        // Si ya no quedan vidas → GAME OVER
        if (this.lives <= 0) {
            this.bird.isAlive = false;
            this.showGameOverScreen();
            this.sonidioCaida.play();

        }
    }

    showGameOverScreen() {
        const panel = document.getElementById("game-over");
        panel.classList.remove("hidden");

        setTimeout(() => panel.classList.add("visible"), 10);

        const restartHandler = (e) => {
            if (e.code === "Space") {
                document.removeEventListener("keydown", restartHandler);
                panel.classList.remove("visible");
                setTimeout(() => panel.classList.add("hidden"), 300);

                this.restartGame();
            }
        };

        document.addEventListener("keydown", restartHandler);
    }

    restartGame() {
        window.location.reload();
    }

    // Reemplazamos el gameLoop por uno que use requestAnimationFrame y pase dt (ms).
    gameLoop() {
        let ultimo = performance.now();

        const loop = (ahora) => {
            const dt = ahora - ultimo; // dt en milisegundos
            ultimo = ahora;

            // Solo procesar actualizaciones mientras el pájaro esté vivo
            if (this.bird && this.bird.isAlive) {
                // Actualizar el generador/las pipes aunque el juego aún no se haya "iniciado"
                // de esta forma las tuberías empiezan a generarse desde que se carga la página.
                if (this.generadorTuberias && typeof this.generadorTuberias.update === "function") {
                    this.generadorTuberias.update(dt);
                }
                // Compatibilidad: si usamos la antigua clase Pipes que tenga update

                // Actualizar otros sistemas que dependan del tiempo (monedas/corazones)
                // NOTA: su comportamiento de start sigue controlado por el evento 'game-started'
                if (this.coins && typeof this.coins.update === "function") this.coins.update(dt);
                if (this.hearts && typeof this.hearts.update === "function") this.hearts.update(dt);

                // Lógica adicional por frame (si hace falta)
                // ...existing code...
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}

