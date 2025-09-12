export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          guest_email: string | null
          total_amount: number
          status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
          payment_method: 'stripe' | 'solana' | 'etransfer'
          stripe_session_id: string | null
          solana_signature: string | null
          etransfer_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_email?: string | null
          total_amount: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
          payment_method: 'stripe' | 'solana' | 'etransfer'
          stripe_session_id?: string | null
          solana_signature?: string | null
          etransfer_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_email?: string | null
          total_amount?: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
          payment_method?: 'stripe' | 'solana' | 'etransfer'
          stripe_session_id?: string | null
          solana_signature?: string | null
          etransfer_reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
      }
      shipping_addresses: {
        Row: {
          id: string
          order_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          address: string
          city: string
          state: string
          postal_code: string
          country: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address: string
          city: string
          state: string
          postal_code: string
          country: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          created_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          billing_interval: 'monthly' | 'quarterly' | 'yearly'
          trial_days: number
          product_count: number
          discount_percentage: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          billing_interval: 'monthly' | 'quarterly' | 'yearly'
          trial_days?: number
          product_count?: number
          discount_percentage?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          billing_interval?: 'monthly' | 'quarterly' | 'yearly'
          trial_days?: number
          product_count?: number
          discount_percentage?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'paused' | 'cancelled' | 'expired' | 'trial'
          current_period_start: string
          current_period_end: string
          trial_end: string | null
          cancelled_at: string | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'paused' | 'cancelled' | 'expired' | 'trial'
          current_period_start: string
          current_period_end: string
          trial_end?: string | null
          cancelled_at?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'paused' | 'cancelled' | 'expired' | 'trial'
          current_period_start?: string
          current_period_end?: string
          trial_end?: string | null
          cancelled_at?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_items: {
        Row: {
          id: string
          subscription_id: string
          product_id: string
          product_name: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          product_id: string
          product_name: string
          quantity?: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
      }
      subscription_deliveries: {
        Row: {
          id: string
          subscription_id: string
          delivery_date: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'failed'
          tracking_number: string | null
          shipping_carrier: string | null
          delivery_notes: string | null
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          delivery_date: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'failed'
          tracking_number?: string | null
          shipping_carrier?: string | null
          delivery_notes?: string | null
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          delivery_date?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'failed'
          tracking_number?: string | null
          shipping_carrier?: string | null
          delivery_notes?: string | null
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscription_delivery_items: {
        Row: {
          id: string
          delivery_id: string
          product_id: string
          product_name: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          delivery_id: string
          product_id: string
          product_name: string
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          delivery_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
      }
      subscription_preferences: {
        Row: {
          id: string
          subscription_id: string
          preferred_delivery_day: number
          skip_months: string[] | null
          special_instructions: string | null
          allergy_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          preferred_delivery_day?: number
          skip_months?: string[] | null
          special_instructions?: string | null
          allergy_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          preferred_delivery_day?: number
          skip_months?: string[] | null
          special_instructions?: string | null
          allergy_info?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type ShippingAddress = Database['public']['Tables']['shipping_addresses']['Row']
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row']
export type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row']
export type SubscriptionItem = Database['public']['Tables']['subscription_items']['Row']
export type SubscriptionDelivery = Database['public']['Tables']['subscription_deliveries']['Row']
export type SubscriptionDeliveryItem = Database['public']['Tables']['subscription_delivery_items']['Row']
export type SubscriptionPreferences = Database['public']['Tables']['subscription_preferences']['Row']

export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertOrder = Database['public']['Tables']['orders']['Insert']
export type InsertOrderItem = Database['public']['Tables']['order_items']['Insert']
export type InsertShippingAddress = Database['public']['Tables']['shipping_addresses']['Insert']
export type InsertSubscriptionPlan = Database['public']['Tables']['subscription_plans']['Insert']
export type InsertUserSubscription = Database['public']['Tables']['user_subscriptions']['Insert']
export type InsertSubscriptionItem = Database['public']['Tables']['subscription_items']['Insert']
export type InsertSubscriptionDelivery = Database['public']['Tables']['subscription_deliveries']['Insert']
export type InsertSubscriptionDeliveryItem = Database['public']['Tables']['subscription_delivery_items']['Insert']
export type InsertSubscriptionPreferences = Database['public']['Tables']['subscription_preferences']['Insert']

export type UpdateUser = Database['public']['Tables']['users']['Update']
export type UpdateOrder = Database['public']['Tables']['orders']['Update']
export type UpdateUserSubscription = Database['public']['Tables']['user_subscriptions']['Update']
export type UpdateSubscriptionDelivery = Database['public']['Tables']['subscription_deliveries']['Update']
export type UpdateSubscriptionPreferences = Database['public']['Tables']['subscription_preferences']['Update']