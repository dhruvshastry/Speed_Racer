var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount = 0;
var gameState;
var car1;
var car2;
var cars = []
var car1Img, car2Img, trackImg;
var allPlayers;
var fuel,goldCoin,obstacle1Image,obstacle2Image;
var fuelGrp,powerCoinGrp,obstacleGrp;



function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Img = loadImage("./assets/car1.png");
  car2Img = loadImage("./assets/car2.png");
  trackImg = loadImage("./assets/track.jpg")
  fuel = loadImage("./assets/fuel.png");
  goldCoin = loadImage("./assets/goldCoin.png")
  obstacle1Image = loadImage("./assets/obstacle1.png")
  obstacle2Image = loadImage("./assets/obstacle2.png")
  lifeImg = loadImage("./assets/life.png");
  blastImg = loadImage("./assets/blast.png")


}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount === 2){
    game.updateState(1)
  }
  if(gameState === 1){
     game.play()
  }
  if(gameState===2){
    game.showLeaderboard()
    game.end()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
