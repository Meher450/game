//Declaring the variables
var boy,boyimg,boyimg1;
var path,pathimg;
var obj1,obj2,obj3;
var virus,virusimg1,virusimg2;
var sani,saniimg;
var spray;
var flag=0;
var music,hit,happy,horn,lost,scream; 
var up,down,center;
var upimg,downimg,centerimg;


var kills=0;
var lives=3;

var vaccine,vaccineimg;
var gameover,gameoverimg;
var ambulance,ambulanceimg;
var ambCount=0;

var PLAY=1;
var END=0;
var gameState=PLAY;

function preload(){
  //Loading the Sounds and Images
boyimg = loadAnimation("images/man1.png","images/man2.png","images/man3.png","images/man4.png","images/man5.png","images/man6.png");                   
boyimg1 = loadAnimation("images/mandied.png");

pathimg=loadImage("images/path.png");

virusimg1=loadImage("images/corona.png");
virusimg2=loadImage("images/covid.png");

saniimg=loadImage("images/sanitizer.png");
vaccineimg=loadImage("images/vaccine.png");
ambulanceimg=loadImage("images/ambulance.png");

upimg=loadImage("images/up.png");
downimg=loadImage("images/down.png");
centerimg=loadImage("images/center.png");

spray=loadSound("sounds/spray.mp3");
music=loadSound("sounds/bgm.mp3");
hit=loadSound("sounds/hit.wav");
happy=loadSound("sounds/happy.wav");
horn=loadSound("sounds/siren.mp3");
lost=loadSound("sounds/lost.wav");
scream=loadSound("sounds/scream.mp3");

gameoverimg=loadImage("images/gameover.png");
}

function setup() {
  createCanvas(1200,400);

  //creating the ground
  path=createSprite(1400,220);
  path.addImage("pathimg",pathimg);
  path.scale=2.00;
  path.velocityX=-(5+kills/10);
  
  //creating the player
  boy=createSprite(600, 300, 50, 50);
  boy.addAnimation("boyimg",boyimg);
  boy.debug=false;
  boy.setCollider("rectangle",10,0,30,120);

  //creating the sanitizer
  sani=createSprite(90, 300, 50, 50);
  sani.x=boy.x+30;
  sani.y=boy.y;
  sani.addImage("saniimg",saniimg);
  sani.debug=false;
  sani.setCollider("rectangle",200,0,400,100);
  sani.scale=0.3;

  //Creating the ambulance
  ambulance=createSprite(1300,50);
  ambulance.addImage("ambulanceimg",ambulanceimg);
  ambulance.y=boy.y;
  ambulance.debug=true;
  ambulance.scale=0.25;

  //creating the edges for the player
  obj1=createSprite(600,155,1200,10);
  obj1.visible=false;
  obj2=createSprite(600,380,1200,5);
  obj2.visible=false;

  //Creating the gameover icon
  gameover=createSprite(600,200,10,10);
  gameover.addImage("gameoverimg",gameoverimg);
  gameover.visible=false;

  up=createSprite(100,300);
  up.addImage("up",upimg);
  up.scale=0.3;

  down=createSprite(100,350);
  down.addImage("up",downimg);
  down.scale=0.3;

  center=createSprite(1100,325);
  center.addImage("center",centerimg);
  center.scale=0.3;

  //setting up groups
  virusGroup=new Group();
  vaccineGroup=new Group();
  amb=new Group();
}

function draw() {
  background("white"); 
  //music.loop("");

  path.velocityX=-(5+kills/10);
  console.log(path.velocityX);

  obj1.depth=path.depth+1;
  obj2.depth=path.depth+1;

  if(gameState=PLAY){

    fill("black");
    textSize(30);
    text("Kills: "+kills,1000,60);

    fill("black");
    textSize(30);
    text("Lives: "+lives,100,60);

    fill("black");
    textSize(30);
    text("Press SPACE to use Sanitizer",400,60);

    sani.destroy();
    sani.depth=boy.depth+1;

    //Spawning the items
    spawnvirus(); 
    spawnvaccine();

    //giving infinite path
    if(path.x<0.1){
      path.x=1200
    }

    //giving movements to the player 
    if(keyDown(UP_ARROW) || mousePressedOver(up)){
      boy.y+=-5;
    }

    if(keyDown(DOWN_ARROW) || mousePressedOver(down)){
      boy.y+=5;
    }

    //Showing the sanitizer whwn space is pressed 
    if(keyDown('SPACE') || mousePressedOver(center)){
      sani=createSprite(90, 300, 50, 50);
      sani.x=boy.x+30;
      sani.y=boy.y;
      sani.addImage("saniimg",saniimg);
      sani.debug=false;
      sani.setCollider("rectangle",200,0,400,100);
      sani.scale=0.3;
      spray.play();
    }

    //giving the score
    if(virusGroup.isTouching(sani)){
      var virus1=createSprite(0,0);
      virus1.x=virus.x;
      virus1.y=virus.y;
      virus1.scale=0.35;
      virus1.velocityX=-(5+kills/10);
      virus1.lifetime=10;
      scream.play();
      virus1.addImage("virusimg2",virusimg2);
      virus.destroy();

      kills+=10;    
    }
  //giving the lifelines
    if(virusGroup.isTouching(boy)){   
      virusGroup.destroyEach();
      hit.play();
      lives-=1;
    }

    //giving the lifelines
    if(vaccineGroup.isTouching(boy) && lives<3){
      vaccineGroup.destroyEach();
      happy.play();
      lives+=1;  
    }

    //changing the gamestate when there are no lifelines
    if(lives<=0){
      gameState=END;
      //lost.play();
      flag+=1;
      console.log(flag);
    }

    if(flag>0 && flag<=2){
      lost.play();
    }

    //Making the player not to exceed the road
    if(boy.isTouching(obj1)||boy.isTouching(obj2)||ambulance.isTouching(obj2)){
      boy.bounceOff(obj1);
      boy.bounceOff(obj2);
      ambulance.bounceOff(obj2);
    }
    drawSprites();
  }
  if(gameState===END){
    path.velocityX=0;
    gameover.visible=true;

    up.visible=false;
    down.visible=false;
    center.visible=false;

    //changing the animation when the player died
    boy.setCollider("rectangle",0,45,150,35);
    boy.addAnimation("boyimg1",boyimg1);
    boy.changeAnimation("boyimg1");

    //destroying the objects
    sani.destroy();

    virusGroup.setVelocityXEach(0);
    vaccineGroup.setVelocityXEach(0);

    vaccineGroup.setLifetimeEach(-1);
    virusGroup.setLifetimeEach(-1);

    vaccineGroup.destroyEach();
    virusGroup.destroyEach();

    if((keyDown("a")||mousePressedOver(gameover))&& ambCount==0){
        ambulance=createSprite(1300,50);
        ambulance.addImage("ambulanceimg",ambulanceimg);
        ambulance.y=boy.y+10;
        horn.play();
        ambulance.debug=true;
        ambulance.scale=0.25;
        ambulance.velocityX=-(7+kills/50);
        boy.depth=ambulance.depth+1;
        amb.add(ambulance);
        ambCount=1;
    }

    if(amb.isTouching(boy)){
      ambulance.velocityX=0;
      ambulance.lifetime=1;
      horn.pause();
      happy.play();
      reset();
    }
  }
}

//writing the function to spawn the virus and vaccine 
function spawnvirus(){
  if(frameCount%150===0){
   virus=createSprite(1300,50);
   virus.addImage("virusimg1",virusimg1);
   virus.y=Math.round(random(300,380));
   virus.scale=0.75;
   virus.velocityX=-(5+kills/10);
   virus.lifetime=1250;
   virusGroup.add(virus);
   boy.depth=virus.depth+1;
  }
}

function spawnvaccine(){
    if(frameCount%1000===0){
    vaccine=createSprite(1300,50);
    vaccine.addImage("vaccineimg",vaccineimg);
    vaccine.y=Math.round(random(300,380));
    vaccine.scale=0.25;
    vaccine.velocityX=-(5+kills/10);
    vaccine.lifetime=1250;
    vaccineGroup.add(vaccine);
    boy.depth=vaccine.depth+1;
  }
}

function reset(){
  gameState=PLAY;

  boy.addAnimation("boyimg",boyimg);
  boy.changeAnimation("boyimg");
  boy.setCollider("rectangle",10,0,30,120);

  path.velocityX=-(5+kills/10);

  gameover.visible=false;
  ambulance.visible=false;
  up.visible=true;
  down.visible=true;
  center.visible=true;
  kills=0;
  lives=3;
  flag=0;
  ambCount=0;
}