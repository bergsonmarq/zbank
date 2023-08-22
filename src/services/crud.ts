export class Crud {
    static getAll: any;
    constructor(private model: any) {}

    public async getAll() {
        try {
            const records: any = await this.model.find();            
            return records;
          } catch (err : any) {
            return err;
          }
    }

    public async create(payload: any) {
        try {
            const record: any = new this.model(payload);
            await record.save();
            return record;
          } catch (err : any) {
            return err;
          }
    }
}