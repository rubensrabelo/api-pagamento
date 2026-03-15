import type { HttpContext } from '@adonisjs/core/http'
import { GatewayService } from '#services/gateway_service'
import { inject } from '@adonisjs/core'

@inject()
export default class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  async toggle({ params }: HttpContext) {
    return this.gatewayService.toggle(params.id)
  }

  async updatePriority({ params, request }: HttpContext) {

    const priority = request.input('priority')

    return this.gatewayService.updatePriority(params.id, priority)

  }

}