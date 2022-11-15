/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})


Route.post('/openCheckingAccount', 'CheckingAccountsController.openCheckingAccount')
Route.post('/openFirstCheckingAccount', 'CheckingAccountsController.openFirstCheckingAccount')
Route.post('/login', 'AuthController.login')

Route.get('/logs', 'LogsController.index')


Route.group(() => {
  Route.get('/authenticated', 'AuthController.authenticated')
  Route.post('/logout', 'AuthController.logout')

  Route.get('/consultBalance', 'CheckingAccountsController.consultBalance')
  Route.post('/transactions', 'CheckingAccountsController.getTransactions')

  Route.post('/withdraw', 'TransactionsController.withdraw')
  Route.post('/deposit', 'TransactionsController.deposit')
  Route.get('/giftCardTypes', 'GiftCardTypesController.index')
  Route.post('/buyGiftCard', 'TransactionsController.buyGiftCard')
  Route.post('/transference', 'TransactionsController.transference')
}).middleware('auth:checkingAccount')