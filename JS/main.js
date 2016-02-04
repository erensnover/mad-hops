//jshint -W104

'use strict';

var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
paper.install(window);
paper.setup(document.getElementById('myCanvas'));

class Entity {
  constructor(pos, vel, acc, color, body) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.color = color;
    this.body = body;
  }

  update(event){

  }

  move(){
    this.x += this.vx;
    this.y += this.vy;
    this.vx += this.av;
    this.vy += this.ay;

    this.body.position.x = this.x;
    this.body.position.y = this.y;
  }

  get x()     { return this.pos[0]; }
  set x(posX) { this.pos[0] = posX; }

  get y()     { return this.pos[1]; }
  set y(posY) { this.pos[1] = posY; }


  get vx()    { return this.vel[0]; }
  set vx(velX){ this.vel[0] = velX; }

  get vy()    { return this.vel[1]; }
  set vy(velY){ this.vel[1] = velY; }


  get av()    { return this.acc[0]; }
  set av(accX){ this.acc[0] = accX; }

  get ay()    { return this.acc[1]; }
  set ay(accY){ this.acc[1] = accY; }

  get width()  { return this.body.bounds.width;  }

  get height() { return this.body.bounds.height; }

}


class Frog extends Entity{
  constructor(){
    super([200, 600], [1, 3], [0, 0], "#24ff00", new Path.Rectangle({
      size: [50, 50],
      fillColor: "#22f000",
      strokeColor: "black"
    }));
  }
  instanceFrog(body) {
    var a = this.body;
  }
  update(event) {
    if (Key.isDown('right')) {
      this.vx = 10;
    }

    if (Key.isDown('left')) {
      this.vx = -10;
    }

    if (this.y >= canvas.height - 25) {
      this.ay = 0;
      this.vy = 0;
      if (Key.isDown('up')) {
        this.vy = -15;
      }
    }

    if (!Key.isDown('right') && !Key.isDown('left')) {
      this.vx = 0;
    }

    if (!Key.isDown('up') || this.y < canvas.height - 25) {
      this.ay = 0.3;
    }
  }
}

class Platform extends Entity{
  constructor(){
    super([Math.floor(Math.random() * canvas.width), -60 ], [0, 0], [0, 0], "black", new Path.Rectangle({
      size: [100, 30],
      position: [-60, -60],
      fillColor: "black",
      strokeColor: "black"
    }));
  }
  instancePlatform(body) {
    var b = this.body;
  }
  update(event) {
    this.vy = 8;
  }
}

class World{
  constructor(){
    this.entities = [];

    this.makeEntities();
  }

  makeEntities(){
    this.entities.push(new Frog());
  }
  update(event){
    for(var i = 0; i < this.entities.length; i++){
      var entity = this.entities[i];

      entity.update(event);
      entity.move();

      if(entity.y >= canvas.height - 25 && entity instanceof Frog) {
        entity.y = canvas.height - 25;
        entity.vy = 0;
      }
      else {
        if (entity instanceof Platform) {
          entity.vy = 15;
        }
        else if (entity instanceof Frog) {
          entity.ay = 9.8;
        }

      }
    }
    if (event.count % 50 === 0) {
      this.entities.push(new Platform());
    }
  }
  isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
      );
    }
  checkBorders(entity) {
    if (entity.x >= canvas.width + 25 && entity instanceof Frog) {
      entity.x = -24;
    }

    else if (entity.x <= -25) {
      entity.x = canvas.width + 24;
    }
  }
}

// var frog = new Frog();
var world = new World();

view.onFrame = function (event) {
  world.update(event);
  // frog.update(event);
  // frog.move();
};
