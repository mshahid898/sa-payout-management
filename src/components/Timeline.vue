<template>
  <el-timeline>
    <TimelineStep
      v-for="(step, index) in steps"
      :key="index"
      :step="step"
      :current-status="currentStatus"
      :member="member"
      :payout-account="payoutAccount"
      :error-data="errorData"
      @error-action="$emit('error-action', $event)"
    />
  </el-timeline>
</template>

<script>
import TimelineStep from './TimelineStep.vue'

export default {
  name: 'Timeline',
  
  components: {
    TimelineStep
  },
  
  props: {
    steps: {
      type: Array,
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
  
  emits: ['error-action']
}
</script>

<style scoped>
:deep(.el-timeline) {
  padding-bottom: 0;
  margin-bottom: 0;
}
</style>
