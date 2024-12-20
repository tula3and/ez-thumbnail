import { fillBackground } from "./js/background.js";
import { fillStroke } from "./js/stroke.js";

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");

const textarea = document.getElementById("jsTextarea");
const textUpdate = document.getElementById("jsTextUpdate");
const textCheckbox = document.getElementById("jsTextCheckbox");

const range = document.getElementById("jsRange");
const rangeValue = document.getElementById("jsRangeValue");

const modeBtn = document.getElementById("jsMode");
const typeBtn = document.getElementById("jsStroke");
const fontBtn = document.getElementById("jsFont");
const saveBtn = document.getElementById("jsSave");

const helpBtn = document.getElementById("jsHelp");
const uploadBtn = document.getElementById("jsUpload");
const blurCheckbox = document.getElementById("jsBlurCheckbox");
const deleteBtn = document.getElementById("jsDelete");

const saveTemplateBtn = document.getElementById("jsSaveTemplate");
const loadTemplateBtn = document.getElementById("jsLoadTemplate");

const colors = document.getElementsByClassName("jsColor");
const COLORS = Array.from(colors).map((color) => color.style.backgroundColor);
const MODES = ["Text", "BG", "Stroke"];
const STROKES = ["none", "line", "rounded", "circle", "heart", "star"];
const FONTS = ["Nanum Gothic", "Jua", "Black Han Sans", "Bagel Fat One"];

// set canvas size
const CANVAS_SIZE = 700;
const CENTER_POS = CANVAS_SIZE / 2;
const INITIAL_COLOR = COLORS[0]; // #2c2c2c

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// set default color mode
let colorMode = 0;
colors[0].classList.add("selected");

// initialize background
let backgroundColor = COLORS[1]; // white
ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

// initialize image file
let imgBase64 = null;

// initialize text
let textColor = INITIAL_COLOR;
let fontSize = 30;
let fontType = 0;

// initialize stroke
let strokeColor = INITIAL_COLOR;
let strokeType = 0;

// main function
function updateCanvas() {
  fillBackground(
    ctx,
    canvas,
    CANVAS_SIZE,
    backgroundColor,
    imgBase64,
    blurCheckbox.checked
  );
  fillStroke(ctx, CENTER_POS, strokeColor, strokeType);
  fillText();
}

// text
// write text with line changes
// may include text outlines
// v: textarea, textColor, fontSize, fontType, textCheckbox
function fillText() {
  const text = textarea.value;
  const phrases = text.split("\n").filter((phrase) => phrase.trim() !== "");

  let x = canvas.width / 2;
  let y = (canvas.height - fontSize * (phrases.length - 1)) / 2;

  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px ${FONTS[fontType]}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // text outline is selected
  if (textCheckbox.checked) {
    if (textColor === COLORS[1]) {
      ctx.strokeStyle = COLORS[0];
    } else {
      ctx.strokeStyle = COLORS[1];
    }
    ctx.lineWidth = fontSize / 3;
  }

  document.fonts.load(`${fontSize}px "${FONTS[fontType]}"`).then(() => {
    for (let i = 0; i < phrases.length; i++) {
      if (textCheckbox.checked) {
        ctx.strokeText(phrases[i], x, y);
      }
      ctx.fillText(phrases[i], x, y);
      y += fontSize * 1.2;
    }
  });
}

// first button: modeBtn
// change color mode
modeBtn.addEventListener("click", () => {
  colorMode += 1;

  if (colorMode == MODES.length) {
    colorMode = 0;
  }

  modeBtn.innerText = MODES[colorMode];

  updateColorPalette();
});

// second button: typeBtn
// change stroke type
typeBtn.addEventListener("click", () => {
  strokeType += 1;

  if (strokeType == STROKES.length) {
    strokeType = 0;
  }

  updateCanvas();
});

// third button: fontBtn
// change font type
fontBtn.addEventListener("click", () => {
  fontType += 1;

  if (fontType == FONTS.length) {
    fontType = 0;
  }

  updateCanvas();
});

// fourth button: saveBtn
// save thumbnail image in local
saveBtn.addEventListener("click", () => {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "UrThumb";
  link.click();
});

// upload image
uploadBtn.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  // if file loading is done
  reader.onload = function (e) {
    imgBase64 = e.target.result;

    const img = new Image();

    img.onload = function () {
      updateCanvas();
    };

    img.src = imgBase64;
  };

  reader.readAsDataURL(file);
});

// delete image
deleteBtn.addEventListener("click", () => {
  imgBase64 = null;
  updateCanvas();
});

function handleTemplateSave() {
  const text = textarea.value;
  localStorage.setItem("text", text);

  localStorage.setItem("backgroundColor", backgroundColor);
  localStorage.setItem("imgBase64", imgBase64);
  localStorage.setItem("textColor", textColor);
  localStorage.setItem("fontSize", fontSize);
  localStorage.setItem("fontType", fontType);
  localStorage.setItem("strokeColor", strokeColor);
  localStorage.setItem("strokeType", strokeType);

  localStorage.setItem("textChecked", textCheckbox.checked);
  localStorage.setItem("blurChecked", blurCheckbox.checked);
}

function handleTemplateLoad() {
  const text = localStorage.getItem("text");
  textarea.value = text;

  backgroundColor = localStorage.getItem("backgroundColor");
  imgBase64 = localStorage.getItem("imgBase64");

  if (imgBase64 === "null") {
    imgBase64 = null;
  }

  textColor = localStorage.getItem("textColor");
  fontSize = JSON.parse(localStorage.getItem("fontSize"));
  fontType = JSON.parse(localStorage.getItem("fontType"));
  strokeColor = localStorage.getItem("strokeColor");
  strokeType = JSON.parse(localStorage.getItem("strokeType"));

  updateColorPalette();

  range.value = fontSize;

  const textChecked = localStorage.getItem("textChecked");
  if (textChecked === "true") {
    textCheckbox.checked = true;
  }

  const blurChecked = localStorage.getItem("blurChecked");
  if (blurChecked === "true") {
    blurCheckbox.checked = true;
  }

  updateCanvas();
}

// change font size
function handleRangeChange(event) {
  const size = event.target.value;
  rangeValue.textContent = size;

  fontSize = Number(size);

  updateCanvas();
}

// color palette
// apply selected color based on color mode
function handleColorClick(event) {
  resetColorPalette();

  const color = event.target.style.backgroundColor;
  event.target.classList.add("selected");

  switch (colorMode) {
    case 0:
      textColor = color;
      break;
    case 1:
      backgroundColor = color;
      break;
    case 2:
      strokeColor = color;
      break;
  }

  updateCanvas();
}

// none of things in palette is selected
function resetColorPalette() {
  const controls = document.querySelectorAll(".jsColor");
  controls.forEach((control) => control.classList.remove("selected"));
}

function updateColorPalette() {
  resetColorPalette();

  let colorIndex = 0;
  switch (colorMode) {
    case 0:
      colorIndex = COLORS.indexOf(textColor);
      break;
    case 1:
      colorIndex = COLORS.indexOf(backgroundColor);
      break;
    case 2:
      colorIndex = COLORS.indexOf(strokeColor);
      break;
  }
  colors[colorIndex].classList.add("selected");
}

function handleCM(event) {
  event.preventDefault();
}

if (canvas) {
  canvas.addEventListener("contextmenu", handleCM);
}

// text update
// click or enter
if (textUpdate) {
  textUpdate.addEventListener("click", updateCanvas);
}

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    updateCanvas();
  }
});

// checkbox
blurCheckbox.addEventListener("change", () => {
  updateCanvas();
});

textCheckbox.addEventListener("change", () => {
  updateCanvas();
});

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);

if (range) {
  range.addEventListener("input", handleRangeChange);
  range.addEventListener("mousedown", () => {
    rangeValue.classList.add("visible");
  });
  range.addEventListener("mouseup", () => {
    rangeValue.classList.remove("visible");
  });
}

if (saveTemplateBtn) {
  saveTemplateBtn.addEventListener("click", handleTemplateSave);
}

if (loadTemplateBtn) {
  loadTemplateBtn.addEventListener("click", handleTemplateLoad);
}

if (helpBtn) {
  helpBtn.addEventListener("click", () => {
    window.open("https://blog.naver.com/kekdud0301/223699963450");
  });
}
