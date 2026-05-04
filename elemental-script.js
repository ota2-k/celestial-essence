// ゲーム状態
const gameState = {
  pools: {
      light: 5,
      aqua: 5,
      wind: 5,
      fire: 5,
      dark: 5,
      aether: 0
  },
  player: {
      light: 0,
      aqua: 0,
      wind: 0,
      fire: 0,
      dark: 0,
      aether: 0,
      score: 0
  },
  generatedElements: {
      light: 0,
      aqua: 0,
      wind: 0,
      fire: 0,
      dark: 0
  },
  cards: {
      tier1: [],
      tier2: [],
      tier3: []
  },
  reservedCards: [],
  purchasedCards: [],
  gameOver: false
};

// マジックカード定義
const cardDefinitions = {
  tier1: [
      { cost: { light: 1 }, points: 1, bonus: 'light' },
      { cost: { aqua: 1 }, points: 1, bonus: 'aqua' },
      { cost: { wind: 1 }, points: 1, bonus: 'wind' },
      { cost: { fire: 1 }, points: 1, bonus: 'fire' },
      { cost: { dark: 1 }, points: 1, bonus: 'dark' },
      { cost: { light: 1, aqua: 1 }, points: 1, bonus: 'light' },
      { cost: { wind: 1, fire: 1 }, points: 1, bonus: 'wind' },
      { cost: { dark: 1, light: 1 }, points: 1, bonus: 'dark' }
  ],
  tier2: [
      { cost: { light: 2, aqua: 1 }, points: 3, bonus: 'light' },
      { cost: { aqua: 2, wind: 1 }, points: 3, bonus: 'aqua' },
      { cost: { wind: 2, fire: 1 }, points: 3, bonus: 'wind' },
      { cost: { fire: 2, dark: 1 }, points: 3, bonus: 'fire' },
      { cost: { dark: 2, light: 1 }, points: 3, bonus: 'dark' },
      { cost: { light: 1, aqua: 1, wind: 1 }, points: 3, bonus: 'light' },
      { cost: { aqua: 1, wind: 1, fire: 1 }, points: 3, bonus: 'aqua' },
      { cost: { wind: 1, fire: 1, dark: 1 }, points: 3, bonus: 'wind' }
  ],
  tier3: [
      { cost: { light: 3, aqua: 2 }, points: 6, bonus: 'light' },
      { cost: { aqua: 3, wind: 2 }, points: 6, bonus: 'aqua' },
      { cost: { wind: 3, fire: 2 }, points: 6, bonus: 'wind' },
      { cost: { fire: 3, dark: 2 }, points: 6, bonus: 'fire' },
      { cost: { dark: 3, light: 2 }, points: 6, bonus: 'dark' },
      { cost: { light: 2, aqua: 1, wind: 1, fire: 1 }, points: 6, bonus: 'light' },
      { cost: { aqua: 2, wind: 1, fire: 1, dark: 1 }, points: 6, bonus: 'aqua' },
      { cost: { wind: 2, fire: 1, dark: 1, light: 1 }, points: 6, bonus: 'wind' }
  ]
};

// ゲーム初期化
function initGame() {
  gameState.pools = {
      light: 5,
      aqua: 5,
      wind: 5,
      fire: 5,
      dark: 5,
      aether: 0
  };
  gameState.player = {
      light: 0,
      aqua: 0,
      wind: 0,
      fire: 0,
      dark: 0,
      aether: 0,
      score: 0
  };
  gameState.generatedElements = {
      light: 0,
      aqua: 0,
      wind: 0,
      fire: 0,
      dark: 0
  };
  gameState.reservedCards = [];
  gameState.purchasedCards = [];
  gameState.gameOver = false;

  // カード初期化
  gameState.cards.tier1 = cardDefinitions.tier1.map(c => ({...c, id: Math.random()})).slice(0, 4);
  gameState.cards.tier2 = cardDefinitions.tier2.map(c => ({...c, id: Math.random()})).slice(0, 4);
  gameState.cards.tier3 = cardDefinitions.tier3.map(c => ({...c, id: Math.random()})).slice(0, 4);

  updateUI();
  addLog('ゲーム開始', 'info');
}

// UIの更新
function updateUI() {
  updatePools();
  updatePlayerElements();
  updateCards();
  updateReservedCards();
  updatePurchasedCards();
  updateScore();
  updateActionButtons();
}

// プール更新
function updatePools() {
  document.getElementById('lightPool').textContent = gameState.pools.light;
  document.getElementById('aquaPool').textContent = gameState.pools.aqua;
  document.getElementById('windPool').textContent = gameState.pools.wind;
  document.getElementById('firePool').textContent = gameState.pools.fire;
  document.getElementById('darkPool').textContent = gameState.pools.dark;
}

// プレイヤーエレメント更新
function updatePlayerElements() {
  document.getElementById('playerLight').textContent = gameState.player.light;
  document.getElementById('playerAqua').textContent = gameState.player.aqua;
  document.getElementById('playerWind').textContent = gameState.player.wind;
  document.getElementById('playerFire').textContent = gameState.player.fire;
  document.getElementById('playerDark').textContent = gameState.player.dark;
  document.getElementById('playerAether').textContent = gameState.player.aether;

  document.getElementById('generatedLight').textContent = gameState.generatedElements.light;
  document.getElementById('generatedAqua').textContent = gameState.generatedElements.aqua;
  document.getElementById('generatedWind').textContent = gameState.generatedElements.wind;
  document.getElementById('generatedFire').textContent = gameState.generatedElements.fire;
  document.getElementById('generatedDark').textContent = gameState.generatedElements.dark;
}

// スコア更新
function updateScore() {
  const percentage = (gameState.player.score / 15) * 100;
  document.getElementById('currentScore').textContent = gameState.player.score;
  document.getElementById('scoreProgress').style.width = Math.min(percentage, 100) + '%';

  const statusBtn = document.getElementById('gameStatus');
  if (gameState.gameOver) {
      statusBtn.textContent = 'ゲーム終了 - 勝利！';
      statusBtn.classList.add('victory');
  } else {
      statusBtn.textContent = 'ゲーム進行中...';
      statusBtn.classList.remove('victory');
  }
}

// カード更新
function updateCards() {
  renderCardTier('tier1');
  renderCardTier('tier2');
  renderCardTier('tier3');
}

function renderCardTier(tier) {
  const container = document.getElementById(`${tier}Cards`);
  container.innerHTML = '';

  gameState.cards[tier].forEach(card => {
      const cardEl = createCardElement(card, tier);
      container.appendChild(cardEl);
  });
}

function createCardElement(card, tier) {
  const cardEl = document.createElement('div');
  cardEl.className = 'magic-card';

  const elementMap = {
      light: '🕯️',
      aqua: '💧',
      wind: '🌪️',
      fire: '🔥',
      dark: '⚫',
      aether: '⭐'
  };

  const costHTML = Object.entries(card.cost)
      .map(([type, count]) => `<div class="cost-item">${Array(count).fill(elementMap[type]).join('')}</div>`)
      .join('');

  const canPurchase = canBuyCard(card);
  const canReserve = gameState.reservedCards.length < 2;

  cardEl.innerHTML = `
      <div class="card-header">
          <div class="card-cost">${costHTML}</div>
          <div class="card-points">${card.points}</div>
      </div>
      <div class="card-bonus">ボーナス: ${elementMap[card.bonus]}</div>
      <div class="card-buttons">
          <button class="card-btn purchase-btn" ${!canPurchase ? 'disabled' : ''}>購入</button>
          <button class="card-btn reserve-btn" ${!canReserve ? 'disabled' : ''}>予約</button>
      </div>
  `;

  const purchaseBtn = cardEl.querySelector('.purchase-btn');
  const reserveBtn = cardEl.querySelector('.reserve-btn');

  purchaseBtn.addEventListener('click', () => buyCard(card, tier));
  reserveBtn.addEventListener('click', () => reserveCard(card, tier));

  return cardEl;
}

// カード購入判定
function canBuyCard(card) {
  let needed = { ...card.cost };
  let available = { ...gameState.player };
  available.aether = 0; // エーテルは別枠

  // ボーナスで割引
  gameState.purchasedCards.forEach(c => {
      if (available[c.bonus] > 0) {
          available[c.bonus]--;
      }
  });

  // コスト計算
  for (const [type, count] of Object.entries(needed)) {
      if (!available[type] || available[type] < count) {
          const shortfall = count - (available[type] || 0);
          if (gameState.player.aether < shortfall) {
              return false;
          }
          available.aether -= shortfall;
      } else {
          available[type] -= count;
      }
  }

  return true;
}

// カード購入
function buyCard(card, tier) {
  if (!canBuyCard(card)) {
      addLog('エレメント不足で購入できません', 'info');
      return;
  }

  // エレメント消費
  let needed = { ...card.cost };
  for (const [type, count] of Object.entries(needed)) {
      let consume = Math.min(gameState.player[type] - gameState.generatedElements[type], count);
      gameState.player[type] -= consume;
      const remaining = count - consume;
      if (remaining > 0 && gameState.player.aether >= remaining) {
          gameState.player.aether -= remaining;
      }
  }

  // ボーナス追加
  gameState.generatedElements[card.bonus]++;

  // スコア追加
  gameState.player.score += card.points;

  // カード追加
  gameState.purchasedCards.push(card);

  // カード削除と補充
  gameState.cards[tier] = gameState.cards[tier].filter(c => c.id !== card.id);
  supplementCard(tier);

  // ゲーム終了判定
  if (gameState.player.score >= 15) {
      gameState.gameOver = true;
  }

  addLog(`カード購入: ポイント +${card.points}`);
  updateUI();
}

// カード予約
function reserveCard(card, tier) {
  if (gameState.reservedCards.length >= 2) {
      addLog('予約できるカードは最大2枚です', 'info');
      return;
  }

  gameState.reservedCards.push({ ...card, tier });
  gameState.player.aether++;

  // カード削除と補充
  gameState.cards[tier] = gameState.cards[tier].filter(c => c.id !== card.id);
  supplementCard(tier);

  addLog('カード予約: エーテル +1');
  updateUI();
}

// カード補充
function supplementCard(tier) {
  const pool = cardDefinitions[tier];
  const newCard = pool[Math.floor(Math.random() * pool.length)];
  gameState.cards[tier].push({ ...newCard, id: Math.random() });
}

// 予約カード更新
function updateReservedCards() {
  const container = document.getElementById('reservedCards');
  container.innerHTML = '';

  if (gameState.reservedCards.length === 0) {
      container.innerHTML = '<div class="no-reserved">予約カードなし</div>';
      return;
  }

  gameState.reservedCards.forEach((card, index) => {
      const cardEl = createReservedCardElement(card, index);
      container.appendChild(cardEl);
  });
}

function createReservedCardElement(card, index) {
  const cardEl = document.createElement('div');
  cardEl.className = 'magic-card';

  const elementMap = {
      light: '🕯️',
      aqua: '💧',
      wind: '🌪️',
      fire: '🔥',
      dark: '⚫',
      aether: '⭐'
  };

  const costHTML = Object.entries(card.cost)
      .map(([type, count]) => `<div class="cost-item">${Array(count).fill(elementMap[type]).join('')}</div>`)
      .join('');

  const canPurchase = canBuyCard(card);

  cardEl.innerHTML = `
      <div class="card-header">
          <div class="card-cost">${costHTML}</div>
          <div class="card-points">${card.points}</div>
      </div>
      <div class="card-bonus">ボーナス: ${elementMap[card.bonus]}</div>
      <button class="card-btn purchase-btn" style="width: 100%;" ${!canPurchase ? 'disabled' : ''}>購入</button>
  `;

  const purchaseBtn = cardEl.querySelector('.purchase-btn');
  purchaseBtn.addEventListener('click', () => {
      buyCard(card, card.tier);
      gameState.reservedCards.splice(index, 1);
      updateUI();
  });

  return cardEl;
}

// 購入カード更新
function updatePurchasedCards() {
  const container = document.getElementById('purchasedCards');
  container.innerHTML = '';

  if (gameState.purchasedCards.length === 0) {
      container.innerHTML = '<div class="no-purchased">購入済みカードなし</div>';
      return;
  }

  gameState.purchasedCards.forEach(card => {
      const cardEl = createPurchasedCardElement(card);
      container.appendChild(cardEl);
  });
}

function createPurchasedCardElement(card) {
  const cardEl = document.createElement('div');
  cardEl.className = 'magic-card';
  cardEl.style.opacity = '0.8';

  const elementMap = {
      light: '🕯️',
      aqua: '💧',
      wind: '🌪️',
      fire: '🔥',
      dark: '⚫',
      aether: '⭐'
  };

  const costHTML = Object.entries(card.cost)
      .map(([type, count]) => `<div class="cost-item">${Array(count).fill(elementMap[type]).join('')}</div>`)
      .join('');

  cardEl.innerHTML = `
      <div class="card-header">
          <div class="card-cost">${costHTML}</div>
          <div class="card-points">${card.points}</div>
      </div>
      <div class="card-bonus">ボーナス: ${elementMap[card.bonus]}</div>
  `;
  cardEl.style.pointerEvents = 'none';

  return cardEl;
}

// アクションボタン更新
function updateActionButtons() {
  const availableTypes = Object.keys(gameState.pools).filter(t => t !== 'aether' && gameState.pools[t] > 0).length;
  document.getElementById('takeDifferent').disabled = availableTypes < 3 || gameState.gameOver;

  // 4個以上のプール
  const canTakeSame = Object.values(gameState.pools).some(p => p >= 4) && !gameState.gameOver;
  document.getElementById('takeSame').disabled = !canTakeSame;
}

// 異なる3つ取得
document.getElementById('takeDifferent').addEventListener('click', () => {
  document.getElementById('differentUI').style.display = 'block';
  updateSameSelect();
});

document.getElementById('confirmDifferent').addEventListener('click', () => {
  const selected = Array.from(document.querySelectorAll('.different-checkbox:checked'))
      .map(cb => cb.value);

  if (selected.length !== 3) {
      alert('3つ選択してください');
      return;
  }

  selected.forEach(type => {
      gameState.pools[type]--;
      gameState.player[type]++;
  });

  document.getElementById('differentUI').style.display = 'none';
  document.querySelectorAll('.different-checkbox').forEach(cb => cb.checked = false);
  addLog(`異なる3つを取得: ${selected.map(t => {
      const map = { light: 'ライト', aqua: 'アクア', wind: 'ウィンド', fire: 'ファイア', dark: 'ダーク' };
      return map[t];
  }).join(', ')}`);
  updateUI();
});

document.getElementById('cancelDifferent').addEventListener('click', () => {
  document.getElementById('differentUI').style.display = 'none';
  document.querySelectorAll('.different-checkbox').forEach(cb => cb.checked = false);
});

// 同じ属性2つ取得
document.getElementById('takeSame').addEventListener('click', () => {
  document.getElementById('sameUI').style.display = 'block';
  updateSameSelect();
});

function updateSameSelect() {
  const select = document.getElementById('sameSelect');
  select.innerHTML = '<option value="">属性を選択...</option>';

  const typeMap = {
      light: 'ライト 🕯️',
      aqua: 'アクア 💧',
      wind: 'ウィンド 🌪️',
      fire: 'ファイア 🔥',
      dark: 'ダーク ⚫'
  };

  Object.entries(gameState.pools).forEach(([type, count]) => {
      if (type !== 'aether' && count >= 4) {
          const option = document.createElement('option');
          option.value = type;
          option.textContent = `${typeMap[type]} (${count}個)`;
          select.appendChild(option);
      }
  });
}

document.getElementById('confirmSame').addEventListener('click', () => {
  const selected = document.getElementById('sameSelect').value;

  if (!selected) {
      alert('属性を選択してください');
      return;
  }

  gameState.pools[selected] -= 2;
  gameState.player[selected] += 2;

  document.getElementById('sameUI').style.display = 'none';
  document.getElementById('sameSelect').value = '';

  const typeMap = { light: 'ライト', aqua: 'アクア', wind: 'ウィンド', fire: 'ファイア', dark: 'ダーク' };
  addLog(`${typeMap[selected]}を2つ取得`);
  updateUI();
});

document.getElementById('cancelSame').addEventListener('click', () => {
  document.getElementById('sameUI').style.display = 'none';
  document.getElementById('sameSelect').value = '';
});

// 自動プレイ
document.getElementById('autoPlay').addEventListener('click', () => {
  if (gameState.gameOver) return;

  const actions = [];

  // 異なる3つ取得可能
  const availableTypes = Object.keys(gameState.pools)
      .filter(t => t !== 'aether' && gameState.pools[t] > 0);
  if (availableTypes.length >= 3) {
      actions.push(() => {
          const selected = availableTypes.slice(0, 3);
          selected.forEach(type => {
              gameState.pools[type]--;
              gameState.player[type]++;
          });
          const typeMap = { light: 'ライト', aqua: 'アクア', wind: 'ウィンド', fire: 'ファイア', dark: 'ダーク' };
          addLog(`異なる3つを取得: ${selected.map(t => typeMap[t]).join(', ')}`);
      });
  }

  // 同じ属性2つ取得可能
  const sameType = Object.keys(gameState.pools).find(t => t !== 'aether' && gameState.pools[t] >= 4);
  if (sameType) {
      actions.push(() => {
          gameState.pools[sameType] -= 2;
          gameState.player[sameType] += 2;
          const typeMap = { light: 'ライト', aqua: 'アクア', wind: 'ウィンド', fire: 'ファイア', dark: 'ダーク' };
          addLog(`${typeMap[sameType]}を2つ取得`);
      });
  }

  // カード購入
  const allCards = [...gameState.cards.tier1, ...gameState.cards.tier2, ...gameState.cards.tier3];
  const buyableCards = allCards.filter(c => canBuyCard(c));
  if (buyableCards.length > 0) {
      const card = buyableCards[0];
      const tier = gameState.cards.tier1.includes(card) ? 'tier1' :
                   gameState.cards.tier2.includes(card) ? 'tier2' : 'tier3';
      actions.push(() => buyCard(card, tier));
  }

  // カード予約
  if (gameState.reservedCards.length < 2) {
      actions.push(() => {
          const card = allCards[0];
          const tier = gameState.cards.tier1.includes(card) ? 'tier1' :
                       gameState.cards.tier2.includes(card) ? 'tier2' : 'tier3';
          reserveCard(card, tier);
      });
  }

  if (actions.length > 0) {
      actions[Math.floor(Math.random() * actions.length)]();
      updateUI();
  }
});

// 新規ゲーム
document.getElementById('newGame').addEventListener('click', () => {
  if (confirm('ゲームをリセットしますか？')) {
      initGame();
  }
});

// ゲームログ
function addLog(message, type = 'success') {
  const logContainer = document.getElementById('gameLog');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;

  const timestamp = new Date().toLocaleTimeString('ja-JP');
  entry.textContent = `[${timestamp}] ${message}`;

  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

// ゲーム開始
initGame();