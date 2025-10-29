<template>
  <el-timeline-item>
    <template #dot>
      <div class="custom-dot" :class="{ 'with-details': shouldShowDetails }">
        <img 
          :src="getTimelineIcon()" 
          :alt="getTimelineIconAlt()" 
          class="timeline-icon"
        />
      </div>
    </template>
    <div class="timeline-content">
      <div class="timeline-left-group">
        <div class="step-title">{{ step.title }}</div>
        <div 
          class="step-timestamp" 
          :data-local="formatLocalTime(step.timestamp)"
          :data-utc="formatUTCTime(step.timestamp)"
          @mouseenter="showUTCTime($event)"
          @mouseleave="showLocalTime($event)"
        >
          {{ formatLocalTime(step.timestamp) }}
        </div>
      </div>
      <div class="timeline-right-stack">
        <!-- Error alerts -->
        <ErrorAlert
          v-if="step.title === 'EFT returned' && currentStatus === 'returned'"
          type="returned"
          :error-code="errorData.returnCode"
          :error-message="errorData.returnReason"
          @action-click="$emit('error-action', { type: 'returned', step })"
        />

        <ErrorAlert
          v-if="step.title === 'EFT failed' && currentStatus === 'failed'"
          type="failed"
          :error-code="errorData.failureCode || 'NSF'"
          :error-message="errorData.failureReason || 'Insufficient funds in processing account.'"
          @action-click="$emit('error-action', { type: 'failed', step })"
        />

        <ErrorAlert
          v-if="step.title === 'Cash out' && step.failed && errorData.failureCode"
          type="failed"
          :error-code="errorData.failureCode"
          :error-message="errorData.failureReason || 'Insufficient funding'"
          @action-click="$emit('error-action', { type: 'failed', step })"
        />

        <ErrorAlert
          v-if="step.title === 'Cash out' && step.failed && !errorData.failureCode"
          type="cancelled"
          error-message="Cancelled by member"
        />

        <!-- Detail card -->
        <TimelineDetailCard
          v-if="shouldShowDetails"
          :step="step"
          :step-type="getStepType()"
          :member="member"
          :payout-account="payoutAccount"
        />
      </div>
    </div>
  </el-timeline-item>
</template>

<script>
import ErrorAlert from './alerts/ErrorAlert.vue'
import TimelineDetailCard from './TimelineDetailCard.vue'

export default {
  name: 'TimelineStep',
  
  components: {
    ErrorAlert,
    TimelineDetailCard
  },
  
  props: {
    step: {
      type: Object,
      required: true
    },
    currentStatus: {
      type: String,
      required: true
    },
    member: {
      type: Object,
      required: true
    },
    payoutAccount: {
      type: Object,
      required: true
    },
    errorData: {
      type: Object,
      default: () => ({})
    }
  },
  
  computed: {
    shouldShowDetails() {
      const stepsWithDetails = ['Cash out', 'Payday', 'EFT failed', 'EFT returned']
      if (this.currentStatus === 'issued' || this.currentStatus === 'deposited') {
        stepsWithDetails.push('EFT issued')
      }
      return stepsWithDetails.includes(this.step.title)
    }
  },
  
  methods: {
    getStepType() {
      const typeMap = {
        'Cash out': 'cashout',
        'Payday': 'payday',
        'EFT issued': 'eft-issued',
        'EFT deposited': 'eft-deposited',
        'EFT failed': 'eft-failed',
        'EFT returned': 'eft-returned'
      }
      return typeMap[this.step.title] || 'default'
    },
    
    getTimelineIcon() {
      if (this.step.title === 'EFT failed' || this.step.title === 'EFT returned') {
        return '/icons/error.svg'
      }
      if (this.step.title === 'Cash out' && this.step.failed) {
        return '/icons/error.svg'
      }
      if (this.step.title === 'EFT deposited' && this.step.completed) {
        return '/icons/check_green.svg'
      }
      if (this.step.title === 'Cash out') {
        return this.step.completed ? '/icons/check_green.svg' : '/icons/pending.svg'
      }
      return this.step.completed ? '/icons/check_green.svg' : '/icons/circle.svg'
    },
    
    getTimelineIconAlt() {
      if (this.step.title === 'EFT failed' || this.step.title === 'EFT returned') {
        return 'Error'
      }
      if (this.step.title === 'EFT deposited') {
        return 'Deposited'
      }
      return this.step.completed ? 'Completed' : 'Incomplete'
    },
    
    formatLocalTime(timestamp) {
      if (!timestamp) return ''
      const timeString = timestamp.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      const timezone = timestamp.toLocaleTimeString('en-US', { 
        timeZoneName: 'short' 
      }).split(' ').pop()
      return `${timeString} ${timezone}`
    },
    
    formatUTCTime(timestamp) {
      if (!timestamp) return ''
      const utcString = timestamp.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      })
      return `${utcString} UTC`
    },
    
    showUTCTime(event) {
      event.target.textContent = event.target.dataset.utc
    },
    
    showLocalTime(event) {
      event.target.textContent = event.target.dataset.local
    }
  }
}
</script>

<style scoped>
.timeline-content {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
}

.timeline-left-group {
  display: flex;
  flex-direction: column;
  padding-top: 2px;
  width: 240px;
  flex-shrink: 0;
}

.timeline-right-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.timeline-content:has(.timeline-details) .timeline-left-group {
  padding-top: 17px;
}


.step-title {
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.09px;
  font-weight: 500;
  color: #000000;
  margin: 0;
}

.step-timestamp {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  color: #76767F;
  font-weight: 400;
  cursor: help;
  margin: 0;
  width: fit-content;
}

.custom-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
}

.custom-dot.with-details {
  transform: translateY(14px);
}

.timeline-icon {
  width: 24px;
  height: 24px;
}

/* Timeline item styling */
:deep(.el-timeline-item) {
  padding-bottom: 24px;
}

:deep(.el-timeline-item__wrapper) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  padding-left: 36px;
}

:deep(.el-timeline-item__content) {
  padding-top: 2px;
}

:deep(.el-timeline-item:last-child) {
  padding-bottom: 0;
  margin-bottom: 0;
}

:deep(.el-timeline-item__dot) {
  left: 0;
  transform: translateX(0);
}


:deep(.el-timeline-item__tail) {
  left: 11px;
  width: 1px;
  border-radius: 999px;
  overflow: hidden;
  background-color: #EDEDEE;
  height: calc(100% + 20px);
}
</style>
