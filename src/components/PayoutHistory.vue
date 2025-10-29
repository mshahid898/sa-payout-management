<template>
  <div class="payout-history">
    <div class="content-wrapper">
      <!-- Back Button -->
      <div class="back-header">
        <a href="#" class="back-link" @click.prevent="goBack">
          <img src="/icons/chevron_left.svg" alt="Back" class="chevron-icon" />
          <span>Members</span>
        </a>
      </div>
      
      <!-- Page Header -->
      <PageHeader 
        variant="simple" 
        :title="memberData.member.name" 
      />

      <div class="cards-container">
        <!-- Combined Account and Payout Details Card -->
        <div class="horizontal-layout">
          <el-card class="combined-details-card">
            <div class="card-header">
              <h2>Details</h2>
            </div>
            <div class="card-content">
              <div class="descriptions-container">
                <!-- Payout Details Section -->
                <div class="section-group">
                  <div class="description-item">
                    <el-descriptions :column="1" label-width="0px">
                      <el-descriptions-item label="Payout method">
                        <span class="preference-enabled" v-if="memberData.preferences.autoPayout">Scheduled</span>
                        <span v-else>Instant</span>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                  <div class="description-item">
                    <el-descriptions :column="1" label-width="0px">
                      <el-descriptions-item label="Pay schedule">
                        <div class="frequency-group">
                          <div class="frequency-item">
                            {{ getWalletName('wallet-001') }}・{{ memberData.preferences.payCycleFrequency === 'weekly' ? 'every Fri' : '1st and 15th' }}
                          </div>
                          <div class="frequency-item">
                            {{ getWalletName('wallet-002') }}・every Wed
                          </div>
                        </div>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>

                <!-- Divider -->
                <div class="section-divider"></div>

                <!-- Account Details Section -->
                <div class="section-group no-bottom-margin">
                  <div class="description-item">
                    <el-descriptions :column="1" label-width="0px">
                      <el-descriptions-item label="Linked account">
                        <span>{{ memberData.account.bankName }} <span class="account-badge-inline" v-if="memberData.account.verified">Verified</span></span>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                  <div class="description-item">
                    <el-descriptions :column="1" label-width="0px">
                      <el-descriptions-item label="Account No.">
                        <span>{{ getMaskedAccountNumber(memberData.account.accountNumber) }}</span>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- Payout History Card -->
          <el-card class="history-card">
            <div class="card-header">
              <h2>Payouts</h2>
              <div class="filter-row">
                <div class="date-range-container">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="to"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    format="MMM DD, YYYY"
                    value-format="YYYY-MM-DD"
                    @change="applyDateFilter"
                    class="date-range-picker"
                    style="width: 280px"
                  />
                </div>
                <el-select
                  v-model="typeFilter"
                  placeholder="All types"
                  @change="applyWalletFilter"
                  class="type-select"
                  clearable
                >
                  <el-option label="Cash out" value="cashout" />
                  <el-option label="Instant" value="instant" />
                  <el-option label="Scheduled" value="scheduled" />
                </el-select>
                <el-select
                  v-model="walletFilter"
                  placeholder="All wallets"
                  @change="applyWalletFilter"
                  class="wallet-select"
                  clearable
                >
                  <el-option
                    v-for="wallet in availableWallets"
                    :key="wallet.id"
                    :label="wallet.name"
                    :value="wallet.id"
                  />
                </el-select>
              </div>
            </div>
            <div class="card-content">
              <el-table
                :data="payoutHistoryData"
                class="history-table"
                @row-click="handleRowClick"
                :row-class-name="getRowClassName"
              >
                <el-table-column label="Type" width="auto">
                  <template #default="{ row }">
                    <span class="type-label">{{ getPayoutTypeDisplay(row) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Wallet" width="164">
                  <template #default="{ row }">
                    <span class="wallet-label">{{ getWalletName(row.walletId) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Initiated" width="132">
                  <template #default="{ row }">
                    <div class="date-cell">
                      <div class="date-main">{{ formatDate(new Date(row.payoutType === 'cashout' ? row.initiatedDate : row.payCycleStartDate)) }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Status" width="140">
                  <template #default="{ row }">
                    <div class="status-cell">
                      <img 
                        :src="getStatusIcon(row.status, row.payoutType)" 
                        :alt="getStatusText(row.status, row.payoutType)" 
                        class="status-icon" 
                      />
                      <span class="status-text" :class="getStatusClass(row.status, row.payoutType)">
                        {{ getStatusText(row.status, row.payoutType) }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Deposited" width="132">
                  <template #default="{ row }">
                    <div class="date-cell">
                      <div class="date-main">{{ row.depositedDate ? formatDate(new Date(row.depositedDate)) : '-' }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Amount" align="right" width="100">
                  <template #default="{ row }">
                    <div class="amount-cell">
                      <div class="amount-main">${{ row.amount.toFixed(2) }}</div>
                      <div v-if="row.payoutType === 'cashout'" class="amount-fee">$0.50 fee</div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMemberData, getWallet, getPayoutAccount } from '../data/payoutData.js'
import { formatDate } from '../utils/dateFormatters.js'
import { getStatusText, getStatusIcon, getStatusClass } from '../utils/statusUtils.js'
import { ROUTES } from '../constants/index.js'
import PageHeader from './PageHeader.vue'

export default {
  name: 'PayoutHistory',
  
  components: {
    PageHeader
  },
  
  props: {
    memberId: {
      type: String,
      default: 'member-001'
    }
  },
  
  data() {
    return {
      dateRange: null,
      walletFilter: null,
      typeFilter: null
    }
  },

  computed: {
    memberData() {
      return getMemberData(this.memberId)
    },
    
    payoutHistoryData() {
      let data = this.memberData.payoutHistory
      
      // Apply date filter if date range is selected
      if (this.dateRange && this.dateRange.length === 2) {
        data = data.filter(payout => {
          const payoutDate = new Date(payout.initiatedDate)
          const startDate = new Date(this.dateRange[0])
          const endDate = new Date(this.dateRange[1])
          
          if (payoutDate < startDate) return false
          if (payoutDate > endDate) return false
          
          return true
        })
      }
      
      // Apply wallet filter if wallet is selected
      if (this.walletFilter) {
        data = data.filter(payout => payout.walletId === this.walletFilter)
      }

      // Apply type filter if type is selected
      if (this.typeFilter) {
        data = data.filter(payout => {
          if (this.typeFilter === 'cashout') {
            return payout.payoutType === 'cashout'
          } else if (this.typeFilter === 'instant') {
            return payout.payoutType === 'instant'
          } else if (this.typeFilter === 'scheduled') {
            return payout.payoutType === 'scheduled' || !payout.payoutType
          }
          return true
        })
      }
      
      return data
    },
    
    availableWallets() {
      // Get unique wallets from payout history
      const walletIds = [...new Set(this.memberData.payoutHistory.map(p => p.walletId))]
      return walletIds.map(id => getWallet(id)).filter(Boolean)
    }
  },

  methods: {
    // Navigation
    goBack() {
      // This would typically go back to a parent page or dashboard
    },
    
    // Event Handlers
    handleRowClick(row) {
      if (row.payoutType === 'cashout') {
        this.$router.push(ROUTES.CASHOUT_DETAILS(this.memberId, row.id))
      } else {
        this.$router.push(ROUTES.PAYOUT_DETAILS(this.memberId, row.id))
      }
    },
    
    applyDateFilter() {
      // The computed property will automatically update when dateFilter changes
    },
    
    applyWalletFilter() {
      // The computed property will automatically update when walletFilter changes
    },
    
    clearAllFilters() {
      this.dateRange = null
      this.walletFilter = null
      this.typeFilter = null
    },
    
    // Formatting
    getMaskedAccountNumber(accountNumber) {
      if (accountNumber) {
        const lastFour = accountNumber.toString().slice(-4)
        return `••${lastFour}`
      }
      return '••0000'
    },
    
    formatDate,
    
    // Status
    getStatusText,
    getStatusClass,
    getStatusIcon,
    
    // Utilities
    getWalletName(walletId) {
      const wallet = getWallet(walletId)
      return wallet ? wallet.name : 'Unknown Wallet'
    },
    
    getPayoutTypeDisplay(row) {
      if (row.payoutType === 'cashout') {
        return 'Cash out'
      } else if (row.payoutType === 'instant') {
        return 'Instant'
      }
      return 'Scheduled payout'
    },
    
    getRowClassName({ row }) {
      return row.payoutType === 'cashout' ? 'cashout-row' : ''
    },
    
    isTextTruncated(text) {
      return text && text.length > 20
    },
    
    getAccountDisplay(row) {
      if (row.payoutType === 'cashout') {
        return this.memberData.member.email
      } else {
        return this.getPayoutAccountDisplay(row.payoutAccountId)
      }
    },
    
    getPayoutAccountDisplay(accountId) {
      const account = getPayoutAccount(accountId)
      if (account && account.type === 'bank_account') {
        return `${account.bankName} ･･${account.accountNumberLast4}`
      }
      return 'Unknown Account'
    }
  }
}
</script>

<style scoped>
.payout-history {
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

.horizontal-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.combined-details-card {
  width: 264px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  align-self: flex-start;
}

.history-card {
  flex: 1;
  background: white !important;
  border-radius: 10px !important;
  border: 1px solid rgba(39, 39, 42, 0.10) !important;
  box-shadow: 0 1px 2px 0 rgba(39, 39, 42, 0.01), 0 4px 12px 0 rgba(39, 39, 42, 0.06) !important;
  overflow: hidden;
}

.history-card :deep(.el-card__body) {
  padding: 0 !important;
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #EDEDEE;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 71px;
}

.card-header h2 {
  margin: 0;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.18px;
  font-weight: 600;
  color: #000000;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
}

.date-range-container {
  width: auto;
  flex-shrink: 0;
}

.type-select {
  width: 140px;
}

.wallet-select {
  width: 140px;
}

.clear-btn {
  font-size: 14px;
  padding: 8px 16px;
  height: auto;
  flex-shrink: 0;
  margin-left: auto;
}

.combined-details-card {
  background: white !important;
  border-radius: 10px !important;
  border: 1px solid rgba(39, 39, 42, 0.10) !important;
  box-shadow: 0 1px 2px 0 rgba(39, 39, 42, 0.01), 0 4px 12px 0 rgba(39, 39, 42, 0.06) !important;
  overflow: hidden;
}

.combined-details-card :deep(.el-card__body) {
  padding: 0 !important;
}

.section-group {
  margin-bottom: 0;
}

.section-group:last-child {
  margin-bottom: 0;
}

.section-group.no-bottom-margin {
  margin-bottom: 0;
}

.section-divider {
  height: 1px;
  background-color: #EDEDEE;
  margin: 20px 0;
}

.section-title-with-badge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.18px;
  font-weight: 600;
  color: #000000;
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
  padding: 24px;
}

.descriptions-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.description-item {
  border-radius: 10px;
  padding-bottom: 16px;
}

.description-item:last-child {
  padding-bottom: 0;
}

.description-item :deep(.el-descriptions) {
  padding: 0;
  background: transparent !important;
}

.description-item :deep(.el-descriptions__table) {
  border-spacing: 0;
  background: transparent !important;
}

.description-item :deep(.el-descriptions__cell) {
  margin-bottom: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.description-item :deep(.el-descriptions-item) {
  margin-bottom: 0 !important;
  background: transparent !important;
}

.description-item :deep(.el-descriptions__label) {
  color: #000000;
  font-weight: 500;
  background: transparent !important;
  align-self: flex-start !important;
}

.description-item :deep(.el-descriptions__content) {
  background: transparent !important;
  font-weight: 400 !important;
}

.description-item :deep(.el-descriptions__body) {
  background: transparent !important;
}

.description-item :deep(.el-descriptions__row) {
  background: transparent !important;
  display: flex !important;
  flex-direction: row !important;
}

.frequency-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.frequency-item {
  font-size: 14px;
  line-height: 20px;
  color: #6B7280;
}

.history-card .card-content {
  padding: 0;
}

.account-badge-inline {
  display: inline-block;
  padding: 2px 8px;
  background: #DCFCE7;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #12873D;
  letter-spacing: 0.01px;
  margin-left: 4px;
}

.preference-enabled {
  font-weight: 400;
}

.history-table {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  border-collapse: separate;
  border-spacing: 0 16px;
}

.history-table :deep(.el-table__header),
.history-table :deep(.el-table__body) {
  font-size: 14px !important;
  line-height: 20px !important;
  letter-spacing: -0.09px !important;
}

.history-table :deep(.el-table__header th) {
  font-size: 12px !important;
  line-height: 16px !important;
  letter-spacing: -0.08px !important;
  font-weight: 500 !important;
  color: #62626A !important;
  background: #F7F7F7 !important;
  border-bottom: 1px solid #EDEDEE !important;
  padding: 8px 0 8px 12px !important;
  height: 44px;
}

.history-table :deep(.el-table__header th:last-child) {
  padding-right: 12px !important;
}

.history-table :deep(.el-table__body td) {
  font-size: 14px !important;
  line-height: 20px !important;
  letter-spacing: -0.09px !important;
  font-weight: 400 !important;
  color: #000000 !important;
  border-bottom: 1px solid #EDEDEE !important;
  padding: 16px 0 16px 12px !important;
  cursor: pointer;
  vertical-align: middle !important;
}

.history-table :deep(.el-table__body tr) {
  height: 64px;
}

.history-table :deep(.el-table__body tr:hover > td) {
  background-color: #F8F8F8 !important;
}

.history-table :deep(.el-table__body .cashout-row > td) {
  background-color: white !important;
  height: 64px;
}

.history-table :deep(.el-table__body .cashout-row:hover > td) {
  background-color: #F8F8F8 !important;
}

.amount-cell {
  font-weight: 600;
  color: #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  text-align: right;
  padding: 0 12px;
}

.amount-main {
  font-weight: 600;
  color: #000000;
  font-size: 14px;
  line-height: 20px;
}

.amount-fee {
  font-weight: 400;
  color: #6B7280;
  font-size: 12px;
  line-height: 16px;
  margin-top: 1px;
  white-space: nowrap;
}

.wallet-label {
  font-weight: 400;
  color: #6B7280; /* Secondary color for wallet */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
  vertical-align: middle;
}

.type-label {
  font-weight: 500;
  color: #000000; /* Black color for type */
}

.account-label {
  font-weight: 500;
  color: #000000; /* Black color for account (To) */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
  vertical-align: middle;
}

.date-cell {
  width: 100%;
}

.date-main {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  font-weight: 400;
  color: #6B7280; /* Secondary color for dates */
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  width: 20px;
  height: 20px;
}

.status-text {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  font-weight: 500;
}

.status-scheduled {
  color: #6B7280;
}

.status-pending {
  color: #2563EB;
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

/* Override Element Plus descriptions styling */
.combined-details-card :deep(.el-descriptions) {
  padding: 0;
  background: transparent;
  width: 100%;
}

.combined-details-card :deep(.el-descriptions__body) {
  width: 100%;
}

.combined-details-card :deep(.el-descriptions__table) {
  border-spacing: 0;
  background: transparent;
  width: 100% !important;
  table-layout: fixed !important;
}

.combined-details-card :deep(.el-descriptions__cell) {
  margin-bottom: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  width: 100% !important;
  min-width: 100% !important;
}

.combined-details-card :deep(.el-descriptions__row) {
  width: 100% !important;
  display: table-row !important;
}

.combined-details-card :deep(.el-descriptions__row td) {
  width: 100% !important;
  min-width: 100% !important;
}

.combined-details-card :deep(.el-descriptions-item) {
  margin-bottom: 0 !important;
  background: transparent !important;
  width: 100%;
}

.combined-details-card :deep(.el-descriptions-item__label) {
  background: transparent;
  color: #000000;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 4px;
  width: 100%;
  white-space: nowrap;
}

.combined-details-card :deep(.el-descriptions__label) {
  color: #000000;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 4px;
  width: 100%;
  white-space: nowrap;
}

.combined-details-card :deep(.el-descriptions-item__content) {
  background: transparent !important;
  color: #6B7280;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  width: 100% !important;
  min-width: 100%;
  max-width: none !important;
}
</style>
