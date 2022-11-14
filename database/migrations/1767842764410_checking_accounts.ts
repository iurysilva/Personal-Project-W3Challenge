import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'checking_accounts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().references('clients.id').onDelete('CASCADE')
      table.integer('agency_id').unsigned().references('agencies.id').onDelete('CASCADE')

      table.string('account_number', 17)
      table.integer('balance')
      table.string('password', 255)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
