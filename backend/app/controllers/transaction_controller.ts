import type { HttpContext } from '@adonisjs/core/http'
import { TransactionService } from '#services/transaction_service'
import TransactionTransformer from '#transformers/transaction_transformer'
import { createTransactionValidator, updateTransactionValidator } from '#validators/transaction_validator'
import { GatewayType } from '../types/GatewayType.ts'
import { TransactionInput } from '../types/TransactionInput.ts'

export default class TransactionsController {
  private transactionService = new TransactionService()

  async index({ serialize }: HttpContext) {
    const transactions = await this.transactionService.getAll()
    return serialize(TransactionTransformer.transform(transactions))
  }

  async show({ params, serialize }: HttpContext) {
    const transaction = await this.transactionService.getById(params.id)
    return serialize(TransactionTransformer.transform(transaction))
  }

  async store({ request, response, serialize }: HttpContext) {
    const validated = await request.validateUsing(createTransactionValidator)

    const gateway: GatewayType = validated.gateway === 'gateway1' ? 'gateway1' : 'gateway2'

    const input: TransactionInput = {
      clientId: validated.clientId,
      gateway,
      cardNumber: validated.cardNumber,
      cardLastNumbers: validated.cardLastNumbers,
      cvv: validated.cvv,
      products: validated.products,
    }

    const transaction = await this.transactionService.create(input)

    response.status(201)
    return serialize(TransactionTransformer.transform(transaction))
  }

  async update({ params, request, serialize }: HttpContext) {
    const data = await request.validateUsing(updateTransactionValidator)
    const transaction = await this.transactionService.update(params.id, data)
    return serialize(TransactionTransformer.transform(transaction))
  }
}