<template>
  <div class="error-alert" :class="type">
    <div class="alert-content">
      <div class="alert-left">
        <div v-if="errorCode && type !== 'cancelled'" class="error-code-badge">{{ errorCode }}</div>
        <div class="error-reason-text">{{ errorMessage }}</div>
      </div>
      <div v-if="type !== 'cancelled'" class="alert-action">
        <a href="#" @click.prevent="handleAction">{{ computedActionText }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorAlert',
  
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['failed', 'returned', 'cancelled'].includes(value)
    },
    errorCode: {
      type: String,
      required: false,
      default: null
    },
    errorMessage: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      default: null
    },
    actionLink: {
      type: String,
      default: null
    }
  },
  
  computed: {
    computedActionText() {
      if (this.actionText) {
        return this.actionText
      }
      if (this.type === 'failed') return 'Retry'
      if (this.type === 'cancelled') return 'Retry'
      return 'Update name'
    }
  },
  
  methods: {
    handleAction() {
      if (this.actionLink) {
        // If actionLink is provided, navigate to it
        window.location.href = this.actionLink
      } else {
        // Otherwise emit event for parent to handle
        this.$emit('action-click', {
          type: this.type,
          errorCode: this.errorCode,
          errorMessage: this.errorMessage
        })
      }
    }
  }
}
</script>

<style scoped>
.error-alert {
  background: #FEF2F2;
  border-left: 4px solid #D32222;
  border-radius: 0 8px 8px 0;
  width: 480px;
  overflow: hidden;
}

/* Yellow styling for cancelled cashouts */
.error-alert.cancelled {
  background: #FFFBEB;
  border-left: 4px solid #F59E0B;
}

.error-alert.cancelled .error-reason-text {
  color: #D97706;
}

.error-alert.cancelled .alert-content {
  justify-content: flex-start;
}

.alert-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 20px;
  gap: 16px;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.error-code-badge {
  background: #ef4444;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  padding: 1px 6px;
  border-radius: 6px;
  letter-spacing: -0.09px;
  white-space: nowrap;
}

.error-reason-text {
  color: #D32222;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.18px;
  white-space: nowrap;
}

.alert-action {
  flex-shrink: 0;
}

.alert-action a {
  color: #D32222;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.18px;
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
  cursor: pointer;
}

.alert-action a:hover {
  text-decoration: none;
}
</style>
