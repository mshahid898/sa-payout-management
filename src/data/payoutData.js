// Pay Cycle Data Management System
// Centralized data store for payout management

// Database Tables
const members = [
  {
    id: 'member-001',
    name: 'Alejandra Gomez',
    email: 'agomez1@gmail.com',
    createdAt: '2024-01-15'
  }
]

const payoutAccounts = [
  {
    id: 'account-001',
    memberId: 'member-001',
    type: 'bank_account', // 'bank_account' or 'anyday_card'
    
    // For bank accounts:
    bankName: 'Neo',
    transit: '67890',
    institution: '003',
    accountNumber: '9876543210',
    accountNumberLast4: '6767',
    verified: true,
    
    // For Anyday cards:
    cardLast4: null,
    cardType: null,
    
    isDefault: true,
    createdAt: '2024-01-20'
  },
  {
    id: 'account-002',
    memberId: 'member-001',
    type: 'bank_account', // 'bank_account' or 'anyday_card'
    
    // For bank accounts:
    bankName: 'TD Bank',
    transit: '12345',
    institution: '004',
    accountNumber: '1234567890',
    accountNumberLast4: '7890',
    verified: true,
    
    // For Anyday cards:
    cardLast4: null,
    cardType: null,
    
    isDefault: false,
    createdAt: '2024-01-20'
  }
]

const payoutPreferences = [
  {
    id: 'pref-001',
    memberId: 'member-001',
    autoPayout: true,
    payoutType: 'scheduled', // 'scheduled' or 'instant'
    payoutAccountId: 'account-001',
    payCycleFrequency: 'weekly', // 'weekly' or 'bimonthly'
    payCycleDay: 5, // 5 = Friday for weekly, null for bimonthly
    minThreshold: 50.00,
    updatedAt: '2024-06-01'
  }
]

const wallets = [
  {
    id: 'wallet-001',
    name: 'Gusto 101',
    merchantId: 'merchant-001',
    payCycleFrequency: 'weekly',
    payCycleDay: 5, // Friday
    createdAt: '2024-01-10'
  },
  {
    id: 'wallet-002',
    name: 'Cafe ZUZU',
    merchantId: 'merchant-002',
    payCycleFrequency: 'weekly',
    payCycleDay: 3, // Wednesday
    createdAt: '2024-02-15'
  }
]

const payments = []  // Individual tips/payments processed during pay cycles

// Static Sample Data - Snapshot database values
// Realistic amounts that align with current setup but are fixed, not dynamically calculated
const STATIC_PAYOUT_AMOUNTS = [
  450.25,  // payout-001
  623.50,  // payout-002
  287.75,  // payout-003 (has cashout)
  512.00,  // payout-004
  789.30,  // payout-005
  345.60,  // payout-006 (has cashout)
  567.40,  // payout-007
  421.80,  // payout-008
  654.20,  // payout-009 (has cashout)
  398.90,  // payout-010
  723.15,  // payout-011
  456.70,  // payout-012 (has cashout)
  589.25,  // payout-013
  312.40,  // payout-014
  678.60,  // payout-015 (has cashout)
  445.85,  // payout-016
  534.20,  // payout-017
  367.90,  // payout-018 (has cashout)
  612.75,  // payout-019
  498.30,  // payout-020
  723.60,  // payout-021 (has cashout)
  389.45,  // payout-022
  556.80,  // payout-023
  442.15,  // payout-024 (has cashout)
  671.40,  // payout-025
]

// Static payment line items - predefined arrays that sum to payout amounts
const STATIC_PAYMENT_AMOUNTS = {
  // Format: [payment1, payment2, payment3, ...] - sums to payout amount
  'payout-001': [150.08, 150.08, 150.09],
  'payout-002': [311.75, 311.75],
  'payout-003': [95.92, 95.91, 95.92],
  'payout-004': [256.00, 256.00],
  'payout-005': [263.10, 263.10, 263.10],
  'payout-006': [172.80, 172.80],
  'payout-007': [189.13, 189.13, 189.14],
  'payout-008': [140.60, 140.60, 140.60],
  'payout-009': [218.07, 218.06, 218.07],
  'payout-010': [199.45, 199.45],
  'payout-011': [241.05, 241.05, 241.05],
  'payout-012': [228.35, 228.35],
  'payout-013': [196.42, 196.41, 196.42],
  'payout-014': [156.20, 156.20],
  'payout-015': [226.20, 226.20, 226.20],
  'payout-016': [148.62, 148.61, 148.62],
  'payout-017': [178.07, 178.06, 178.07],
  'payout-018': [122.63, 122.63, 122.64],
  'payout-019': [204.25, 204.25, 204.25],
  'payout-020': [166.10, 166.10, 166.10],
  'payout-021': [241.20, 241.20, 241.20],
  'payout-022': [129.82, 129.81, 129.82],
  'payout-023': [185.60, 185.60, 185.60],
  'payout-024': [147.38, 147.38, 147.39],
  'payout-025': [223.80, 223.80, 223.80],
}

// Helper function to get static payout amount
function getStaticPayoutAmount(payoutIdNum) {
  const index = payoutIdNum - 1
  if (index >= 0 && index < STATIC_PAYOUT_AMOUNTS.length) {
    return STATIC_PAYOUT_AMOUNTS[index]
  }
  // Fallback: use a deterministic but static calculation for IDs beyond our static data
  return 400.00 + (payoutIdNum % 500)
}

// Helper function to get static payment amounts
function getStaticPaymentAmounts(payoutId) {
  return STATIC_PAYMENT_AMOUNTS[payoutId] || [200.00, 200.00]
}

// Date Helper Functions
function addBusinessDays(date, days) {
  const result = new Date(date)
  let addedDays = 0
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1)
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++
    }
  }
  
  return result
}

// Consolidated function to get next occurrence of a weekday (0=Sunday, 1=Monday, ..., 6=Saturday)
// If allowSameWeek is true, returns the weekday in the same week if it hasn't passed yet
function getNextWeekday(date, targetDayOfWeek, allowSameWeek = false) {
  const result = new Date(date)
  const dayOfWeek = result.getDay()
  const daysUntilTarget = (targetDayOfWeek - dayOfWeek + 7) % 7
  
  if (allowSameWeek && daysUntilTarget === 0) {
    // If it's already that day and we allow same week, return today
    return result
  }
  
  // If it's already that day and we don't allow same week, add 7 days
  const daysToAdd = daysUntilTarget === 0 ? 7 : daysUntilTarget
  result.setDate(result.getDate() + daysToAdd)
  return result
}

function getNextBimonthlyDate(date, isFirst) {
  const result = new Date(date)
  if (isFirst) {
    result.setDate(1)
  } else {
    result.setDate(15)
  }
  
  // If weekend, move to next business day
  if (result.getDay() === 0) { // Sunday
    result.setDate(result.getDate() + 1)
  } else if (result.getDay() === 6) { // Saturday
    result.setDate(result.getDate() + 2)
  }
  
  return result
}

function calculatePayDates(frequency, payDay = 5, monthsBack = 6) {
  const payDates = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setMonth(startDate.getMonth() - monthsBack)
  
  if (frequency === 'weekly') {
    // Find the first payday from start date
    let currentDate = getNextWeekday(startDate, payDay, false)
    
    // Generate pay dates up to today
    while (currentDate <= today) {
      payDates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 7) // Next payday
    }
    
    // Always include this week's payday if it's not already in the list
    const thisWeekPayday = getNextWeekday(today, payDay, true)
    const alreadyExists = payDates.some(date => 
      Math.abs(date.getTime() - thisWeekPayday.getTime()) < 24 * 60 * 60 * 1000
    )
    if (!alreadyExists) {
      payDates.push(thisWeekPayday)
    }
  } else if (frequency === 'bimonthly') {
    let currentDate = new Date(startDate)
    
    while (currentDate <= today) {
      // Add 1st of month
      const firstOfMonth = getNextBimonthlyDate(currentDate, true)
      if (firstOfMonth <= today) {
        payDates.push(new Date(firstOfMonth))
      }
      
      // Add 15th of month
      const fifteenthOfMonth = getNextBimonthlyDate(currentDate, false)
      if (fifteenthOfMonth <= today) {
        payDates.push(new Date(fifteenthOfMonth))
      }
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1)
      currentDate.setDate(1)
    }
  }
  
  return payDates.sort((a, b) => b - a) // Most recent first
}

// Extract: Calculate pay cycle dates from payday
function calculatePayCycleDates(payDate, cycleLength) {
  const cycleStartDate = new Date(payDate)
  cycleStartDate.setDate(cycleStartDate.getDate() - cycleLength)
  const cycleEndDate = new Date(payDate)
  cycleEndDate.setDate(cycleEndDate.getDate() - 1)
  return { cycleStartDate, cycleEndDate }
}

// Extract: Assign payout status based on index
function assignPayoutStatus(index, payoutIdNum, payDate) {
  let status, eftIssuedDate, depositedDate, failureCode, failureReason, returnCode, returnReason
  
  if (index === 0) {
    // Most recent - pending
    status = 'pending'
  } else if (index === 1) {
    // Second most recent - issued (EFT sent but not deposited)
    status = 'issued'
    eftIssuedDate = new Date(payDate)
  } else if (index === 2) {
    // Third most recent - deposited
    status = 'deposited'
    eftIssuedDate = new Date(payDate)
    depositedDate = addBusinessDays(payDate, 1)
  } else if (index === 3) {
    // Fourth most recent - failed
    status = 'failed'
    eftIssuedDate = new Date(payDate)
    failureCode = 'NSF'
    failureReason = 'Insufficient funds in processing account'
  } else if (index === 4) {
    // Fifth most recent - returned
    status = 'returned'
    eftIssuedDate = new Date(payDate)
    returnCode = '914'
    returnReason = 'Incorrect payee name'
  } else {
    // Older payouts - mostly deposited
    status = 'deposited'
    eftIssuedDate = new Date(payDate)
    depositedDate = addBusinessDays(payDate, (payoutIdNum % 10) > 1 ? 1 : 2)
  }
  
  return {
    status,
    eftIssuedDate,
    depositedDate,
    failureCode,
    failureReason,
    returnCode,
    returnReason
  }
}

// Extract: Calculate cashout date within cycle bounds
function calculateCashoutDate(cycleStartDate, cycleEndDate) {
  // Cashout happens 2 days before payday (which is 1 day before cycle end)
  const cashOutDate = new Date(cycleEndDate)
  cashOutDate.setDate(cashOutDate.getDate() - 1)
  
  // Ensure cashout date is at least 2 days after cycle start
  const minCashoutDate = new Date(cycleStartDate)
  minCashoutDate.setDate(minCashoutDate.getDate() + 2)
  
  // Clamp cashout date within valid range
  if (cashOutDate < minCashoutDate) {
    return minCashoutDate
  }
  if (cashOutDate > cycleEndDate) {
    return cycleEndDate
  }
  
  return cashOutDate
}

// Extract: Assign cashout status based on counter
function assignCashoutStatus(cashoutCounter, cashoutDate) {
  let cashOutStatus = 'pending'
  let cashOutDepositedDate = null
  
  if (cashoutCounter === 0) {
    cashOutStatus = 'pending'
  } else if (cashoutCounter === 1) {
    cashOutStatus = 'requested'
  } else if (cashoutCounter === 2) {
    cashOutStatus = 'processed'
    cashOutDepositedDate = cashoutDate.toISOString().split('T')[0]
  } else if (cashoutCounter === 3) {
    cashOutStatus = 'failed'
  } else if (cashoutCounter === 4) {
    cashOutStatus = 'cancelled'
  } else {
    // Older cashouts - mostly processed
    const statusCycle = ['processed', 'processed', 'failed', 'processed', 'cancelled', 'processed']
    cashOutStatus = statusCycle[cashoutCounter % statusCycle.length]
    if (cashOutStatus === 'processed') {
      cashOutDepositedDate = cashoutDate.toISOString().split('T')[0]
    }
  }
  
  return { cashOutStatus, cashOutDepositedDate }
}

// Extract: Generate payment records for a payout
function generatePaymentRecords(payoutId, cycleStartDate, wallet) {
  const paymentAmounts = getStaticPaymentAmounts(payoutId)
  const numPayments = paymentAmounts.length
  const paymentRecords = []
  
  for (let i = 0; i < numPayments; i++) {
    const paymentDate = new Date(cycleStartDate)
    paymentDate.setDate(paymentDate.getDate() + i)
    
    const paymentId = `payment-${payoutId}-${String(i + 1).padStart(2, '0')}`
    
    paymentRecords.push({
      id: paymentId,
      payoutId: payoutId,
      date: paymentDate.toISOString().split('T')[0],
      from: { name: wallet.name, icon: '/icons/wallets.svg' },
      to: { name: 'Neo ･･6767', icon: '/icons/bank.svg' },
      notes: [
        'Dinner service tips',
        'Wine service tips',
        'Lunch service tips',
        'Brunch service tips',
        'Happy hour tips',
        'Private event tips',
        'Weekend service tips',
        'Catering event tips',
        'Outdoor seating tips',
        'Late night service tips'
      ][i] || 'Service tips',
      status: 'Scheduled',
      manager: ['Sarah Johnson', 'Mike Chen'][i % 2],
      amount: paymentAmounts[i]
    })
  }
  
  return paymentRecords
}

function generatePayoutHistory(memberId, monthsBack = 6) {
  const member = members.find(m => m.id === memberId)
  const preferences = payoutPreferences.find(p => p.memberId === memberId)
  const account = payoutAccounts.find(a => a.id === preferences?.payoutAccountId)
  
  if (!member || !preferences || !account) {
    return []
  }
  
  // Clear the global payments array to prevent duplicates when function is called multiple times
  payments.length = 0
  
  // Generate payouts for each wallet using wallet configuration
  const allPayouts = []
  
  wallets.forEach(wallet => {
    const walletFrequency = wallet.payCycleFrequency || 'weekly'
    const walletPayDay = wallet.payCycleDay || 5
    const cycleLength = walletFrequency === 'weekly' ? 7 : 14 // Default cycle length
    
    const walletPayDates = calculatePayDates(walletFrequency, walletPayDay, monthsBack)
    
    walletPayDates.forEach(payDate => {
      const payoutId = `payout-${String(allPayouts.length + 1).padStart(3, '0')}`
      allPayouts.push({
        id: payoutId,
        payDate: payDate,
        walletId: wallet.id
      })
    })
  })
  
  // Sort all payouts by date (most recent first)
  allPayouts.sort((a, b) => b.payDate - a.payDate)
  
  const payouts = []
  let cashoutCounter = 0 // Track cashouts independently for status assignment
  
  allPayouts.forEach((payoutData, index) => {
    const payoutId = payoutData.id
    const payDate = payoutData.payDate
    const currentWallet = wallets.find(w => w.id === payoutData.walletId)
    
    // Calculate pay cycle dates
    const cycleLength = currentWallet.payCycleFrequency === 'weekly' ? 7 : 14
    const { cycleStartDate, cycleEndDate } = calculatePayCycleDates(payDate, cycleLength)
    
    // Get static payout amount from snapshot database
    const payoutIdNum = parseInt(payoutId.split('-')[1])
    const positiveAmount = getStaticPayoutAmount(payoutIdNum)
    
    // Determine if this payout has cashouts
    const hasCashOut = payoutIdNum === 1 || (payoutIdNum % 3 === 0)
    const cashOutAmount = hasCashOut ? Math.round(positiveAmount * 0.3 * 100) / 100 : 0
    
    // Assign status using extracted function
    const statusInfo = assignPayoutStatus(index, payoutIdNum, payDate)
    
    // Select account based on payout date - older payouts use TD Bank
    const cutoffDate = new Date('2025-09-19')
    const selectedAccountId = payDate <= cutoffDate ? 'account-002' : preferences.payoutAccountId
    
    // Create payout record
    payouts.push({
      id: payoutId,
      memberId: memberId,
      payoutAccountId: selectedAccountId,
      walletId: currentWallet.id,
      
      amount: positiveAmount,
      payoutType: preferences.payoutType,
      
      // Dates
      payCycleStartDate: cycleStartDate.toISOString().split('T')[0],
      payCycleEndDate: cycleEndDate.toISOString().split('T')[0],
      initiatedDate: cycleStartDate.toISOString().split('T')[0],
      eftIssuedDate: statusInfo.eftIssuedDate ? statusInfo.eftIssuedDate.toISOString().split('T')[0] : null,
      depositedDate: statusInfo.depositedDate ? statusInfo.depositedDate.toISOString().split('T')[0] : null,
      
      // Status tracking
      status: statusInfo.status,
      failureCode: statusInfo.failureCode,
      failureReason: statusInfo.failureReason,
      returnCode: statusInfo.returnCode,
      returnReason: statusInfo.returnReason,
      
      createdAt: payDate.toISOString(),
      updatedAt: payDate.toISOString()
    })
    
    // Add cashout record if applicable
    if (hasCashOut && cashOutAmount > 0) {
      const cashOutDate = calculateCashoutDate(cycleStartDate, cycleEndDate)
      const { cashOutStatus, cashOutDepositedDate } = assignCashoutStatus(cashoutCounter, cashOutDate)
      
      payouts.push({
        id: `${payoutId}-cashout`,
        parentPayoutId: payoutId,
        memberId: memberId,
        payoutAccountId: selectedAccountId,
        walletId: currentWallet.id,
        
        amount: cashOutAmount,
        payoutType: 'cashout',
        
        // Dates
        payCycleStartDate: cycleStartDate.toISOString().split('T')[0],
        payCycleEndDate: cycleEndDate.toISOString().split('T')[0],
        initiatedDate: cashOutDate.toISOString().split('T')[0],
        eftIssuedDate: cashOutDate.toISOString().split('T')[0],
        depositedDate: cashOutDepositedDate,
        
        // Status tracking
        status: cashOutStatus,
        failureCode: cashOutStatus === 'failed' ? 'NSF' : null,
        failureReason: cashOutStatus === 'failed' ? 'Insufficient funding' : null,
        returnCode: null,
        returnReason: null,
        
        createdAt: cashOutDate.toISOString(),
        updatedAt: cashOutDate.toISOString()
      })
      
      cashoutCounter++
    }
    
    // Generate payment records using extracted function
    const paymentRecords = generatePaymentRecords(payoutId, cycleStartDate, currentWallet)
    payments.push(...paymentRecords)
  })
  
  // Sort all payouts by initiated date (most recent first)
  payouts.sort((a, b) => new Date(b.initiatedDate) - new Date(a.initiatedDate))
  
  return payouts
}

// Data Access Functions
export function getMember(memberId) {
  return members.find(m => m.id === memberId)
}

export function getPayoutAccount(accountId) {
  return payoutAccounts.find(a => a.id === accountId)
}

export function getPayoutPreferences(memberId) {
  return payoutPreferences.find(p => p.memberId === memberId)
}

export function getWallet(walletId) {
  return wallets.find(w => w.id === walletId)
}

export function getPayoutById(payoutId) {
  const memberId = 'member-001' // Default member for now
  const memberData = getMemberData(memberId)
  return memberData.payoutHistory.find(p => p.id === payoutId)
}

export function getPayoutHistory(memberId) {
  return generatePayoutHistory(memberId)
}

export function getMemberData(memberId) {
  const member = getMember(memberId)
  const preferences = getPayoutPreferences(memberId)
  const account = preferences ? getPayoutAccount(preferences.payoutAccountId) : null
  
  return {
    member,
    preferences,
    account,
    payoutHistory: getPayoutHistory(memberId)
  }
}

// Helper function to calculate adjusted amount for payday/EFT based on cashout status
// Returns full payout amount if cashout failed/cancelled, otherwise payout.amount - cashOutAmount
function calculateAdjustedAmount(payout, cashOutAmount, hasCashOut) {
  if (!hasCashOut) {
    return payout.amount
  }
  
  const cashoutId = `${payout.id}-cashout`
  const relatedCashout = getPayoutById(cashoutId)
  
  if (relatedCashout && (relatedCashout.status === 'failed' || relatedCashout.status === 'cancelled')) {
    // If cashout failed or was cancelled, return full amount to scheduled payout
    return payout.amount
  }
  
  // Otherwise, subtract cashout amount
  return payout.amount - cashOutAmount
}

// Timeline Generation Functions
export function generateTimelineSteps(payout) {
  const steps = []
  const payCycleStart = new Date(payout.payCycleStartDate)
  const initiatedDate = new Date(payout.initiatedDate)
  const eftIssuedDate = payout.eftIssuedDate ? new Date(payout.eftIssuedDate) : null
  const depositedDate = payout.depositedDate ? new Date(payout.depositedDate) : null
  
  // Always start with pay cycle
  steps.push({
    title: 'Pay cycle started',
    timestamp: payCycleStart,
    completed: true,
    amount: null
  })
  
  // Add cash out step if there was one (determine consistently based on payout ID)
  const payoutIdNum = parseInt(payout.id.split('-')[1])
  const hasCashOut = payoutIdNum === 1 || (payoutIdNum % 3 === 0) // First payout and every 3rd payout has cash out
  const cashOutAmount = hasCashOut ? payout.amount * 0.3 : 0 // 30% cash out
  
  if (hasCashOut) {
    // Use the actual cashout date from the cashout record, not calculate it
    const cashoutId = `${payout.id}-cashout`
    const relatedCashout = getPayoutById(cashoutId)
    
    let cashOutDate
    if (relatedCashout && relatedCashout.initiatedDate) {
      cashOutDate = new Date(relatedCashout.initiatedDate)
    } else {
      // Fallback: calculate during cycle if record not found
      cashOutDate = new Date(initiatedDate)
      cashOutDate.setDate(cashOutDate.getDate() + 4) // Mid-cycle, after payments have accumulated
    }
    
    // Check if there's a related cashout record to get its status
    let cashOutCompleted = false
    let cashOutFailed = false
    
    if (relatedCashout) {
      // Handle independent cashout status lifecycle: requested → pending → processed/failed/cancelled
      const cashoutStatus = relatedCashout.status || 'pending'
      cashOutCompleted = cashoutStatus === 'processed' || cashoutStatus === 'failed' || cashoutStatus === 'cancelled'
      cashOutFailed = cashoutStatus === 'failed' || cashoutStatus === 'cancelled'
    }
    
    steps.push({
      title: 'Cash out',
      timestamp: cashOutDate,
      completed: cashOutCompleted,
      failed: cashOutFailed,
      amount: `$${cashOutAmount.toFixed(2)}`,
      fee: '$0.50 fee'
    })
  }
  
  // Get current time for date comparisons
  const now = new Date()
  
  // Add pay cycle ended step for scheduled and EFT states
  if (payout.status === 'pending' || payout.status === 'issued' || payout.status === 'deposited' || payout.status === 'returned' || payout.status === 'failed') {
    // Calculate pay cycle ended date
    let payCycleEndDate
    if (payout.status === 'pending') {
      // For scheduled payouts, use the actual pay cycle end date from payout data
      payCycleEndDate = new Date(payout.payCycleEndDate || initiatedDate)
    } else {
      // For EFT states, cycle ended day before EFT issued
      payCycleEndDate = new Date(eftIssuedDate || initiatedDate)
      payCycleEndDate.setDate(payCycleEndDate.getDate() - 1)
    }
    
    // Check if pay cycle has actually ended
    let cycleHasEnded = true
    try {
      cycleHasEnded = payCycleEndDate.getTime() <= now.getTime()
    } catch (e) {
      cycleHasEnded = true
    }
    
    steps.push({
      title: cycleHasEnded ? 'Pay cycle ended' : 'Pay cycle ends',
      timestamp: payCycleEndDate,
      completed: cycleHasEnded,
      amount: null
    })
  }
  
  // Add payday step - only for pending status (not for EFT states)
  if (payout.status === 'pending') {
    // Calculate payday amount using helper function - handles failed/cancelled cashouts
    const paydayAmount = calculateAdjustedAmount(payout, cashOutAmount, hasCashOut)
    
    // For payday, payCycleEndDate is the day before payday, so payday = payCycleEndDate + 1
    const paydayDate = new Date(payout.payCycleEndDate)
    paydayDate.setDate(paydayDate.getDate() + 1)
    
    // Check if payday has occurred
    let paydayHasOccurred = false
    try {
      paydayHasOccurred = paydayDate.getTime() <= now.getTime()
    } catch (e) {
      paydayHasOccurred = false
    }
    
    steps.push({
      title: 'Payday',
      timestamp: null,
      completed: paydayHasOccurred,
      amount: `$${paydayAmount.toFixed(2)}`
    })
  }
  
  // Add EFT steps based on status - using original labels
  if (payout.status === 'issued' || payout.status === 'deposited' || payout.status === 'returned') {
    // Calculate EFT amount using helper function - handles failed/cancelled cashouts
    const eftAmount = calculateAdjustedAmount(payout, cashOutAmount, hasCashOut)
    
    steps.push({
      title: 'EFT issued',
      timestamp: eftIssuedDate,
      completed: true,
      amount: `$${eftAmount.toFixed(2)}`
    })
  }
  
  if (payout.status === 'deposited') {
    steps.push({
      title: 'EFT deposited',
      timestamp: depositedDate,
      completed: true,
      amount: null
    })
  } else if (payout.status === 'issued') {
    // Show EFT deposited as incomplete/pending for issued status
    steps.push({
      title: 'EFT deposited',
      timestamp: null, // No deposit date yet
      completed: false,
      amount: null
    })
  } else if (payout.status === 'failed') {
    // Calculate EFT amount using helper function - handles failed/cancelled cashouts
    const eftAmount = calculateAdjustedAmount(payout, cashOutAmount, hasCashOut)
    
    steps.push({
      title: 'EFT failed',
      timestamp: eftIssuedDate,
      completed: true,
      amount: `$${eftAmount.toFixed(2)}`
    })
  } else if (payout.status === 'returned') {
    // Calculate EFT amount using helper function - handles failed/cancelled cashouts
    const eftAmount = calculateAdjustedAmount(payout, cashOutAmount, hasCashOut)
    
    steps.push({
      title: 'EFT returned',
      timestamp: eftIssuedDate,
      completed: true,
      amount: `$${eftAmount.toFixed(2)}`
    })
  }
  
  return steps
}

// Payments Table Data Generation
export function getPaymentsByPayoutId(payoutId) {
  return payments.filter(p => p.payoutId === payoutId)
}

// Separate Cashout Timeline Generation Function
export function generateCashoutTimelineSteps(cashoutPayout) {
  if (!cashoutPayout) {
    return []
  }
  
  const steps = []
  
  let payCycleStart, initiatedDate
  try {
    payCycleStart = new Date(cashoutPayout.payCycleStartDate || new Date())
    initiatedDate = new Date(cashoutPayout.initiatedDate || new Date())
  } catch (error) {
    payCycleStart = new Date()
    initiatedDate = new Date()
  }
  
  // Always start with pay cycle
  steps.push({
    title: 'Pay cycle started',
    timestamp: payCycleStart,
    completed: true,
    amount: null
  })
  
  // Add cash out step 
  let cashOutCompleted = false
  let cashOutFailed = false
  
  const status = cashoutPayout.status || 'pending'
  // Handle independent cashout status lifecycle: requested → pending → processed/failed/cancelled
  if (status === 'processed') {
    cashOutCompleted = true
    cashOutFailed = false
  } else if (status === 'failed' || status === 'cancelled') {
    cashOutCompleted = true
    cashOutFailed = true
  } else {
    // requested, pending, or any other status
    cashOutCompleted = false
    cashOutFailed = false
  }
  
  const amount = cashoutPayout.amount || 0
  steps.push({
    title: 'Cash out',
    timestamp: initiatedDate,
    completed: cashOutCompleted,
    failed: cashOutFailed,
    amount: `$${amount.toFixed(2)}`,
    fee: '$0.50 fee'
  })
  
  return steps
}
