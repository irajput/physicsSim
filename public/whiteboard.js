// Name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, text, mouseX, mouseY, 
          strokeWeight, line,  mouseIsPressed, windowWidth, windowHeight, noStroke, keyIsDown, CONTROL, textSize,
           textAlign, CENTER, ENTER,keyCode, BACKSPACE, noFill, noStroke*/

//modified from kmarventano@ for Google CSSI

// let brushHue,
//   priorX,
//   priorY,
//   red,
//   globalS,
//   globalB,
//   backgroundColor,
//   textColor,
//   playersWord,
//   redJar,
//   wordBank,
//   wordPos,
//   orangeJar,
//   yellowJar,
//   greenJar,
//   blueJar,
//   purpleJar,
//   blackJar, grayJar, pinkJar,pink, orange, yellow, green, blue, black, gray, purple;

// function setup() {
//   // Canvas & color settings
//   createCanvas(700, 700);
//   colorMode(HSB, 360, 100, 100); //using HSB colors
//   brushHue = 0;
//   priorX = 0;
//   priorY = 0;
//   background(95);
//   strokeWeight(6);

//   globalS = 90;
//   globalB = 90;
//   backgroundColor = color(200, 0, 75);
//   red = color(0, globalS, globalB); //red
//   pink = color(305,globalS, globalB);
//   orange = color(40,globalS, globalB);
//   yellow = color(58,globalS, globalB);
//   green = color(123,globalS, globalB);
//   blue = color(233,globalS, globalB);
//   purple = color(272,globalS, globalB);
//   black = color(0,0,0);
//   gray = color(0,0, 40);
//   textColor = color(300, globalS, globalB);
//   noStroke();
//   background(backgroundColor);
//   //playersWord = getWord();
//   printInstructions();
// }

// function draw() {
//   //word functions
//   //writeWord(playersWord);

//   //creates a redJar object for the red "paint jar",
//   redJar = new paintJar(50, red);
//   redJar.show();
//   redJar.getColor();
//   pinkJar = new paintJar(125, pink);
//   pinkJar.show();
//   pinkJar.getColor();
//   orangeJar = new paintJar(200, orange);
//   orangeJar.show();
//   orangeJar.getColor();
//   yellowJar = new paintJar(275, yellow);
//   yellowJar.show();
//   yellowJar.getColor();
//   greenJar = new paintJar(350, green);
//   greenJar.show();
//   greenJar.getColor();
//   blueJar = new paintJar(425, blue);
//   blueJar.show();
//   blueJar.getColor();
//   purpleJar = new paintJar(500, purple);
//   purpleJar.show();
//   purpleJar.getColor();
//   blackJar = new paintJar(575, black);
//   blackJar.show();
//   blackJar.getColor();
//   grayJar = new paintJar(650, gray);
//   grayJar.show();
//   grayJar.getColor();
  

//   //TODO 3: create two more jars of color

// if (mouseIsPressed) {
//     //ellipse(mouseX, mouseY,5,5); //TODO 4: can you think of a way to use line() instead of ellipse()?
//     line(priorX, priorY, mouseX, mouseY);
//   }

//   priorX = mouseX;
//   priorY = mouseY;
// }

function printInstructions() {
    noStroke();
    fill(0); //black
    textSize(12);
    text(
      "Press BACKSPACE to clear the board.",
      10,
      10,
      width - 10,
      60
    );
  }
  
  // function getWord() {
  //   //TODO 1: getWord should return a single random word from an array of words
  //   wordBank = ["Angel", "Baby", "Angry", "Beard"];
  //   return random(wordBank);
  // }
  
  // function writeWord(word) {
  //   noStroke();
  //   fill(98); //white
  //   rect(0, 0.9 * height, width, 0.2 * height);
  //   textSize(20);
  //   fill(0); //black
  //   textAlign(CENTER);
  //   text("Your word: " + word, width / 2, 0.96 * height);
  // }
  
  class paintJar {
    constructor(xPos, color) {
      this.xPos = xPos;
      this.HSBColor = color;
      this.yPos = 190;
      this.radius = 30;
    }
  
    getColor() {
      if (
        mouseX > this.xPos - this.radius / 2 &&
        mouseX < this.xPos + this.radius / 2 &&
        mouseY > this.yPos - this.radius / 2 &&
        mouseY < this.yPos + this.radius / 2 &&
        mouseIsPressed
      ) {
        brushHue = this.HSBColor;
      }
  
      stroke(brushHue);
      fill(brushHue);
    }
  
    show() {
      stroke(this.HSBColor);
      fill(this.HSBColor);
      ellipse(this.xPos, this.yPos, this.radius);
    }
  }
  
  // function keyPressed() {
  //   //TODO 2: if a key is pressed, playersWord should be assigned to an empty string ""
  //   //and the canvas should be cleared
  //   // if (keyCode == ENTER) {
  //   //   playersWord = "[redacted]";
  //   //   background(backgroundColor);
  //   // }
  //   if (keyCode == BACKSPACE) {
  //     background(backgroundColor);
  //   }
  // }
  
  