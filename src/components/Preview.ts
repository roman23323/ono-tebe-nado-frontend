import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface IPreview {
    title: string,
    description: string,
    image: string,
    status: HTMLElement
}

export class Preview extends Component<IPreview> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _image: HTMLImageElement;
    protected _status: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);

        this._title = ensureElement('.lot__title', container);
        this._description = ensureElement('.lot__description', container);
        this._image = ensureElement<HTMLImageElement>('.lot__image', container);
        this._status = ensureElement('.lot__status', container);
    }

    set title(title: string) {
        this.setText(this._title, title);
    }

    set description(value: string) {
        const paragraphs = value.split('\n');
    
        const elements = paragraphs.map(paragraph => {
            return createElement('p', { textContent: paragraph });
        });
    
        this._description.replaceChildren(...elements);
    }

    set image(image: string) {
        this.setImage(this._image, image);
    }

    set status(status: HTMLElement) {
        this._status.replaceChildren(status);
    }
}