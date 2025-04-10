import { ILotItem, LotStatus } from "../types";
import { dayjs, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { Action } from "../types";

export class Card extends Component<ILotItem> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _status: HTMLElement;
    protected _statusValue: string;

    constructor(protected container: HTMLElement, action: Action) {
        super(container);

        console.log('Конструктор карточки');
        console.log(container);

        this._title = ensureElement('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement('.card__description', container);
        this._button = ensureElement<HTMLButtonElement>('.button', container);
        this._button.addEventListener('click', action.onClick);
        this._status = ensureElement('.card__status', container);
    }

    set title(title: string) {
        this.setText(this._title, title);
    }

    set about(about: string) {
        this.setText(this._description, about);
    }

    set image(image: string) {
        this.setImage(this._image, image, 'Изображение лота')
    }

    set status(status: LotStatus) {
        this.toggleClass(this._status, `card__status_${status}`);
        this._statusValue = this.getDatetimePrefix(status);
        console.log(`Статус: ${this._statusValue}`);
    }

    getDatetimePrefix(status: LotStatus): string{
        switch(status) {
            case "wait": return 'Откроется ';
            case "active": return 'Открыто до ';
            case "closed": return 'Закрыто ';
            default: return '';
        }
    }

    set datetime(datetime: string) {
        const time = dayjs(datetime).format('D MMMM HH:mm');
        this.setText(this._status, `${this._statusValue}${time}`);
    }
}