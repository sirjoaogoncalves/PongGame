const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 15;
const PADDLE_SPEED = 10;
const BALL_SPEED = 4;
const COMPUTER_PADDLE_SPEED = 10; // Increased speed for prediction

let playerPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let computerPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = GAME_WIDTH / 2;
let ballY = GAME_HEIGHT / 2;
let ballSpeedX = BALL_SPEED;
let ballSpeedY = BALL_SPEED;
let playerScore = 0;
let computerScore = 0;

function draw() {
	// Clear canvas
	ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

	// Draw paddles
	ctx.fillStyle = 'black';
	ctx.fillRect(0, playerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
	ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, computerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

	// Draw ball
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(ballX, ballY, BALL_SIZE / 2, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();

	// Draw score
	ctx.font = '24px Arial';
	ctx.fillText(`Player: ${playerScore}`, 20, 40);
	ctx.fillText(`Computer: ${computerScore}`, GAME_WIDTH - 180, 40);
}

function update() {
	// Update player paddle movement
	canvas.addEventListener('mousemove', event => {
		const rect = canvas.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;
		playerPaddleY = mouseY - PADDLE_HEIGHT / 2;
	});

	canvas.addEventListener('touchmove', event => {
		const rect = canvas.getBoundingClientRect();
		const touchY = event.touches[0].clientY - rect.top;
		playerPaddleY = touchY - PADDLE_HEIGHT / 2;
	});

	// Update computer paddle movement to track the ball's Y position
	const targetY = ballY - PADDLE_HEIGHT / 2; // Target Y position of ball

	// Ensure paddles do not go outside the canvas
	playerPaddleY = Math.max(Math.min(playerPaddleY, GAME_HEIGHT - PADDLE_HEIGHT), 0);
	computerPaddleY = Math.max(Math.min(computerPaddleY, GAME_HEIGHT - PADDLE_HEIGHT), 0);

	// Move computer paddle towards the target Y position
	if (computerPaddleY + PADDLE_HEIGHT / 2 < targetY && computerPaddleY < GAME_HEIGHT - PADDLE_HEIGHT) {
		computerPaddleY += COMPUTER_PADDLE_SPEED;
	} else if (computerPaddleY + PADDLE_HEIGHT / 2 > targetY && computerPaddleY > 0) {
		computerPaddleY -= COMPUTER_PADDLE_SPEED;
	}
	// Update ball movement
	// Update ball position
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	// Check collision with paddles
	if (ballX <= PADDLE_WIDTH && ballY + BALL_SIZE / 2 >= playerPaddleY && ballY - BALL_SIZE / 2 <= playerPaddleY + PADDLE_HEIGHT) {
		// Ball hits player paddle
		ballSpeedX = BALL_SPEED;
		let deltaY = ballY - (playerPaddleY + PADDLE_HEIGHT / 2);
		ballSpeedY = deltaY * 0.2;
	} else if (ballX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY + BALL_SIZE / 2 >= computerPaddleY && ballY - BALL_SIZE / 2 <= computerPaddleY + PADDLE_HEIGHT) {
		// Ball hits computer paddle
		ballSpeedX = -BALL_SPEED;
		let deltaY = ballY - (computerPaddleY + PADDLE_HEIGHT / 2);
		ballSpeedY = deltaY * 0.2;
	}
	// Check collision with top and bottom walls
	if (ballY <= 0 || ballY >= GAME_HEIGHT - BALL_SIZE) {
		ballSpeedY = -ballSpeedY;
	}

	// Check if ball goes out of bounds
	if (ballX <= 0) {
		// Ball goes out on the left side, computer scores
		computerScore++;
		resetBall();
	} else if (ballX >= GAME_WIDTH - BALL_SIZE) {
		// Ball goes out on the right side, player scores
		playerScore++;
		resetBall();
	}
}

function resetBall() {
	ballX = GAME_WIDTH / 2;
	ballY = GAME_HEIGHT / 2;
	ballSpeedX = BALL_SPEED;
	ballSpeedY = BALL_SPEED;
}

function gameLoop() {
	draw();
	update();
	requestAnimationFrame(gameLoop);
}

gameLoop();