import { ResponseToolkit } from "hapi";
import { ICustomer } from "../models/customer";
import CustomerModel from "../models/customer";
import { BaseController } from "./BaseController";
import { AccountService } from "../services/account";

export class CustomerController extends BaseController<ICustomer> {
  constructor() {
    super(CustomerModel);
  }

  public static async getAll(request: any, h: ResponseToolkit) {
    const controller = new CustomerController();
    return await controller.baseGetAll(request, h);
  }

    public static async getOne(request: any, h: ResponseToolkit) {
    const controller = new CustomerController();
    return await controller.baseGetOne(request, h);
  }

  public static async update(request: any, h: ResponseToolkit) {
    const controller = new CustomerController();
    return await controller.baseUpdate(request, h);
  }

  public static async info(request: any, h: ResponseToolkit) {
    try {
      return AccountService.getCustomerAccountInfo({ id: request.params.id });
    }
    catch (err: any) {
      return h.response(err).code(500);
    }
  }

  public static async create(request: any, h: ResponseToolkit) {
    try {
      return AccountService.createCustomerAccount({ payload: request.payload });
    }
    catch (err: any) {
      return h.response(err).code(500);
    }
  }

  public static async delete(request: any, h: ResponseToolkit) {
    try{
      return AccountService.deleteCustomerAccount({ id: request.params.id });
    }
    catch(err: any){
      return h.response(err).code(500);
    }        
  }
}
