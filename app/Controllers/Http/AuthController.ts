import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CheckingAccount from 'App/Models/CheckingAccount'
import Hash from '@ioc:Adonis/Core/Hash'
import Log from 'App/Models/Log'
import { DateTime } from 'luxon'


export default class AuthController{
    public async saveLoginLog(checkingAccount: CheckingAccount){
        await checkingAccount.load('client')
        await checkingAccount.load('agency')
        Log.create({
            title: `Authentication realized by ${checkingAccount.client.name} at ${DateTime.now()}`,
            description: `The checking account ${checkingAccount.account_number} of agency ${checkingAccount.agency.number} was accessed`
        })
    }
    
    public async login({ auth, request, response }: HttpContextContract){
        const agencyNumber = request.input('agency')
        const checkingAccountNumber = request.input('checking_account')
        const password = request.input('password')
        
        const checkingAccount = await CheckingAccount
            .query()
            .where('account_number', checkingAccountNumber)
            .whereHas('agency', (query)=> {
                query.where('number', agencyNumber)
            })
            .first()
        
        if (checkingAccount){
            if (!(await Hash.verify(checkingAccount.password, password))) {
                return response.unauthorized('Invalid credentials')
                }
            const token = await auth.use('checkingAccount').generate(checkingAccount, {
                expiresIn: '2days'
                })
            this.saveLoginLog(checkingAccount)
            return token
        }else{
            return response.notFound({'message':'User not found'})
        }
    }

    public async authenticated({ auth, response }: HttpContextContract){
        if (auth.use().user instanceof CheckingAccount){
            const checkingAccount = await CheckingAccount.findOrFail(auth.user?.$getAttribute('id'))
            response.send(checkingAccount)
        }
    }

    public async logout({auth}){
        await auth.use().revoke()
        return {
            loggedOut: true
        }
    }
}