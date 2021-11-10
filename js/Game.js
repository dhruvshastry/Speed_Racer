class Game {
  constructor() {

    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leaderboardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.isMoving = false;
    this.leftKey = false;
    this.blast = false;


  }

  getState(){
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value",function(data){
       gameState = data.val()
    })
  }

  updateState(state){
    database.ref("/").update({
      gameState: state
    })

  }


  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount()
    car1 = createSprite(width/2-50,height-100)
    car1.addImage("car1",car1Img)
    car1.addImage("blast",blastImg)
    car1.scale = 0.07
    car2 = createSprite(width/2+100,height-100);
    car2.addImage("car2",car2Img) ;
    car2.addImage("blast",blastImg)
    car2.scale = 0.07;
    cars = [car1,car2] ;
    fuelGrp = new Group();
    powerCoinGrp = new Group();
    obstacleGrp = new Group();
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    this.addSprites(fuelGrp,4,fuel,0.02);
    this.addSprites(powerCoinGrp,18,goldCoin,0.09);
    this.addSprites(obstacleGrp,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
  }

  handleMethods(){
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")
    form.titleImg.scale = 0.7
    this.resetTitle.html("resetGame")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40)
    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230,30)
    this.leaderboardTitle.html("leaderboard")
    this.leaderboardTitle.class("resetText")
    this.leaderboardTitle.position(width/3-60,40)
    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)
    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130)
  }
 
 
  play(){
    this.handleMethods()
    this.handleResetButton()
    Player.getPlayerInfo()
    player.getCarsAtEnd()
    if(allPlayers!== undefined){
       image(trackImg,0,-height*5,width,height*6)
       var index = 0
       for(var plr in allPlayers){
         index = index+1
         var x = allPlayers[plr].positionX
         var y = height-allPlayers[plr].positionY
         var currentLife = allPlayers[plr].life
         if(currentLife<=0){
           cars[index-1].changeImage("blast")
           cars[index-1].scale = 0.5;

         }
         if (cars[index-1]== undefined){
           cars[index-1] = {}
         }
         cars[index-1].position.x = x
         cars[index-1].position.y = y
         if(index == player.index){
           fill("red")
           stroke(10)
           ellipse(x,y,60,60)
           this.handleFeul(index)
           this.handlePowerCoin(index)
           this.handleCarCollision(index)
           this.handleObstacleCollision(index)
           if(player.life<=0){
            this.blast = true;
            this.isMoving = false;
            gameState = 2
           }
         camera.position.y = cars[index-1].position.y
         camera.position.x = cars[index-1].position.x
       }
      }
       this.handlePlayerControls()
       
       
       this.showLeaderboard()
       this.showLife()
       this.showFuelBar()
       const finishLine = height*6-100;
       if(player.positionY > finishLine){
         gameState = 2
         player.rank+=1
         Player.updateCarsAtEnd(player.rank)
         player.update()
         this.showRank()
       }

       drawSprites()
    }
  }

  handlePlayerControls(){
    if(this.blast === false){
      if(keyIsDown(UP_ARROW)){
        player.positionY += 10
        this.isMoving = true;
        player.update()
      }
      if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
        player.positionX += 10
        player.update()
        this.leftKey = false;
      }
      if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
        player.positionX += -10
        player.update()
        this.leftKey = true;
    }
  }
}

  showLeaderboard(){
     var leader1, leader2;
     var players = Object.values(allPlayers)
     if((players[0].rank===0 && players[1].rank===0)|| players[0].rank===1){
       leader1 = players[0].rank+"&emsp;"+players[0].name+ "&emsp;"+players[0].score
       leader2 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
     }
     if(players[1].rank===1){
      leader1 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
      leader2 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)

  }



  handleResetButton(){
     this.resetButton.mousePressed(()=>{
        database.ref("/").set({
          playerCount: 0,
          gameCount: 0,
          carsAtEnd: 0,
          player : {}
        })
        window.location.reload()
     })
  }

  addSprites(spriteGrp,NumberOfSprites,SpriteImage,Scale,Position = []){
     for(var i=0;i<NumberOfSprites;i++){
       var x,y;
       if(Position.length>0){
        x = Position[i].x
        y = Position[i].y
        SpriteImage = Position[i].image
      }
      else{
        x = random(width/2+150,width/2-150)
        y = random(-height*4.5,height-400)
      }
       var sprite = createSprite(x,y)
       sprite.addImage("sprite",SpriteImage)
       sprite.scale = Scale

       spriteGrp.add(sprite)
     }
  }

  handleFeul(index){
    cars[index-1].overlap(fuelGrp,function(collector,collected){
      player.fuel = 185
      collected.remove()
    })
   if(player.fuel>0 && this.isMoving){
     player.fuel-=0.3;
   }
   if(player.fuel<=0){
     this.gameOver()
     gameState=2
   }

  }

  handlePowerCoin(index){
    cars[index-1].overlap(powerCoinGrp,function(collector,collected){
      player.score +=21
      player.update()
      collected.remove()
    })

    
  }
  handleCarCollision(index){
    if(index===1){
     if(cars[index-1].collide(cars[1])){
       if(this.leftKey){
         player.positionX+=100
       }
       else{
         player.positionX-=100
       }
       if(player.life>0){
         player.life-=185/4
       }
       player.update()
    }
    
   }
 
   if(index===2){
     if(cars[index-1].collide(cars[0])){
       if(this.leftKey){
         player.positionX+=100
       }
       else{
         player.positionX-=100
       }
       if(player.life>0){
         player.life-=185/4
       }
       player.update()
    }
    
   }
  }

  showRank(){
    swal({ title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`, 
    text: "You reached the finish line successfully",
    imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize: "100x100",
    confirmButtonText: "Ok" });
  }

  showFuelBar(){
    push()
    image(fuel,width/2+70,height-player.positionY-100,20,20)
    fill("white")
    rect(width/2+100,height-player.positionY-100,185,20)
    fill("blue")
    rect(width/2+100,height-player.positionY-100,player.fuel,20)
    noStroke()
    pop()
     
  }

  showLife(){
    push()
    image(lifeImg,width/2+70,height-player.positionY-200,20,20)
    fill("white")
    rect(width/2+100,height-player.positionY-200,185,20)
    fill("red")
    rect(width/2+100,height-player.positionY-200,player.life,20)
    pop()
  }

  gameOver(){
    swal({ title: `Game Over`,
     text: "Oops you lost the race....!!!", 
     imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
     imageSize: "100x100", 
     confirmButtonText: "Thanks For Playing" });
 }

 handleObstacleCollision(index){
   if(cars[index-1].collide(obstacleGrp)){
     if(this.leftKey){
       player.positionX+=100
     }
     else{
       player.positionX-=100
     }
     if(player.life>0){
       player.life-=185/4
     }
     player.update()
   }
 }

 end(){
   console.log("Game Over")
 }



  




}
