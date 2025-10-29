/**
 * Vue Router Configuration
 * 
 * Defines all application routes and navigation structure.
 * Uses HTML5 history mode for clean URLs (requires server configuration for SPA routing).
 */
import { createRouter, createWebHistory } from 'vue-router'
import PayoutHistory from '../components/PayoutHistory.vue'
import PayoutDetails from '../components/PayoutDetails.vue'
import CashoutDetails from '../components/CashoutDetails.vue'
import TestStates from '../components/TestStates.vue'

// Route definitions
const routes = [
  // Member payout history page
  {
    path: '/members/:memberId/payouts',
    name: 'PayoutHistory',
    component: PayoutHistory,
    props: true // Pass route params as props
  },
  // Individual payout details page
  {
    path: '/members/:memberId/payouts/:payoutId',
    name: 'PayoutDetails',
    component: PayoutDetails,
    props: route => ({
      paymentId: route.params.payoutId,
      memberId: route.params.memberId
    })
  },
  // Cashout details page
  {
    path: '/members/:memberId/cashouts/:cashoutId',
    name: 'CashoutDetails',
    component: CashoutDetails,
    props: route => ({
      paymentId: route.params.cashoutId,
      memberId: route.params.memberId
    })
  },
  // Testing/debugging page for payout states
  {
    path: '/test-states',
    name: 'TestStates',
    component: TestStates
  },
  // Default route - redirects to default member's payout history
  {
    path: '/',
    redirect: '/members/member-001/payouts'
  }
]

// Create and configure router instance
const router = createRouter({
  history: createWebHistory(), // HTML5 history mode (requires server-side routing support)
  routes
})

export default router
