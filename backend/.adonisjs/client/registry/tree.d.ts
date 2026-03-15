/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
      update: typeof routes['profile.profile.update']
      destroy: typeof routes['profile.profile.destroy']
    }
  }
  products: {
    product: {
      index: typeof routes['products.product.index']
      show: typeof routes['products.product.show']
      store: typeof routes['products.product.store']
      update: typeof routes['products.product.update']
      destroy: typeof routes['products.product.destroy']
    }
  }
  clients: {
    client: {
      index: typeof routes['clients.client.index']
      show: typeof routes['clients.client.show']
      store: typeof routes['clients.client.store']
      update: typeof routes['clients.client.update']
      destroy: typeof routes['clients.client.destroy']
    }
  }
  gateway: {
    toggle: typeof routes['gateway.toggle']
    updatePriority: typeof routes['gateway.update_priority']
  }
  transactions: {
    transaction: {
      index: typeof routes['transactions.transaction.index']
      show: typeof routes['transactions.transaction.show']
      store: typeof routes['transactions.transaction.store']
      update: typeof routes['transactions.transaction.update']
    }
  }
}
