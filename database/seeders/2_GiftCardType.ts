import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GiftCardType from 'App/Models/GiftCardType'

export default class extends BaseSeeder {
  public async run () {
    await GiftCardType.createMany([
      {
        name: "Celular"
      },
      {
        name: "Stream"
      },
      {
        name: "Games"
      }
    ])
  }
}
