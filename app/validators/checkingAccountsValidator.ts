import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export class CheckingAccountsValidator { 
    public refs = schema.refs({
        allowedDate: DateTime.local(2004, 11, 14, 1, 1)
    })
    
    public schema = schema.create({
    name: schema.string(),

    birth_date: schema.date({
        format: 'yyyy-mm-dd'
    }, [
        rules.before(this.refs.allowedDate)
    ]),

    cpf: schema.string([
        rules.maxLength(11),
        rules.minLength(11),
        rules.regex(/^[0-9]*$/),
        rules.unique({table: 'clients', column: 'cpf'})
    ]),

    email: schema.string([
        rules.email(),
        rules.unique({table: 'clients', column: 'email'})
    ]),

    password: schema.string([
        rules.alphaNum(),
        rules.minLength(6),
        rules.maxLength(6),
        rules.regex(/^(?!.*(.).*\1)[0-9]+$/)
    ])
    })
}