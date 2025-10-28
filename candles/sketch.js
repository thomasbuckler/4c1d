let baseImg;
let flameImg;
let smokeImg;
let bothLoaded = false;

let flames = [];
let smokes = [];
let scaleFactor = 1;

function preload() {
  baseImg = loadImage("candles2.png", img => checkLoaded(), () => console.error("Couldn't load candles2.png"));
  flameImg = loadImage("quote_glyph2.png", img => checkLoaded(), () => console.error("Couldn't load quote_glyph2.png"));
  smokeImg = loadImage("smoke_glyph.png", () => console.log("Loaded smoke_glyph.png"), () => console.warn("Couldn't load smoke_glyph.png"));
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

  // --- 🔥 FLAME COORDINATES ---
  let coords = [
    {x: 627, y: 283},
    {x: 303, y: 330},
    {x: 618, y: 330},
    {x: 702, y: 330},
    {x: 753, y: 330},
    {x: 900, y: 330},
    {x: 387, y: 377},
    {x: 600, y: 377},
    {x: 741, y: 377},
    {x: 389, y: 425},
    {x: 686, y: 425},
    {x: 861, y: 425},
    {x: 984, y: 425},
    {x: 271, y: 474},
    {x: 395, y: 474},
    {x: 713, y: 474},
    {x: 441, y: 569},
    {x: 617, y: 569},
    {x: 256, y: 617},
    {x: 280, y: 665},
    {x: 639, y: 665},
    {x: 711, y: 665},
    {x: 592, y: 712},
    {x: 312, y: 761},
    {x: 687, y: 761},
    {x: 714, y: 760},
    {x: 264, y: 856},
    {x: 293, y: 856},
    {x: 584, y: 855},
    {x: 688, y: 855},
    {x: 705, y: 904},
    {x: 906, y: 904},
    {x: 541, y: 952},
    {x: 285, y: 1000},
    {x: 319, y: 1000},
    {x: 632, y: 999},
    {x: 756, y: 1000},
    {x: 870, y: 1000},
    {x: 699, y: 1048},
    {x: 778, y: 1048},
    {x: 302, y: 1095},
    {x: 515, y: 1095},
    {x: 595, y: 1191},
    {x: 719, y: 1191},
    {x: 1051, y: 1239},
    {x: 429, y: 1287},
    {x: 1122, y: 1334},
    {x: 688, y: 1382},
    {x: 316, y: 1478},
    {x: 349, y: 1478},
    {x: 431, y: 1478},
    {x: 689, y: 1478},
    {x: 752, y: 1478},
    {x: 885, y: 1478},
    {x: 315, y: 1526},
    {x: 377, y: 1526},
    {x: 361, y: 1574},
    {x: 736, y: 1573},
    {x: 353, y: 1621},
    {x: 585, y: 1620},
    {x: 261, y: 1669},
    {x: 382, y: 1669},
    {x: 436, y: 1669},
    {x: 737, y: 1668},
  ];

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

  // --- 💨 SMOKE COORDINATES ---
  smokes = [
    {x: 416, y: 970},
    {x: 881, y: 1305},
    {x: 475, y: 1496},
    {x: 511, y: 1640},
  ];

  // initialize mirror timing
  for (let s of smokes) {
    s.mirrored = false;
    s.nextMirrorTime = 0;
    s.mirrorInterval = 0;
    randomizeSmokeMirror(s);
  }

  computeScaleFactor();
}

function draw() {
  background(255);

  if (!bothLoaded) {
    text("Loading images...", width / 2, height / 2);
    return;
  }

  push();
  translate(width / 2, height / 2);
  scale(scaleFactor);
  image(baseImg, 0, 0);

  // 🔥 flames
  for (let f of flames) {
    if (millis() > f.nextFlipTime) {
      f.flipped = !f.flipped;
      randomizeNextFlip(f);
    }

    push();
    translate(f.x - baseImg.width / 2, f.y - baseImg.height / 2);
    if (f.flipped) scale(-1, 1);
    image(flameImg, 0, 0);
    pop();
  }

  // 💨 smoke (mirror horizontally = vertical axis mirror)
  for (let s of smokes) {
    if (millis() > s.nextMirrorTime) {
      s.mirrored = !s.mirrored;
      randomizeSmokeMirror(s);
    }

    push();
    translate(s.x - baseImg.width / 2, s.y - baseImg.height / 2);
    if (s.mirrored) scale(-1, 1); // mirror left/right, NOT upside down
    image(smokeImg, 0, 0);
    pop();
  }

  pop();
}

function randomizeNextFlip(f) {
  f.flipInterval = random(30, 1500);
  f.nextFlipTime = millis() + f.flipInterval;
}

function randomizeSmokeMirror(s) {
  s.mirrorInterval = random(90, 1900); // slower, gentle change
  s.nextMirrorTime = millis() + s.mirrorInterval;
}

function computeScaleFactor() {
  if (!baseImg) return;
  let scaleX = windowWidth / baseImg.width;
  let scaleY = windowHeight / baseImg.height;
  scaleFactor = min(scaleX, scaleY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeScaleFactor();
}
