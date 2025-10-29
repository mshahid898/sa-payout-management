<template>
  <div class="content-area">
    <div class="content-wrapper">
      <div class="back-header">
        <a href="#" class="back-link" @click.prevent="goBack">
          <img src="/icons/chevron_left.svg" alt="Back" class="chevron-icon" />
          <span>Payouts</span>
        </a>
      </div>
      
      <!-- Page Header -->
      <PageHeader 
        variant="detailed"
        :title="totalPayout"
        :details="headerDetails"
      />
      
      <div class="cards-container">
        
        <el-card class="status-card">
          <div class="card-header">
            <h2>Timeline</h2>
          </div>
          <div class="card-content">
            <Timeline
              :steps="dynamicTimeline"
              :current-status="currentStatus"
              :member="member"
              :payout-account="payoutAccount"
              :error-data="payout"
              @error-action="handleErrorAction"
            />
          </div>
        </el-card>
        
        <el-card class="payments-card">
          <div class="card-header">
            <h2>Payouts included</h2>
          </div>
          <div class="card-content">
            <el-table
              :data="paymentsData"
              class="payments-table"
              style="width: 100%"
            >
              <el-table-column label="Wallet" width="fit-content">
                <template #default="{ row }">
                  <span class="wallet-label">{{ row.from.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="manager" label="Manager" width="fit-content" />
              <el-table-column prop="notes" label="Notes" width="auto" show-overflow-tooltip />
              <el-table-column label="Processed" width="280">
                <template #default="{ row }">
                  <div class="date-cell">
                    <div class="date-main">{{ formatDate(new Date(row.date + 'T00:00:00Z')) }}, <span class="date-time">{{ formatTime(new Date(row.date + 'T00:00:00Z')) }}</span></div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Amount" width="auto" align="right">
                <template #default="{ row }">
                  <span class="amount-cell">${{ row.amount.toFixed(2) }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <div class="footer-total">
                <span class="footer-label">Total amount</span>
                <span class="footer-amount">{{ formattedTotalAmount }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Floating Action Button -->
    <div class="fab-container">
      <el-button 
        type="primary" 
        class="fab-main"
        @click="toggleFabMenu"
        :class="{ 'fab-open': fabMenuOpen }"
      >
        <img 
          src="/icons/chevron_left.svg" 
          alt="Toggle" 
          class="fab-icon"
          :class="{ 'fab-icon-rotated': fabMenuOpen }"
        />
      </el-button>
      
      <!-- FAB Menu -->
      <div class="fab-menu" :class="{ 'fab-menu-open': fabMenuOpen }">
        <div 
          v-for="state in testStates" 
          :key="state.id"
          class="fab-menu-item"
          @click="switchToState(state.id)"
          :class="{ 'fab-menu-item-active': currentStateId === state.id }"
        >
          <span class="fab-menu-text">{{ state.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, formatTime } from '../utils/dateFormatters.js'
import { getPayoutStatusIcon, getPayoutStatusText } from '../utils/statusUtils.js'
import { ROUTES, ICONS } from '../constants/index.js'
import ErrorAlert from './alerts/ErrorAlert.vue'
import Timeline from './Timeline.vue'
import PageHeader from './PageHeader.vue'

export default {
  name: 'TestStates',
  components: {
    ErrorAlert,
    Timeline,
    PageHeader
  },
  
  data() {
    return {
      fabMenuOpen: false,
      currentStateId: 'pending',
      
      // Test states configuration
      testStates: [
        {
          id: 'pending',
          name: 'Pending',
          icon: '/icons/scheduled.svg',
          status: 'pending'
        },
        {
          id: 'cashout_pending',
          name: 'Cash Out Pending',
          icon: '/icons/wallet.svg',
          status: 'cashout_pending'
        },
        {
          id: 'cashout_processed',
          name: 'Cash Out Processed',
          icon: '/icons/check_green.svg',
          status: 'cashout_processed'
        },
        {
          id: 'cashout_failed',
          name: 'Cash Out Failed',
          icon: '/icons/error.svg',
          status: 'cashout_failed'
        },
        {
          id: 'issued',
          name: 'EFT Issued',
          icon: '/icons/pending.svg',
          status: 'issued'
        },
        {
          id: 'deposited',
          name: 'EFT Deposited',
          icon: '/icons/check_green.svg',
          status: 'deposited'
        },
        {
          id: 'failed',
          name: 'EFT Failed',
          icon: '/icons/error.svg',
          status: 'failed'
        },
        {
          id: 'returned',
          name: 'EFT Returned',
          icon: '/icons/error.svg',
          status: 'returned'
        }
      ],
      
      // Static member data
      member: {
        name: 'Alejandra Gomez',
        email: 'alejandra.gomez@email.com'
      },
      
      // Static wallet data
      wallet: {
        name: 'Chop Steakhouse Toronto'
      },
      
      // Static payout account data
      payoutAccount: {
        bankName: 'Scotiabank',
        transit: '67890',
        institution: '003',
        accountNumber: '9876543210',
        accountNumberLast4: '6767'
      }
    }
  },

  computed: {
    payout() {
      return this.generatePayoutData()
    },
    
    totalPayout() {
      return `$${this.payout.amount.toFixed(2)}`
    },
    
    dynamicTimeline() {
      return this.generateTimelineSteps()
    },
    
    paymentsData() {
      return this.generatePaymentsTableData()
    },
    
    currentStatus() {
      return this.payout.status
    },
    
    statusConfig() {
      return {
        'pending': {
          displayText: 'Scheduled',
          color: '#6B7280',
          cssClass: 'status-scheduled'
        },
        'cashout_pending': {
          displayText: 'Scheduled',
          color: '#6B7280',
          cssClass: 'status-scheduled'
        },
        'cashout_processed': {
          displayText: 'Scheduled',
          color: '#6B7280',
          cssClass: 'status-scheduled'
        },
        'cashout_failed': {
          displayText: 'Scheduled',
          color: '#6B7280',
          cssClass: 'status-scheduled'
        },
        'issued': {
          displayText: 'On it\'s way',
          color: '#2563EB',
          cssClass: 'status-pending'
        },
        'deposited': {
          displayText: 'Completed',
          color: '#16A34A',
          cssClass: 'status-completed'
        },
        'failed': {
          displayText: 'Failed',
          color: '#DC2626',
          cssClass: 'status-failed'
        },
        'returned': {
          displayText: 'Returned',
          color: '#DC2626',
          cssClass: 'status-returned'
        }
      }
    },
    
    currentStatusConfig() {
      return this.statusConfig[this.currentStatus] || this.statusConfig['pending']
    },
    
    statusDisplayText() {
      return this.currentStatusConfig.displayText
    },
    
    statusCssClass() {
      return this.currentStatusConfig.cssClass
    },
    
    formattedTotalAmount() {
      return `$${this.payout.amount.toFixed(2)}`
    },
    
    headerDetails() {
      return [
        {
          icon: ICONS.MEMBER,
          label: 'Member',
          text: this.member.name
        },
        {
          icon: ICONS.WALLET,
          label: 'Wallet',
          text: this.wallet.name
        },
        {
          icon: this.getStatusIcon(),
          label: 'Status',
          text: this.statusDisplayText
        }
      ]
    }
  },

  methods: {
    // Navigation
    goBack() {
      this.$router.push(ROUTES.PAYOUT_HISTORY('member-001'))
    },
    
    // Event Handlers
    handleErrorAction(eventData) {
      if (eventData.type === 'returned') {
        this.handleReturnAction(eventData)
      } else if (eventData.type === 'failed') {
        this.handleFailedAction(eventData)
      }
    },
    
    handleReturnAction(eventData) {
      // TODO: Handle update name action
    },
    
    handleFailedAction(eventData) {
      // TODO: Handle retry action
    },
    
    // Formatting
    formatDate,
    formatTime,
    
    // Status
    getStatusIcon() {
      return getPayoutStatusIcon(this.currentStatus)
    },
    
    // FAB Methods
    toggleFabMenu() {
      this.fabMenuOpen = !this.fabMenuOpen
    },
    
    switchToState(stateId) {
      this.currentStateId = stateId
    },
    
    // Data Generation
    generatePayoutData() {
      const today = new Date()
      const payDate = new Date(today)
      payDate.setDate(payDate.getDate() - 1)
      
      const amount = 323.45
      const cashOutAmount = 97.03
      const paydayAmount = amount - cashOutAmount
      
      return {
        id: `test-${this.currentStateId}-001`,
        amount: amount,
        status: this.currentStateId,
        payCycleStartDate: new Date(payDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payCycleEndDate: new Date(payDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        initiatedDate: payDate.toISOString().split('T')[0],
        eftIssuedDate: this.currentStateId === 'issued' || this.currentStateId === 'deposited' || this.currentStateId === 'failed' || this.currentStateId === 'returned' ? payDate.toISOString().split('T')[0] : null,
        depositedDate: this.currentStateId === 'deposited' ? new Date(payDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        failureCode: this.currentStateId === 'failed' ? 'NSF' : null,
        failureReason: this.currentStateId === 'failed' ? 'Insufficient funds in processing account' : null,
        returnCode: this.currentStateId === 'returned' ? '914' : null,
        returnReason: this.currentStateId === 'returned' ? 'Incorrect payee name' : null,
        hasCashOut: this.currentStateId === 'cashout_pending' || this.currentStateId === 'cashout_processed' || this.currentStateId === 'cashout_failed' || this.currentStateId === 'issued' || this.currentStateId === 'deposited' || this.currentStateId === 'failed' || this.currentStateId === 'returned'
      }
    },

    generateTimelineSteps() {
      const payout = this.payout
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
      
      // Add cash out step if there was one
      if (payout.hasCashOut) {
        const cashOutDate = new Date(initiatedDate)
        cashOutDate.setDate(cashOutDate.getDate() - 1)
        
        // Determine if cashout failed
        const isCashOutFailed = payout.status === 'cashout_failed'
        
        steps.push({
          title: 'Cash out',
          timestamp: cashOutDate,
          completed: payout.status !== 'pending' && payout.status !== 'cashout_pending' && !isCashOutFailed,
          failed: isCashOutFailed,
          amount: '$97.03',
          fee: '$0.50 fee'
        })
      }
      
      // Add payday step only for cashout states (pay period still active)
      if (payout.status === 'pending' || payout.status === 'cashout_pending' || payout.status === 'cashout_processed' || payout.status === 'cashout_failed') {
        // If cashout failed, add the amount back to payday
        const cashOutAmount = payout.hasCashOut ? 97.03 : 0
        const paydayAmount = payout.status === 'cashout_failed' 
          ? payout.amount // Full amount if cashout failed
          : payout.amount - cashOutAmount // Subtract cashout if successful
        
        steps.push({
          title: 'Payday',
          timestamp: initiatedDate,
          completed: false, // Payday is always pending for cashout states
          amount: `$${paydayAmount.toFixed(2)}`
        })
      }
      
      // Add EFT steps based on status
      if (payout.status === 'issued' || payout.status === 'deposited' || payout.status === 'returned') {
        const eftAmount = payout.amount - (payout.hasCashOut ? 97.03 : 0)
        
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
        steps.push({
          title: 'EFT deposited',
          timestamp: null,
          completed: false,
          amount: null
        })
      } else if (payout.status === 'failed') {
        const eftAmount = payout.amount - (payout.hasCashOut ? 97.03 : 0)
        
        steps.push({
          title: 'EFT failed',
          timestamp: eftIssuedDate,
          completed: true,
          amount: `$${eftAmount.toFixed(2)}`
        })
      } else if (payout.status === 'returned') {
        const eftAmount = payout.amount - (payout.hasCashOut ? 97.03 : 0)
        
        steps.push({
          title: 'EFT returned',
          timestamp: eftIssuedDate,
          completed: true,
          amount: `$${eftAmount.toFixed(2)}`
        })
      }
      
      return steps
    },

    generatePaymentsTableData() {
      // Static payments data - these are the actual tips/earnings that don't change between states
      const payments = [
        {
          date: '2024-10-16',
          from: { name: this.wallet.name, icon: '/icons/wallets.svg' },
          to: { name: `${this.payoutAccount.bankName} ..${this.payoutAccount.accountNumberLast4}`, icon: '/icons/bank.svg' },
          notes: 'Tips - Dinner rush',
          status: 'Scheduled',
          manager: 'Sarah Johnson',
          amount: 125.50
        },
        {
          date: '2024-10-17',
          from: { name: this.wallet.name, icon: '/icons/wallets.svg' },
          to: { name: `${this.payoutAccount.bankName} ..${this.payoutAccount.accountNumberLast4}`, icon: '/icons/bank.svg' },
          notes: 'Tips - Wine service',
          status: 'Scheduled',
          manager: 'Mike Chen',
          amount: 98.75
        },
        {
          date: '2024-10-18',
          from: { name: this.wallet.name, icon: '/icons/wallets.svg' },
          to: { name: `${this.payoutAccount.bankName} ..${this.payoutAccount.accountNumberLast4}`, icon: '/icons/bank.svg' },
          notes: 'Tips - Lunch special',
          status: 'Scheduled',
          manager: 'Emma Wilson',
          amount: 99.20
        }
      ]
      
      return payments
    }
  },

  mounted() {
    // Close FAB menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.fab-container')) {
        this.fabMenuOpen = false
      }
    })
  }
}
</script>

<style scoped>
.content-area {
  flex: 1;
  background: #F8F8F8;
  overflow-y: auto;
}

.content-wrapper {
  padding: 48px;
  max-width: 1250px;
  margin: 0 auto;
}

.back-header {
  margin-bottom: 24px;
  margin-left: -6px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #76767F;
  text-decoration: none;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #000000;
}

.back-link:hover .chevron-icon {
  filter: brightness(0);
}

.chevron-icon {
  width: 24px;
  height: 24px;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-card,
.payments-card {
  background: white !important;
  border-radius: 10px !important;
  border: 1px solid rgba(39, 39, 42, 0.10) !important;
  box-shadow: 0 1px 2px 0 rgba(39, 39, 42, 0.01), 0 4px 12px 0 rgba(39, 39, 42, 0.06) !important;
  overflow: hidden;
}

.status-card :deep(.el-card__body),
.payments-card :deep(.el-card__body) {
  padding: 0 !important;
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid #EDEDEE;
}

.card-header h2 {
  margin: 0;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.18px;
  font-weight: 600;
  color: #000000;
}


.card-content {
  padding: 24px 48px 24px 24px;
}

.payments-card .card-content {
  padding: 0;
}


/* Override Element Plus default line-height from 23px to 20px */
:deep(.el-table .cell) {
  line-height: 20px;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
  line-height: 20px;
}

.description-divider {
  height: 1px;
  background-color: #EDEDEE;
  margin: 0;
  width: 100%;
}

.details-card-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(39, 39, 42, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.header-subtitle {
  font-size: 14px;
  color: #6B7280;
  margin-top: 2px;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  background: #DCFCE7;
  border-radius: 6px;
}

.badge-icon {
  width: 12px;
  height: 12px;
}

.badge-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #12873D;
  letter-spacing: 0.01px;
}

.account-with-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-badge {
  display: flex;
  align-items: center;
  padding: 2px 8px;
  background: #DCFCE7;
  border-radius: 6px;
}

.account-badge-inline {
  display: inline-block;
  padding: 2px 8px;
  background: #DCFCE7;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #12873D;
  letter-spacing: 0.01px;
  margin-left: 8px;
}

.header-icon {
  width: 40px;
  height: 40px;
}

.header-icon.avatar-icon {
  background-color: rgba(14, 118, 253, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-size: 16px;
  font-weight: 600;
  color: #0E76FD;
  line-height: 1;
}

.header-content {
  display: flex;
  flex-direction: column;
}

.header-name {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  font-weight: 500;
  color: #76767F;
}

.header-amount {
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.18px;
  font-weight: 600;
  color: #000000;
}

.header-amount.amount-grey {
  color: #76767F;
}


.status-card :deep(.el-timeline-item) {
  padding-bottom: 24px;
}

.status-card :deep(.el-timeline-item__wrapper) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  padding-left: 36px;
}

.status-card :deep(.el-timeline-item__content) {
  padding-top: 2px;
}

.status-card :deep(.el-timeline-item:last-child) {
  padding-bottom: 0;
  margin-bottom: 0;
}

.status-card :deep(.el-timeline) {
  padding-bottom: 0;
  margin-bottom: 0;
}


.payments-table {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  border-collapse: separate;
  border-spacing: 0 24px;
}

.payments-table :deep(.el-table__header),
.payments-table :deep(.el-table__body) {
  font-size: 14px !important;
  line-height: 20px !important;
  letter-spacing: -0.09px !important;
}

.payments-table :deep(.el-table__header th) {
  font-size: 12px !important;
  line-height: 16px !important;
  letter-spacing: -0.08px !important;
  font-weight: 500 !important;
  color: #62626A !important;
  background: #FCFCFC !important;
  border-bottom: 1px solid #EDEDEE !important;
  padding: 8px 0 8px 12px !important;
  height: 44px;
}

.payments-table :deep(.el-table__header th:last-child) {
  padding-right: 12px !important;
}

.payments-table :deep(.el-table__body td) {
  font-size: 14px !important;
  line-height: 20px !important;
  letter-spacing: -0.09px !important;
  font-weight: 400 !important;
  color: #000000 !important;
  border-bottom: 1px solid #EDEDEE !important;
  padding: 16px 0 16px 12px !important;
}

.payments-table :deep(.el-table__body tr) {
  height: 56px;
}

.payments-table :deep(.el-table__body .el-table_1_column_3),
.payments-table :deep(.el-table__body .el-table_1_column_4) {
  color: #000000 !important;
}

.payments-table :deep(.el-table__body td:nth-child(3)),
.payments-table :deep(.el-table__body td:nth-child(4)) {
  color: #000000 !important;
}

.payments-table :deep(.el-table__body tr:hover > td) {
  background-color: transparent !important;
}

.table-footer {
  padding: 16px 24px;
  width: 100%;
  background: #FFFFFF;
}

.footer-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.footer-label {
  font-size: 14px;
  font-weight: 400;
  color: #62626A;
}

.footer-amount {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.wallet-label {
  font-weight: 500;
  text-align: left;
}

.cell-with-icon {
  display: flex;
  align-items: center;
}

.cell-with-icon img.icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.date-cell {
  width: 100%;
}

.date-main {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  font-weight: 400;
  color: #000000;
  width: 100%;
}

.date-time {
  color: #6B7280;
}

.amount-cell {
  text-align: left;
  display: block;
  font-weight: 600;
  padding-right: 12px;
}


.status-pending {
  color: #2563EB;
}

.status-scheduled {
  color: #6B7280;
}

.status-completed {
  color: #16A34A;
}

.status-failed {
  color: #DC2626;
}

.status-returned {
  color: #DC2626;
}

.status-cashout {
  color: #D97706;
}


/* Floating Action Button Styles */
.fab-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.fab-main {
  width: 56px;
  height: 56px;
  border-radius: 50% !important;
  background: #0E76FD !important;
  border: none !important;
  box-shadow: 0 4px 12px 0 rgba(14, 118, 253, 0.3) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fab-main:hover {
  background: #0B5FD6 !important;
  box-shadow: 0 6px 16px 0 rgba(14, 118, 253, 0.4) !important;
}

.fab-main.fab-open {
  background: #DC2626 !important;
  box-shadow: 0 4px 12px 0 rgba(220, 38, 38, 0.3) !important;
}

.fab-main.fab-open:hover {
  background: #B91C1C !important;
  box-shadow: 0 6px 16px 0 rgba(220, 38, 38, 0.4) !important;
}

.fab-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.fab-icon-rotated {
  transform: rotate(180deg);
}

.fab-menu {
  position: absolute;
  bottom: 72px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px 0 rgba(39, 39, 42, 0.15);
  border: 1px solid rgba(39, 39, 42, 0.08);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
  min-width: 200px;
}

.fab-menu-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.fab-menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(39, 39, 42, 0.08);
}

.fab-menu-item:last-child {
  border-bottom: none;
}

.fab-menu-item:hover {
  background-color: #F8F8F8;
}

.fab-menu-item-active {
  background-color: #EFF6FF;
}

.fab-menu-item-active:hover {
  background-color: #DBEAFE;
}


.fab-menu-text {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  font-weight: 500;
  color: #000000;
}

.fab-menu-item-active .fab-menu-text {
  color: #2563EB;
  font-weight: 600;
}
</style>