import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CheckingAccountsValidator } from '../../validators/CheckingAccountsValidator'
import { randomString, randomInteger } from '../../../services/random'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { DateTime } from 'luxon'

import CheckingAccount from 'App/Models/CheckingAccount'
import Client from 'App/Models/Client'
import Agency from 'App/Models/Agency'
import Log from 'App/Models/Log'


export default class CheckingAccountsController {
    public async defineAgency(){
        const agencies = await Agency.query().preload('checking_accounts')
        const agency = agencies.reduce((prev, current) => (prev.checking_accounts.length < current.checking_accounts.length) ? prev : current)
        return agency
    }

    public async saveClient(request: RequestContract){
        const data = request.except(['password'])
        const client = await Client.create(data)
        return client
    }

    public async saveCheckingAccount(request: RequestContract, client: Client, agency: Agency){
        const checkingAccount = await CheckingAccount.create({
            client_id: client.id,
            agency_id: agency.id,
            number: randomString(randomInteger(6, 17), '0123456789'),
            password: request.input('password')
        })
        return checkingAccount
    }

    public async saveLog(checkingAccount: CheckingAccount, client: Client, agency: Agency){
        await Log.create({
            title: `Checking Account ${checkingAccount.id} created for ${client.name}`,
            description: `A checking account with number ${checkingAccount.number} was created in agency ${agency.number}, for the client ${client.name} in ${checkingAccount.createdAt}`
        })
    }

    public async openCheckingAccount({ request, response }: HttpContextContract) {
        const validator = new CheckingAccountsValidator()
        await request.validate({schema: validator.schema, refs: validator.refs, 
            messages: {
                'password.regex': "Field password must contain only only numbers, without repetition",
                'cpf.regex': "Field CPF must containt only numbers",
                'birth_date.before': "Client cannot be a minor" 
            }})
        const client = await this.saveClient(request)
        const agency = await this.defineAgency()
        const checkingAccount = await this.saveCheckingAccount(request, client, agency)
        await this.saveLog(checkingAccount, client, agency)
        return response.created(`Your checking account with number ${checkingAccount.number} was created in agency ${agency.number}, you can access it using the same password informed.`)
    }


}
