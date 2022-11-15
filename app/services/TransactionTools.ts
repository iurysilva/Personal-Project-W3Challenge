import CheckingAccount from "App/Models/CheckingAccount"
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
}
