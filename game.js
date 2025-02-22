// 玩家初始化
let player = {
    level: 1,
    combatPower: 5,
    defense: 3,
    counterAttack: 10,
    strength: 10,
    health: 100,
    bananas: 0
};

// 创建敌人
function createOpponent(level) {
    return {
        level: level,
        combatPower: 5 + 2 * (level - 1),
        defense: 3 + 1 * (level - 1),
        counterAttack: 10 + 2 * (level - 1),
        strength: 10 + 2 * (level - 1),
        health: (10 + 2 * (level - 1)) * 10
    };
}

let currentOpponent;

function startBattle(territoryId) {
    currentOpponent = createOpponent(territoryId);
    document.getElementById('map').style.display = 'none';
    document.getElementById('battle').style.display = 'block';
    document.getElementById('battleLog').innerHTML = '';
    document.getElementById('bananaButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';
    updateStats();
}

function updateStats() {
    document.getElementById('playerStats').innerHTML = 
        `玩家 - 等级: ${player.level}, 生命值: ${player.health}, 香蕉: ${player.bananas}`;
    document.getElementById('opponentStats').innerHTML = 
        `敌人 - 等级: ${currentOpponent.level}, 生命值: ${currentOpponent.health}`;
}

function playerAttack() {
    let damage = Math.max(0, player.combatPower - currentOpponent.defense);
    currentOpponent.health -= damage;
    document.getElementById('battleLog').innerHTML += `<p>玩家对敌人造成 ${damage} 点伤害。</p>`;

    if (currentOpponent.health <= 0) {
        document.getElementById('battleLog').innerHTML += `<p>玩家获胜！获得 1 个香蕉。</p>`;
        player.bananas++;
        document.getElementById('bananaButton').style.display = 'inline';
        document.getElementById('returnButton').style.display = 'inline';
        updateStats();
        return;
    }

    // 敌人反击
    if (Math.random() * 100 < currentOpponent.counterAttack) {
        let counterDamage = Math.max(0, currentOpponent.combatPower - player.defense);
        player.health -= counterDamage;
        document.getElementById('battleLog').innerHTML += 
            `<p>敌人反击，对玩家造成 ${counterDamage} 点伤害。</p>`;
    } else {
        document.getElementById('battleLog').innerHTML += `<p>敌人试图反击但失败了！</p>`;
    }

    if (player.health <= 0) {
        document.getElementById('battleLog').innerHTML += `<p>玩家失败！游戏结束。</p>`;
        document.getElementById('returnButton').style.display = 'inline';
        return;
    }

    updateStats();
}

function eatBanana() {
    if (player.bananas > 0) {
        player.bananas--;
        player.level++;
        player.combatPower += 2;
        player.defense += 1;
        player.counterAttack += 2;
        player.strength += 2;
        player.health = player.strength * 10;
        document.getElementById('battleLog').innerHTML += `<p>玩家吃了一个香蕉，升级了！</p>`;
        updateStats();
    }
}

function returnToMap() {
    document.getElementById('battle').style.display = 'none';
    document.getElementById('map').style.display = 'block';
}