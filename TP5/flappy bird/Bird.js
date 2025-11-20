class Bird {
  constructor(birdElementId, containerHeight) {
    this.bird = document.getElementById(birdElementId);
    this.containerHeight = containerHeight;
    this.gravity = 0.4;
    this.lift = -7;
    this.velocity = 0;
    this.position = this.containerHeight / 2;
    this.maxFallSpeed = 5;
    this.isAlive = true;
    this.gameStarted = false;
    this.sonidoVuelo = new Audio("../../audio/vuelo.mp3");

    this.init();
  }

  init() {
    this.bird.style.top = `${this.position}px`;

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.sonidoVuelo.currentTime = 0;
        this.sonidoVuelo.play();
        if (!this.gameStarted) {
          this.gameStarted = true;
          this.update(); // inicia el bucle solo una vez
        }
        this.flap();

      }
    });
  }

  flap() {
    if (this.isAlive) {
      this.velocity = this.lift;
    }
  }

  update() {
    if (!this.isAlive) return;

    this.velocity += this.gravity;
    this.velocity = Math.min(this.velocity, this.maxFallSpeed);
    this.position += this.velocity;

    if (this.position > this.containerHeight - this.bird.offsetHeight) {
      this.position = this.containerHeight - this.bird.offsetHeight;
      this.velocity = 0;
    } else if (this.position < 0) {
      this.position = 0;
      this.velocity = 0;
    }

    this.bird.style.top = `${this.position}px`;

    requestAnimationFrame(() => this.update());
  }
}