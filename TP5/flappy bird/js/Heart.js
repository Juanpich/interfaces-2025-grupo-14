class Heart {
    constructor(container, bird) {
        this.container = container;
        this.bird = bird;
        this.speed = 2;
        this.initialDelay = 20000; // primer spawn
        this.spawnInterval = 20000; // cada cuánto aparece
        this.heartWidth = 32;
        this.heartHeight = 32;
        this.hearts = [];
        this.started = false;
        this.spawnTimer = null;
        this.loop = null;
        this.sonidoCorazon = new Audio ("./../audio/moneda.mp3");
    }

    start() {
        if (this.started) return;
        this.started = true;

        this.spawnTimer = setTimeout(() => {
            this.spawnHeart();
            this.spawnTimer = setInterval(() => this.spawnHeart(), this.spawnInterval);
        }, this.initialDelay);

        this.gameLoop();
    }

    spawnHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.style.position = "absolute";
        heart.style.width = this.heartWidth + "px";
        heart.style.height = this.heartHeight + "px";
        heart.style.background = 'url("../img/heart/corazon.png") no-repeat center';
        heart.style.backgroundSize = "contain";
        heart.style.left = this.container.offsetWidth + "px";
        heart.style.top = Math.random() * (this.container.offsetHeight - this.heartHeight) + "px";
        this.container.appendChild(heart);
        this.hearts.push(heart);
    }

    gameLoop() {
        this.loop = setInterval(() => this.updateHearts(), 16); // ~60 FPS
    }

    updateHearts() {
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            let x = parseFloat(heart.style.left);
            heart.style.left = (x - this.speed) + "px";

            if (x < -this.heartWidth) {
                heart.remove();
                this.hearts.splice(i, 1);
                continue;
            }

            if (this.checkCollision(heart)) {
                document.dispatchEvent(new Event("heart-collected"));
                this.sonidoCorazon.play();
                heart.remove();
                this.hearts.splice(i, 1);
            }
        }
    }

    checkCollision(heart) {
        const birdRect = this.bird.getBoundingClientRect();
        const heartRect = heart.getBoundingClientRect();
        return !(birdRect.right < heartRect.left || birdRect.left > heartRect.right || birdRect.bottom < heartRect.top || birdRect.top > heartRect.bottom);
    }

    stop() {
        clearTimeout(this.spawnTimer);
        clearInterval(this.loop);
        this.spawnTimer = null;
        this.loop = null;
    }

    clear() {
        this.hearts.forEach(h => h.remove());
        this.hearts = [];
    }
}