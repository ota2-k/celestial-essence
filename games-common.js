/**
 * games-common.js
 * 複数のゲームで使える共通ユーティリティ関数
 */

/**
 * ゲーム終了判定
 * @param {number} currentScore - 現在のスコア
 * @param {number} targetScore - 目標スコア（デフォルト15）
 * @returns {boolean} 目標スコア以上なら true
 */
function isGameEnd(currentScore, targetScore = 15) {
    return currentScore >= targetScore;
}

/**
 * ボーナスポイント計算
 * @param {number} matchCount - マッチ数（3個以上）
 * @param {number} basePoints - 基本ポイント
 * @returns {number} 合計ポイント
 */
function calculateBonus(matchCount, basePoints = 10) {
    let bonus = basePoints;
    
    // マッチ数に応じたボーナス
    if (matchCount === 4) {
        bonus += 5;
    } else if (matchCount === 5) {
        bonus += 10;
    } else if (matchCount > 5) {
        bonus += (matchCount - 3) * 2;
    }
    
    return bonus;
}

/**
 * 値の範囲チェック
 * @param {number} value - チェックする値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {boolean} 範囲内なら true
 */
function checkValidation(value, min, max) {
    return value >= min && value <= max;
}

/**
 * スコア表示フォーマット
 * @param {number} score - スコア
 * @returns {string} フォーマットされたスコア文字列
 */
function formatScore(score) {
    return score.toString().padStart(4, '0');
}

/**
 * 配列からランダムに要素を取得
 * @param {array} array - 対象配列
 * @returns {*} ランダムに選ばれた要素
 */
function getRandomFromArray(array) {
    if (array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 配列をシャッフル（Fisher-Yates）
 * @param {array} array - シャッフルする配列
 * @returns {array} シャッフル済み配列
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * ディープコピー
 * @param {*} obj - コピーするオブジェクト
 * @returns {*} コピーされたオブジェクト
 */
function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepCopy(item));
    if (obj instanceof Object) {
        const copy = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }
        return copy;
    }
}

/**
 * 遅延実行（Promise）
 * @param {number} ms - 遅延時間（ミリ秒）
 * @returns {Promise} 遅延後に解決される Promise
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * オブジェクトのマージ
 * @param {object} target - マージ対象
 * @param {object} source - マージ元
 * @returns {object} マージされたオブジェクト
 */
function mergeObjects(target, source) {
    return { ...target, ...source };
}
