// stores/userStore.js
import {create} from 'zustand'
import { devtools } from 'zustand/middleware'
import useProfile from '../../Hooks/useProfile'
import { usePaymentAccount } from '../../Hooks/subscription/useCreateAccount'

export const useUserStore = create(devtools((set, get) => ({
  // ─── State ───────────────────────────────────────────────────────────────
  authProfile: null,
  paymentDetails: null,
  loading: false,
  errors: null,
  _paymentAttempted: false,
  refreshCounter: 0,

  // ─── Actions ─────────────────────────────────────────────────────────────
  initPreload: async () => {
    const { fetchAuth, fetchPayment } = get()
    set({ loading: true })
    try {
      await fetchAuth()
      await fetchPayment()
    } finally {
      set({ loading: false })
    }
  },

  fetchAuth: async () => {
    const { refreshProfile } = useProfile()
    try {
      const { profile } = await refreshProfile()
      set({ authProfile: profile })
    } catch (err) {
      set(state => ({ errors: { ...state.errors, auth: err } }))
      throw err
    }
  },

  fetchPayment: async () => {
    const { fetchPaymentDetails, resetError } = usePaymentAccount()
    // only once
    if (get()._paymentAttempted) return
    set({ _paymentAttempted: true })
    try {
      resetError()
      const { paymentDetails } = await fetchPaymentDetails()
      set({ paymentDetails })
    } catch (err) {
      set(state => ({ errors: { ...state.errors, payment: err } }))
      throw err
    }
  },

  retryPreload: async () => {
    set(state => ({
      loading: true,
      errors: null,
      refreshCounter: state.refreshCounter + 1,
      _paymentAttempted: false
    }))
    try {
      await get().initPreload()
    } finally {
      set({ loading: false })
    }
  },
})))
