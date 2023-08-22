import { ResponseToolkit } from "hapi";
import { Document, Model } from "mongoose";

export class BaseController<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async baseGetAll(request: any, h: ResponseToolkit) {
    try {
      const items: T[] = await this.model.find();
      return items;
    } catch (err: any) {
      return h.response(err).code(500);
    }
  }

  public async baseGetOne(request: any, h: ResponseToolkit) {
    try {
      const item: T | null = await this.model.findById(request.params.id);
      if (!item) {
        return h.response("Item not found").code(404);
      }
      return item;
    } catch (err: any) {
      return h.response("Item not found").code(500);
    }
  }

  public async baseCreate(request: any, h: ResponseToolkit) {
    try {
      const item: T = await this.model.create(request.payload);
      return item;
    } catch (err: any) {
      return h.response(err.message).code(500);
    }
  }

  public async baseUpdate(request: any, h: ResponseToolkit) {
    try {
      const item: T | null = await this.model.findByIdAndUpdate(
        request.params.id,
        request.payload,
        { new: true }
      );
      if (!item) {
        return h.response("Item not found").code(404);
      }
      return item;
    } catch (err: any) {
      return h.response(err.message).code(500);
    }
  }

  public async baseDelete(request: any, h: ResponseToolkit) {
    try {
      const item: T | null = await this.model.findByIdAndDelete(
        request.params.id
      );
      if (!item) {
        return h.response("Item not found").code(404);
      }
      return item;
    } catch (err: any) {
      return h.response(err.message).code(500);
    }
  }
}
