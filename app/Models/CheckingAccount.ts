import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Agency from './Agency'
import Client from './Client'

export default class CheckingAccount extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public client_id: number
  @column()
  public agency_id: number

  @column()
  public number: string
  @column({serializeAs:null})
  public password: string

  @belongsTo(() => Client, {
    foreignKey: 'client_id',
  })
  public client: BelongsTo<typeof Client>

  @belongsTo(() => Agency, {
    foreignKey: 'agency_id',
  })
  public agency: BelongsTo<typeof Agency>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(checking_account: CheckingAccount) {
    if (checking_account.$dirty.senha) {
      checking_account.password = await Hash.make(checking_account.password)
    }
  }
}
