/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Product, 'index'])
        router.post('/', [controllers.Product, 'store'])
      })
      .prefix('products')
      .as('products')
      .use(middleware.auth())
    
    router
      .group(() => {
        router.get('/', [controllers.Client, 'index'])
        router.get('/:id', [controllers.Client, 'show'])
        router.post('/', [controllers.Client, 'store'])
        router.put('/:id', [controllers.Client, 'update'])
        router.delete('/:id', [controllers.Client, 'destroy'])
      })
      .prefix('clients')
      .as('clients')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Transaction, 'index'])
        router.get('/:id', [controllers.Transaction, 'show'])
        router.post('/', [controllers.Transaction, 'store'])
        router.put('/:id', [controllers.Transaction, 'update'])
        router.delete('/:id', [controllers.Transaction, 'destroy'])
      })
      .prefix('transactions')
      .as('transactions')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
