import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Agency from 'App/Models/Agency'

export default class extends BaseSeeder {
  public async run () {
    await Agency.createMany([
      {
        number: "0001"
      },
      {
        number: "0002"
      },
      {
        number: "0003"
      },
      {
        number: "0004"
      },
      {
        number: "0005"
      }
    ])
  }
}
