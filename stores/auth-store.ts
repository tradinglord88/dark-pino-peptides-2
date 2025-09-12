'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
// Dynamic import to prevent build errors when Supabase isn't configured
const getSupabase = () => {
  try {
    const { supabase } = require('@/lib/supabase/client')
    // Check if we have a real Supabase client (not the placeholder)
    const url = supabase.supabaseUrl
    if (url === 'https://placeholder.supabase.co') {
      console.warn('Supabase not configured - using placeholder client')
      return null
    }
    return supabase
  } catch (error) {
    console.warn('Supabase not configured, auth features will be disabled')
    return null
  }
}
import { User } from '@supabase/supabase-js'
import { User as DbUser } from '@/lib/supabase/types'

interface AuthStore {
  user: User | null
  profile: DbUser | null
  isLoading: boolean
  isHydrated: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<DbUser>) => Promise<{ success: boolean; error?: string }>
  loadUser: () => Promise<void>
  setHydrated: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      isHydrated: false,

      signUp: async (email: string, password: string, fullName: string) => {
        try {
          const supabase = getSupabase()
          if (!supabase) {
            return { 
              success: false, 
              error: 'Account creation is temporarily unavailable. Please contact support for assistance.' 
            }
          }

          set({ isLoading: true })
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })

          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user) {
            set({ user: data.user })
            // Profile will be created automatically by database trigger
            const store = get()
            if (store && typeof store.loadUser === 'function') {
              await store.loadUser()
            }
          }

          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          }
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          const supabase = getSupabase()
          if (!supabase) {
            return { 
              success: false, 
              error: 'Sign in is temporarily unavailable. Please contact support for assistance.' 
            }
          }

          set({ isLoading: true })
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user) {
            set({ user: data.user })
            const store = get()
            if (store && typeof store.loadUser === 'function') {
              await store.loadUser()
            }
          }

          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          }
        }
      },

      signOut: async () => {
        try {
          const supabase = getSupabase()
          if (!supabase) return
          
          set({ isLoading: true })
          await supabase.auth.signOut()
          set({ user: null, profile: null, isLoading: false })
        } catch (error) {
          console.error('Sign out error:', error)
          set({ isLoading: false })
        }
      },

      updateProfile: async (updates: Partial<DbUser>) => {
        try {
          const supabase = getSupabase()
          if (!supabase) {
            return { 
              success: false, 
              error: 'Profile updates are temporarily unavailable. Please contact support for assistance.' 
            }
          }

          const { user } = get()
          if (!user) return { success: false, error: 'Not authenticated' }

          const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

          if (error) {
            return { success: false, error: error.message }
          }

          set({ profile: data })
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          }
        }
      },

      loadUser: async () => {
        try {
          const supabase = getSupabase()
          if (!supabase) return

          const { user } = get()
          if (!user) return

          // Load user profile from database
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading user profile:', error)
            return
          }

          set({ profile: profile || null })
        } catch (error) {
          console.error('Error in loadUser:', error)
        }
      },

      setHydrated: () => {
        set({ isHydrated: true })
        
        // Initialize auth state
        const initAuth = async () => {
          const supabase = getSupabase()
          if (!supabase) {
            set({ isLoading: false })
            return
          }

          try {
            const { data: { session } } = await supabase.auth.getSession()
            
            if (session?.user) {
              set({ user: session.user, isLoading: true })
              const store = get()
              if (store && typeof store.loadUser === 'function') {
                await store.loadUser()
              }
            }
            
            set({ isLoading: false })
          } catch (error) {
            console.error('Error initializing auth:', error)
            set({ isLoading: false })
          }
        }
        
        initAuth()

        // Listen for auth changes
        const supabase = getSupabase()
        if (supabase) {
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              set({ user: session.user, isLoading: true })
              const store = get()
              if (store && typeof store.loadUser === 'function') {
                await store.loadUser()
              }
              set({ isLoading: false })
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, profile: null, isLoading: false })
            }
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({
        // Only persist minimal data, not sensitive auth info
        isHydrated: state.isHydrated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof state.setHydrated === 'function') {
          state.setHydrated()
        }
      },
    }
  )
)