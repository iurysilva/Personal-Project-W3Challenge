import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import CheckingAccount from './CheckingAccount'

export default class Agency extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public number: string

  @hasMany(() => CheckingAccount, {
    foreignKey: 'agency_id',
  })
  public checking_accounts: HasMany<typeof CheckingAccount>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
