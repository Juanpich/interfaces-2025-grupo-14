class Game {
    constructor() {
        this.container = document.querySelector(".game-container");
        this.startScreen = document.getElementById("start-screen");
        this.bird = null;
        this.generadorTuberias = null;
        this.score = 0;
        this.lives = 3;
        this.gameStarted = false;
        this.hud = null;
        this.sonidoCaida = new Audio("./../audio/caida.mp3");
        this.generadorPajarosEnemigos = null;
        this.init();
    }


    init() {
        const containerHeight = this.container.offsetHeight;

        // Crear pájaro
        this.bird = new Bird("bird", containerHeight);
        //generador de enemigos
         this.generadorPajarosEnemigos = new GeneradorPajarosEnemigos(
            this.container,
            this.bird
        );
        // Crear generador de tuberías con valores iniciales más amplios
        if (window.GeneradorTuberias) {
            this.generadorTuberias = new GeneradorTuberias({
                contenedor: document.getElementById("pipes-container"),

                //SEPARACIÓN VERTICAL
                separacionVerticalInicial: 320,  // separacion entre los tubos al comenzar
                minSeparacion: 100,              // separacion minima entre tubos

                // SEPARACIÓN HORIZONTAL
                separacionHorizontalInicial: 400, // separacion entre pares de tubos al inicio
                minSeparacionHorizontal: 250,     // minima separacion a la que llega

                // VELOCIDAD 
                velocidadInicial: 150,            // velocidad de movimineto de las tuberias

                // Reducion de dificultad del juego
                factorDificultad: 0.9999,         //si se hacerca a uno la dificultad de va haciendo mas lenta 

                //ALTURA MÍNIMA DE CADA TUBO
                minAlturaTubo: 30                 // No modificar
            });

            // Establecer referencia al pájaro para detección de colisiones
            this.generadorTuberias.setPajaro(this.bird);
        }

        // Crear HUD
        this.hud = new HUD();
        this.hud.updateScore(this.score);
        this.hud.updateLives(this.lives);

        // Configurar eventos
        this.setupEventListeners();

        // Iniciar el bucle principal (pero sin actualizar tuberías hasta que empiece el juego)
        this.gameLoop();
    }

    setupEventListeners() {
        // Evento de colectar monedas
        document.addEventListener("coin-collected", () => {
            this.score += 3;
            this.hud.updateScore(this.score);
        });

        // Evento de pasar tubería
        document.addEventListener("pipe-passed", () => {
            this.score++;
            this.hud.updateScore(this.score);
        });

        // Evento de colectar corazón
        document.addEventListener("heart-collected", () => this.gainLife());

        // Evento de perder vida
        document.addEventListener("hit-limit", () => this.loseLife());

        // Evento de inicio del juego (cuando se presiona ESPACIO por primera vez)
        document.addEventListener("game-started", () => {
            if (!this.gameStarted) {
                this.gameStarted = true;

                // Ocultar pantalla de inicio
                if (this.startScreen) {
                    this.startScreen.style.opacity = "0";
                    setTimeout(() => {
                        this.startScreen.style.display = "none";
                    }, 300);
                }
                if (this.generadorTuberias) {
                    this.generadorTuberias.iniciarGeneracion();
                }

                if (this.generadorPajarosEnemigos) {
                    // iniciar medio segundo despues de comenzar el juego
                    setTimeout(() => {
                        this.generadorPajarosEnemigos.iniciar();
                    }, 500);
                }
            }
        });
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
            this.gameStarted = false; // Detener actualizaciones
            this.showGameOverScreen();
            this.sonidoCaida.play();

            // Detener generador de tuberías
            if (this.generadorTuberias) {
                this.generadorTuberias.detener();
            }

            // Detener monedas y corazones
            if (this.coins) {
                this.coins.stop();
                this.coins.clear();
            }
            if (this.hearts) {
                this.hearts.stop();
                this.hearts.clear();
            }
            if (this.generadorPajarosEnemigos) {
                this.generadorPajarosEnemigos.detener();
            }
            //TODO parar el fondo 
        }
    }

    showGameOverScreen() {
        const panel = document.getElementById("game-over");
        if (!panel) return;

        panel.classList.remove("hidden");
        setTimeout(() => panel.classList.add("visible"), 10);

        const restartHandler = (e) => {
            if (e.code === "Space") {
                document.removeEventListener("keydown", restartHandler);
                panel.classList.remove("visible");
                setTimeout(() => {
                    panel.classList.add("hidden");
                    this.restartGame();
                }, 300);
            }
        };

        document.addEventListener("keydown", restartHandler);
    }

    restartGame() {
        window.location.reload();
    }

    gameLoop() {
        let ultimo = performance.now();

        const loop = (ahora) => {
            const dt = ahora - ultimo; // dt en milisegundos
            ultimo = ahora;

            // IMPORTANTE: Solo actualizar tuberías si el juego ha comenzado
            if (this.bird && this.bird.isAlive && this.gameStarted) {
                // Actualizar generador de tuberías
                if (this.generadorTuberias) {
                    this.generadorTuberias.update(dt);
                }
                if (this.generadorPajarosEnemigos) {
                    this.generadorPajarosEnemigos.actualizar(dt);
                }
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}
function iniciar_juego(){
// Inicialización automática cuando el DOM esté listo
    console.log("Listo para comezar")
    window.addEventListener("keydown", function(e) {
    if (e.key === " " || e.keyCode === 32) {
        e.preventDefault();
    }
});
    //descativar scrool del espacio
    const game = new Game();
}
iniciar_juego()

