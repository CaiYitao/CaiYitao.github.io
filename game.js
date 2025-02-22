// ================
// 游戏资源加载
// ================

// 图片资源（请确保这些图片与代码在同一目录下）：
const jungleImage = new Image();
jungleImage.src = "jungle.png"; // 丛林背景
const apeImage = new Image();
apeImage.src = "ape.png";       // 猩猩形象（玩家及敌人，可通过水平翻转区分）
const bananaImage = new Image();
bananaImage.src = "banana.png"; // 香蕉图片

// ================
// 游戏类定义
// ================

// 属性类：包含战斗力、防御力、反击概率、力量和生命值
class Attributes {
  constructor(level) {
    this.combatPower = 5 + 2 * (level - 1);
    this.defense = 3 + 1 * (level - 1);
    this.counterAttack = 10 + 2 * (level - 1); // %
    this.strength = 10 + 2 * (level - 1);
    this.health = this.strength * 10;
  }
  upgrade() {
    this.combatPower += 2;
    this.defense += 1;
    this.counterAttack = Math.min(this.counterAttack + 2, 50);
    this.strength += 2;
    this.health = this.strength * 10;
  }
}

// 玩家类
class Player {
  constructor() {
    this.level = 1;
    this.attributes = new Attributes(this.level);
    this.bananas = 0;
    // 在画布上显示的位置
    this.x = 100;
    this.y = 400;
  }
  eatBanana() {
    if(this.bananas > 0) {
      this.bananas--;
      this.level++;
      this.attributes.upgrade();
      // 升级后恢复满血
      this.attributes.health = this.attributes.strength * 10;
    }
  }
}

// 敌人类（AI猩猩）
class Enemy {
  constructor(level) {
    this.level = level;
    this.attributes = new Attributes(level);
    // 敌人位置（在战斗时出现在右侧）
    this.x = 500;
    this.y = 400;
  }
}

// ================
// 游戏全局变量与状态
// ================

// 游戏状态： "map" 地图探索、 "battle" 战斗、 "upgrade" 升级提示、 "gameover" 游戏结束
let gameState = "map";
let player = new Player();
let currentEnemy = null;
let battleMessage = "";

// 用于简单动画效果（例如攻击时的闪烁）
let animationTimer = 0;

// Canvas 与上下文
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI 容器
const uiDiv = document.getElementById("ui");

// ================
// 地图与领地设置
// ================

// 定义四个领地区域（矩形区域），格式：{x, y, w, h, minLevel, maxLevel, label}
const territories = [
  { x: 50, y: 450, w: 150, h: 100, minLevel: 1, maxLevel: 3, label: "领地1\n(等级1-3)" },
  { x: 250, y: 450, w: 150, h: 100, minLevel: 4, maxLevel: 6, label: "领地2\n(等级4-6)" },
  { x: 450, y: 450, w: 150, h: 100, minLevel: 7, maxLevel: 9, label: "领地3\n(等级7-9)" },
  { x: 650, y: 450, w: 100, h: 100, minLevel: 10, maxLevel: 10, label: "Alpha\n领地" }
];

// ================
// UI 处理函数
// ================

function setUIForMap() {
  uiDiv.innerHTML = "<p>点击地图上的领地进入战斗</p>";
}

function setUIForBattle() {
  uiDiv.innerHTML = `
    <button onclick="battleRound('attack')">攻击</button>
    <button onclick="battleRound('defend')">防御</button>
    <button onclick="exitBattle()">逃离</button>
    <p>${battleMessage}</p>
  `;
}

function setUIForUpgrade() {
  uiDiv.innerHTML = `
    <p>敌人被击败！你获得了一根香蕉。是否吃香蕉升级？</p>
    <button onclick="upgradePlayer()">吃香蕉升级</button>
    <button onclick="backToMap()">暂不升级</button>
  `;
}

function setUIForGameOver() {
  uiDiv.innerHTML = `
    <p>游戏结束！</p>
    <button onclick="restartGame()">重新开始</button>
  `;
}

// ================
// 游戏逻辑函数
// ================

// 地图状态：点击领地开始战斗
canvas.addEventListener("click", function(e) {
  if(gameState !== "map") return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  // 检查点击是否在某个领地内
  for (let ter of territories) {
    if(mouseX >= ter.x && mouseX <= ter.x + ter.w &&
       mouseY >= ter.y && mouseY <= ter.y + ter.h) {
         startBattle(ter);
         break;
    }
  }
});

// 开始战斗：根据领地设定随机生成敌人等级
function startBattle(territory) {
  let enemyLevel;
  if (territory.minLevel === territory.maxLevel) {
    enemyLevel = territory.minLevel;
  } else {
    enemyLevel = Math.floor(Math.random() * (territory.maxLevel - territory.minLevel + 1)) + territory.minLevel;
  }
  currentEnemy = new Enemy(enemyLevel);
  gameState = "battle";
  battleMessage = "";
  setUIForBattle();
}

// 战斗回合：根据玩家选择（攻击或防御）
function battleRound(action) {
  if (gameState !== "battle") return;
  // 玩家回合
  if(action === "attack") {
    let damage = Math.max(0, player.attributes.combatPower - currentEnemy.attributes.defense);
    currentEnemy.attributes.health -= damage;
    battleMessage = `你攻击造成 ${damage} 点伤害！`;
  } else if(action === "defend") {
    battleMessage = "你选择防御，暂时降低受到的伤害。";
  }
  
  // 检查敌人是否被击败
  if(currentEnemy.attributes.health <= 0) {
    battleMessage += " 敌人被击败，化作香蕉掉落！";
    player.bananas++;
    gameState = "upgrade";
    setUIForUpgrade();
    return;
  }
  
  // 敌人回合（简单模拟）
  // 如果玩家选择防御，则防御力翻倍
  let effectiveDefense = (action === "defend") ? player.attributes.defense * 2 : player.attributes.defense;
  let enemyDamage = Math.max(0, currentEnemy.attributes.combatPower - effectiveDefense);
  player.attributes.health -= enemyDamage;
  battleMessage += ` 敌人反击造成 ${enemyDamage} 点伤害！`;
  
  // 检查玩家存活
  if(player.attributes.health <= 0) {
    gameState = "gameover";
    setUIForGameOver();
  } else {
    setUIForBattle();
  }
}

// 退出战斗，返回地图状态
function exitBattle() {
  gameState = "map";
  setUIForMap();
}

// 升级玩家（吃香蕉升级）
function upgradePlayer() {
  player.eatBanana();
  gameState = "map";
  setUIForMap();
}

// 重新开始游戏
function restartGame() {
  player = new Player();
  currentEnemy = null;
  gameState = "map";
  setUIForMap();
}

// ================
// 动画与渲染函数
// ================

function draw() {
  // 绘制背景（丛林）
  if(jungleImage.complete) {
    ctx.drawImage(jungleImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#228822";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  if(gameState === "map") {
    drawMapScene();
  } else if(gameState === "battle") {
    drawBattleScene();
  } else if(gameState === "upgrade") {
    drawMapScene(); // 升级时可显示地图背景，并额外绘制香蕉动画
    drawBananaAnimation();
  } else if(gameState === "gameover") {
    drawGameOverScene();
  }
  
  requestAnimationFrame(draw);
}

// 绘制地图场景：显示领地区域和玩家猩猩
function drawMapScene() {
  // 绘制领地区域（半透明矩形和文字提示）
  ctx.save();
  ctx.globalAlpha = 0.6;
  territories.forEach(ter => {
    ctx.fillStyle = "#4444aa";
    ctx.fillRect(ter.x, ter.y, ter.w, ter.h);
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    wrapText(ctx, ter.label, ter.x + ter.w/2, ter.y + ter.h/2, ter.w - 10, 20);
  });
  ctx.restore();
  
  // 绘制玩家猩猩（使用 apeImage）
  if(apeImage.complete) {
    ctx.drawImage(apeImage, player.x, player.y, 100, 100);
  } else {
    ctx.fillStyle = "#ff0";
    ctx.fillRect(player.x, player.y, 100, 100);
  }
}

// 绘制战斗场景：显示玩家与敌人、血条等
function drawBattleScene() {
  // 绘制玩家
  if(apeImage.complete) {
    ctx.drawImage(apeImage, player.x, player.y, 100, 100);
  } else {
    ctx.fillStyle = "#ff0";
    ctx.fillRect(player.x, player.y, 100, 100);
  }
  // 绘制敌人（将猩猩图水平翻转）
  if(apeImage.complete) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(apeImage, - (currentEnemy.x + 100), currentEnemy.y, 100, 100);
    ctx.restore();
  } else {
    ctx.fillStyle = "#f00";
    ctx.fillRect(currentEnemy.x, currentEnemy.y, 100, 100);
  }
  // 绘制血条
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`你的生命: ${player.attributes.health}`, 50, 50);
  ctx.fillText(`敌人生命: ${currentEnemy.attributes.health}`, 500, 50);
}

// 绘制香蕉动画（简单的上下浮动效果）
function drawBananaAnimation() {
  animationTimer += 0.05;
  const offsetY = Math.sin(animationTimer) * 10;
  if(bananaImage.complete) {
    ctx.drawImage(bananaImage, player.x + 120, player.y + offsetY, 50, 50);
  } else {
    ctx.fillStyle = "#ff0";
    ctx.fillRect(player.x + 120, player.y + offsetY, 50, 50);
  }
}

// 绘制游戏结束场景（在画布上显示Game Over文字）
function drawGameOverScene() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
}

// 辅助函数：换行绘制文本
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  let words = text.split('\n');
  for(let i = 0; i < words.length; i++){
    context.fillText(words[i], x, y + (i * lineHeight));
  }
}

// 启动动画循环
draw();

// 初始 UI
setUIForMap();
