// ============================================================
// 🌟 Global twinkle settings
// ============================================================

const MIN_TWINKLE_SPEED = 0.15;
const MAX_TWINKLE_SPEED = 0.45;

const RECORD_SECONDS = 60;
const RECORD_FPS = 60;
const TOTAL_FRAMES = RECORD_SECONDS * RECORD_FPS;

// ============================================================

let baseImg;
let overlayImg;
let stars = [];

let scaleFactor = 1;
let bothLoaded = false;

// p5 canvas + recording
let cnv;
let capturer = null;
let recording = false;
let capturedFrames = 0;

function preload() {
  baseImg = loadImage(
    "stars.png",
    () => checkLoaded(),
    () => console.error("Couldn't load stars.png")
  );

  overlayImg = loadImage(
    "overlay.png",
    () => checkLoaded(),
    () => console.error("Couldn't load overlay.png")
  );
}

function checkLoaded() {
  if (baseImg && overlayImg) {
    bothLoaded = true;
  }
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight); // keep a handle to canvas
  imageMode(CENTER);
  noStroke();
  frameRate(RECORD_FPS);

  // ⭐ All star coordinates (22×22 overlay regions)
  const coords = [
    [605, 319], [996, 316], [607, 694],
    [767, 694], [1069, 696], [697, 739], [952, 739], [1243, 739], [1392, 739],
    [675, 790], [1073, 838], [665, 886], [1140, 888], [1345, 888], [713, 983],
    [983, 983], [1204, 983], [456, 1076], [695, 1079], [1231, 1081],
    [1610, 1222], [631, 1271], [995, 1271], [1181, 1271],
    [1327, 1510], [703, 1656], [995, 1656], [1300, 1656],
    [591, 1752], [1355, 1752], [1494, 1797],
    [464, 1944], [817, 1945], [1059, 1945], [1108, 1945], [1337, 1946],
    [693, 2041], [1141, 2139], [1669, 2184],
    [709, 2236], [880, 2236], [1181, 2236], [1386, 2332],
    [939, 2377], [648, 2428], [1456, 2472],
    [753, 2524], [1139, 2525], [1409, 2525], [1516, 2570],
    [786, 2622], [914, 2621], [1636, 2622],
    [1210, 2666], [983, 2717], [538, 2815],
    [1407, 2858], [853, 2910], [1154, 2910],
    [685, 3007], [1245, 3007], [1369, 3007], [1726, 3007],
    [1319, 3148] // ✅ corrected
  ];

  stars = coords.map(([x, y]) => ({
    x,
    y,
    srcX: x - 11,
    srcY: y - 11,
    w: 22,
    h: 22,
    phase: random(TWO_PI),
    speed: random(MIN_TWINKLE_SPEED, MAX_TWINKLE_SPEED)
  }));

  computeScaleFactor();

  // 🎥 Initialize capturer ONLY if CCapture is available
  if (typeof CCapture !== "undefined") {
    capturer = new CCapture({
      format: "webm",
      framerate: RECORD_FPS,
      quality: 100,
      name: "stars_twinkle"
    });
    console.log("CCapture found, recording will start when images are loaded.");
  } else {
    console.warn("CCapture not found – recording disabled.");
  }
}

function draw() {
  background(255);

  if (!bothLoaded) {
    fill(60);
    textAlign(CENTER, CENTER);
    text("Loading images...", width / 2, height / 2);
    return;
  }

  // Start recording once, on the first frame after everything is loaded
  if (capturer && !recording) {
    capturer.start();
    recording = true;
    capturedFrames = 0;
    console.log("🎬 Recording started");
  }

  push();
  translate(width / 2, height / 2);
  scale(scaleFactor);

  // background poem page
  image(baseImg, 0, 0);

  // stars
  for (let s of stars) {
    s.phase += s.speed;
    const twinkle = sin(s.phase) * 0.5 + 0.5;
    const alpha = map(twinkle, 0, 1, 0, 255);

    push();
    tint(255, alpha);
    image(
      overlayImg,
      s.x - baseImg.width / 2, s.y - baseImg.height / 2,
      s.w, s.h,
      s.srcX, s.srcY,
      s.w, s.h
    );
    pop();
  }

  pop();

  // 🎥 Capture one frame per draw
  if (recording && capturer) {
    // cnv is the p5.Renderer; its .canvas is the actual <canvas> element
    capturer.capture(cnv.canvas);
    capturedFrames++;

    if (capturedFrames >= TOTAL_FRAMES) {
      console.log("⏹ Stopping recording and saving...");
      recording = false;
      capturer.stop();
      capturer.save(); // will trigger the download of stars_twinkle.webm
      noLoop();
    }
  }
}

// ============================================================
// 📏 Utilities
// ============================================================

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
