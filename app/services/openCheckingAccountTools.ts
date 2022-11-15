import Agency from "App/Models/Agency"
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ClientsValidator } from "App/validators/ClientsValidator"
import Client from "App/Models/Client"
import Log from "App/Models/Log"
import {randomString, randomInteger} from '../services/random'
import CheckingAccount from "App/Models/CheckingAccount"

export class OpenCheckingAccountsTools{
    public async defineAgency(){
        const agencies = await Agency.query().preload('checking_accounts')
        const agency = agencies.reduce((prev, current) => (prev.checking_accounts.length < current.checking_accounts.length) ? prev : current)
        return agency
    }

    public async saveClient(request: RequestContract){
        const validator = new ClientsValidator()
        await request.validate({schema: validator.schema, refs: validator.refs, 
            messages: {
                'cpf.regex': "Field CPF must containt only numbers",
                'birth_date.before': "Client cannot be a minor" 
            }})
        const data = request.except(['password'])
        const client = await Client.create(data)
        this.saveClientLog(client)
        return client
    }

    async saveClientLog(client: Client){
        await Log.create({
            title: `Client ${client.name} was registered`,
            description: `The client ${client.name} with CPF ${client.cpf} was registered in ${client.createdAt}`
        })
    }

    async saveCheckingAccount(request: RequestContract, client: Client, agency: Agency){
        const checkingAccount = await CheckingAccount.create({
            client_id: client.id,
            agency_id: agency.id,
            account_number: randomString(randomInteger(6, 17), '0123456789'),
            password: request.input('password'),
            balance: 0
        })
        return checkingAccount
    }

    async saveCheckingAccoungLog(checkingAccount: CheckingAccount, client: Client, agency: Agency){
        await Log.create({
            title: `Checking Account ${checkingAccount.id} created for ${client.name}`,
            description: `A checking account with number ${checkingAccount.account_number} was created in agency ${agency.number}, for the client ${client.name} in ${checkingAccount.createdAt}`
        })
    }
}