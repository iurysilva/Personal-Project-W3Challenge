import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { WithdrawValidator, DepositValidator } from '../../validators/CheckingAccountsValidator'
import CheckingAccount from 'App/Models/CheckingAccount'
import { TransactionTools } from '../../services/TransactionTools'


export default class TransactionsController {
    transactionTools = new TransactionTools()

    public async  withdraw( {request, response, auth}: HttpContextContract ){
        if (auth.use().user instanceof CheckingAccount){
            const checkingAccount = await CheckingAccount.findOrFail(auth.user?.$getAttribute('id'))
            await checkingAccount.load('client')
            const validator = new WithdrawValidator()
            const payload = await request.validate({schema: validator.defineSchema(checkingAccount.balance), 
                messages: {
                    'value.range': 'Insufficient balance'
                }})
            checkingAccount.balance -= payload.value
            await checkingAccount.save()
            await this.transactionTools.withdrawLog(checkingAccount, payload)
            response.send({'message':`Withdraw completed, your new balance is ${checkingAccount.balance}`})
        }
    }

    public async  deposit( {request, response, auth}: HttpContextContract ){
        if (auth.use().user instanceof CheckingAccount){
            const checkingAccount = await CheckingAccount.findOrFail(auth.user?.$getAttribute('id'))
            await checkingAccount.load('client')
            const validator = new DepositValidator()
            const payload = await request.validate({schema: validator.schema})
            checkingAccount.balance += payload.value
            await checkingAccount.save()
            await this.transactionTools.depositLog(checkingAccount, payload)
            response.send({'message':`Deposit completed, your new balance is ${checkingAccount.balance}`})
        }
    }
}
