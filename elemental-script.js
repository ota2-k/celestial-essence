// Celestial Essence - Game Logic

class CelestialEssenceGame {
    constructor() {
      this.reset();
    }
  
    reset() {
      // Initialize element pools
      this.elementPool = {
        light: GAME_CONFIG.initialPoolSize,
        aqua: GAME_CONFIG.initialPoolSize,
        wind: GAME_CONFIG.initialPoolSize,
        fire: GAME_CONFIG.initialPoolSize,
        dark: GAME_CONFIG.initialPoolSize
      };
  
      // Initialize player stats
      this.playerElements = {
        light: 0,
        aqua: 0,
        wind: 0,
        fire: 0,
        dark: 0
      };
  
      this.playerAether = 0;
      this.playerScore = 0;
  
      // Initialize cards
      this.purchasedCards = [];
      this.reservedCards = [];
      this.tier1Cards = deepClone(TIER_CARDS.filter(c => c.tier === 1));
      this.tier2Cards = deepClone(TIER_CARDS.filter(c => c.tier === 2));
      this.tier3Cards = deepClone(TIER_CARDS.filter(c => c.tier === 3));
  
      // Element bonuses from purchased cards
      this.elementBonuses = {
        light: 0,
        aqua: 0,
        wind: 0,
        fire: 0,
        dark: 0
      };
  
      this.selectedElements = [];
      this.gameLog = [];
      this.gameEnded = false;
  
      this.addLog('🎮 新しいゲームが開始されました！');
    }
  
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString('ja-JP');
      this.gameLog.push(`[${timestamp}] ${message}`);
    }
  
    // Take 3 different elements
    takeThreeDifferentElements(elements) {
      // Check if we have 3 different elements
      if (elements.length !== 3 || new Set(elements).size !== 3) {
        this.addLog('❌ 異なる3種類のエレメントを選んでください');
        return false;
      }
  
      // Check if available
      for (let elem of elements) {
        if (this.elementPool[elem] <= 0) {
          this.addLog(`❌ ${elem} が不足しています`);
          return false;
        }
      }
  
      // Take elements
      for (let elem of elements) {
        this.elementPool[elem]--;
        this.playerElements[elem]++;
      }
  
      this.addLog(`✨ 異なる3種類を取得: ${elements.map(e => `${ELEMENT_ICONS[e]}${e}`).join(', ')}`);
      return true;
    }
  
    // Take 2 same elements
    takeTwoSameElements(element) {
      if (this.elementPool[element] < GAME_CONFIG.minPoolToTakePair) {
        this.addLog(`❌ ${element} は${GAME_CONFIG.minPoolToTakePair}個以上必要です`);
        return false;
      }
  
      this.elementPool[element] -= 2;
      this.playerElements[element] += 2;
  
      this.addLog(`✨ 同じエレメント2個を取得: ${ELEMENT_ICONS[element]}${element}`);
      return true;
    }
  
    // Reserve a card and get aether
    reserveCard(tier, cardIndex) {
      if (this.reservedCards.length >= GAME_CONFIG.maxReservedCards) {
        this.addLog(`❌ 予約は最大${GAME_CONFIG.maxReservedCards}枚までです`);
        return false;
      }
  
      let deck;
      if (tier === 1) deck = this.tier1Cards;
      else if (tier === 2) deck = this.tier2Cards;
      else deck = this.tier3Cards;
  
      if (cardIndex >= deck.length) return false;
  
      const card = deck.splice(cardIndex, 1)[0];
      this.reservedCards.push(card);
      this.playerAether++;
  
      this.addLog(`📜 魔法カードを予約: ${card.name} (エーテル+1)`);
      return true;
    }
  
    // Purchase a card
    purchaseCard(tier, cardIndex, isReserved = false) {
      let deck;
      if (tier === 1) deck = this.tier1Cards;
      else if (tier === 2) deck = this.tier2Cards;
      else deck = this.tier3Cards;
  
      const card = deck[cardIndex];
      if (!card) return false;
  
      // Check if can afford
      if (!this.canAfford(card.cost)) {
        this.addLog(`❌ エレメントが足りません`);
        return false;
      }
  
      // Consume elements
      this.consumeElements(card.cost);
  
      // Remove from deck or reserved
      if (isReserved) {
        const reservedIndex = this.reservedCards.indexOf(card);
        if (reservedIndex > -1) {
          this.reservedCards.splice(reservedIndex, 1);
        }
      } else {
        deck.splice(cardIndex, 1);
      }
  
      // Add to purchased
      this.purchasedCards.push(card);
      this.playerScore += card.points;
      this.elementBonuses[card.bonus]++;
  
      this.addLog(`🏆 魔法カード購入: ${card.name} (ポイント+${card.points}, ${ELEMENT_ICONS[card.bonus]}ボーナス)`);
  
      // Refill deck
      if (tier === 1 && this.tier1Cards.length < 3) this.refillDeck(1);
      if (tier === 2 && this.tier2Cards.length < 3) this.refillDeck(2);
      if (tier === 3 && this.tier3Cards.length < 3) this.refillDeck(3);
  
      // Check if game ended
      if (isGameEnd(this.playerScore, GAME_CONFIG.targetScore)) {
        this.gameEnded = true;
        this.addLog(`🎉 ゲーム終了！最終スコア: ${this.playerScore}点`);
      }
  
      return true;
    }
  
    canAfford(cost) {
      // Check with bonuses and aether
      let elementsNeeded = deepClone(cost);
  
      // Apply bonuses
      for (let elem in elementsNeeded) {
        elementsNeeded[elem] = Math.max(0, elementsNeeded[elem] - this.elementBonuses[elem]);
      }
  
      // Check if we have enough
      for (let elem in elementsNeeded) {
        const available = this.playerElements[elem] + this.playerAether;
        if (available < elementsNeeded[elem]) {
          return false;
        }
      }
  
      return true;
    }
  
    consumeElements(cost) {
      let elementsToConsume = deepClone(cost);
  
      // Apply bonuses first
      for (let elem in elementsToConsume) {
        const bonus = Math.min(elementsToConsume[elem], this.elementBonuses[elem]);
        elementsToConsume[elem] -= bonus;
      }
  
      // Use aether for remaining
      let aetherNeeded = 0;
      for (let elem in elementsToConsume) {
        const available = this.playerElements[elem];
        const needed = elementsToConsume[elem];
  
        if (available >= needed) {
          this.playerElements[elem] -= needed;
        } else {
          this.playerElements[elem] = 0;
          aetherNeeded += needed - available;
        }
      }
  
      this.playerAether -= aetherNeeded;
    }
  
    refillDeck(tier) {
      // In this simplified version, we just show a message
      // In a full implementation, you'd generate or draw new cards
    }
  }
  
  const game = new CelestialEssenceGame();
  
  // UI Update Functions
  function updateUI() {
    // Update element pools
    const poolHTML = Object.entries(game.elementPool)
      .map(([elem, count]) => {
        const isDisabled = count < GAME_CONFIG.minPoolToTakePair;
        return `<div class="element-display ${isDisabled ? 'disabled' : ''}">${ELEMENT_ICONS[elem]}<span class="count">${count}</span></div>`;
      })
      .join('');
    document.getElementById('element-pool').innerHTML = poolHTML;
  
    // Update player elements
    const playerHTML = Object.entries(game.playerElements)
      .map(([elem, count]) => `<div class="element-display">${ELEMENT_ICONS[elem]}<span class="count">${count}</span></div>`)
      .join('');
    document.getElementById('player-elements').innerHTML = playerHTML;
  
    // Update aether
    document.getElementById('aether-count').textContent = game.playerAether;
  
    // Update bonuses
    const bonusHTML = Object.entries(game.elementBonuses)
      .filter(([_, count]) => count > 0)
      .map(([elem, count]) => `<div class="bonus-display">${ELEMENT_ICONS[elem]} <span class="count">+${count}</span></div>`)
      .join('');
    document.getElementById('element-bonuses').innerHTML = bonusHTML || '<span class="empty">ボーナスなし</span>';
  
    // Update purchased cards
    updateCardGrid();
  
    // Update reserved cards
    updateReservedCards();
  
    // Update score
    document.getElementById('current-score').textContent = formatScore(game.playerScore);
    const progressPercent = (game.playerScore / GAME_CONFIG.targetScore) * 100;
    document.getElementById('score-bar').style.width = Math.min(progressPercent, 100) + '%';
  
    // Update game log
    const logHTML = game.gameLog.map(log => `<div class="log-entry">${log}</div>`).join('');
    const logContainer = document.getElementById('game-log');
    logContainer.innerHTML = logHTML;
    logContainer.scrollTop = logContainer.scrollHeight;
  
    // Check game end
    if (game.gameEnded) {
      document.getElementById('game-status').innerHTML = `<div class="game-end-message">🎉 ゲーム終了！<br>最終スコア: ${game.playerScore}点</div>`;
      document.querySelectorAll('.action-button').forEach(btn => btn.disabled = true);
    }
  }
  
  function updateCardGrid() {
    const tiers = [
      { tier: 1, deck: game.tier1Cards, name: '初級' },
      { tier: 2, deck: game.tier2Cards, name: '中級' },
      { tier: 3, deck: game.tier3Cards, name: '上級' }
    ];
  
    tiers.forEach(({ tier, deck, name }) => {
      const column = document.getElementById(`tier${tier}-column`);
      const html = deck.map((card, idx) => `
        <div class="card">
          <div class="card-header">${card.name}</div>
          <div class="card-content">
            <div class="card-cost">${Object.entries(card.cost).map(([elem, count]) => `${ELEMENT_ICONS[elem]}×${count}`).join(' ')}</div>
            <div class="card-bonus">ボーナス: ${ELEMENT_ICONS[card.bonus]}</div>
            <div class="card-points">⭐ ${card.points}pt</div>
          </div>
          <div class="card-actions">
            <button class="card-btn purchase-btn" onclick="purchaseCard(${tier}, ${idx})">購入</button>
            <button class="card-btn reserve-btn" onclick="reserveCard(${tier}, ${idx})">予約</button>
          </div>
        </div>
      `).join('');
      column.innerHTML = html;
    });
  
    // Update purchased cards
    const purchasedHTML = game.purchasedCards.map(card => `
      <div class="purchased-card">
        <div class="card-name">${card.name}</div>
        <div class="card-bonus-small">${ELEMENT_ICONS[card.bonus]}</div>
      </div>
    `).join('');
    document.getElementById('purchased-cards').innerHTML = purchasedHTML || '<span class="empty">購入カードなし</span>';
  }
  
  function updateReservedCards() {
    const html = game.reservedCards.map((card, idx) => `
      <div class="card">
        <div class="card-header">📜 ${card.name}</div>
        <div class="card-content">
          <div class="card-cost">${Object.entries(card.cost).map(([elem, count]) => `${ELEMENT_ICONS[elem]}×${count}`).join(' ')}</div>
          <div class="card-bonus">ボーナス: ${ELEMENT_ICONS[card.bonus]}</div>
          <div class="card-points">⭐ ${card.points}pt</div>
        </div>
        <button class="card-btn purchase-btn" onclick="purchaseReservedCard(${idx})">購入</button>
      </div>
    `).join('');
    document.getElementById('reserved-cards').innerHTML = html || '<span class="empty">予約カードなし</span>';
  }
  
  // Action Functions
  function takeThreeDifferent() {
    const checkboxes = Array.from(document.querySelectorAll('.element-checkbox:checked'));
    if (checkboxes.length !== 3) {
      alert('異なる3種類のエレメントを選んでください');
      return;
    }
  
    const elements = checkboxes.map(cb => cb.value);
    game.takeThreeDifferentElements(elements);
    updateUI();
  }
  
  function takeTwoSame() {
    const select = document.getElementById('two-same-select');
    const element = select.value;
  
    if (!element) {
      alert('エレメントを選んでください');
      return;
    }
  
    if (game.elementPool[element] < GAME_CONFIG.minPoolToTakePair) {
      alert(`${element} は${GAME_CONFIG.minPoolToTakePair}個以上必要です`);
      return;
    }
  
    game.takeTwoSameElements(element);
    select.value = '';
    updateUI();
  }
  
  function purchaseCard(tier, cardIndex) {
    game.purchaseCard(tier, cardIndex, false);
    updateUI();
  }
  
  function purchaseReservedCard(cardIndex) {
    const card = game.reservedCards[cardIndex];
    const tierIndex = game[`tier${card.tier}Cards`].findIndex(c => c.id === card.id);
    game.purchaseCard(card.tier, tierIndex, true);
    updateUI();
  }
  
  function reserveCard(tier, cardIndex) {
    game.reserveCard(tier, cardIndex);
    updateUI();
  }
  
  function autoPlay() {
    if (game.gameEnded) {
      alert('ゲームは終了しています');
      return;
    }
  
    const action = Math.random();
  
    if (action < 0.5) {
      // Random three different
      const elements = ['light', 'aqua', 'wind', 'fire', 'dark'];
      const shuffled = elements.sort(() => Math.random() - 0.5);
      const available = shuffled.filter(e => game.elementPool[e] > 0);
  
      if (available.length >= 3) {
        game.takeThreeDifferentElements(available.slice(0, 3));
      }
    } else {
      // Random purchase
      const allCards = [
        ...game.tier1Cards.map(c => ({ tier: 1, card: c })),
        ...game.tier2Cards.map(c => ({ tier: 2, card: c })),
        ...game.tier3Cards.map(c => ({ tier: 3, card: c }))
      ];
  
      if (allCards.length > 0) {
        const { tier, card } = getRandomFromArray(allCards);
        const idx = game[`tier${tier}Cards`].indexOf(card);
        game.purchaseCard(tier, idx, false);
      }
    }
  
    updateUI();
  }
  
  function newGame() {
    game.reset();
    document.getElementById('two-same-select').value = '';
    updateUI();
  }
  
  // Initialize game
  window.addEventListener('load', () => {
    updateUI();
  });
  