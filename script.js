const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load character images
const squirrelImg = new Image();
squirrelImg.src = 'squirrel.png'; // Replace 'character.png' with your character image URL

const acornImg = new Image();
acornImg.src = 'acorn.png'; // Replace 'popup_character.png' with the pop-up character image URL

const squirrel = {
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  speed: 5
};

const acorn = {
  x: 200,
  y: 200,
  width: 50,
  height: 50,
  speed: 3,
  isVisible: true
};


let flipSquirrelVertically = false; // To keep track of whether the character is flipped horizontally
let rotateSquirrel = 0; // To keep track of the rotation angle of the character
let rotateSquirrelkeydown = false; // To keep track of whether the character is rotated
let rotateSquirrelkeyup = false; // To keep track of whether the character is rotated

window.onload = function() {
  const welcomeMessage = "Welcome to the Acorn Hunt!\n\nYou are a HUNGRY Squirrel:\n- Use the arrow keys to move up, down, left, or right.\n- Collect the Acorns by colliding with them.\n- Have fun!";
  alert(welcomeMessage);
  canvas.style.display = 'block';
  canvas.style.border = '5px solid green';
  canvas.style.backgroundColor = '#2ecc71';
  canvas.style.margin = '50px auto';
  
  // Additional logic to start the game after the user clicks OK in the alert
  // You can trigger the game to start or set up event listeners after the alert is dismissed
};

function drawSquirrel() {
  ctx.save(); // Save the current canvas state
  if (flipSquirrelVertically) {
    // Flip the character horizontally
    ctx.scale(-1, 1);
    ctx.drawImage(squirrelImg, -squirrel.x - squirrel.width, squirrel.y, squirrel.width, squirrel.height);
  } else {
    ctx.drawImage(squirrelImg, squirrel.x, squirrel.y, squirrel.width, squirrel.height);
  }
  if (rotateSquirrelkeydown || rotateSquirrelkeyup) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save(); // Save the current canvas state

    ctx.translate(squirrel.x + squirrel.width / 2, squirrel.y + squirrel.height / 2); // Translate to the center of the character
    ctx.rotate(rotateSquirrel * Math.PI / 180); // Rotate the canvas
    ctx.drawImage(squirrelImg, -squirrel.width / 2, -squirrel.height / 2, squirrel.width, squirrel.height); // Draw the character

    ctx.restore();
    } 
    else {
        ctx.drawImage(squirrelImg, squirrel.x, squirrel.y, squirrel.width, squirrel.height);
    }
    ctx.restore(); // Restore the canvas state to avoid affecting other drawings
}

window.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowRight') {
    flipSquirrelVertically = true; // Set the flag to flip the character horizontally when the right arrow key is pressed
    // Additional logic for character movement or any other actions
    // ...
  }
});

window.addEventListener('keyup', function(event) {
  if (event.key === 'ArrowRight') {
    flipSquirrelVertically = false; // Reset the flag when right arrow key is released
    // Additional logic for character movement or any other actions
    // ...
  }
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown') {
      rotateSquirrel = -90; // Rotate the character by 90 degrees when the right arrow key is pressed
      rotateSquirrelkeydown = true;     // ...
    }
});

window.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowDown') {
      rotateSquirrel = -90; // Rotate the character by 90 degrees when the right arrow key is pressed
      rotateSquirrelkeydown = false;     // ...
    }
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
      rotateSquirrel = +90; // Rotate the character by 90 degrees when the right arrow key is pressed
      rotateSquirrelkeyup = true;     // ...
    }
});

window.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp') {
      rotateSquirrel = +90; // Rotate the character by 90 degrees when the right arrow key is pressed
      rotateSquirrelkeyup = false;     // ...
    }
});


function drawAcorn() {
  if (acorn.isVisible) {
    ctx.drawImage(acornImg, acorn.x, acorn.y, acorn.width, acorn.height);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height - 40);
}

function update() {
  clearCanvas();
  drawSquirrel();
  drawAcorn();
  acornsCollected();
}

function moveSquirrel(event) {
  const key = event.key;
  switch (key) {
    case 'ArrowUp':
      if (squirrel.y - squirrel.speed > 0) {
        squirrel.y -= squirrel.speed;
      }
      break;
    case 'ArrowDown':
      if (squirrel.y + squirrel.height + squirrel.speed < canvas.height) {
        squirrel.y += squirrel.speed;
      }
      break;
    case 'ArrowLeft':
      if (squirrel.x - squirrel.speed > 0) {
        squirrel.x -= squirrel.speed;
      }
      break;
    case 'ArrowRight':
      if (squirrel.x + squirrel.width + squirrel.speed < canvas.width) {
        squirrel.x += squirrel.speed;
      }
      break;
    default:
      break;
  }
  checkCollision();
  update();
}

let popupDirection = 1; // Initialize direction (1: right, -1: left)
let popupSpeed = 1; // Set the speed of the popup character
let acorn_collection = 0;


function moveAcorn() {
  if (acorn.isVisible) {
    acorn.x += popupDirection * popupSpeed;
    // Check if the popup character hits the canvas boundary and change direction
    if (acorn.x <= 0 || acorn.x + acorn.width >= canvas.width) {
      popupDirection *= -1; // Reverse direction
    }

    update();
  }
}

function acornsCollected() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  
  ctx.fillText(`Acorns Collected: ${acorn_collection}`, 20, 30); // Display the counter on the canvas
}


function checkCollision() {
    if (
      squirrel.x < acorn.x + acorn.width &&
      squirrel.x + squirrel.width > acorn.x &&
      squirrel.y < acorn.y + acorn.height &&
      squirrel.y + squirrel.height > acorn.y
    ) {
      acorn.isVisible = false;
      acorn_collection ++;

  
      // Generate new random position for the popup character
      const newX = Math.floor(Math.random() * (canvas.width - acorn.width));
      const newY = Math.floor(Math.random() * (canvas.height - acorn.height));
      
      acorn.x = newX;
      acorn.y = newY;
      acorn.isVisible = true;
  
      update();
    }
  }
  
  

window.addEventListener('keydown', moveSquirrel);
setInterval(moveAcorn, 100); // Change the interval for the popup character movement (milliseconds)
update();
