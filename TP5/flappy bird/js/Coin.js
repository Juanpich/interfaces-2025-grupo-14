class Coin {
    constructor(container, bird) {
        this.container = container;
        this.bird = bird;
        this.speed = 2;
        this.spawnInterval = 15000; // cada cuánto aparecen monedas
        this.coinWidth = 46;
        this.coinHeight = 42;
        this.coins = [];
        this.running = false;
        this.spawnTimer = null;
        this.loop = null;
        this.sonidoMoeda = new Audio("./../audio/moneda.mp3");
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.spawnCoin();
            this.spawnTimer = setInterval(() => this.spawnCoin(), this.spawnInterval);
            this.gameLoop();
        }
    }

    spawnCoin() {
        const coin = document.createElement("div");
        coin.classList.add("moneda");
        coin.style.position = "absolute";
        coin.style.width = this.coinWidth + "px";
        coin.style.height = this.coinHeight + "px";
        coin.style.background = 'url("../img/coin/monedas.png") repeat-x';
        coin.style.animation = "rotate-coin .8s steps(6) infinite";
        coin.style.left = this.container.offsetWidth + "px";
        coin.style.top = Math.random() * (this.container.offsetHeight - this.coinHeight) + "px";
        this.container.appendChild(coin);
        this.coins.push(coin);
    }

    gameLoop() {
        this.loop = setInterval(() => { this.updateCoins(); }, 16); // ~60 FPS
    }

    updateCoins() {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            let x = parseFloat(coin.style.left);
            coin.style.left = (x - this.speed) + "px";

            // Fuera de pantalla
            if (x < -this.coinWidth) {
                coin.remove();
                this.coins.splice(i, 1);
                continue;
            }

            // Colisión con pájaro
            if (this.checkCollision(coin)) {
                document.dispatchEvent(new Event("coin-collected"));
                this.sonidoMoeda.currentTime = 0;
                this.sonidoMoeda.play();
                coin.remove();
                this.coins.splice(i, 1);
            }
        }
    }

    checkCollision(coin) {
        const birdRect = this.bird.getBoundingClientRect();
        const coinRect = coin.getBoundingClientRect();
        return !(birdRect.right < coinRect.left || birdRect.left > coinRect.right || birdRect.bottom < coinRect.top || birdRect.top > coinRect.bottom);
    }

    stop() {
        clearInterval(this.spawnTimer);
        clearInterval(this.loop);
        this.spawnTimer = null;
        this.loop = null;
    }

    clear() {
        this.coins.forEach(c => c.remove());
        this.coins = [];
    }
}