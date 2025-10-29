/**
 * Composable for shared payout details logic
 * Used by PayoutDetails and CashoutDetails components
 */

import { computed } from 'vue'
import { getPayoutById, getMember, getPayoutAccount, getWallet } from '../data/payoutData.js'
import { getPayoutStatusIcon, getCashoutStatusIcon } from '../utils/statusUtils.js'
import { ROUTES } from '../constants/index.js'

/**
 * Composable for payout details functionality
 * @param {Object} props - Component props
 * @param {Object} router - Vue router instance
 * @returns {Object} Computed properties and methods
 */
export function usePayoutDetails(props, router) {
  // Computed properties
  const payout = computed(() => getPayoutById(props.paymentId))
  
  const member = computed(() => {
    if (!payout.value) return null
    return getMember(payout.value.memberId)
  })
  
  const payoutAccount = computed(() => {
    if (!payout.value) return null
    return getPayoutAccount(payout.value.payoutAccountId)
  })
  
  const wallet = computed(() => {
    if (!payout.value) return null
    return getWallet(payout.value.walletId)
  })
  
  const totalPayout = computed(() => {
    if (!payout.value) return '$0.00'
    return `$${payout.value.amount.toFixed(2)}`
  })
  
  const currentStatus = computed(() => {
    return payout.value?.status || ''
  })
  
  // Navigation methods
  const goBack = () => {
    router.push(ROUTES.PAYOUT_HISTORY(props.memberId))
  }
  
  // Status methods
  const getStatusIcon = () => {
    return getPayoutStatusIcon(currentStatus.value)
  }
  
  return {
    // Computed
    payout,
    member,
    payoutAccount,
    wallet,
    totalPayout,
    currentStatus,
    
    // Methods
    goBack,
    getStatusIcon
  }
}

/**
 * Composable for cashout details functionality
 * @param {Object} props - Component props
 * @param {Object} router - Vue router instance
 * @returns {Object} Computed properties and methods
 */
export function useCashoutDetails(props, router) {
  // Computed properties
  const payout = computed(() => getPayoutById(props.paymentId))
  
  const member = computed(() => {
    if (!payout.value) return null
    return getMember(payout.value.memberId)
  })
  
  const payoutAccount = computed(() => {
    if (!payout.value) return null
    return getPayoutAccount(payout.value.payoutAccountId)
  })
  
  const wallet = computed(() => {
    if (!payout.value) return null
    return getWallet(payout.value.walletId)
  })
  
  const totalPayout = computed(() => {
    if (!payout.value) return '$0.00'
    return `$${payout.value.amount.toFixed(2)}`
  })
  
  const currentStatus = computed(() => {
    return payout.value?.status || ''
  })
  
  // Navigation methods
  const goBack = () => {
    router.push(ROUTES.PAYOUT_HISTORY(props.memberId))
  }
  
  // Status methods
  const getStatusIcon = () => {
    return getCashoutStatusIcon(currentStatus.value)
  }
  
  return {
    // Computed
    payout,
    member,
    payoutAccount,
    wallet,
    totalPayout,
    currentStatus,
    
    // Methods
    goBack,
    getStatusIcon
  }
}

