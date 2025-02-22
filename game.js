// 属性类，包含战斗力、防御力、反击概率、力量和生命值
class Attributes {
    constructor(level) {
      this.combatPower = 5 + 2 * (level - 1);
      this.defense = 3 + 1 * (level - 1);
      this.counterAttack = 10 + 2 * (level - 1); // 百分比
      this.strength = 10 + 2 * (level - 1);
      this.health = this.strength * 10;
    }
    upgrade() {
      this.combatPower += 2;
      this.defense += 1;
      // 反击能力上限50%
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
    }
  }
  
  // 工具函数：生成[min, max]范围内的随机整数
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // 全局变量
  let player = new Player();
  let currentEnemy = null;
  let battleOngoing = false;
  
  // 更新顶部状态栏（显示玩家属性）
  function updateStatusBar() {
    const statusBar = document.getElementById("statusBar");
    statusBar.innerHTML = `玩家等级: ${player.level} | 战斗力: ${player.attributes.combatPower} | 防御力: ${player.attributes.defense} | 反击: ${player.attributes.counterAttack}% | 力量: ${player.attributes.strength} | 生命值: ${player.attributes.health} | 香蕉: ${player.bananas}`;
  }
  
  // 切换界面（添加简单的淡入淡出效果）
  function showScreen(screenId) {
    const screens = document.getElementsByClassName("screen");
    for(let screen of screens) {
      screen.classList.remove("active");
    }
    document.getElementById(screenId).classList.add("active");
  }
  
  // 从地图进入战斗
  function startBattle(territoryId) {
    // 根据领地不同，生成对应等级的敌人
    let enemyLevel;
    if(territoryId === 1) {
      enemyLevel = getRandomInt(1, 3);
    } else if(territoryId === 2) {
      enemyLevel = getRandomInt(4, 6);
    } else if(territoryId === 3) {
      enemyLevel = getRandomInt(7, 9);
    } else if(territoryId === 4) {
      enemyLevel = 10;
    }
    currentEnemy = new Enemy(enemyLevel);
    battleOngoing = true;
    // 清空战斗日志
    document.getElementById("battleLog").innerHTML = "";
    updateBattleStatus();
    showScreen("battleScreen");
  }
  
  // 更新战斗界面信息
  function updateBattleStatus() {
    const battleStatus = document.getElementById("battleStatus");
    battleStatus.innerHTML = `<strong>玩家</strong> - 等级: ${player.level}, 生命值: ${player.attributes.health}<br>
    <strong>敌人</strong> - 等级: ${currentEnemy.level}, 生命值: ${currentEnemy.attributes.health}`;
    updateStatusBar();
  }
  
  // 在战斗日志中追加信息
  function addBattleLog(message) {
    const logDiv = document.getElementById("battleLog");
    logDiv.innerHTML += `<p>${message}</p>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  }
  
  // 玩家在战斗中选择操作
  function playerAction(action) {
    if(!battleOngoing) return;
    if(action === 'attack') {
      playerAttack();
    } else if(action === 'defend') {
      playerDefend();
    }
  }
  
  // 玩家攻击
  function playerAttack() {
    // 计算伤害：玩家战斗力 - 敌人防御力
    let damage = Math.max(0, player.attributes.combatPower - currentEnemy.attributes.defense);
    currentEnemy.attributes.health -= damage;
    addBattleLog(`你攻击敌人，造成 ${damage} 点伤害.`);
    // 判断敌人是否被击败
    if(currentEnemy.attributes.health <= 0) {
      addBattleLog("敌人被击败，化为香蕉！");
      player.bananas++;
      endBattle(true);
      return;
    }
    // 敌人反击：根据其反击概率决定是否反击
    if(Math.random() * 100 < currentEnemy.attributes.counterAttack) {
      let counterDamage = Math.max(0, currentEnemy.attributes.combatPower - player.attributes.defense);
      player.attributes.health -= counterDamage;
      addBattleLog(`敌人反击，造成 ${counterDamage} 点伤害.`);
      if(player.attributes.health <= 0) {
        addBattleLog("你被击败了！");
        endBattle(false);
        return;
      }
    }
    updateBattleStatus();
  }
  
  // 玩家防御
  function playerDefend() {
    addBattleLog("你选择防御。");
    // 防御状态下，防御力翻倍
    let effectiveDefense = player.attributes.defense * 2;
    let damage = Math.max(0, currentEnemy.attributes.combatPower - effectiveDefense);
    player.attributes.health -= damage;
    addBattleLog(`敌人攻击，你受到 ${damage} 点伤害.`);
    if(player.attributes.health <= 0) {
      addBattleLog("你被击败了！");
      endBattle(false);
      return;
    }
    updateBattleStatus();
  }
  
  // 退出战斗，返回地图
  function exitBattle() {
    battleOngoing = false;
    showScreen("mapScreen");
  }
  
  // 结束战斗，区分胜利或失败
  function endBattle(victory) {
    battleOngoing = false;
    if(victory) {
      // 胜利后进入升级界面（吃香蕉升级）
      showScreen("upgradeScreen");
    } else {
      // 失败则显示游戏结束
      document.getElementById("gameOverMessage").innerText = "你被击败了。";
      showScreen("gameOverScreen");
    }
    updateStatusBar();
  }
  
  // 吃香蕉升级
  function eatBanana() {
    player.eatBanana();
    addBattleLog("你吃掉了香蕉，升级成功！");
    showScreen("mapScreen");
    updateStatusBar();
  }
  
  // 返回地图（不吃香蕉升级）
  function backToMap() {
    showScreen("mapScreen");
    updateStatusBar();
  }
  
  // 重新开始游戏
  function restartGame() {
    player = new Player();
    currentEnemy = null;
    battleOngoing = false;
    showScreen("mapScreen");
    updateStatusBar();
    document.getElementById("battleLog").innerHTML = "";
  }
  
  // 初始状态更新
  updateStatusBar();
  