import { createRouter, createWebHistory } from 'vue-router'
import PayoutHistory from '../components/PayoutHistory.vue'
import PayoutDetails from '../components/PayoutDetails.vue'
import CashoutDetails from '../components/CashoutDetails.vue'
import TestStates from '../components/TestStates.vue'

const routes = [
  {
    path: '/members/:memberId/payouts',
    name: 'PayoutHistory',
    component: PayoutHistory,
    props: true
  },
  {
    path: '/members/:memberId/payouts/:payoutId',
    name: 'PayoutDetails',
    component: PayoutDetails,
    props: route => ({
      paymentId: route.params.payoutId,
      memberId: route.params.memberId
    })
  },
  {
    path: '/members/:memberId/cashouts/:cashoutId',
    name: 'CashoutDetails',
    component: CashoutDetails,
    props: route => ({
      paymentId: route.params.cashoutId,
      memberId: route.params.memberId
    })
  },
  {
    path: '/test-states',
    name: 'TestStates',
    component: TestStates
  },
  {
    path: '/',
    redirect: '/members/member-001/payouts'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
