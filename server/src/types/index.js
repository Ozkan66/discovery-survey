// Centrale types/interfaces voor de Discovery-Survey backend (JSDoc style)

/**
 * @typedef {Object} SurveyTheme
 * @property {string} id
 * @property {string} name
 * @property {SurveySubtheme[]} subthemes
 */

/**
 * @typedef {Object} SurveySubtheme
 * @property {string} id
 * @property {string} name
 * @property {SurveyStatement[]} statements
 */

/**
 * @typedef {Object} SurveyStatement
 * @property {string} id
 * @property {string} text
 */

/**
 * @typedef {Object} SurveyResponse
 * @property {string} statementId
 * @property {number} value
 * @property {string} [comment]
 */

/**
 * @typedef {Object} ContextFormData
 * @property {string} gender
 * @property {number} age
 * @property {string} schoolType
 */
