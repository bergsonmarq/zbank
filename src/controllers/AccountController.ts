import { ResponseToolkit } from "hapi";
import { IAccount } from "../models/account";
import { BaseController } from "./BaseController";
import AccountModel from "../models/account";
import { AccountService } from "../services/account";

export class AccountController extends BaseController<IAccount>{
    constructor() {
        super(AccountModel);
    }

    public static async getAll(request: any, h: ResponseToolkit) {
        const controller = new AccountController();
        return await controller.baseGetAll(request, h);
    }

    public static async getExtract(request: any, h: ResponseToolkit) {
        const controller = new AccountController();
        return await AccountService.getExtract({ id: request.params.id });
    }

    public static async getOne(request: any, h: ResponseToolkit) {
        const controller = new AccountController();
        return await controller.baseGetOne(request, h);
    }
}