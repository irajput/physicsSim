/*global createCanvas,colorMode,HSB,background,PI, fill, arc,pow,  width,noFill,color, stroke, ellipse, 
line, strokeWeight,createInput,createButton, noStroke, point, sqrt, angleMode, DEGREES, cos, sin,loadImage,textSize,
textStyle,text,BOLD,height, image, textAlign, CENTER, rect, abs, RGB, LEFT, NORMAL, ITALIC,loadSound, random, round,int, 
Vector, p5, keyCode, createVector*/

// let fireworks, gravity;

// function setup() {
//   createCanvas(700, 700);
  
//   background(0);
// }

// function draw() {
//   colorMode(RGB);
//   // background(0,25);
 
//   if (random(1) < 0.03) {
//     //10% chance of a new firework
//     fireworks.push(new Firework());
//   }
//   for (let i = fireworks.length -1; i >= 0; i--) {
//     fireworks[i].update();
//     fireworks[i].show();
//     if(fireworks[i].done()){
//       fireworks.splice(i,1);
//     }
//   }
// }

class Firework {
    constructor() {
      this.firework = new Particle(random(width), height, this.hue, true);
      this.exploded = false;
      this.particles = [];
      this.hue = random(0,360);
    }
  
    done() {
      if (this.exploded && this.particles.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  
    update() {
      if (!this.exploded) {
        this.firework.update();
        this.firework.applyForce(gravity);
        if (this.firework.vel.y >= 0) {
          this.exploded = true;
          this.explode();
        }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].applyForce(gravity);
        this.particles[i].update();
        if (this.particles[i].done()) {
          this.particles.splice(i, 1);
        }
      }
    }
    explode() {
      for (let i = 0; i < 100; i++) {
        let p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hue, false);
        this.particles.push(p);
      }
    }
    show() {
      if (!this.exploded) {
        this.firework.show();
      }
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].show();
      }
    }
  }
  
  class Particle {
    constructor(x, y, hue, firework) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.lifespan = 255;
      this.hue = hue;
      
      if (this.firework) {
        this.vel = createVector(0, random(-15, -10));
      } else {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2, 10));
      }
  
      this.acc = createVector(0, 0);
    }
    show() {
      colorMode(HSB);
      if (!this.firework) {
        strokeWeight(4);
        stroke(this.hue, 255, 255, this.lifespan);
      } else {
        strokeWeight(6);
        stroke(this.hue, 255, 255);
      }
  
      point(this.pos.x, this.pos.y);
    }
    update() {
      if (!this.firework) {
        this.vel.mult(0.9);
        this.lifespan -= 6;
      }
      this.pos.add(this.vel); //adds vel to pos
      this.vel.add(this.acc); //adds acc to vel
      this.acc.mult(0); //clear acc each frame
    }
    applyForce(force) {
      this.acc.add(force);
    }
  
    done() {
      if (this.lifespan < 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  
  