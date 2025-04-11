import { Action, formButtonAction, LotStatus } from "../types";
import { dayjs, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface IAuction {
    datetime: string,
    price: number,
    status: LotStatus
    // TODO: дописать интерфейс
}

export class Auction extends Component<IAuction> {
    protected _timer: HTMLElement;
    protected _text: HTMLElement;
    protected _bidInput: HTMLInputElement;
    protected _button: HTMLButtonElement;
    protected _bidHistory: HTMLUListElement;
    protected _currentPrice: number;

    // TODO: дописать сеттеры

    constructor(protected container: HTMLElement, action: formButtonAction) {
        super(container);
    
        this._timer = ensureElement<HTMLElement>('.lot__auction-timer', container);
        this._text = ensureElement<HTMLElement>('.lot__auction-text', container);
        this._bidInput = ensureElement<HTMLInputElement>('.form__input', container);
        this._button = ensureElement<HTMLButtonElement>('.button', container);
        this._bidHistory = ensureElement<HTMLUListElement>('.lot__history-bids', container);
        
        this._button.addEventListener('click', action.onClick);
    }
    
    set datetime(datetime: string) {
        const timeLeft = this.getTimeDuration(datetime);
        this.setText(this._timer, timeLeft);
    }

    getTimeDuration(datetime: string): string {
        // Нетекущая дата, т.к. с апи приходят устравшие данные
        const now = dayjs('2025-03-30T21:00:00');
        const targetDate = dayjs(datetime);
        const diffInSeconds = targetDate.diff(now, 'second');

        if (diffInSeconds <= 0) return 'Аукцион завершён';

        const duration = dayjs.duration(diffInSeconds, 'seconds');
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        return `${days}д ${hours.toString().padStart(2, '0')}ч ${minutes.toString().padStart(2, '0')} мин ${seconds.toString().padStart(2, '0')} сек`;
    }

    set price(price: number) {
        this._currentPrice = price;
    }

    set status(status: LotStatus) {
        let text = ''
        switch(status) {
            case "wait": {
                text = 'До начала аукциона';
                break;
            }
            case "active": {
                text = 'До закрытия лота';
                break;
            }
            case "closed": {
                text = `Продано за ${this._currentPrice} \u20BD`; // Символ рубля в Unicode
                break;
            }
        }
        this.setText(this._text, text);
    }
}