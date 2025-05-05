document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const bus = document.getElementById('bus');
    const road = document.getElementById('road');
    const obstaclesContainer = document.getElementById('obstacles');
    const scoreElement = document.getElementById('score');
    const speedElement = document.getElementById('speed');
    
    // Control buttons
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const accelerateBtn = document.getElementById('accelerate-btn');
    
    // Game variables
    let score = 0;
    let speed = 0;
    let maxSpeed = 120;
    let acceleration = 0.5;
    let deceleration = 0.2;
    let busPosition = 350;
    let roadPosition = 0;
    let gameRunning = true;
    let obstacleInterval;
    let gameLoop;
    
    // Keyboard controls
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false
    };
    
    // Event listeners for buttons
    leftBtn.addEventListener('mousedown', () => moveBus('left', true));
    leftBtn.addEventListener('mouseup', () => moveBus('left', false));
    leftBtn.addEventListener('touchstart', () => moveBus('left', true));
    leftBtn.addEventListener('touchend', () => moveBus('left', false));
    
    rightBtn.addEventListener('mousedown', () => moveBus('right', true));
    rightBtn.addEventListener('mouseup', () => moveBus('right', false));
    rightBtn.addEventListener('touchstart', () => moveBus('right', true));
    rightBtn.addEventListener('touchend', () => moveBus('right', false));
    
    accelerateBtn.addEventListener('mousedown', () => accelerate(true));
    accelerateBtn.addEventListener('mouseup', () => accelerate(false));
    accelerateBtn.addEventListener('touchstart', () => accelerate(true));
    accelerateBtn.addEventListener('touchend', () => accelerate(false));
    
    // Keyboard event listeners
    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
            e.preventDefault();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
            e.preventDefault();
        }
    });
    
    // Control functions
    function moveBus(direction, active) {
        if (direction === 'left') {
            keys.ArrowLeft = active;
        } else if (direction === 'right') {
            keys.ArrowRight = active;
        }
    }
    
    function accelerate(active) {
        keys.ArrowUp = active;
    }
    
    // Create obstacles
    function createObstacle() {
        if (!gameRunning) return;
        
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        
        // Random lane (left, center, right)
        const lanes = [280, 400, 520];
        const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        
        obstacle.style.left = `${randomLane}px`;
        obstacle.style.top = '-80px';
        obstacle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        
        obstaclesContainer.appendChild(obstacle);
        
        // Remove obstacle when it goes out of view
        setTimeout(() => {
            if (obstacle.parentNode) {
                obstaclesContainer.removeChild(obstacle);
            }
        }, 5000);
    }
    
    // Check collisions
    function checkCollision() {
        const busRect = bus.getBoundingClientRect();
        const obstacles = document.querySelectorAll('.obstacle');
        
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            if (
                busRect.left < obstacleRect.right &&
                busRect.right > obstacleRect.left &&
                busRect.top < obstacleRect.bottom &&
                busRect.bottom > obstacleRect.top
            ) {
                gameOver();
            }
        });
    }
    
    // Game over
    function gameOver() {
        gameRunning = false;
        clearInterval(obstacleInterval);
        cancelAnimationFrame(gameLoop);
        
        alert(`Game Over! Your score: ${score}`);
        
        // Reset game
        setTimeout(() => {
            score = 0;
            speed = 0;
            busPosition = 350;
            roadPosition = 0;
            scoreElement.textContent = '0';
            speedElement.textContent = '0';
            obstaclesContainer.innerHTML = '';
            gameRunning = true;
            startGame();
        }, 1000);
    }
    
    // Main game loop
    function update() {
        if (!gameRunning) return;
        
        // Handle bus movement
        if (keys.ArrowLeft && busPosition > 200) {
            busPosition -= 5;
        }
        if (keys.ArrowRight && busPosition < 500) {
            busPosition += 5;
        }
        
        // Handle acceleration
        if (keys.ArrowUp && speed < maxSpeed) {
            speed += acceleration;
        } else if (speed > 0) {
            speed -= deceleration;
        } else {
            speed = 0;
        }
        
        // Update road movement based on speed
        roadPosition += speed / 5;
        road.style.backgroundPositionY = `${roadPosition}px`;
        
        // Update bus position
        bus.style.left = `${busPosition}px`;
        
        // Move obstacles
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            const currentTop = parseInt(obstacle.style.top);
            obstacle.style.top = `${currentTop + speed / 2}px`;
            
            // Increase score when obstacle passes the bus
            if (currentTop > 600 && !obstacle.dataset.scored) {
                obstacle.dataset.scored = true;
                score += 10;
                scoreElement.textContent = score;
            }
        });
        
        // Update speed display
        speedElement.textContent = Math.round(speed);
        
        // Check for collisions
        checkCollision();
        
        // Continue game loop
        gameLoop = requestAnimationFrame(update);
    }
    
    // Start the game
    function startGame() {
        // Create obstacles at intervals
        obstacleInterval = setInterval(createObstacle, 2000);
        
        // Start game loop
        gameLoop = requestAnimationFrame(update);
    }
    
    // Initialize game
    startGame();
});