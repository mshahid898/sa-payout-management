<!-- 
  PAGE HEADER COMPONENT
  Reusable header component with simple and detailed variants
  Supports different metadata and configurations
-->
<template>
  <div class="page-header">
    <h1 :class="titleClass">{{ title }}</h1>
    <div v-if="variant === 'detailed'" class="header-details">
      <div v-for="(detail, index) in details" :key="index" class="detail-item">
        <div class="detail-value">
          <img :src="detail.icon" :alt="detail.label" class="detail-icon" />
          <span>{{ detail.text }}</span>
        </div>
        <div v-if="index < details.length - 1" class="detail-divider"></div>
      </div>
    </div>
  </div>
</template>

<!-- 
  PAGE HEADER COMPONENT SCRIPT
  Handles different variants and metadata
-->
<script>
export default {
  name: 'PageHeader',
  
  props: {
    variant: {
      type: String,
      default: 'simple',
      validator: value => ['simple', 'detailed'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    details: {
      type: Array,
      default: () => []
    }
  },
  
  computed: {
    titleClass() {
      return this.variant === 'simple' ? 'member-name' : 'total-amount'
    }
  }
}
</script>

<!-- 
  PAGE HEADER COMPONENT STYLES
  Styles for both simple and detailed variants
-->
<style scoped>
.page-header {
  margin-bottom: 32px;
}

.member-name {
  margin: 0;
  color: var(--label-primary, #27272A);
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.03688rem;
}

.total-amount {
  margin: 0;
  color: var(--label-primary, #27272A);
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.03688rem;
}

.header-details {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.09px;
  font-weight: 500;
  color: #62626A;
}

.detail-icon {
  width: 20px;
  height: 20px;
}

.detail-divider {
  width: 1px;
  height: 16px;
  background-color: #E5E7EB;
  margin-left: 16px;
}
</style>
