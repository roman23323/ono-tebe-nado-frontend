import { ILot, ILotItem } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

interface IAppData {

}

export class AppData extends Model<IAppData> {
    protected _catalog: ILotItem[];

    constructor(data: Partial<IAppData>, protected events: IEvents) {
        super(data, events)
    }

    set catalog(items: ILot[]) {
        this._catalog = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                about: item.about,
                image: item.image,
                status: item.status,
                datetime: item.datetime
            }
        });
        console.log(`Теперь в каталоге: `, this._catalog);
        this.events.emit<{items: ILotItem[]}>('appdata:changed:catalog', {items: this._catalog});
    }
}