import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { WithdrawValidator, DepositValidator, GiftCardValidator, TransferenceValidator } from '../../validators/TransactionsValidator'
import CheckingAccount from 'App/Models/CheckingAccount'
import { TransactionTools } from '../../services/TransactionTools'
import GiftCard from 'App/Models/GiftCard'


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
            await this.transactionTools.generateWithdrawTransaction(checkingAccount, request.input('value'))
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
            await this.transactionTools.generateDepositTransaction(checkingAccount, request.input('value'))
            response.send({'message':`Deposit completed, your new balance is ${checkingAccount.balance}`})
        }
    }

    public async buyGiftCard( {request, response, auth}: HttpContextContract ){
        if (auth.use().user instanceof CheckingAccount){
            const checkingAccount = await CheckingAccount.findOrFail(auth.user?.$getAttribute('id'))
            await checkingAccount.load('client')
            const validator = new GiftCardValidator()
            const payload = await request.validate({schema: validator.defineSchema(checkingAccount.balance),
            messages: {
                'gift_card_id.exists': 'Gift card not found',
                'value.range': 'Insufficient balance'
            }})
            checkingAccount.balance -= payload.value
            await checkingAccount.save()
            const giftCard = await GiftCard.findOrFail(payload.gift_card_id)
            await this.transactionTools.generateGiftCardTransaction(checkingAccount, request.input('value'), giftCard)
            response.send({'message':`You bought the gift card of ${giftCard.company} successfully, your new balance is ${checkingAccount.balance}`})
        }
    }

    public async transference( {request, response, auth}: HttpContextContract ){
        if (auth.use().user instanceof CheckingAccount){
            const checkingAccount = await CheckingAccount.findOrFail(auth.user?.$getAttribute('id'))
            await checkingAccount.load('client')
            const validator = new TransferenceValidator()
            const payload = await request.validate({schema: validator.defineSchema(checkingAccount.balance),
            messages: {
                'value.range': 'Insufficient balance',
                'destiny_account_number.exists': 'Destiny account not found',
                'destiny_account_number.regex': 'Invalid destiny account number',
                'destiny_agency_number.exists': 'Destiny agency not found',
                'destiny_agency_number.regex': 'Invalid agency number',
            }})
            const destinyCheckingAccount = await CheckingAccount.query().whereHas('agency', (query) => {
                query.where('number', payload.destiny_agency_number)
            }).where('account_number', payload.destiny_account_number).first()
            if (destinyCheckingAccount){
                checkingAccount.balance -= payload.value
                await checkingAccount.save()
                destinyCheckingAccount.balance += payload.value
                await destinyCheckingAccount.save()
                await destinyCheckingAccount.load('client')
                await this.transactionTools.generateTransferenceTransaction(checkingAccount, destinyCheckingAccount, request.input('value'))
                response.send({'message':`Your transference to the account ${destinyCheckingAccount.account_number} of ${destinyCheckingAccount.client.name} in the value of ${payload.value} was made successfully`})
            }
            else{
                response.notFound({'message': 'Destiny account not found'})
            }
        }
    }
}
