let baseImg;
let flameImg;
let bothLoaded = false;

let flames = []; // array of all flame objects

function preload() {
  baseImg = loadImage("candles2.png", img => checkLoaded(), () => console.error("Couldn't load candles2.png"));
  flameImg = loadImage("quote_glyph2.png", img => checkLoaded(), () => console.error("Couldn't load quote_glyph2.png"));
}

function checkLoaded() {
  if (baseImg && flameImg) bothLoaded = true;
}

function setup() {
  createCanvas(800, 1000); // fallback size; will resize later
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(60);

  // --- 🔥 INSERT YOUR COORDINATES HERE ---
  let coords = [
    {x: 627, y: 285},
    {x: 303, y: 332},
	{x: 618, y: 332},
    // {x: 142, y: 310},
    // {x: 255, y: 292},
    // ...
  ];
  // ---------------------------------------

  // Initialize each flame with random flip timing
  for (let c of coords) {
    flames.push({
      x: c.x,
      y: c.y,
      flipped: false,
      nextFlipTime: 0,
      flipInterval: 0
    });
    randomizeNextFlip(flames[flames.length - 1]);
  }
}

function draw() {
  background(255);

  if (!bothLoaded) {
    text("Loading images...", width / 2, height / 2);
    return;
  }

  resizeCanvas(baseImg.width, baseImg.height);
  image(baseImg, width / 2, height / 2);

  // draw each flame independently
  for (let f of flames) {
    if (millis() > f.nextFlipTime) {
      f.flipped = !f.flipped;
      randomizeNextFlip(f);
    }

    push();
    translate(f.x, f.y);
    if (f.flipped) scale(-1, 1);
    image(flameImg, 0, 0);
    pop();
  }
}

function randomizeNextFlip(f) {
  // Each flame gets its own random flicker rhythm
  f.flipInterval = random(10, 2500); // adjust range for faster/slower overall flicker
  f.nextFlipTime = millis() + f.flipInterval;
}
