<template>
  <div class="content-area">
    <div class="content-wrapper">
      <div class="back-header">
        <a href="#" class="back-link" @click.prevent="goBack">
          <img src="/icons/chevron_left.svg" alt="Back" class="chevron-icon" />
          <span>Payouts</span>
        </a>
      </div>
      
      <!-- Page Header with Actions -->
      <div class="header-container">
        <PageHeader 
          variant="detailed"
          :title="totalPayout"
          :details="headerDetails"
        />
        
        <div class="header-actions">
          <el-button 
            type="default" 
            @click="viewPayPeriod"
            class="secondary-button"
          >
            View pay period
          </el-button>
        </div>
      </div>
      
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
      </div>
    </div>
  </div>
</template>

<script>
import { getPayoutById, generateCashoutTimelineSteps, getMember, getPayoutAccount, getWallet } from '../data/payoutData.js'
import { getCashoutStatusIcon, getCashoutStatusText } from '../utils/statusUtils.js'
import { ROUTES, ICONS } from '../constants/index.js'
import ErrorAlert from './alerts/ErrorAlert.vue'
import Timeline from './Timeline.vue'
import PageHeader from './PageHeader.vue'

export default {
  name: 'CashoutDetails',
  components: {
    ErrorAlert,
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
      return generateCashoutTimelineSteps(this.payout)
    },
    
    currentStatus() {
      return this.payout.status
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
          text: this.getStatusDisplay()
        }
      ]
    }
  },
  
  methods: {
    // Navigation
    goBack() {
      this.$router.push(ROUTES.PAYOUT_HISTORY(this.memberId))
    },
    
    viewPayPeriod() {
      const parentPayoutId = this.paymentId.replace('-cashout', '')
      this.$router.push({
        path: ROUTES.PAYOUT_DETAILS(this.memberId, parentPayoutId),
        query: { from: 'cashout', cashoutId: this.paymentId }
      })
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
      // TODO: Handle reprocess action for cashouts
    },
    
    handleFailedAction(eventData) {
      // TODO: Handle retry action for cashouts
    },
    
    // Formatting
    getMemberInitials() {
      const names = this.member.name.split(' ')
      return names.map(name => name.charAt(0)).join('').toUpperCase()
    },
    
    // Status
    getStatusDisplay() {
      return getCashoutStatusText(this.currentStatus)
    },
    
    getStatusIcon() {
      return getCashoutStatusIcon(this.currentStatus)
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

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-container :deep(.page-header) {
  margin-bottom: 0;
}

.header-actions {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
}

.secondary-button {
  background: #F8C332 !important;
  border: 1px solid #F8C332 !important;
  color: #000000 !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  padding: 8px 16px !important;
  height: auto !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 4px 0 rgba(39, 39, 42, 0.06), 0 1px 1px 0 rgba(39, 39, 42, 0.03), 0 -1px 0 0 rgba(39, 39, 42, 0.02) inset !important;
}

.secondary-button:hover {
  background: #F6B800 !important;
  border-color: #F6B800 !important;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-card {
  background: white !important;
  border-radius: 10px !important;
  border: 1px solid rgba(39, 39, 42, 0.10) !important;
  box-shadow: 0 1px 2px 0 rgba(39, 39, 42, 0.01), 0 4px 12px 0 rgba(39, 39, 42, 0.06) !important;
  overflow: hidden;
}

.status-card :deep(.el-card__body) {
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

/* Override Element Plus default line-height from 23px to 20px */
:deep(.el-table .cell) {
  line-height: 20px;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
  line-height: 20px;
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
</style>
