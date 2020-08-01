/*global createCanvas,colorMode,HSB,background,PI, fill, arc,pow,  width,noFill,color, stroke, ellipse, 
line, strokeWeight,createInput,createButton, noStroke, point, sqrt, angleMode, DEGREES, cos, sin,loadImage,textSize,
textStyle,text,BOLD,height, image, textAlign, random, createVector, CENTER, rect, abs, LEFT, NORMAL, ITALIC,loadSound, 
round,int,keyCode, fireworks, p5. RGB, mouseX, mouseY, mouseIsPressed, pmouseX, pmouseY, line*/
var socket;
let defaultHeight,
  track,
  groundHeight,
  button,
  radiusButton,
  radius,
  inputHeight,
  input,
  trackWidth,
  ball,
  arcWidth,
  arcCenterX,
  arcCenterY,
  userHeight,
  userRadius,
  defaultRadius,
  bgImage,
  trackColor,
  sky,
  grass,
  ball2,
  runButton,
  run,
  mass,
  instructionsButton,
  instructionsShown,
  prevPotentialEnergy,
  kineticEnergy,
  velocity,
  labelHeight,
  fail,
  sadFace,
  failSound,
  result,
  isPlaying,
  resetButton,
  success,
  successPossible,
  fireworks,
  gravity;

let brushHue,
  priorX,
  priorY,
  red,
  backgroundColor,
  textColor,
  playersWord,
  redJar,
  wordBank,
  wordPos,
  orangeJar,
  yellowJar,
  greenJar,
  blueJar,
  purpleJar,
  blackJar, grayJar, pinkJar,pink, orange, yellow, green, blue, black, gray, purple, whiteBoardOn;

function setup() {

  socket=io.connect('http://localhost:3000');
  socket.on('mouse',newDrawing);

  defaultHeight = 700;
  userHeight = defaultHeight;
  defaultRadius = 100;
  userRadius = defaultRadius;
  //colorMode(HSB, 360, 100, 100);
  //angleMode(DEGREES);
  createCanvas(900, 700);
  bgImage = loadImage(
    "https://cdn.glitch.com/16d3490c-9af1-498f-86a3-77171c075040%2Fbg3.jpg?v=1595896996906"
  );

  //alternate background
  sky = loadImage(
"assets/sky.png"  );
  grass = loadImage(
"assets/grass.png"  );
  sadFace = loadImage(
"assets/sad.png"  );
  fail = true;
  //failSound = loadSound('https://cdn.glitch.com/16d3490c-9af1-498f-86a3-77171c075040%2Fcomputer-sound.mp3?v=1596131143903');

  labelHeight = 140;
  buttonH=150;
  //creates the input text field for the user to enter in the height
  inputHeight = createInput("");
  inputHeight.position(width - 600, buttonH);
  button = createButton("submit");
  button.position(inputHeight.x + inputHeight.width, buttonH);
  button.mousePressed(setHeight);

  //creates input text field for radius
  input = createInput("");
  input.position(width - 320, buttonH);
  radiusButton = createButton("submit");
  radiusButton.position(input.x + input.width, buttonH);
  radiusButton.mousePressed(setRadius);

  //run button
  runButton = createButton("RUN");
  runButton.position(width - 50, buttonH);
  runButton.mousePressed(runBall);
  runButton.style("background-color", color(68, 201, 89));

  //instructions button
  instructionsButton = createButton("Hide/Show Instructions");
  instructionsButton.position(50, buttonH);
  instructionsButton.mousePressed(stateInstructions);
  instructionsShown = true;

  //reset Button
  resetButton = createButton("RESET");
  resetButton.position(width - 60, labelHeight + 60);
  resetButton.mousePressed(reset);
  resetButton.style("background-color", color(180, 56, 186));
  
  //WHITEBOARD Button
  resetButton = createButton("Whiteboard");
  resetButton.position(width - 90, labelHeight -60);
  resetButton.mousePressed(stateWhiteboard);
  resetButton.style("background-color", color("white"));
  resetButton.style("color", color("black"));
  whiteBoardOn = false;

  //creates Track
  groundHeight = 600; //set y-coordinate line of the "ground"
  trackColor = color(64, 98, 104);
  track = new Track(groundHeight, defaultHeight, defaultRadius, trackColor);

  //creates ball
  ball = new BallRun();
  ball2 = new BallRun();
  run = false;
  mass = 5;

  prevPotentialEnergy = 0;
  kineticEnergy = 0;
  velocity = 0;

  //results
  isPlaying = false;
  success = false;
  successPossible = false;
  result = "";

  //fireworks
  // stroke(255);
  // strokeWeight(4);
  gravity = createVector(0, 0.2);
  fireworks = [];
  
  //whiteboard
  //colorMode(HSB, 360, 100, 100); //using HSB colors
  brushHue = 0;
  priorX = 0;
  priorY = 0;
  //background(95);
  strokeWeight(6);
  backgroundColor = color(200, 0, 75);
  red = color(224, 29, 29); //red
  pink = color(224, 29, 179);
  orange = color(237, 115, 45);
  yellow = color(252, 245, 18);
  green = color(15, 150, 42);
  blue = color(45, 58, 237);
  purple = color(179, 45, 237);
  black = color(0,0,0);
  gray = color(111, 108, 112);
  textColor = color(0,0,0);
  noStroke();
  noFill();
  //playersWord = getWord();
  //printInstructions();
  //background(sky);
  //image(grass, 0, 350, 798 * 1.13, 313 * 1.13);
}
function mouseDragged(){
  console.log("SENDING"+mouseX + ','+mouseY+','+pmouseX+',',pmouseY);
  var data={
    x:mouseX,
    y:mouseY,
    prevX:pmouseX,
    prevY:pmouseY
  }
  socket.emit('mouse',data);
}

function newDrawing(data){
  //noStroke();
 // ellipse(data.x,data.y,10);
 stroke(0.5);
 stroke(66, 245, 188);
 //stroke color
  console.log(socket.id+"'s data.prevX"+data.prevX+" and data.prevY "+data.prevY+" data.x "+data.x+" data.y "+data.y);
  line(data.prevX, data.prevY, data.x, data.y);
 noStroke();
 noFill();
}
function draw() {
  
  if(!whiteBoardOn){
   background(sky);
    image(grass, 0, 350, 798 * 1.13, 313 * 1.13);
    
  }
  
  drawLabels();
  track.showSelf();
  showPoints();

  //draw ground line
  //strokeWeight(1);
  //stroke("black");
  //line(0, groundHeight, track.arcCenterX - 20, groundHeight);

  //runBall();
  if (run) {
    ball.runArc();
    ball.runLine1();
    ball.runLine2();
  }
  calculateVelocity(mass, userRadius, ball);

  if (instructionsShown) {
    showInstructions();
  }
  checkFailure();
  drawFailure();
  drawSuccess();
  showWhiteboard();
}

function stateInstructions() {
  instructionsShown = !instructionsShown;
}

function reset() {
  isPlaying = false;
  successPossible = false;
    whiteBoardOn = false;

}

function showInstructions() {
  fill(33, 32, 79);
  rect(50, 230, width - 100, 460, 20);
  fill("white");
  textAlign(CENTER);
  textSize(20);
  text(`Physics lab Simulation Instructions`, width / 2, 270);
  textAlign(LEFT);
  textSize(14);
  textStyle(ITALIC);
  //The mass of the ball is 5kg.
  text(
    `Objective: Learn about the laws of circular motion and law of conservation of energy through a looped rollercoaster demo.`,
    80,
    300,
    width - 130,
    200
  );
  textStyle(NORMAL);
  text(
    `1. Set the radius of your loop (between 50-200 meters). Enter the value under 'RADIUS' and press "submit".`,
    80,
    340,
    width - 140,
    200
  );
  text(
    `2. Calculate the minimum critical velocity needed for the ball to just travel around the loop without losing contact with the track. The critical velocity is at the point labeled "Loop," and the mass of the ball is 10kg.`,
    80,
    380,
    width - 140,
    200
  );
  text(
    `3. Using the Law of Conservation of Energy calculate the ideal height (of the "Start" point) from which the ball should be released so that it will successfully complete the loop-the-loop with the velocity you found.`,
    80,
    440,
    width - 140,
    200
  );
  text(
    `4. Set the initial height of your rollercoaster to the ideal height you calculated. Enter the value under 'HEIGHT' and press "submit".`,
    80,
    500,
    width - 140,
    200
  );
  text(
    `5. If your height isn't correct, you'll be given hints on how to proceed. If it's correct, your rollercoaster will run successfully! The updated velocity will be displayed on the bottom right throughout the run.`,
    80,
    560,
    width - 140,
    200
  );
  textSize(20);
  textStyle(ITALIC);
  textAlign(CENTER);
  text(
    `Have fun! Click "Hide/Show Instructions" to close or open this page.`,
    80,
    630,
    width - 140,
    200
  );
  textStyle(NORMAL);
  textAlign(LEFT);
}

function runBall() {
  run = true;
  console.log("Run ball");
  ball = new BallRun();
}

function keyPressed() {
  if (keyCode === 32) {
    fail = !fail;
    console.log("changed");
  }
  if (keyCode === 8) {
    success = !success;
  }
}

function drawSuccess() {
  if (result == "Success" && successPossible) {
    if (random(1) < 0.03) {
      //10% chance of a new firework
      fireworks.push(new Firework());
    }
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].done()) {
        fireworks.splice(i, 1);
      }
    }
    colorMode(RGB);
    noStroke();
    //fill(13, 163, 108);
    //rect(0, 300, width, 70);
    fill("white");
    textSize(30);
    textAlign(CENTER);
    text("SUCCESS!", width / 2, 350);
  }
}

function showPoints() {
  stroke("red");
  strokeWeight(10);
  // point(track.arcCenterX, track.arcCenterY);
  point(track.arcCenterX - track.arcWidth / 2, track.arcCenterY); //starting point
  //point(track.arcCenterX, track.arcCenterY + defaultHeight / 2); //end arc point
  //point(track.arcWidth, groundHeight); //bottom circle point
  point(track.arcWidth, groundHeight - track.radius / 2); //center of loop
  point(track.arcWidth, groundHeight - track.radius); //top of loop
  noStroke();
  //texts
  fill("black");
  textSize(14);
  textAlign(LEFT);
  text(
    `Start: (${track.arcCenterX - track.arcWidth / 2} m, ${(abs(
      track.arcCenterY - 590
    ) +
      10) *
      2} m)`,
    track.arcCenterX - track.arcWidth / 2 + 10,
    track.arcCenterY
  );

  text(
    `Radius: ${track.radius} m`,
    track.arcWidth - 40,
    groundHeight - track.radius / 2 - 20
  );

  text(
    `Loop: (${track.arcWidth} m, ${abs(groundHeight - 2 * track.radius - 590) +
      10 * 2 -
      10} m)`,
    track.arcWidth - 70,
    groundHeight - track.radius - 20
  );
  noFill();
  noStroke();
}

class Track {
  constructor(groundHeight, defaultHeight, defaultRadius, colorChoice) {
    this.radius = defaultRadius; //track default radius
    this.arcCenterX = 330; //starting x-coordinate of arc
    this.arcCenterY = groundHeight - defaultHeight / 2; //center of arc ellipse
    this.arcWidth = this.arcCenterX + defaultHeight / 5; // set arcwidth according to height
    this.color = colorChoice;
  }

  showSelf() {
    //Arc Center Y needs to be updated each time a user inputs a Height so we set this here.
    this.arcCenterY =
      groundHeight - defaultHeight / 2 + (defaultHeight - userHeight) / 2;
    this.radius = userRadius; //update Radius

    noFill();
    strokeWeight(10);
    stroke(this.color);
    //little arc for start
    arc(this.arcCenterX-2*this.radius-115,
      this.arcCenterY,
      160,
      80,
    (5/4)*PI,
      2*PI);
    //larger arc
    arc(
      this.arcCenterX,
      this.arcCenterY,
      this.arcWidth,
      userHeight,
      PI / 2,
      PI
    ); //track arc
    //ellipse(this.arcCenterX, this.arcCenterY, this.arcWidth, userHeight); //arc ellipse
    ellipse(
      this.arcWidth,
      groundHeight - this.radius / 2,
      this.radius,
      this.radius
    ); //track loop
    line(this.arcCenterX, groundHeight, width, groundHeight); //track end
  }
  
}

function setHeight() {
  userHeight = inputHeight.value();
  console.log("set height to: " + userHeight);
  console.log("set width to: " + arcWidth);
  if (inputHeight.value() == "") {
    userHeight = defaultHeight;
  }
  inputHeight.value("");
}

function setRadius() {
  userRadius = input.value();
  console.log("set radius to: " + userRadius);
  if (input.value() == "") {
    userRadius = defaultRadius;
  }
  input.value("");
}

class BallRun {
  constructor() {
    this.beginX = track.arcCenterX - track.arcWidth / 2; // Initial x-coordinate: center of arc ellipse - width/2
    this.beginY = track.arcCenterY; //Initial y-coordinate, groundHeight - h/2
    this.x = this.beginX; //starting x
    this.y = this.beginY; //starting y
    // this.distX = this.endX - this.beginX; // X-axis distance to move
    // this.distY = this.endY - this.beginY; // X-axis distance to move
    // this.endX = track.arcCenterX; // Final x-coordinate
    // this.endY = track.arcCenterY + height / 2; // Final y-coordinate
    this.step = 0.01; // Size of each step along the path
    this.stepCircle = 1 / (track.radius / 2);
    this.pct = 0; // Percentage traveled (0.0 to 1.0)

    //for run lines
    this.xVelocity1 = (track.arcWidth / 2 - 10) * PI * this.step;
    this.xVelocity2 = (track.radius / 2 - 10) * 2 * PI * this.stepCircle;
    this.lineIsDone = false;

    //for runCircle
    this.pct2 = 0;
    this.x1 = track.arcWidth; //starting x
    this.y1 = groundHeight; //starting y
  }
  runArc() {
    if (this.pct < 1.0) {
      this.x =
        track.arcCenterX +
        (track.arcWidth / 2 - 10) * cos(PI - (PI / 2) * this.pct);
      this.y =
        this.beginY + (userHeight / 2 - 10) * sin(PI - (PI / 2) * this.pct);
      fill(0);
      noStroke();
      ellipse(this.x, this.y, 20, 20);
    }

    this.pct += this.step;
  }
  runLine1() {
    if (this.pct >= 1.0) {
      this.x += this.xVelocity1;
      if (this.x > track.arcWidth) {
        this.xVelocity1 = 0;
        ball.runCircle();
        return;
      }
      fill(0);
      noStroke();
      ellipse(this.x, this.y, 20, 20);
    }
    this.pct += this.step;
  }
  runCircle() {
    if (this.pct2 < 1.0) {
      this.x1 =
        track.arcWidth +
        (track.radius / 2 - 10) * cos(PI / 2 - 2 * PI * this.pct2);
      this.y1 =
        groundHeight -
        track.radius / 2 +
        (track.radius / 2 - 10) * sin(PI / 2 - 2 * PI * this.pct2);
      fill(0);
      noStroke();
      ellipse(this.x1, this.y1, 20, 20);
      isPlaying = true;
      successPossible = true;
    }
    this.pct2 += this.stepCircle;
  }
  runLine2() {
    if (this.pct2 >= 1.0) {
      this.x1 += this.xVelocity2;
      fill(0);
      noStroke();
      ellipse(this.x1, this.y1, 20, 20);
    }
  }
}

function drawLabels() {
  
  textSize(20);
  textStyle(BOLD);
  textAlign(LEFT);
  fill(33, 32, 79);
  text("HEIGHT", width - 600, labelHeight - 35);
  text("RADIUS", width - 320, labelHeight - 35);
  text("Velocity: " + round(velocity, 2) + " m/s", width - 300, height - 20);
  textSize(40);
  fill("white");
  stroke(33, 32, 79);
  textAlign(CENTER);
  text("Roller coaster Simulation", width / 2, labelHeight - 75);
  noStroke();
  noFill();
}

function calculateVelocity(mass, radiusLoop, ball) {
  velocity = 0;
  let ballHeight = defaultHeight;
  if (ball.x < track.arcWidth) {
    ballHeight = (abs(ball.y - 590) + 10) * 2;
  } else {
    ballHeight = (abs(ball.y1 - 590) + 10) * 2;
  }
  let potentialEnergy = mass * 9.81 * ballHeight;
  if (prevPotentialEnergy != 0) {
    kineticEnergy += prevPotentialEnergy - potentialEnergy; //add the difference of the potential energies
    velocity = sqrt((2 * kineticEnergy) / mass);
  }
  // console.log("Ball Height: "+ballHeight+"  Current PE: "+potentialEnergy+ "Kinetic Energy:   "+kineticEnergy+ " Velocity:  "+velocity);
  prevPotentialEnergy = potentialEnergy;
}

function drawFailure() {
  //console.log(" Result: "+result+" isPlaying "+isPlaying+ " fail " +fail);
  let failType = "";
  if (result == "FailHigh") {
    failType = "too high";
  } else {
    failType = "too low";
  }
  if ((result == "FailHigh" || result == "FailLow") && isPlaying && fail) {
    fill(color(240, 101, 96));
    rect(50, 230, width - 100, 460, 20);
    textSize(30);
    fill("white");
    textAlign(CENTER);
    text(
      "Oops! Your height is " + failType + "!",
      width / 2,
      labelHeight + 120
    );
    image(sadFace, width / 2 - 95, labelHeight + 140, 190, 120);
    fill("black");
    textSize(25);
    textStyle(NORMAL);
    textAlign(LEFT);
    text("Let's see why:", 80, labelHeight + 300);
    textSize(20);
    fill(color(218, 244, 245));
    text(
      "Your ideal height was " +
        failType +
        ". \nTry checking your math. Remember that: \n \n \n \n \nUse these equations and the law of conservation of energy to calculate the ideal \nheight. Press RESET to try again.",
      80,
      labelHeight + 330
    );
    fill("black");
    text(
      " Potential Energy = (mass) x (g) x (height) \n Kinetic Energy = (0.5) x (mass) x (velocity)^2 \n What must your centripetal force be equal to ensure that the ball makes it \n through the loop?",
      120,
      labelHeight + 380
    );

   // failSound.play();
    //failSound.noLoop();
    //failSound.stop();
  }
  noStroke();
}

function checkFailure() {
  //threshold point is when the wave force = centripetal force
  let minVelocity = sqrt(userRadius * 9.81);
  let idealHeight = (1 / 9.8) * (9.8 * 2 * userRadius + 0.5 * minVelocity ** 2);
  idealHeight = int(idealHeight);
  if (userHeight > idealHeight) {
    result = "FailHigh";
    
    fail = true;
  } else if (userHeight < idealHeight) {
    result = "FailLow";
    
    fail = true;
  } else {
    result = "Success";
  
    fail = false;
  }
}

function stateWhiteboard() {
  whiteBoardOn = true;
}

function showWhiteboard(){
  //background(backgroundColor);
 
  if(whiteBoardOn){

  // fill('white');
  // rect(50, 230, width - 100, 460, 20);
  
  redJar = new paintJar(290, red);
  redJar.show();
  redJar.getColor();
  pinkJar = new paintJar(347.5, pink);
  pinkJar.show();
  pinkJar.getColor();
  orangeJar = new paintJar(405, orange);
  orangeJar.show();
  orangeJar.getColor();
  yellowJar = new paintJar(462.5, yellow);
  yellowJar.show();
  yellowJar.getColor();
  greenJar = new paintJar(520, green);
  greenJar.show();
  greenJar.getColor();
  blueJar = new paintJar(577.5, blue);
  blueJar.show();
  blueJar.getColor();
  purpleJar = new paintJar(635, purple);
  purpleJar.show();
  purpleJar.getColor();
  blackJar = new paintJar(692.5, black);
  blackJar.show();
  blackJar.getColor();
  grayJar = new paintJar(750, gray);
  grayJar.show();
  grayJar.getColor();
  
  if (mouseIsPressed) {
    //ellipse(mouseX, mouseY,5,5); 
    // stroke(0,0,0);
    // fill(0,0,0);
    line(pmouseX, pmouseY, mouseX, mouseY, 1, 1);
    console.log("drawing");
  }
    
  noFill();
  noStroke();
  
  }

   
}


