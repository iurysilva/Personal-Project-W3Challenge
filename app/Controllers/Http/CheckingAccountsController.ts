import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OpenCheckingAccountsValidator, OpenFirstCheckingAccountsValidator, WithdrawValidator, DepositValidator } from '../../validators/CheckingAccountsValidator'
import { OpenCheckingAccountsTools } from 'App/services/OpenCheckingAccountTools'
import { TransactionTools } from '../../services/TransactionTools'

import Client from 'App/Models/Client'
import CheckingAccount from 'App/Models/CheckingAccount'


export default class CheckingAccountsController {
    tools = new OpenCheckingAccountsTools()
    transactionTools = new TransactionTools()

    public async openCheckingAccount({ request, response }: HttpContextContract) {
        const validator = new OpenCheckingAccountsValidator()
        await request.validate({schema: validator.schema, 
            messages: {
                'cpf.regex': "Field CPF must containt only numbers",
                'password.regex': "Field password must contain only only numbers, without repetition",
            }})
        const client = await Client.findBy("cpf", request.input('cpf'))
        if (!client){
            return response.notFound({'message': 'Client not found'})
        }
        const agency = await this.tools.defineAgency()
        const checkingAccount = await this.tools.saveCheckingAccount(request, client, agency)
        await this.tools.saveCheckingAccoungLog(checkingAccount, client, agency)
        return response.created({'message':`Your checking account with number ${checkingAccount.account_number} was created in agency ${agency.number}, you can access it using the same password informed.`})
    }

    public async openFirstCheckingAccount({ request, response }: HttpContextContract) {
        const validator = new OpenFirstCheckingAccountsValidator()
        await request.validate({schema: validator.schema, 
            messages: {
                'password.regex': "Field password must contain only only numbers, without repetition",
            }})
        const client = await this.tools.saveClient(request)
        const agency = await this.tools.defineAgency()
        const checkingAccount = await this.tools.saveCheckingAccount(request, client, agency)
        await this.tools.saveCheckingAccoungLog(checkingAccount, client, agency)
        return response.created({'message':`Your checking account with number ${checkingAccount.account_number} was created in agency ${agency.number}, you can access it using the same password informed.`})
    }

    public async consultBalance({ response, auth }) {
        if (auth.use().user instanceof CheckingAccount){
            const checkingAccount = await CheckingAccount.findOrFail(auth.user?.$getAttribute('id'))
            response.send({'message':checkingAccount.balance})
        }
    }

    public async  withdraw( {request, response, auth} ){
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

    public async  deposit( {request, response, auth} ){
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
