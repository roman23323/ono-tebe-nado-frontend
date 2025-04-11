import { LotStatus } from "../types";
import { createElement, dayjs, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IAuction {
    id: string,
    datetime: string,
    price: number,
    status: LotStatus,
    history: number[]
}

export interface IBidSubmit {
    id: string,
    bid: number
}

export class Auction extends Component<IAuction> {
    protected _currentPrice: number;
    protected _id: string;

    protected _timer: HTMLElement;
    protected _text: HTMLElement;
    protected _bidInput: HTMLInputElement;
    protected _submit: HTMLButtonElement;
    protected _bidHistory: HTMLUListElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
    
        this._timer = ensureElement<HTMLElement>('.lot__auction-timer', container);
        this._text = ensureElement<HTMLElement>('.lot__auction-text', container);
        this._bidInput = ensureElement<HTMLInputElement>('.form__input', container);
        this._submit = ensureElement<HTMLButtonElement>('.button', container);
        this._bidHistory = ensureElement<HTMLUListElement>('.lot__history-bids', container);
        
        this._submit.addEventListener('click', event => {
            event.preventDefault();
            events.emit<IBidSubmit>('bid:submit', {
                id: this._id,
                bid: Number(this._bidInput.value)
            })
        });
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

        if (status != 'active') {
            ['.lot__bid', '.lot__history'].map(elem => {
                ensureElement(elem, this.container).style.display = 'none';
            });
        }
    }

    set history(history: number[]) {
        const bids = history.map(bid => {
            return createElement('li', {
                className: 'lot__history-item',
                textContent: String(bid)
            });
        });
        this._bidHistory.replaceChildren(...bids);
    }

    set id(id: string) {
        this._id = id;
    }
}