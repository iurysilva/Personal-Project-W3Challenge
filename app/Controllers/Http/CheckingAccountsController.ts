import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OpenCheckingAccountsValidator, OpenFirstCheckingAccountsValidator } from '../../validators/CheckingAccountsValidator'
import { OpenCheckingAccountsTools } from 'App/services/openCheckingAccountTools'

import Client from 'App/Models/Client'


export default class CheckingAccountsController {
    tools = new OpenCheckingAccountsTools()

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
}
