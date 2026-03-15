import Gateway from "#models/gateway"
import { Gateway1 } from "../gateways/Gateway1.ts"
import { Gateway2 } from "../gateways/Gateway2.ts"
import { IGateway } from "../gateways/interfaces/IGateway.ts"
import { PaymentChargeDTO, PaymentResultDTO, RefundResultDTO } from '../dtos/payment_dto.ts'

export class PaymentService {
  private async getActiveGateways(): Promise<IGateway[]> {
    const activeGateways = await Gateway.query()
      .where('is_active', true)
      .orderBy('priority', 'desc')

    const gateways: IGateway[] = []
    for (const g of activeGateways) {
      if (g.name === 'Gateway1') gateways.push(new Gateway1())
      if (g.name === 'Gateway2') gateways.push(new Gateway2())
    }
    return gateways
  }

  async charge(data: PaymentChargeDTO): Promise<PaymentResultDTO> {
    const gateways = await this.getActiveGateways()

    for (const gateway of gateways) {
      try {
        const result = await gateway.charge(data)
        if (result.success) return result
      } catch {}
    }

    return { success: false, message: 'All gateways failed' }
  }

  async refund(external_id: string): Promise<RefundResultDTO> {
    const gateways = await this.getActiveGateways()

    for (const gateway of gateways) {
      try {
        const result = await gateway.refund(external_id)
        if (result.success) return result
      } catch {}
    }

    return { success: false, message: 'Refund failed on all gateways' }
  }
}