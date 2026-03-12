const express = require("express")
const { randomUUID } = require("crypto")
require("dotenv").config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const TOKEN = process.env.TOKEN
const SECRET = process.env.SECRET
const GATEWAY_NAME = process.env.GATEWAY_NAME
const FAIL_RATE = Number(process.env.FAIL_RATE || 0)

app.use((req, res, next) => {
  const token = req.header("Gateway-Auth-Token")
  const secret = req.header("Gateway-Auth-Secret")

  if (token !== TOKEN || secret !== SECRET) {
    return res.status(401).json({
      message: "Unauthorized",
    })
  }

  next()
})

app.post("/transacoes", (req, res) => {
  const { amount, cardNumber, cvv } = req.body

  if (!amount || !cardNumber || !cvv) {
    return res.status(400).json({
      message: "Dados inválidos",
    })
  }

  if (Math.random() < FAIL_RATE) {
    return res.status(400).json({
      message: `Transação recusada pelo ${GATEWAY_NAME}`,
    })
  }

  return res.json({
    id: randomUUID(),
  })
})

app.post("/transacoes/reembolso", (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      message: "ID da transação obrigatório",
    })
  }

  return res.json({
    success: true,
  })
})

app.listen(PORT, () => {
  console.log(`${GATEWAY_NAME} rodando na porta ${PORT}`)
})