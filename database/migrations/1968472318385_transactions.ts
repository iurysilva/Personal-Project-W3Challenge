import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('checking_account_id').unsigned().references('checking_accounts.id').onDelete('CASCADE')


      table.string('value', 100)
      table.enu('type', ['withdraw', 'deposit', 'payment done', 'payment received'])
      table.date('date')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.raw('DROP TYPE IF EXISTS "request_type"')
    this.schema.dropTable(this.tableName)
  }
}
