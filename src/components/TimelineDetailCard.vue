<template>
  <div class="timeline-details">
    <div class="details-card-header">
      <div class="header-left">
        <div class="header-icon" :class="{ 'avatar-icon': stepType === 'cashout' }">
          <img v-if="stepType !== 'cashout'" :src="getHeaderIcon()" :alt="getHeaderName()" />
          <span v-else class="avatar-initials">{{ getMemberInitials() }}</span>
        </div>
        <div class="header-content">
          <div class="header-amount" :class="{ 
            'amount-grey': !step.completed || step.failed
          }">{{ getHeaderAmount() }}</div>
          <h3 class="header-name">{{ getHeaderName() }}</h3>
          <div v-if="stepType === 'cashout'" class="header-subtitle">{{ member.email }}</div>
        </div>
      </div>
      <div class="header-right" v-if="stepType !== 'payday'">
        <el-input
          :model-value="getTransactionId()"
          readonly
          class="transaction-id-input"
          :title="getTransactionId()"
          size="small"
        >
          <template #suffix>
            <img 
              src="/icons/clipboard.svg"
              alt="Copy"
              width="20"
              height="20"
              class="copy-icon"
              @click.stop="copyTransactionId"
              @mousedown.prevent
              :title="'Copy transaction ID'"
            />
          </template>
        </el-input>
      </div>
    </div>
    
    <!-- Cash out specific layout -->
    <template v-if="stepType === 'cashout'">
      <el-descriptions :column="1" label-width="140px">
        <el-descriptions-item label="Amount sent">{{ getAmountSent() }}</el-descriptions-item>
        <el-descriptions-item :label="getSecondLabel()">{{ getSecondValue() }}</el-descriptions-item>
      </el-descriptions>
    </template>
    
    <!-- Bank account steps layout -->
    <template v-else>
      <el-descriptions :column="1" label-width="140px">
        <el-descriptions-item :label="getAccountLabel()">
          <span>{{ getMaskedAccountNumber() }} <span class="account-badge-inline">Verified</span></span>
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TimelineDetailCard',
  
  props: {
    step: {
      type: Object,
      required: true
    },
    stepType: {
      type: String,
      required: true,
      validator: (value) => ['cashout', 'payday', 'eft-issued', 'eft-deposited', 'eft-failed', 'eft-returned'].includes(value)
    },
    member: {
      type: Object,
      required: true
    },
    payoutAccount: {
      type: Object,
      required: true
    }
  },
  
  methods: {
    getHeaderName() {
      if (this.stepType === 'cashout') {
        return '' // No name for e-transfer
      }
      return this.payoutAccount.bankName // Bank name for payday/EFT issued
    },
    
    getHeaderAmount() {
      return this.step.amount || '' // Return the amount from step data, or empty string if null
    },
    
    getHeaderIcon() {
      if (this.stepType === 'cashout') {
        return '/icons/member.svg' // Avatar icon for e-transfer cashout
      }
      if (this.stepType === 'eft-issued' || this.stepType === 'payday') {
        return '/icons/bank.svg' // Bank icon for EFT issued and payday
      }
      return '/icons/bank.svg' // Default to bank icon for account-related steps
    },
    
    getMemberInitials() {
      if (this.stepType === 'cashout') {
        const names = this.member.name.split(' ')
        return names.map(name => name.charAt(0)).join('').toUpperCase()
      }
      return 'AG' // fallback
    },
    
    getAmountSent() {
      if (this.stepType === 'cashout' && this.step.amount) {
        const cashoutAmount = parseFloat(this.step.amount.replace('$', ''))
        const fee = 0.50
        const amountSent = cashoutAmount - fee
        return `$${amountSent.toFixed(2)}`
      }
      return '$0.00'
    },
    
    getSecondLabel() {
      return 'Fee'
    },
    
    getSecondValue() {
      return '$0.50'
    },
    
    getAccountLabel() {
      return 'Account No.'
    },
    
    getMaskedAccountNumber() {
      if (this.payoutAccount && this.payoutAccount.accountNumber) {
        const accountNumber = this.payoutAccount.accountNumber.toString()
        const lastFour = accountNumber.slice(-4)
        return `••${lastFour}`
      }
      return '••0000'
    },
    
    getTransactionId() {
      // Generate a random alphanumeric transaction ID
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let transactionId = ''
      
      // Create a consistent seed based on step and payout data for reproducible IDs
      const seed = `${this.stepType}-${this.step.title}-${this.payoutAccount.id}`.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0)
      }, 0)
      
      // Use seeded random to generate consistent ID for each card
      let random = seed
      for (let i = 0; i < 12; i++) {
        random = (random * 9301 + 49297) % 233280
        const index = Math.floor((random / 233280) * characters.length)
        transactionId += characters[index]
      }
      
      return transactionId
    },
    
    async copyTransactionId() {
      try {
        const transactionId = this.getTransactionId()
        await navigator.clipboard.writeText(transactionId)
        this.$message.success('Transfer ID copied')
      } catch (err) {
        console.error('Failed to copy transaction ID:', err)
        // Fallback for older browsers
        this.fallbackCopy(this.getTransactionId())
      }
    },
    
    fallbackCopy(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        this.$message.success('Transfer ID copied')
      } catch (err) {
        console.error('Fallback copy failed:', err)
        this.$message.error('Failed to copy Transfer ID')
      }
      document.body.removeChild(textArea)
    }
  }
}
</script>

<style scoped>
.timeline-details {
  flex: 1;
  padding: 0;
  background: #FFF;
  border: 1px solid rgba(39, 39, 42, 0.08);
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(39, 39, 42, 0.05), 0 1px 1px 0 rgba(39, 39, 42, 0.03), 0 -1px 0 0 rgba(39, 39, 42, 0.08) inset;
  overflow: hidden;
  width: 480px;
}

.details-card-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(39, 39, 42, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
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
  margin-left: 8px;
}

.transaction-id-input {
  max-width: 140px;
  font-family: 'Inter', monospace;
}

.transaction-id-input :deep(.el-input__wrapper) {
  background: #F7F7F7;
  border: 1px solid #EDEDEE;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  box-shadow: none;
}

.transaction-id-input :deep(.el-input__wrapper):focus-within {
  box-shadow: none;
  border-color: #EDEDEE;
}

.transaction-id-input :deep(.el-input__inner) {
  font-family: 'Inter', monospace;
  font-size: 12px;
  font-weight: 400;
  color: #374151;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.transaction-id-input :deep(.el-input__suffix) {
  border-left: 1px solid #EDEDEE;
  margin-left: 4px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  flex-shrink: 0;
}

.copy-icon {
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  padding: 2px;
  display: block;
  flex-shrink: 0;
}

.copy-icon:hover {
  opacity: 1;
  filter: brightness(0) saturate(100%) invert(38%) sepia(100%) saturate(2867%) hue-rotate(208deg) brightness(95%) contrast(101%);
}

.copy-icon:active {
  transform: none;
  padding: 2px;
}

.description-divider {
  height: 1px;
  background-color: #EDEDEE;
  margin: 0;
  width: 100%;
}

/* Element Plus descriptions styling */
:deep(.el-descriptions) {
  padding: 0;
  background: transparent;
}

:deep(.el-descriptions__table) {
  border-spacing: 0;
  background: transparent;
}

:deep(.el-descriptions__cell) {
  margin-bottom: 0 !important;
  padding: 16px 20px !important;
  background: transparent !important;
}

:deep(.el-descriptions-item) {
  margin-bottom: 0 !important;
  background: transparent !important;
}

:deep(.el-descriptions-item__label) {
  background: transparent;
  color: #000000;
  font-weight: 500;
}

:deep(.el-descriptions__label) {
  color: #000000;
  font-weight: 500;
}

:deep(.el-descriptions-item__content) {
  background: transparent !important;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
  line-height: 20px;
}

/* Divider below "Amount sent" for e-transfer cards */
:deep(.el-descriptions .el-descriptions-item:first-child) {
  border-bottom: 1px solid rgba(39, 39, 42, 0.08);
}

:deep(.el-descriptions .el-descriptions-item:first-child .el-descriptions__cell) {
  border-bottom: 1px solid rgba(39, 39, 42, 0.08);
}

:deep(.el-descriptions .el-descriptions__table .el-descriptions__cell:first-child) {
  border-bottom: 1px solid rgba(39, 39, 42, 0.08);
}
</style>
