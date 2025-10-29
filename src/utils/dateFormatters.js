/**
 * Date formatting utilities
 */

/**
 * Formats a date to a readable string (e.g., "Jan 15, 2024")
 * @param {Date|string|number} timestamp - Date object, ISO string, or timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Formats a time to a readable string with timezone (e.g., "3:45 PM EST")
 * @param {Date|string|number} timestamp - Date object, ISO string, or timestamp
 * @returns {string} Formatted time string with timezone
 */
export function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const timeString = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  const timezone = date.toLocaleTimeString('en-US', { 
    timeZoneName: 'short' 
  }).split(' ').pop()
  return `${timeString} ${timezone}`
}

/**
 * Formats both date and time together
 * @param {Date|string|number} timestamp - Date object, ISO string, or timestamp
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return ''
  return `${formatDate(timestamp)}, ${formatTime(timestamp)}`
}

