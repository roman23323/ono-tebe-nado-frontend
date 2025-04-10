import { ILotItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { Action } from "../types";

class Card extends Component<ILotItem> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _status: HTMLElement;

    constructor(protected container: HTMLElement, action: Action) {
        super(container);

        this._title = ensureElement('.card__title');
        this._image = ensureElement<HTMLImageElement>('.card__image');
        this._description = ensureElement('.card__description');
        this._button = ensureElement<HTMLButtonElement>('.button');
        this._button.addEventListener('click', action.onClick);
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
}