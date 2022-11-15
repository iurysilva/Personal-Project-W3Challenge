import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GiftCard from 'App/Models/GiftCard'

export default class extends BaseSeeder {
  public async run () {
    await GiftCard.createMany([
      {
        gift_card_type_id: 1,
        name: "VIVO gift card",
        company: "VIVO"
      },
      {
        gift_card_type_id: 1,
        name: "CLARO gift card",
        company: "CLARO"
      },
      {
        gift_card_type_id: 1,
        name: "TIM gift card",
        company: "TIM"
      },
      {
        gift_card_type_id: 1,
        name: "OI gift card",
        company: "OI"
      },
      {
        gift_card_type_id: 2,
        name: "NETFLIX gift card",
        company: "NETFLIX"
      },
      {
        gift_card_type_id: 2,
        name: "PRIME VIDEO gift card",
        company: "PRIME VIDEO"
      },
      {
        gift_card_type_id: 2,
        name: "DISNEY gift card",
        company: "DISNEY"
      },
      {
        gift_card_type_id: 2,
        name: "HBO MAX gift card",
        company: "HBO MAX"
      },
      {
        gift_card_type_id: 3,
        name: "XBOX gift card",
        company: "XBOX"
      },
      {
        gift_card_type_id: 3,
        name: "NINTENDO gift card",
        company: "NINTENDO"
      },
      {
        gift_card_type_id: 3,
        name: "STEAM gift card",
        company: "STEAM"
      },
    ])
  }
}
