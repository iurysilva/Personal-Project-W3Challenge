import CheckingAccount from "App/Models/CheckingAccount"
import Log from "App/Models/Log"

export class TransactionTools{
    public async depositLog(checkingAccount: CheckingAccount, payload: any){
        await Log.create({
                        title: `Deposit made by ${checkingAccount.client.name}`,
                        description: `Deposit made in the value of ${payload.value}`
                    })
    }

    public async withdrawLog(checkingAccount: CheckingAccount, payload: any){
        await Log.create({
                        title: `Withdraw made by ${checkingAccount.client.name}`,
                        description: `Withdraw made in the value of ${payload.value}`
                    })
    }
}
