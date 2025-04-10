import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, ILot, LotUpdate, IBid} from "../types";

export interface IAuctionAPI {
    getLotList: () => Promise<ILot[]>; // Без description (большого описания)
    getLotItem: (id: string) => Promise<ILot>; // С описанием и историей
    getLotUpdate: (id: string) => Promise<LotUpdate>; // История и последняя цена
    placeBid(id: string, bid: IBid): Promise<LotUpdate>; // То же
    orderLots: (order: IOrder) => Promise<IOrderResult>; // Отправка заказа на лот
}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getLotItem(id: string): Promise<ILot> {
        return this.get(`/lot/${id}`).then(
            (item: ILot) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotUpdate(id: string): Promise<LotUpdate> {
        return this.get(`/lot/${id}/_auction`).then(
            (data: LotUpdate) => data
        );
    }

    getLotList(): Promise<ILot[]> {
        return this.get('/lot').then((data: ApiListResponse<ILot>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    placeBid(id: string, bid: IBid): Promise<LotUpdate> {
        return this.post(`/lot/${id}/_bid`, bid).then(
            (data: ILot) => data
        );
    }

    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}