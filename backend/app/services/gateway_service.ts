import Gateway from '#models/gateway'

export class GatewayService {

  async toggle(id: number): Promise<Gateway> {
    const gateway = await Gateway.findOrFail(id)

    gateway.isActive = !gateway.isActive

    await gateway.save()

    return gateway
  }

  async updatePriority(id: number, priority: number): Promise<Gateway> {
    const gateway = await Gateway.findOrFail(id)

    gateway.priority = priority

    await gateway.save()

    return gateway
  }

}