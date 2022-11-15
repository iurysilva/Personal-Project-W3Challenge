import CheckingAccount from "App/Models/CheckingAccount"
import GiftCard from "App/Models/GiftCard"
import Log from "App/Models/Log"
import Transaction from "App/Models/Transaction"
import { DateTime } from "luxon"

export class TransactionTools{
    public async generateWithdrawTransaction(checkingAccount: CheckingAccount, value: string){
        await Transaction.create({
            checking_account_id: checkingAccount.id,
            type: "withdraw",
            value: '-'+value,
            date: DateTime.now()
        })
        await Log.create({
            title: `Withdraw made by ${checkingAccount.client.name}`,
            description: `Withdraw made in the value of ${value}`
        })
    }

    public async generateDepositTransaction(checkingAccount: CheckingAccount, value: string){
        await Transaction.create({
            checking_account_id: checkingAccount.id,
            type: "deposit",
            value: '+'+value,
            date: DateTime.now()
        })
        await Log.create({
            title: `Deposit made by ${checkingAccount.client.name}`,
            description: `Deposit made in the value of ${value}`
        })
    }

    public async generateGiftCardTransaction(checkingAccount: CheckingAccount, value: string, giftCard: GiftCard){
        await Transaction.create({
            checking_account_id: checkingAccount.id,
            type: "payment done",
            value: '-'+value,
            date: DateTime.now()
        })
        await Log.create({
            title: `Payment made by ${checkingAccount.client.name}`,
            description: `Gift card ${giftCard.name} from ${giftCard.company} bought in the value of ${value}`
        })
    }

    public async generateTransferenceTransaction(checkingAccount: CheckingAccount, destinyCheckingAccount: CheckingAccount, value: string){
        await Transaction.create({
            checking_account_id: checkingAccount.id,
            type: "payment done",
            value: '-'+value,
            date: DateTime.now()
        })
        await Transaction.create({
            checking_account_id: destinyCheckingAccount.id,
            type: "payment received",
            value: '+'+value,
            date: DateTime.now()
        })
        await Log.create({
            title: `Payment made by ${checkingAccount.client.name}`,
            description: `Transference made by ${checkingAccount.client.name} to ${destinyCheckingAccount.client.name} in the value of ${value}`
        })
        await Log.create({
            title: `Payment received by ${destinyCheckingAccount.client.name}`,
            description: `Transference received by ${destinyCheckingAccount.client.name} from ${checkingAccount.client.name} in the value of ${value}`
        })
    }
}
