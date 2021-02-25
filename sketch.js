var trex,trex_running,edges,ground,groundMoving,score,highScore,invisible_ground,trex_jump,cload,cloud_load,obstacle,ob1,ob2,ob3,ob4,ob5,ob6,obstacleGroup,cloudGroup,trex_collide,gameOver,GOimg,frameRandom,restart,restart_load,jumpSound,checkPoint,die,CP=100,rate=0.3,ground2;
const PLAY=1;
const END=0;
var gameState = PLAY, HSTry;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png", "trex4.png" );
  groundMoving= loadImage("ground2.png");
  trex_jump=loadAnimation("trex1.png");
  cloud_load=loadImage("cloud.png");
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  trex_collide=loadImage("trex_collided.png");
  GOimg=loadImage("gameOver.png");
  restart_load=loadImage("restart.png");
  jumpSound=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkPoint=loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  score=0;
  highScore=0;
  
  gameOver=createSprite(width/2,height/2-30,50,50);
  gameOver.addImage("gameOver",GOimg);
  gameOver.scale=0.5;
  
  ground=createSprite(450,height-20,600,20);
  ground.addImage("ground_moving",groundMoving);

    ground2=createSprite(450,height-20,600,20);
  ground2.addImage("ground_moving",groundMoving);

 ground.velocityX=-10;
  trex = createSprite(50,height-80,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("jump",trex_jump);
  trex.addAnimation("trex_collide",trex_collide);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  // trex.debug=true;
  restart=createSprite(width/2,height/2,100,100);
  restart.addImage("restart",restart_load);
  restart.scale=0.5;
  invisible_ground=createSprite(300,height-70,600,10);
  invisible_ground.visible=false;
  
  edges = createEdgeSprites();
  obstacleGroup=new Group();
  cloudGroup= new Group();
  // console.warn("This is an warning");
  // console.error("This is an error");
  // console.info("this is an information");
  
}

function draw(){
  // console.time();
  // console.count();
ground2.x=ground.x+1000;
  background("skyBlue");
  if(gameState==PLAY){
     score=score+rate;
     gameOver.visible=false;
     if((keyDown("up")  && trex.y>=height-100)|| (touches.length>1 && trex.y>=height-80) ){
       trex.velocityY = -14;
       trex.changeAnimation("jump",trex_jump);
       jumpSound.play();
     } 
     restart.visible=false;
     trex.velocityY=trex.velocityY + 1;
    
     if(trex.y>=160 && trex.velocityY==1){
       trex.changeAnimation("running",trex_running);
     }
     if(score>CP){
       CP=CP+100;
       checkPoint.play();
        ground.velocityX= ground.velocityX-0.5;
       rate=rate+0.1;
     }
    
     spawnCloud();
     spawnObstacle();
     
     if(ground2.x<width/2){
      ground.x=width/2;
     }
    
    if(trex.isTouching(obstacleGroup)){
      gameState=END;
      trex.velocityY=0;
      trex.velocityX=0;
      die.play();
    }
  }
  else if(gameState==END){
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
   if(score>=highScore){
    highScore=score;
   }
    restart.visible=true;
    obstacleGroup.setVelocityXEach(0);
    ground.velocityX=0;
    cloudGroup.setVelocityXEach(0);              
    trex.changeAnimation("trex_collide",trex_collide);
    gameOver.visible=true;
    if(mousePressedOver(restart) || touches.length>1){
      gameState=PLAY;
      touches=[];
      obstacleGroup.destroyEach();
      cloudGroup.destroyEach();
      score=0;
      rate=0.3;
      ground.velocityX=-10;
    }

  }
        console.log(ground.x);
  text(mouseX+","+mouseY,mouseX, mouseY);

  if(score<10){
    text("HI " + HSTry + Math.floor(highScore) + "  0000"+Math.floor(score),width/2-100,60);
  }else if(score<100){
    text("HI " + HSTry + Math.floor(highScore) + "  000"+Math.floor(score),width/2-100,60);
  }else if(score<1000){
    text("HI " + HSTry + Math.floor(highScore) + "  00"+Math.floor(score),width/2-100,60);
  }else if(score<10000){
    text("HI " + HSTry + Math.floor(highScore) + "  0"+Math.floor(score),width/2-100,60);
  }else{
    text("HI " + HSTry + Math.floor(highScore) + "  "+Math.floor(score),width/2-100,60);
  }
  if(highScore<10){
    HSTry="0000";
  }else if(highScore<100){
    HSTry="000";
  }else if(highScore<1000){
    HSTry="00";
  }else if(highScore<10000){
    HSTry="0";
  }else{
    HSTry="";
  }
  trex.collide(invisible_ground);
  drawSprites();
}


function spawnCloud(){
 
  if(frameCount%frameRandom==0 || frameCount==15){
  cloud=createSprite(width,50,50,50);
  frameRandom=Math.round(random(40,240));
  cloud.addImage("cloud",cloud_load);
  cloud.velocityX=-2;
  cloud.scale=0.2;
  cloud.y=Math.round(random(30,height-100));
  // console.log(cloud.x);
  cloud.depth=trex.depth;
  trex.depth++;
  cloud.lifetime=600;  
  cloudGroup.add(cloud);
  }

}

function spawnObstacle(){
  
  if(frameCount%60==0){
    obstacle=createSprite(width,height-100,50,50);
    obstacle.velocityX=ground.velocityX;
    var rand=Math.round(random(1,7));
    // obstacle.debug=true;
    switch(rand){
      case 1:obstacle.addImage("obstacle1",ob1);obstacle.scale=0.7;
        break;
        case 2:obstacle.addImage("ob2",ob2);obstacle.scale=0.7;
        break;
        case 3:obstacle.addImage("ob3",ob3);obstacle.scale=0.7;
        break;
        case 4:obstacle.addImage("ob4",ob4);obstacle.scale=0.5;
        break;
        case 5:obstacle.addImage("ob5",ob5);obstacle.scale=0.5;
        break;
        case 6:obstacle.addImage("ob6",ob6);obstacle.scale=0.5;
        break;
        case 7:obstacle.destroy();
        break;
    }
    
    obstacle.lifetime=600;
    obstacleGroup.add(obstacle);
  }
    
}