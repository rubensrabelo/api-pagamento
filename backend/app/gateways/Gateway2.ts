import { IGateway } from "./interfaces/IGateway.ts"
import { ChargeResponse, RefundResponse } from "./interfaces/IGatewayResponse.ts"

export class Gateway2 implements IGateway {
  private name = 'Gateway2'
  private baseUrl = 'http://localhost:3002'
  private headers = {
    'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
    'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
    'Content-Type': 'application/json',
  }

  async charge(data: any) {
    try {
      const res = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      })

      const json = (await res.json()) as Partial<ChargeResponse>

      if (res.ok && json.id) {
        return { success: true, external_id: json.id, gatewayName: this.name }
      }

      return { success: false, message: json.message || 'Erro desconhecido', gatewayName: this.name }
    } catch (err: any) {
      return { success: false, message: err.message, gatewayName: this.name }
    }
  }

  async refund(external_id: string) {
    try {
      const res = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ id: external_id }),
      })

      if (res.ok) return { success: true , gatewayName: this.name}

      const json = (await res.json()) as Partial<RefundResponse>
      return { success: false, message: json.message || 'Erro desconhecido', gatewayName: this.name }
    } catch (err: any) {
      return { success: false, message: err.message, gatewayName: this.name }
    }
  }
}