import CheckingAccount from "App/Models/CheckingAccount"
import type { AuthContract } from "@ioc:Adonis/Addons/Auth"

export class AuthenticationTools{
    public async getLoggedUser(auth: AuthContract){
        if (auth.use().user instanceof CheckingAccount){
            const checkingAccount = await CheckingAccount.findOrFail(auth.user?.$getAttribute('id'))
            return checkingAccount
        }
    }
}