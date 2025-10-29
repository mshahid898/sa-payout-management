<template>
  <div class="content-area">
    <div class="content-wrapper">
      <div class="back-header">
        <a href="#" class="back-link" @click.prevent="goBack">
          <img src="/icons/chevron_left.svg" alt="Back" class="chevron-icon" />
          <span>{{ backButtonText }}</span>
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
              <el-table-column prop="manager" label="Manager" width="fit-content">
                <template #default="{ row }">
                  <span class="secondary-text">{{ row.manager }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="notes" label="Notes" width="auto" show-overflow-tooltip>
                <template #default="{ row }">
                  <span class="secondary-text">{{ row.notes }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Processed" width="280">
                <template #default="{ row }">
                  <div class="date-cell">
                    <div class="date-main secondary-text">{{ formatDate(new Date(row.date + 'T00:00:00Z')) }}, <span class="date-time">{{ formatTime(new Date(row.date + 'T00:00:00Z')) }}</span></div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Amount" width="124" align="right">
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
    
  </div>
</template>

<script>
/*
 * BACKEND INTEGRATION GUIDE:
 * 
 * Props to pass from parent component:
 * - paymentStatus: Current status string ('pending', 'cashout_pending', etc.)
 * - timelineData: Array of timeline steps with title, timestamp, completed, amount
 * - paymentId: Unique ID for this payout
 * - totalAmount: Formatted total amount string (e.g. "$845.68")
 * - memberName: Member name for display
 * - walletName: Wallet name for display
 * - paymentsTableData: Array of payment line items for table
 * 
 * Events to listen for:
 * - @status-changed: Emitted when user changes status via FAB menu
 *   Payload: { paymentId, newStatus }
 *   Parent should make API call to update status
 * 
 * Example usage:
 * <ContentArea
 *   :payment-status="payout.status"
 *   :timeline-data="payout.timeline"
 *   :payment-id="payout.id"
 *   @status-changed="handleStatusChange"
 * />
 */
import { getPayoutById, generateTimelineSteps, getPaymentsByPayoutId, getMember, getPayoutAccount, getWallet } from '../data/payoutData.js'
import { formatDate, formatTime } from '../utils/dateFormatters.js'
import { getPayoutStatusIcon, getPayoutStatusText } from '../utils/statusUtils.js'
import { ROUTES, ICONS } from '../constants/index.js'
import Timeline from './Timeline.vue'
import PageHeader from './PageHeader.vue'

export default {
  name: 'PayoutDetails',
  components: {
    Timeline,
    PageHeader
  },
  props: {
    paymentId: {
      type: String,
      required: true
    },
    memberId: {
      type: String,
      default: 'member-001'
    }
  },

  data() {
    return {
      // Touch coordinates for swipe detection
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0,
      // Wheel delta for Mac trackpad gestures
      wheelDeltaX: 0
    }
  },

  computed: {
    payout() {
      return getPayoutById(this.paymentId)
    },
    
    member() {
      return getMember(this.payout.memberId)
    },
    
    payoutAccount() {
      return getPayoutAccount(this.payout.payoutAccountId)
    },
    
    wallet() {
      return getWallet(this.payout.walletId)
    },
    
    totalPayout() {
      return `$${this.payout.amount.toFixed(2)}`
    },
    
    dynamicTimeline() {
      return generateTimelineSteps(this.payout)
    },
    
    paymentsData() {
      return getPaymentsByPayoutId(this.payout.id)
    },
    
    currentStatus() {
      return this.payout.status
    },
    
    formattedTotalAmount() {
      if (!this.paymentsData || this.paymentsData.length === 0) {
        return `$${this.payout.amount.toFixed(2)}`
      }
      const sum = this.paymentsData.reduce((total, payment) => total + payment.amount, 0)
      return `$${sum.toFixed(2)}`
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
          text: this.getStatusDisplayText()
        }
      ]
    },
    
    backButtonText() {
      return this.$route.query.from === 'cashout' ? 'Cash out' : 'Payouts'
    },
    
    cashoutId() {
      return this.$route.query.cashoutId || null
    }
  },
  
  mounted() {
    // Add touch event listeners for swipe navigation
    this.addSwipeListeners()
  },
  
  beforeUnmount() {
    // Clean up touch event listeners
    this.removeSwipeListeners()
  },
  
  methods: {
    // Navigation
    goBack() {
      if (this.cashoutId) {
        this.$router.push(ROUTES.CASHOUT_DETAILS(this.memberId, this.cashoutId))
      } else {
        this.$router.push(ROUTES.PAYOUT_HISTORY(this.memberId))
      }
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
    
    // Swipe Navigation
    addSwipeListeners() {
      this.touchStartX = 0
      this.touchStartY = 0
      this.touchEndX = 0
      this.touchEndY = 0
      this.wheelDeltaX = 0
      
      document.addEventListener('touchstart', this.handleTouchStart, { passive: true })
      document.addEventListener('touchend', this.handleTouchEnd, { passive: true })
      document.addEventListener('wheel', this.handleWheel, { passive: true })
    },
    
    removeSwipeListeners() {
      document.removeEventListener('touchstart', this.handleTouchStart)
      document.removeEventListener('touchend', this.handleTouchEnd)
      document.removeEventListener('wheel', this.handleWheel)
    },
    
    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX
      this.touchStartY = e.changedTouches[0].screenY
    },
    
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX
      this.touchEndY = e.changedTouches[0].screenY
      this.handleSwipe()
    },
    
    handleWheel(e) {
      this.wheelDeltaX += e.deltaX
      
      if (Math.abs(this.wheelDeltaX) > 100 && e.deltaX < 0) {
        this.goBack()
        this.wheelDeltaX = 0
      }
      
      if (Math.abs(this.wheelDeltaX) > 200) {
        this.wheelDeltaX = 0
      }
    },
    
    handleSwipe() {
      const deltaX = this.touchEndX - this.touchStartX
      const deltaY = this.touchEndY - this.touchStartY
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
          this.goBack()
        }
      }
    },
    
    // Formatting
    formatDate,
    formatTime,
    
    // Status
    getStatusIcon() {
      return getPayoutStatusIcon(this.currentStatus)
    },
    
    getStatusDisplayText() {
      return getPayoutStatusText(this.currentStatus)
    }
  }
}
</script>

<style scoped>
.content-area {
  flex: 1;
  background: #F7F7F7;
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
  text-align: right;
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

.secondary-text {
  color: #6B7280;
}

</style>