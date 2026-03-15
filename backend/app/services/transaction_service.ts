import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import Client from '#models/client'
import Product from '#models/product'
import { CreateTransactionDTO, UpdateTransactionDTO, TransactionStatus } from '../dtos/transaction_dto.ts'
import { inject } from '@adonisjs/core'
import { PaymentService } from './payment_service.ts'

@inject()
export class TransactionService {
  constructor(private paymentService: PaymentService) {}

  async getAll(): Promise<Transaction[]> {
    return await Transaction.query().preload('products')
  }

  async getById(id: number): Promise<Transaction> {
    return await Transaction.query().where('id', id).preload('products').firstOrFail()
  }

  async create(data: CreateTransactionDTO): Promise<Transaction> {
    const productIds = data.products.map((p) => p.productId)
    const products = await Product.query().whereIn('id', productIds)
    let total = 0

    for (const item of data.products) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error(`Produto ${item.productId} não encontrado`)
      total += product.amount * item.quantity
    }

    const transaction = await Transaction.create({ 
      clientId: data.clientId, 
      gateway: data.gateway, // valor inicial, será atualizado depois
      amount: total, 
      cardLastNumbers: data.cardLastNumbers ?? '', 
      status: 'PENDING' as TransactionStatus, 
    })

    // Cria os itens da transação
    for (const item of data.products) {
      await TransactionProduct.create({
        transactionId: transaction.id,
        productId: item.productId,
        quantity: item.quantity,
      })
    }

    await transaction.load('products')
    const client = await Client.findOrFail(data.clientId)

    // Remove init() – o PaymentService agora consulta gateways a cada chamada
    const result = await this.paymentService.charge({
      amount: total,
      name: client.name ?? 'Cliente',
      email: client.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    // Atualiza status e gateway
    transaction.status = result.success ? 'SUCCESS' : 'FAILED'
    transaction.externalId = result.external_id ?? null
    transaction.gateway = result.gatewayName ?? data.gateway

    await transaction.save()
    await transaction.refresh()
    await transaction.load('products')

    return transaction
  }

  async update(id: number, data: UpdateTransactionDTO): Promise<Transaction> {
    const transaction = await Transaction.findOrFail(id)
    transaction.merge(data)
    await transaction.save()
    await transaction.load('products')
    return transaction
  }

  async refund(id: number): Promise<Transaction> {
    const transaction = await Transaction.findOrFail(id)
    if (!transaction.externalId) throw new Error('Transação não possui external_id')

    // Não precisa mais init()
    const result = await this.paymentService.refund(transaction.externalId)

    if (result.success) {
      transaction.status = 'REFUNDED'
      transaction.gateway = result.gatewayName ?? transaction.gateway
    }

    await transaction.save()
    await transaction.refresh()
    await transaction.load('products')

    return transaction
  }
}