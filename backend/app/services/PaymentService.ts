import Gateway from "#models/gateway"
import { Gateway1 } from "../gateways/Gateway1.ts"
import { Gateway2 } from "../gateways/Gateway2.ts"
import { IGateway } from "../gateways/interfaces/IGateway.ts"
import { PaymentChargeDTO, PaymentResultDTO, RefundResultDTO } from '../dtos/payment_dto.ts'

export class PaymentService {
  private gateways: IGateway[] = []

  async init() {
    const activeGateways = await Gateway.query()
      .where('is_active', true)
      .orderBy('priority', 'asc')

    for (const g of activeGateways) {
      if (g.name === 'Gateway1') this.gateways.push(new Gateway1())
      if (g.name === 'Gateway2') this.gateways.push(new Gateway2())
    }
  }

  async charge(data: PaymentChargeDTO): Promise<PaymentResultDTO> {
    for (const gateway of this.gateways) {
      const result = await gateway.charge(data)
      if (result.success) return result
    }
    return { success: false, message: 'All gateways failed' }
  }

  async refund(external_id: string): Promise<RefundResultDTO> {
    for (const gateway of this.gateways) {
      const result = await gateway.refund(external_id)
      if (result.success) return result
    }
    return { success: false, message: 'Refund failed on all gateways' }
  }
}