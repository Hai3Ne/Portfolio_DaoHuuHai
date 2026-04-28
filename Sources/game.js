// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Player with image
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: '#0df',
    dx: 0,
    dy: 0,
    image: null,
    isStunned: false,  // Flag to indicate if player is stunned
    stunTimer: 0       // Timer for stun duration
};

function loadPlayerImage() {
    player.image = null;
}

// Stars (collectibles) with images
const stars = [];
const starCount = 10;
let starImage = null;

function loadStarImage() {
    starImage = null;
}

function createStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 15 + Math.random() * 10,
            speed: 1 + Math.random() * 2
        });
    }
}

// Obstacles with images
const obstacles = [];
const obstacleCount = 15;
let obstacleImage = null;

function loadObstacleImage() {
    obstacleImage = null;
}

function createObstacles() {
    for (let i = 0; i < obstacleCount; i++) {
        obstacles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: 40 + Math.random() * 50,
            height: 40 + Math.random() * 50,
            speed: 1 + Math.random() * 1.5,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2
        });
    }
}

// Game variables
let score = 0;
let isGameActive = true;

// Draw functions
function drawPlayer() {
    // Save current global alpha
    const currentAlpha = ctx.globalAlpha;
    
    // Apply visual effect if player is stunned
    if (player.isStunned) {
        if (player.stunTimer % 10 < 5) {
            ctx.globalAlpha = 0.5;
        }
    }
    
    if (player.image && player.image.complete) {
        // Draw player image
        ctx.drawImage(
            player.image, 
            player.x - player.size, 
            player.y - player.size, 
            player.size * 2, 
            player.size * 2
        );
    } else {
        // Draw fallback circle
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        ctx.fillStyle = player.isStunned ? '#ff6347' : player.color; // Red tint when stunned
        ctx.fill();
        ctx.closePath();
    }
    
    // Restore global alpha
    ctx.globalAlpha = currentAlpha;
}

function drawStars() {
    stars.forEach(star => {
        if (starImage && starImage.complete) {
            // Draw star image
            ctx.drawImage(
                starImage, 
                star.x - star.size / 2, 
                star.y - star.size / 2, 
                star.size, 
                star.size
            );
        } else {
            // Draw fallback star shape
            ctx.beginPath();
            // Draw a 5-point star
            for (let i = 0; i < 5; i++) {
                const outerRadius = star.size;
                const innerRadius = star.size / 2;
                const outerX = star.x + outerRadius * Math.cos(((18 + i * 72) * Math.PI) / 180);
                const outerY = star.y + outerRadius * Math.sin(((18 + i * 72) * Math.PI) / 180);
                const innerX = star.x + innerRadius * Math.cos(((54 + i * 72) * Math.PI) / 180);
                const innerY = star.y + innerRadius * Math.sin(((54 + i * 72) * Math.PI) / 180);
                
                if (i === 0) {
                    ctx.moveTo(outerX, outerY);
                } else {
                    ctx.lineTo(outerX, outerY);
                }
                
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fillStyle = '#FFD700';
            ctx.fill();
        }
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacleImage && obstacleImage.complete) {
            // Draw obstacle image
            ctx.drawImage(
                obstacleImage, 
                obstacle.x, 
                obstacle.y, 
                obstacle.width, 
                obstacle.height
            );
        } else {
            // Draw fallback rectangle
            ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

function drawBackground() {
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(10, 10, 20, 0.7)');
    gradient.addColorStop(1, 'rgba(40, 40, 60, 0.7)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some subtle stars in the background
    for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 1.5,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7})`;
        ctx.fill();
        ctx.closePath();
    }
}

// Update functions
function updatePlayer() {
    // If player is stunned, they can't control but physics still apply
    if (!player.isStunned) {
        // Normal player control (dx and dy set by keyboard/touch input)
    } else {
        // While stunned, player movement physics still apply but with damping
        player.dx *= 0.95;
        player.dy *= 0.95;
    }
    
    // Update player position based on velocity
    player.x += player.dx;
    player.y += player.dy;
    
    // Boundary check
    if (player.x - player.size < 0) {
        player.x = player.size;
        player.dx *= -0.5; // Bounce off walls with reduced energy
    } else if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
        player.dx *= -0.5;
    }
    
    if (player.y - player.size < 0) {
        player.y = player.size;
        player.dy *= -0.5;
    } else if (player.y + player.size > canvas.height) {
        player.y = canvas.height - player.size;
        player.dy *= -0.5;
    }
    
    // Update stun status if player is stunned
    if (player.isStunned) {
        player.stunTimer--;
        if (player.stunTimer <= 0) {
            player.isStunned = false;
        }
    }
}

function updateStars() {
    for (let i = 0; i < stars.length; i++) {
        // Make stars twinkle by slightly changing their size
        stars[i].size = 10 + Math.sin(Date.now() * 0.005 + i) * 2;
        
        // Check collision with player
        const dx = stars[i].x - player.x;
        const dy = stars[i].y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.size + stars[i].size / 2) {
            // Player collected a star
            stars.splice(i, 1);
            score++;
            
            // Add a new star
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 10 + Math.random() * 10,
                speed: 1 + Math.random() * 2
            });
        }
    }
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        // Move obstacles
        obstacle.x += obstacle.dx;
        obstacle.y += obstacle.dy;
        
        // Boundary check and bounce
        if (obstacle.x < 0 || obstacle.x + obstacle.width > canvas.width) {
            obstacle.dx *= -1;
        }
        
        if (obstacle.y < 0 || obstacle.y + obstacle.height > canvas.height) {
            obstacle.dy *= -1;
        }
        
        // Check collision with player, but only if player is not already stunned
        if (
            !player.isStunned &&
            player.x + player.size > obstacle.x &&
            player.x - player.size < obstacle.x + obstacle.width &&
            player.y + player.size > obstacle.y &&
            player.y - player.size < obstacle.y + obstacle.height
        ) {
            // Calculate bounce direction
            const centerX = obstacle.x + obstacle.width / 2;
            const centerY = obstacle.y + obstacle.height / 2;
            const dx = player.x - centerX;
            const dy = player.y - centerY;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            // Apply a strong bounce effect
            const bounceForce = 15;
            player.dx = (dx / len) * bounceForce;
            player.dy = (dy / len) * bounceForce;
            
            // Apply stun effect - player cannot control for a short time
            player.isStunned = true;
            player.stunTimer = 60; // About 1 second at 60 FPS
            
            // Reduce score if you want
            score = Math.max(0, score - 1);
            
            // Flash screen to indicate hit
            flashScreenOnHit();
        }
    });
}

// Flash screen when hit
function flashScreenOnHit() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Update stun status
function updatePlayerStun() {
    if (player.isStunned) {
        // Decrease stun timer
        player.stunTimer--;
        
        // If stun duration is over, remove stun
        if (player.stunTimer <= 0) {
            player.isStunned = false;
            player.dx = 0;
            player.dy = 0;
        }
        
        // Make player flash when stunned (alternating alpha)
        if (player.stunTimer % 10 < 5) {
            ctx.globalAlpha = 0.5;
        } else {
            ctx.globalAlpha = 1;
        }
    }
}

// Reset game
function resetGame() {
    score = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.dx = 0;
    player.dy = 0;
    
    // Clear and recreate stars and obstacles
    stars.length = 0;
    obstacles.length = 0;
    createStars();
    createObstacles();
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    if (isGameActive) {
        // Update game objects
        updatePlayer();
        updateStars();
        updateObstacles();
        
        // Draw game objects
        drawObstacles();
        drawStars();
        drawPlayer();
        drawScore();
    }
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
function keyDown(e) {
    if (isGameActive && !player.isStunned) { // Only respond to inputs if not stunned
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            player.dx = player.speed;
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            player.dx = -player.speed;
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            player.dy = -player.speed;
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            player.dy = player.speed;
        }
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowLeft' ||
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'a' ||
        e.key === 'A'
    ) {
        player.dx = 0;
    }
    
    if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'w' ||
        e.key === 'W' ||
        e.key === 's' ||
        e.key === 'S'
    ) {
        player.dy = 0;
    }
}

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    
    if (!isGameActive || player.isStunned) return; // Don't respond to touch if stunned
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const diffX = touchX - touchStartX;
    const diffY = touchY - touchStartY;
    
    // Determine direction based on the largest difference
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal movement
        player.dx = diffX > 0 ? player.speed : -player.speed;
        player.dy = 0;
    } else {
        // Vertical movement
        player.dx = 0;
        player.dy = diffY > 0 ? player.speed : -player.speed;
    }
    
    // Update touch start position
    touchStartX = touchX;
    touchStartY = touchY;
});

canvas.addEventListener('touchend', () => {
    player.dx = 0;
    player.dy = 0;
});

// Mouse controls for desktop
canvas.addEventListener('mousedown', (e) => {
    if (!isGameActive || player.isStunned) return; // Don't respond to mouse if stunned
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate direction from player to mouse position
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length > 0) {
        player.dx = (dx / length) * player.speed;
        player.dy = (dy / length) * player.speed;
    }
});

canvas.addEventListener('mouseup', () => {
    player.dx = 0;
    player.dy = 0;
});

// Initialize game
function init() {
    // Load images
    loadPlayerImage();
    loadStarImage();
    loadObstacleImage();
    
    // Create game objects
    createStars();
    createObstacles();
    
    // Start game loop
    gameLoop();
}

// Export functions for other scripts
window.gameInterface = {
    startGame: function() {
        isGameActive = true;
    },
    pauseGame: function() {
        isGameActive = false;
    },
    resetGame: function() {
        resetGame();
        isGameActive = true;
    },
    getScore: function() {
        return score;
    }
};

// Start the game
init();
