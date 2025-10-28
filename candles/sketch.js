let baseImg;
let flameImg;
let bothLoaded = false;

let flames = [];
let scaleFactor = 1; // for fitting to page

function preload() {
  baseImg = loadImage("candles2.png", img => checkLoaded(), () => console.error("Couldn't load candles2.png"));
  flameImg = loadImage("quote_glyph2.png", img => checkLoaded(), () => console.error("Couldn't load quote_glyph2.png"));
}

function checkLoaded() {
  if (baseImg && flameImg) bothLoaded = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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

  computeScaleFactor();
}

function draw() {
  background(255);

  if (!bothLoaded) {
    text("Loading images...", width / 2, height / 2);
    return;
  }

  // draw scaled image
  push();
  translate(width / 2, height / 2);
  scale(scaleFactor);
  image(baseImg, 0, 0);

  // draw each scaled flame
  for (let f of flames) {
    if (millis() > f.nextFlipTime) {
      f.flipped = !f.flipped;
      randomizeNextFlip(f);
    }

    push();
    translate(f.x - baseImg.width / 2, f.y - baseImg.height / 2); // center alignment
    if (f.flipped) scale(-1, 1);
    image(flameImg, 0, 0);
    pop();
  }
  pop();
}

function randomizeNextFlip(f) {
  f.flipInterval = random(10, 2000);
  f.nextFlipTime = millis() + f.flipInterval;
}

function computeScaleFactor() {
  // fit baseImg into browser window
  if (!baseImg) return;
  let scaleX = windowWidth / baseImg.width;
  let scaleY = windowHeight / baseImg.height;
  scaleFactor = min(scaleX, scaleY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeScaleFactor();
}
