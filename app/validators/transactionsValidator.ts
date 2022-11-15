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