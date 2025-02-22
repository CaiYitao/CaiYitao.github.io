// // 玩家和对手初始化
// let player = { health: 100, attack: 10, bananas: 0 };
// let opponent = { health: 50, attack: 8, counterChance: 0.5 }; // 50% 反击概率

// // 更新状态显示
// function updateStats() {
//     document.getElementById('playerStats').innerHTML = `玩家 - 生命值: ${player.health}, 香蕉: ${player.bananas}`;
//     document.getElementById('opponentStats').innerHTML = `敌人 - 生命值: ${opponent.health}`;
//     document.getElementById('battleLog').scrollTop = document.getElementById('battleLog').scrollHeight;
// }

// // 玩家攻击
// function playerAttack() {
//     let damage = player.attack;
//     opponent.health -= damage;
//     document.getElementById('battleLog').innerHTML += `<p>玩家攻击，造成 ${damage} 点伤害。</p>`;

//     if (opponent.health <= 0) {
//         document.getElementById('battleLog').innerHTML += `<p>敌人被击败！你获得 1 个香蕉。</p>`;
//         player.bananas++;
//         document.getElementById('bananaButton').style.display = 'inline';
//         document.getElementById('resetButton').style.display = 'inline';
//         updateStats();
//         return;
//     }

//     // AI 反击
//     if (Math.random() < opponent.counterChance) {
//         let counterDamage = opponent.attack;
//         player.health -= counterDamage;
//         document.getElementById('battleLog').innerHTML += `<p>敌人反击，造成 ${counterDamage} 点伤害！</p>`;
//     } else {
//         document.getElementById('battleLog').innerHTML += `<p>敌人试图反击，但失败了。</p>`;
//     }

//     if (player.health <= 0) {
//         document.getElementById('battleLog').innerHTML += `<p>你被击败了！游戏结束。</p>`;
//         document.getElementById('resetButton').style.display = 'inline';
//         return;
//     }

//     updateStats();
// }

// // 吃香蕉恢复生命
// function eatBanana() {
//     if (player.bananas > 0) {
//         player.bananas--;
//         player.health += 20;
//         document.getElementById('battleLog').innerHTML += `<p>你吃了一个香蕉，恢复 20 点生命值。</p>`;
//         document.getElementById('bananaButton').style.display = player.bananas > 0 ? 'inline' : 'none';
//         updateStats();
//     }
// }

// // 重置游戏
// function resetGame() {
//     player = { health: 100, attack: 10, bananas: 0 };
//     opponent = { health: 50, attack: 8, counterChance: 0.5 };
//     document.getElementById('battleLog').innerHTML = '';
//     document.getElementById('bananaButton').style.display = 'none';
//     document.getElementById('resetButton').style.display = 'none';
//     updateStats();
// }

// // 游戏开始时初始化
// updateStats();