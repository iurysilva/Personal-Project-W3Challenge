import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class OpenCheckingAccountsValidator {     
    public schema = schema.create({
        password: schema.string([
            rules.alphaNum(),
            rules.minLength(6),
            rules.maxLength(6),
            rules.regex(/^(?!.*(.).*\1)[0-9]+$/)
        ]),

        cpf: schema.string([
            rules.maxLength(11),
            rules.minLength(11),
            rules.regex(/^[0-9]*$/),
        ]),
    })
}

export class OpenFirstCheckingAccountsValidator {     
    public schema = schema.create({
        password: schema.string([
            rules.alphaNum(),
            rules.minLength(6),
            rules.maxLength(6),
            rules.regex(/^(?!.*(.).*\1)[0-9]+$/)
        ]),
    })
}

export class getTransactionsValidator{
    public schema = schema.create({
        initial_date: schema.date({
            format: 'yyyy-mm-dd'
        }),
        final_date: schema.date({
            format: 'yyyy-mm-dd'}, [
                rules.afterOrEqualToField('initial_date')
            ])
    })
}
