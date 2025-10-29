/**
 * Application constants
 */

// Status constants
export const PAYOUT_STATUS = {
  PENDING: 'pending',
  ISSUED: 'issued',
  DEPOSITED: 'deposited',
  FAILED: 'failed',
  RETURNED: 'returned'
}

export const CASHOUT_STATUS = {
  REQUESTED: 'requested',
  PENDING: 'pending',
  PROCESSED: 'processed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

// Icon paths
export const ICONS = {
  CHECK_GREEN: '/icons/check_green.svg',
  PENDING: '/icons/pending.svg',
  ERROR: '/icons/error.svg',
  SCHEDULED: '/icons/scheduled.svg',
  CIRCLE: '/icons/circle.svg',
  MEMBER: '/icons/member.svg',
  WALLET: '/icons/wallet.svg',
  CHEVRON_LEFT: '/icons/chevron_left.svg'
}

// Route patterns
export const ROUTES = {
  PAYOUT_HISTORY: (memberId) => `/members/${memberId}/payouts`,
  PAYOUT_DETAILS: (memberId, payoutId) => `/members/${memberId}/payouts/${payoutId}`,
  CASHOUT_DETAILS: (memberId, cashoutId) => `/members/${memberId}/cashouts/${cashoutId}`
}

