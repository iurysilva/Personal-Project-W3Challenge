// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Log from "App/Models/Log"

export default class LogsControlllersController {
    public async index({}){
        const logs = Log.all()
        return logs
    }
}
