// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import GiftCardType from "App/Models/GiftCardType";

export default class GiftCardTypesController {
    public async index({}){
        const giftCardTypes = await GiftCardType.query().preload('gift_cards')
        return giftCardTypes
    }
}
