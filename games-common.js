// Common Game Utilities - Reusable functions for all games

/**
 * Check if game has ended based on score
 * @param {number} currentScore - Current player score
 * @param {number} targetScore - Target score to reach (default: 15)
 * @returns {boolean} - True if game should end
 */
function isGameEnd(currentScore, targetScore = 15) {
    return currentScore >= targetScore;
  }
  
  /**
   * Calculate bonus points based on match count
   * @param {number} matchCount - Number of matches
   * @param {number} basePoints - Base points per match
   * @returns {number} - Total bonus points
   */
  function calculateBonus(matchCount, basePoints = 1) {
    return matchCount * basePoints;
  }
  
  /**
   * Validate if value is within range
   * @param {number} value - Value to check
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} - True if value is within range
   */
  function checkValidation(value, min, max) {
    return value >= min && value <= max;
  }
  
  /**
   * Format score for display
   * @param {number} score - Score to format
   * @returns {string} - Formatted score string
   */
  function formatScore(score) {
    return score.toString().padStart(2, '0');
  }
  
  /**
   * Get random element from array
   * @param {array} array - Array to select from
   * @returns {any} - Random element from array
   */
  function getRandomFromArray(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }
  
  /**
   * Deep clone an object
   * @param {object} obj - Object to clone
   * @returns {object} - Cloned object
   */
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  /**
   * Sum values in an object
   * @param {object} obj - Object with numeric values
   * @returns {number} - Sum of all values
   */
  function sumObjectValues(obj) {
    return Object.values(obj).reduce((sum, val) => sum + val, 0);
  }
  
  /**
   * Check if object has any truthy values
   * @param {object} obj - Object to check
   * @returns {boolean} - True if has any truthy values
   */
  function hasAnyValue(obj) {
    return Object.values(obj).some(val => val > 0);
  }
  