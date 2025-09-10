'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TermsStore {
  hasAgreedToTerms: boolean
  lastAgreedDate: string | null
  isModalOpen: boolean
  isHydrated: boolean
  agreeToTerms: () => void
  checkAgreementStatus: () => boolean
  showModal: () => void
  hideModal: () => void
  setHydrated: () => void
  // Version tracking for terms updates
  termsVersion: string
  updateTermsVersion: (version: string) => void
}

const CURRENT_TERMS_VERSION = '1.0.0'

export const useTermsStore = create<TermsStore>()(
  persist(
    (set, get) => ({
      hasAgreedToTerms: false,
      lastAgreedDate: null,
      isModalOpen: false,
      isHydrated: false,
      termsVersion: '',

      agreeToTerms: () => {
        const now = new Date().toISOString()
        set({
          hasAgreedToTerms: true,
          lastAgreedDate: now,
          isModalOpen: false,
          termsVersion: CURRENT_TERMS_VERSION,
        })
      },

      checkAgreementStatus: () => {
        const { hasAgreedToTerms, termsVersion } = get()
        // User needs to agree if they haven't agreed or if terms version is outdated
        return hasAgreedToTerms && termsVersion === CURRENT_TERMS_VERSION
      },

      showModal: () => set({ isModalOpen: true }),

      hideModal: () => set({ isModalOpen: false }),

      setHydrated: () => {
        set({ isHydrated: true })
        // Check if we need to show the modal after hydration
        const { checkAgreementStatus } = get()
        if (!checkAgreementStatus()) {
          set({ isModalOpen: true })
        }
      },

      updateTermsVersion: (version: string) => set({ termsVersion: version }),
    }),
    {
      name: 'terms-storage',
      storage: createJSONStorage(() => {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated()
        }
      },
    }
  )
)

export { CURRENT_TERMS_VERSION }