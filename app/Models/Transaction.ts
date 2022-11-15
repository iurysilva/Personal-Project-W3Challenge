import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import CheckingAccount from './CheckingAccount'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public checking_account_id: number

  @column()
  public type: "withdraw" | "deposit" | "payment done" | "payment received"
  @column()
  public value: number

  @belongsTo(() => CheckingAccount, {
    foreignKey: 'checking_account_id',
  })
  public checking_account: BelongsTo<typeof CheckingAccount>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
