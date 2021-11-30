var bg, bg_img;
var shooter, shooter_img1, shooter_img2, shooter_img3;
var enemyGrp, enemy, enemy_img;
var hrt1_img, hrt2_img, hrt3_img;
var hrt1, hrt2, hrt3;
var bullet;
var ammo = 80;
var gameState = "fight";
var lives = 3;
var coin, coin_img;
var score = 0;
var compliments = ["Nice!","Good Job!","Excellent🥳","Awesome!"]

function preload() {
  bg_img = loadImage("assets/bg.jpeg");
  shooter_img1 = loadImage("assets/shooter_1.png");
  shooter_img2 = loadImage("assets/shooter_2.png");
  shooter_img3 = loadImage("assets/shooter_3.png");
  enemy_img = loadImage("assets/zombie.png");
  hrt1_img = loadImage("assets/heart_1.png");
  hrt2_img = loadImage("assets/heart_2.png");
  hrt3_img = loadImage("assets/heart_3.png");
  coin_img = loadImage("assets/coin.png");
  explosion_snd = loadSound("assets/explosion.mp3");
  win_snd = loadSound("assets/win.mp3");
  lose_snd = loadSound("assets/lose.mp3");
  bg_snd = loadSound("assets/background.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  

 // bg = createSprite(displayWidth / 2 - 5, displayHeight / 2 + 159);
  // bg.addImage(bg_img);
  // bg.scale = 1.52

  shooter = createSprite(displayWidth / 2 - 320, displayHeight - 300);
  shooter.addImage(shooter_img2);
  shooter.scale = 0.4;

  hrt1 = createSprite(displayWidth - 150, 40, 20, 20);
  hrt1.addImage("hrt1", hrt1_img);
  hrt1.visible = false;
  hrt1.scale = 0.4;

  hrt2 = createSprite(displayWidth - 150, 40, 20, 20);
  hrt2.addImage("hrt2", hrt2_img);
  hrt2.visible = false;
  hrt2.scale = 0.4;

  hrt3 = createSprite(displayWidth - 150, 40, 20, 20);
  hrt3.addImage("hrt3", hrt3_img);
  hrt3.visible = true;
  hrt3.scale = 0.4;


  shooter.debug = true;

  enemyGrp = new Group();

  coinGrp = new Group()
  bulletGrp = new Group();
}

function draw() {
  background(bg_img);
  if(!bg_snd.isPlaying()){
    bg_snd.play();
    bg_snd.setVolume(0.6);
  }

  if (gameState === "fight") {

    if (keyDown(UP_ARROW) && shooter.y > displayHeight / 2) {
      shooter.y -= 5;
    }
    if (keyDown(DOWN_ARROW) && shooter.y < displayHeight - 250) {
      shooter.y += 5;
    }
    if (keyDown(RIGHT_ARROW) && shooter.x < windowWidth - 53) {
      shooter.x += 5;
    }
    if (keyDown(LEFT_ARROW) && shooter.x > 54) {
      shooter.x -= 5;
    }


    if (keyWentDown("space")) {
      shooter.addImage(shooter_img3);
      bullet = createSprite(shooter.x + 30, shooter.y - 30, 20, 10);
      bullet.velocityX = 20;
      bulletGrp.add(bullet);
      ammo = ammo - 1;
      explosion_snd.play();
    }


    if (ammo === 0) {
      lose_snd.play();
      gameState = "bLost";
    }

    if (score >= 200) {
      win_snd.play();
      gameState = "Won";
    }

    if (keyWentUp("space")) {
      shooter.addImage(shooter_img2)
    }

    if (enemyGrp.isTouching(shooter)) {
      for (var i = 0; i < enemyGrp.length; i++) {
        if (enemyGrp[i].isTouching(shooter)) {
          enemyGrp[i].destroy();
          lives = lives - 1;
        }
      }
    }

    if (bulletGrp.isTouching(enemyGrp)) {
      for (var i = 0; i < enemyGrp.length; i++) {
        if (enemyGrp[i].isTouching(bulletGrp)) {
          textSize(40);
          fill("White");
          text(random(compliments),enemyGrp[i].position.x,enemyGrp[i].position.y);
          // setTimeout(function(){
          //   enemyGrp[i].remove();
          // },500)
          enemyGrp[i].remove();
          
          bulletGrp.destroyEach();
          score = score + 10;
          

        }
      }
    }

    if (coinGrp.isTouching(shooter)) {
      for (var i = 0; i < coinGrp.length; i++) {
        if (coinGrp[i].isTouching(shooter)) {
          coinGrp[i].destroy();
          score = score + 15;
        }
      }
    }
    if (lives === 3) {
      hrt1.visible = false;
      hrt2.visible = false;
      hrt3.visible = true;
    }
    if (lives === 2) {
      hrt1.visible = false;
      hrt2.visible = true;
      hrt3.visible = false;
    }
    if (lives === 1) {
      hrt1.visible = true;
      hrt2.visible = false;
      hrt3.visible = false;
    }
    if (lives === 0) {
      lose_snd.play();
      gameState = "Lost";
      hrt1.visible = false;
      hrt2.visible = false;
      hrt3.visible = false;
    }
    spawnEnemies();
    spawnCoins();
  }

  drawSprites();


  if (gameState === "bLost") {
    shooter.destroy();
    enemyGrp.destroyEach();
    bulletGrp.destroyEach();
    textSize(45);
    fill("white");
    text("You ran out of bullets😪!!!", displayWidth / 2, displayHeight / 2);
    
  }
  else if (gameState === "Won") {
    shooter.destroy();
    enemyGrp.destroyEach();
    bulletGrp.destroyEach();
    textSize(45);
    fill("blue");
    text("You won the game🥳!!!", displayWidth / 2, displayHeight / 2);
    
  }
  else if (gameState === "Lost") {
    shooter.destroy();
    enemyGrp.destroyEach();
    bulletGrp.destroyEach();
    textSize(45);
    fill("Purple");
    text("You LOST the game😭!!!", displayWidth / 2, displayHeight / 2);
    
  }
  textSize(45);
  fill("white");
  text("Bullets: " + ammo, 20, 50);

  text("Score: " + score, 20, 125);




}

function spawnEnemies() {
  if (frameCount % 120 === 0) {
    enemy = createSprite(windowWidth - 10, random(windowHeight / 2, windowHeight - 10));
    enemy.addImage(enemy_img);
    enemy.velocityX = -3;
    enemy.scale = 0.25;
    enemy.debug = true;
    enemy.setCollider("rectangle", 0, 0, 500, 965);
    enemy.lifetime = windowWidth / 3;
    enemyGrp.add(enemy);
  }
}
function spawnCoins() {
  if (frameCount % 90 === 0) {
    coin = createSprite(windowWidth - 10, random(windowHeight / 2, windowHeight - 10));
    coin.addImage(coin_img);
    coin.velocityX = -3;
    coin.scale = 0.25;
    coin.debug = true;
    coin.setCollider("circle", 0, 0, 100);
    coin.lifetime = windowWidth / 3;
    coinGrp.add(coin);
  }
}
