// ゲーム状態
const gameState = {
    playerElements: {
        light: 0,
        aqua: 0,
        wind: 0,
        fire: 0,
        dark: 0
    },
    aether: 0,
    poolElements: {
        light: 5,
        aqua: 5,
        wind: 5,
        fire: 5,
        dark: 5,
        aether: 0
    },
    score: 0,
    purchasedCards: [],
    reservedCards: [],
    bonusElements: {
        light: 0,
        aqua: 0,
        wind: 0,
        fire: 0,
        dark: 0
    },
    maxReserved: 2,
    targetScore: 15
};

const elementIcons = {
    light: '🕯️',
    aqua: '💧',
    wind: '🌪️',
    fire: '🔥',
    dark: '⚫',
    aether: '⭐'
};

const elementNames = {
    light: 'ライト',
    aqua: 'アクア',
    wind: 'ウィンド',
    fire: 'ファイア',
    dark: 'ダーク',
    aether: 'エーテル'
};

const cardTiers = {
    basic: {
        name: '初級',
        minCost: 1,
        maxCost: 1,
        points: 1
    },
    intermediate: {
        name: '中級',
        minCost: 2,
        maxCost: 3,
        points: 3
    },
    advanced: {
        name: '上級',
        minCost: 4,
        maxCost: 5,
        points: 6
    }
};

let cards = {
    basic: [],
    intermediate: [],
    advanced: []
};

// カード生成
function generateCard(tier) {
    const tierData = cardTiers[tier];
    const cost = Math.floor(Math.random() * (tierData.maxCost - tierData.minCost + 1)) + tierData.minCost;
    const elements = ['light', 'aqua', 'wind', 'fire', 'dark'];
    const bonusElement = elements[Math.floor(Math.random() * elements.length)];
    
    const costElements = {};
    for (let i = 0; i < cost; i++) {
        const element = elements[Math.floor(Math.random() * elements.length)];
        costElements[element] = (costElements[element] || 0) + 1;
    }
    
    return {
        id: Math.random(),
        tier: tier,
        cost: costElements,
        points: tierData.points,
        bonus: bonusElement,
        title: `${tierData.name}の魔法 #${Math.floor(Math.random() * 100)}`
    };
}

// 初期カード生成
function initializeCards() {
    cards.basic = Array(4).fill(null).map(() => generateCard('basic'));
    cards.intermediate = Array(4).fill(null).map(() => generateCard('intermediate'));
    cards.advanced = Array(4).fill(null).map(() => generateCard('advanced'));
}

// カード補充
function refillCard(tier) {
    while (cards[tier].length < 4) {
        cards[tier].push(generateCard(tier));
    }
}

// UI更新
function updateUI() {
    updateElementPools();
    updatePlayerElements();
    updateScore();
    updateCards();
    updatePurchasedCards();
    updateReservedCards();
    updateBonusElements();
    updateButtonStates();
}

function updateElementPools() {
    const container = document.getElementById('elementPools');
    container.innerHTML = '';
    
    const elements = ['light', 'aqua', 'wind', 'fire', 'dark', 'aether'];
    elements.forEach(elem => {
        const pool = document.createElement('div');
        pool.className = 'element-pool';
        pool.innerHTML = `
            <div class="element-icon">${elementIcons[elem]}</div>
            <div class="element-name">${elementNames[elem]}</div>
            <div class="element-count">${gameState.poolElements[elem]}</div>
        `;
        container.appendChild(pool);
    });
}

function updatePlayerElements() {
    const container = document.getElementById('playerElements');
    container.innerHTML = '';
    
    const elements = ['light', 'aqua', 'wind', 'fire', 'dark'];
    elements.forEach(elem => {
        const item = document.createElement('div');
        item.className = 'inventory-item';
        item.innerHTML = `
            <div class="element-icon">${elementIcons[elem]}</div>
            <div class="element-count">${gameState.playerElements[elem]}</div>
        `;
        container.appendChild(item);
    });
    
    document.getElementById('aetherDisplay').textContent = gameState.aether;
}

function updateScore() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = gameState.score;
    
    const progress = (gameState.score / gameState.targetScore) * 100;
    document.getElementById('scoreProgress').style.width = Math.min(progress, 100) + '%';
}

function updateCards() {
    updateCardTier('basic', cards.basic);
    updateCardTier('intermediate', cards.intermediate);
    updateCardTier('advanced', cards.advanced);
}

function updateCardTier(tier, cardList) {
    const container = document.getElementById('tier' + tier.charAt(0).toUpperCase() + tier.slice(1));
    container.innerHTML = '';
    
    cardList.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        
        const costHtml = Object.entries(card.cost)
            .map(([elem, count]) => `<div class="cost-item"><span class="element-icon">${elementIcons[elem]}</span>${count}</div>`)
            .join('');
        
        const canPurchase = canBuyCard(card);
        const canReserve = gameState.reservedCards.length < gameState.maxReserved;
        
        cardEl.innerHTML = `
            <div class="card-header">
                <div class="card-title">${card.title}</div>
                <div class="card-points">+${card.points}pt</div>
            </div>
            <div class="card-cost">${costHtml}</div>
            <div class="card-bonus">
                <span class="element-icon">${elementIcons[card.bonus]}</span>
                ボーナス
            </div>
            <div class="card-buttons">
                <button class="btn-purchase" onclick="purchaseCard(${card.id})" ${!canPurchase ? 'disabled' : ''}>購入</button>
                <button class="btn-reserve" onclick="reserveCard(${card.id})" ${!canReserve ? 'disabled' : ''}>予約</button>
            </div>
        `;
        
        container.appendChild(cardEl);
    });
}

function updatePurchasedCards() {
    const container = document.getElementById('purchasedCards');
    container.innerHTML = '';
    
    if (gameState.purchasedCards.length === 0) {
        container.innerHTML = '<div class="reserved-empty">まだカードを習得していません</div>';
        return;
    }
    
    gameState.purchasedCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'purchased-card';
        cardEl.innerHTML = `
            <div class="element-icon">${elementIcons[card.bonus]}</div>
            <div class="card-points">+${card.points}pt</div>
        `;
        container.appendChild(cardEl);
    });
}

function updateReservedCards() {
    const container = document.getElementById('reservedCards');
    container.innerHTML = '';
    
    if (gameState.reservedCards.length === 0) {
        container.innerHTML = '<div class="reserved-empty">予約されたカードはありません</div>';
        return;
    }
    
    gameState.reservedCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'reserved-card';
        
        const costHtml = Object.entries(card.cost)
            .map(([elem, count]) => `<div class="cost-item"><span class="element-icon">${elementIcons[elem]}</span>${count}</div>`)
            .join('');
        
        const canPurchase = canBuyCard(card);
        
        cardEl.innerHTML = `
            <div class="card-header">
                <div class="card-title">${card.title}</div>
                <div class="card-points">+${card.points}pt</div>
            </div>
            <div class="card-cost">${costHtml}</div>
            <div class="card-bonus">
                <span class="element-icon">${elementIcons[card.bonus]}</span>
                ボーナス
            </div>
            <div class="card-buttons">
                <button class="btn-purchase" onclick="purchaseReservedCard(${card.id})" ${!canPurchase ? 'disabled' : ''}>購入</button>
            </div>
        `;
        
        container.appendChild(cardEl);
    });
}

function updateBonusElements() {
    const container = document.getElementById('bonusElements');
    container.innerHTML = '';
    
    const elements = ['light', 'aqua', 'wind', 'fire', 'dark'];
    let hasBonus = false;
    
    elements.forEach(elem => {
        if (gameState.bonusElements[elem] > 0) {
            hasBonus = true;
            const item = document.createElement('div');
            item.className = 'bonus-item';
            item.innerHTML = `
                <div class="element-icon">${elementIcons[elem]}</div>
                <div>${gameState.bonusElements[elem]}</div>
            `;
            container.appendChild(item);
        }
    });
    
    if (!hasBonus) {
        container.innerHTML = '<div style="color: #666; text-align: center;">ボーナスなし</div>';
    }
}

function updateButtonStates() {
    const differentBtn = document.getElementById('takeDifferentBtn');
    const availableElements = Object.values(gameState.poolElements)
        .filter((count, i) => i < 5 && count > 0).length;
    differentBtn.disabled = availableElements < 3;
}

// ゲームロジック
function takeDifferentElements() {
    const elements = ['light', 'aqua', 'wind', 'fire', 'dark']
        .filter(elem => gameState.poolElements[elem] > 0);
    
    if (elements.length < 3) {
        logAction('異なる3つのエレメントが選べません');
        return;
    }
    
    const selected = [];
    const available = [...elements];
    
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * available.length);
        const elem = available[randomIndex];
        selected.push(elem);
        available.splice(randomIndex, 1);
    }
    
    selected.forEach(elem => {
        gameState.playerElements[elem]++;
        gameState.poolElements[elem]--;
    });
    
    logAction(`異なる3つを取得: ${selected.map(e => elementNames[e]).join(', ')}`);
    updateUI();
}

function showSameElementDropdown() {
    const dropdown = document.getElementById('sameElementDropdown');
    const select = document.getElementById('sameElementSelect');
    const elements = ['light', 'aqua', 'wind', 'fire', 'dark'];
    
    select.innerHTML = '<option value="">属性を選択...</option>';
    
    elements.forEach(elem => {
        if (gameState.poolElements[elem] >= 4) {
            const option = document.createElement('option');
            option.value = elem;
            option.textContent = `${elementNames[elem]} (${gameState.poolElements[elem]}個)`;
            select.appendChild(option);
        }
    });
    
    dropdown.style.display = 'block';
}

function takeSameElements() {
    const select = document.getElementById('sameElementSelect');
    const elem = select.value;
    
    if (!elem || gameState.poolElements[elem] < 4) return;
    
    gameState.playerElements[elem] += 2;
    gameState.poolElements[elem] -= 2;
    
    select.value = '';
    document.getElementById('sameElementDropdown').style.display = 'none';
    
    logAction(`${elementNames[elem]} 2つを取得`);
    updateUI();
}

function canBuyCard(card) {
    let needed = { ...card.cost };
    const playerElems = { ...gameState.playerElements };
    const bonus = { ...gameState.bonusElements };
    let aether = gameState.aether;
    
    // ボーナスで割引
    for (let elem in needed) {
        const discount = Math.min(needed[elem], bonus[elem]);
        needed[elem] -= discount;
    }
    
    // プレイヤーのエレメントで支払い
    for (let elem in needed) {
        if (playerElems[elem] >= needed[elem]) {
            playerElems[elem] -= needed[elem];
            needed[elem] = 0;
        } else {
            needed[elem] -= playerElems[elem];
            playerElems[elem] = 0;
        }
    }
    
    // 残りをエーテルで支払い
    let totalNeeded = Object.values(needed).reduce((a, b) => a + b, 0);
    return aether >= totalNeeded;
}

function purchaseCard(cardId) {
    let card = null;
    let tier = null;
    
    for (let t in cards) {
        const found = cards[t].find(c => c.id === cardId);
        if (found) {
            card = found;
            tier = t;
            break;
        }
    }
    
    if (!card || !canBuyCard(card)) return;
    
    // エレメント消費
    let needed = { ...card.cost };
    const bonus = { ...gameState.bonusElements };
    
    // ボーナスで割引
    for (let elem in needed) {
        const discount = Math.min(needed[elem], bonus[elem]);
        needed[elem] -= discount;
    }
    
    // プレイヤーのエレメントで支払い
    for (let elem in needed) {
        const payment = Math.min(gameState.playerElements[elem], needed[elem]);
        gameState.playerElements[elem] -= payment;
        needed[elem] -= payment;
    }
    
    // 残りをエーテルで支払い
    let totalNeeded = Object.values(needed).reduce((a, b) => a + b, 0);
    gameState.aether -= totalNeeded;
    
    // カード購入
    gameState.purchasedCards.push(card);
    gameState.score += card.points;
    gameState.bonusElements[card.bonus]++;
    
    // カード削除
    cards[tier] = cards[tier].filter(c => c.id !== cardId);
    refillCard(tier);
    
    logAction(`『${card.title}』を習得 (+${card.points}pt)`);
    
    // ゲーム終了判定
    if (isGameEnd(gameState.score, gameState.targetScore)) {
        logAction(`🎉 ${gameState.targetScore}点に到達！ゲーム終了！`);
        disableAllButtons();
    }
    
    updateUI();
}

function purchaseReservedCard(cardId) {
    const cardIndex = gameState.reservedCards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const card = gameState.reservedCards[cardIndex];
    if (!canBuyCard(card)) return;
    
    // エレメント消費（上記と同じ処理）
    let needed = { ...card.cost };
    const bonus = { ...gameState.bonusElements };
    
    for (let elem in needed) {
        const discount = Math.min(needed[elem], bonus[elem]);
        needed[elem] -= discount;
    }
    
    for (let elem in needed) {
        const payment = Math.min(gameState.playerElements[elem], needed[elem]);
        gameState.playerElements[elem] -= payment;
        needed[elem] -= payment;
    }
    
    let totalNeeded = Object.values(needed).reduce((a, b) => a + b, 0);
    gameState.aether -= totalNeeded;
    
    gameState.purchasedCards.push(card);
    gameState.score += card.points;
    gameState.bonusElements[card.bonus]++;
    gameState.reservedCards.splice(cardIndex, 1);
    
    logAction(`『${card.title}』を習得 (+${card.points}pt)`);
    
    if (isGameEnd(gameState.score, gameState.targetScore)) {
        logAction(`🎉 ${gameState.targetScore}点に到達！ゲーム終了！`);
        disableAllButtons();
    }
    
    updateUI();
}

function reserveCard(cardId) {
    if (gameState.reservedCards.length >= gameState.maxReserved) {
        logAction('予約カードが満杯です');
        return;
    }
    
    let card = null;
    let tier = null;
    
    for (let t in cards) {
        const found = cards[t].find(c => c.id === cardId);
        if (found) {
            card = found;
            tier = t;
            break;
        }
    }
    
    if (!card) return;
    
    gameState.reservedCards.push(card);
    gameState.aether++;
    cards[tier] = cards[tier].filter(c => c.id !== cardId);
    refillCard(tier);
    
    logAction(`『${card.title}』を予約 (エーテル +1)`);
    updateUI();
}

function disableAllButtons() {
    document.querySelectorAll('.btn, .btn-purchase, .btn-reserve').forEach(btn => {
        btn.disabled = true;
    });
}

function autoPlay() {
    const actions = [
        () => takeDifferentElements(),
        () => {
            const elems = ['light', 'aqua', 'wind', 'fire', 'dark'].filter(e => gameState.poolElements[e] >= 4);
            if (elems.length > 0) {
                const select = document.getElementById('sameElementSelect');
                select.value = elems[Math.floor(Math.random() * elems.length)];
                takeSameElements();
            }
        },
        () => {
            const allCards = [...cards.basic, ...cards.intermediate, ...cards.advanced];
            const buyable = allCards.filter(c => canBuyCard(c));
            if (buyable.length > 0) {
                purchaseCard(buyable[Math.floor(Math.random() * buyable.length)].id);
            }
        },
        () => {
            if (gameState.reservedCards.length < gameState.maxReserved) {
                const allCards = [...cards.basic, ...cards.intermediate, ...cards.advanced];
                if (allCards.length > 0) {
                    reserveCard(allCards[Math.floor(Math.random() * allCards.length)].id);
                }
            }
        }
    ];
    
    actions[Math.floor(Math.random() * actions.length)]();
}

function newGame() {
    gameState.playerElements = { light: 0, aqua: 0, wind: 0, fire: 0, dark: 0 };
    gameState.aether = 0;
    gameState.poolElements = { light: 5, aqua: 5, wind: 5, fire: 5, dark: 5, aether: 0 };
    gameState.score = 0;
    gameState.purchasedCards = [];
    gameState.reservedCards = [];
    gameState.bonusElements = { light: 0, aqua: 0, wind: 0, fire: 0, dark: 0 };
    
    document.getElementById('gameLog').innerHTML = '';
    initializeCards();
    updateUI();
    logAction('🎮 新しいゲームを開始しました');
}

function logAction(action) {
    const logEl = document.getElementById('gameLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const time = new Date().toLocaleTimeString('ja-JP');
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-action">${action}</span>`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

// 初期化
initializeCards();
logAction('🎮 至高の存在へようこそ');
updateUI();
