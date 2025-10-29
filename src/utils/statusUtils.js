/**
 * Status utility functions
 * Centralizes status-to-icon and status-to-display-text mappings
 */

import { ICONS, PAYOUT_STATUS, CASHOUT_STATUS } from '../constants/index.js'

/**
 * Gets the display text for a payout status
 * @param {string} status - Status string
 * @returns {string} Human-readable status text
 */
export function getPayoutStatusText(status) {
  const statusMap = {
    [PAYOUT_STATUS.PENDING]: 'Scheduled',
    [PAYOUT_STATUS.ISSUED]: 'On it\'s way',
    [PAYOUT_STATUS.DEPOSITED]: 'Completed',
    [PAYOUT_STATUS.FAILED]: 'Failed',
    [PAYOUT_STATUS.RETURNED]: 'Returned'
  }
  return statusMap[status] || status
}

/**
 * Gets the display text for a cashout status
 * @param {string} status - Status string
 * @returns {string} Human-readable status text
 */
export function getCashoutStatusText(status) {
  const statusMap = {
    [CASHOUT_STATUS.REQUESTED]: 'Requested',
    [CASHOUT_STATUS.PENDING]: 'Pending',
    [CASHOUT_STATUS.PROCESSED]: 'Processed',
    [CASHOUT_STATUS.FAILED]: 'Failed',
    [CASHOUT_STATUS.CANCELLED]: 'Cancelled'
  }
  return statusMap[status] || status
}

/**
 * Gets the icon path for a payout status
 * @param {string} status - Status string
 * @returns {string} Icon path
 */
export function getPayoutStatusIcon(status) {
  if (status === PAYOUT_STATUS.DEPOSITED) {
    return ICONS.CHECK_GREEN
  }
  if (status === PAYOUT_STATUS.PENDING) {
    return ICONS.SCHEDULED
  }
  if (status === PAYOUT_STATUS.ISSUED) {
    return ICONS.PENDING
  }
  if (status === PAYOUT_STATUS.FAILED || status === PAYOUT_STATUS.RETURNED) {
    return ICONS.ERROR
  }
  return ICONS.PENDING
}

/**
 * Gets the icon path for a cashout status
 * @param {string} status - Status string
 * @returns {string} Icon path
 */
export function getCashoutStatusIcon(status) {
  const iconMap = {
    [CASHOUT_STATUS.REQUESTED]: ICONS.PENDING,
    [CASHOUT_STATUS.PENDING]: ICONS.PENDING,
    [CASHOUT_STATUS.PROCESSED]: ICONS.CHECK_GREEN,
    [CASHOUT_STATUS.FAILED]: ICONS.ERROR,
    [CASHOUT_STATUS.CANCELLED]: ICONS.ERROR
  }
  return iconMap[status] || ICONS.PENDING
}

/**
 * Gets status text based on payout type
 * @param {string} status - Status string
 * @param {string|null} payoutType - 'cashout' or null for regular payout
 * @returns {string} Human-readable status text
 */
export function getStatusText(status, payoutType = null) {
  if (payoutType === 'cashout') {
    if (status === CASHOUT_STATUS.PROCESSED) {
      return 'Deposited'
    }
    return getCashoutStatusText(status)
  }
  return getPayoutStatusText(status)
}

/**
 * Gets status icon based on payout type
 * @param {string} status - Status string
 * @param {string|null} payoutType - 'cashout' or null for regular payout
 * @returns {string} Icon path
 */
export function getStatusIcon(status, payoutType = null) {
  if (payoutType === 'cashout') {
    return getCashoutStatusIcon(status)
  }
  return getPayoutStatusIcon(status)
}

/**
 * Gets CSS class for status text styling
 * @param {string} status - Status string
 * @param {string|null} payoutType - 'cashout' or null for regular payout
 * @returns {string} CSS class name
 */
export function getStatusClass(status, payoutType = null) {
  if (payoutType === 'cashout') {
    if (status === CASHOUT_STATUS.PROCESSED) {
      return 'status-completed'
    }
    if (status === CASHOUT_STATUS.FAILED || status === CASHOUT_STATUS.CANCELLED) {
      return 'status-failed'
    }
    return 'status-pending'
  }
  
  if (status === PAYOUT_STATUS.DEPOSITED) {
    return 'status-completed'
  }
  if (status === PAYOUT_STATUS.ISSUED) {
    return 'status-pending'
  }
  if (status === PAYOUT_STATUS.PENDING) {
    return 'status-scheduled'
  }
  if (status === PAYOUT_STATUS.FAILED || status === PAYOUT_STATUS.RETURNED) {
    return 'status-failed'
  }
  return 'status-pending'
}

