var dino, dinoanimation, dinoduck, bird, birdanimation, cactusgroup, cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6, cloudgroup, cloud, cloudimage, ground, groundimage, gameover, gameoverimage, restart, restartimage, trexcollide, bird, birdanimation, birdgroup, barrier, 
  PLAY = 1,
  END = 0,
  gamestate = PLAY,
  score, hiscore, deathsound, jumpsound, checkpoint;

function preload() {
  dinoanimation = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  gameover = loadImage("gameOver.png");
  restart = loadImage("restart.png");
  trexcollide = loadAnimation("trex_collided.png")
  birdanimation = loadAnimation("download.png", "download (2).png", "download (3).png");
  dinoduck = loadAnimation("download (1).png");
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  deathsound = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(400, 400);
  dino = createSprite(40, 360, 1, 1);
  dino.addAnimation("dino", dinoanimation);
  dino.addAnimation("collide", trexcollide);
  dino.scale = 0.5;
  ground = createSprite(200, 380, 400, 20);
  ground.addImage(groundimage);
  barrier = createSprite(200, 390, 400, 20);
  barrier.visible = false;
  cactusgroup = new Group();
  birdgroup = new Group();
  cloudgroup = new Group();
  dino.addAnimation("duck", dinoduck);
  restart = createSprite(200, 220, 1, 1);
  gameover = createSprite(200, 180, 1, 1);
  gameover.visible = false;
  restart.visible = false;
  restart.addImage(restartimage);
  gameover.addImage(gameoverimage);
  score = 0;
  hiscore = 0;
}

function draw() {
  console.log(hiscore);
  background("black");
  dino.collide(barrier);
  if (gamestate === PLAY) {
    score = score + Math.round(getFrameRate() / 30);
    if (keyDown("up") && dino.y > 356.5) {
      dino.velocityY = -15;
      jumpsound.play();
    }
    if (keyWentDown("down")) {
      dino.changeAnimation("duck", dinoduck);
      dino.scale = 1;
    }
    if (keyWentUp("down")) {
      dino.changeAnimation("dino", dinoanimation);
      dino.scale = 0.5;
    }
    dino.velocityY = dino.velocityY + 1;
    ground.velocityX = -6;

    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    if (score % 100 === 0 && score > 0) {
      checkpoint.play();
    }
    spawnCloud();
    spawnCactus();
    spawnBird();
    if (cactusgroup.isTouching(dino)) {
      dino.changeAnimation("collide", trexcollide);
      gamestate = END;
      deathsound.play();
    }
  } else if (gamestate === END) {
    ground.velocityX = 0;
    dino.velocityY = 0;
    cactusgroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    cactusgroup.setLifetimeEach(-1);
    cloudgroup.setLifetimeEach(-1);
    gameover.visible = true;
    restart.visible = true;
    restart.scale = 0.6;
    gameover.scale = 0.9;
    if (mousePressedOver(restart)) {
      reset();
    }
    if (score > hiscore) {
      hiscore = score;
    }
  }
  fill("white");
  text("Score: " + score, 290, 30);
  text("Hiscore: " + hiscore, 290, 45);
  drawSprites();
}

function spawnCloud() {
  if (frameCount % 75 === 0) {
    cloud = createSprite(350, random(100, 200), 1, 1)
    cloud.addImage(cloudimage);
    cloud.velocityX = -6;
    cloud.scale = 0.6;
    cloud.lifetime = 150
    cloudgroup.add(cloud);
  }
}

function spawnCactus() {
  if (frameCount % 50 === 0) {
    cactus = createSprite(350, 360, 1, 1)
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        cactus.addImage(cactus1);
        break;
      case 2:
        cactus.addImage(cactus2);
        break;
      case 3:
        cactus.addImage(cactus3);
        break;
      case 4:
        cactus.addImage(cactus4);
        break;
      case 5:
        cactus.addImage(cactus5);
        break;
      case 6:
        cactus.addImage(cactus6);
        break;
      default:
        break;
    }
    cactus.scale = 0.5;
    cactus.velocityX = -6;
    cactusgroup.add(cactus);
    cactus.lifetime = 100;
  }
}

function spawnBird() {
  if (frameCount % 125 === 0) {
    bird = createSprite(350, 300, 1, 1);
    bird.addAnimation("crow", birdanimation);
    bird.velocityX = -6.5;
    bird.scale = 0.8;
  }
}

function reset() {
  restart.visible = false;
  gameover.visible = false;
  dino.changeAnimation("dino", dinoanimation);
  birdgroup.destroyEach();
  cactusgroup.destroyEach();
  cloudgroup.destroyEach();
  gamestate = PLAY;
  score = 0;
}