class Game {
    constructor() {
        this.container = document.querySelector(".game-container");
        this.bird = null;
        this.coins = null;
        this.hearts = null;
        this.pipes = null;
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
        this.pipes = new Pipes(this.container, this.bird, this.hud);

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

                // Iniciar tuberías
                this.pipes.start();

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

    gameLoop() {
        setInterval(() => {
            if (this.bird.isAlive) {
                // Aquí podés agregar lógica extra si hace falta
            }
        }, 16);
    }
}

