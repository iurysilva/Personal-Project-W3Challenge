import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class DepositValidator { 
    public schema = schema.create({
       value: schema.number(),
    })
}

export class WithdrawValidator { 
    public defineSchema(balance: number){
        return schema.create({
            value: schema.number([
                 rules.range(0, balance),
             ]),
         })
    }
}

export class GiftCardValidator { 
    public defineSchema(balance: number){
        return schema.create({
            value: schema.number([
                 rules.range(0, balance),
             ]),
             gift_card_id: schema.number([
                rules.exists({table: 'gift_cards', column: 'id'})
             ])
         })
    }
}

export class TransferenceValidator { 
    public defineSchema(balance: number){
        return schema.create({
            value: schema.number([
                 rules.range(0, balance),
             ]),
             destiny_account_number: schema.string([
                rules.exists({table: 'checking_accounts', column: 'account_number'}),
                rules.regex(/^[0-9]*$/)
             ]),
             destiny_agency_number: schema.string([
                rules.exists({table: 'agencies', column: 'number'}),
                rules.regex(/^[0-9]*$/)
             ])
         })
    }
}