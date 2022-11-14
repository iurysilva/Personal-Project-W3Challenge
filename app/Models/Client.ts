import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import CheckingAccount from './CheckingAccount'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string
  @column()
  public name: string
  @column.date({
    serialize: (value) => value.toFormat('yyyy/mm/dd')})
  public birth_date: DateTime
  @column()
  public cpf: string

  @hasMany(() => CheckingAccount, {
    foreignKey: 'client_id',
  })
  public checking_accounts: HasMany<typeof CheckingAccount>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
