import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class CheckingAccountsValidator {     
    public schema = schema.create({
        password: schema.string([
            rules.alphaNum(),
            rules.minLength(6),
            rules.maxLength(6),
            rules.regex(/^(?!.*(.).*\1)[0-9]+$/)
        ])
    })
}