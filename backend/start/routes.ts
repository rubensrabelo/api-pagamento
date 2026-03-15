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

        router
          .post('logout', [controllers.AccessToken, 'destroy'])
          .use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/', [controllers.Profile, 'show'])

        router.put('/', [controllers.Profile, 'update'])

        router.delete('/', [controllers.Profile, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Product, 'index'])

        router.get('/:id', [controllers.Product, 'show'])

        router
          .post('/', [controllers.Product, 'store'])
          .use(middleware.role(['ADMIN', 'MANAGER', 'FINANCE']))

        router
          .put('/:id', [controllers.Product, 'update'])
          .use(middleware.role(['ADMIN', 'MANAGER', 'FINANCE']))

        router
          .delete('/:id', [controllers.Product, 'destroy'])
          .use(middleware.role(['ADMIN', 'MANAGER']))
      })
      .prefix('products')
      .as('products')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Client, 'index'])
          .use(middleware.role(['ADMIN', 'MANAGER']))

        router.get('/:id', [controllers.Client, 'show'])
          .use(middleware.role(['ADMIN', 'MANAGER']))

        router.post('/', [controllers.Client, 'store'])
          .use(middleware.role(['ADMIN', 'MANAGER']))

        router.put('/:id', [controllers.Client, 'update'])
          .use(middleware.role(['ADMIN', 'MANAGER']))

        router.delete('/:id', [controllers.Client, 'destroy'])
          .use(middleware.role(['ADMIN']))
      })
      .prefix('clients')
      .as('clients')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Transaction, 'index'])

        router.get('/:id', [controllers.Transaction, 'show'])

        router
          .post('/', [controllers.Transaction, 'store'])
          .use(middleware.role(['ADMIN', 'FINANCE']))

        router
          .put('/:id', [controllers.Transaction, 'update'])
          .use(middleware.role(['ADMIN', 'FINANCE']))
      })
      .prefix('transactions')
      .as('transactions')
      .use(middleware.auth())
  })
  .prefix('/api/v1')