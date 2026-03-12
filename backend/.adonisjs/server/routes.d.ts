import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'products.product.index': { paramsTuple?: []; params?: {} }
    'products.product.store': { paramsTuple?: []; params?: {} }
    'clients.client.index': { paramsTuple?: []; params?: {} }
    'clients.client.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.client.store': { paramsTuple?: []; params?: {} }
    'clients.client.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.client.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'products.product.index': { paramsTuple?: []; params?: {} }
    'clients.client.index': { paramsTuple?: []; params?: {} }
    'clients.client.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'products.product.index': { paramsTuple?: []; params?: {} }
    'clients.client.index': { paramsTuple?: []; params?: {} }
    'clients.client.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'products.product.store': { paramsTuple?: []; params?: {} }
    'clients.client.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'clients.client.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'clients.client.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}