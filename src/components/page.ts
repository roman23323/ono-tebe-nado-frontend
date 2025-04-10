import { Action } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface IPage {
    catalog: HTMLElement
}

export class Page extends Component<IPage> {
    protected _catalog: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _basketCounter: HTMLElement;
    // IDEA: можно добавить единый обработчик кликов по лотам

    constructor(protected container: HTMLElement, action: Action) {
        super(container);
        this._catalog = ensureElement('.catalog__items');
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket');
        this._basketCounter = ensureElement('header__basket-counter', this._basketButton);
    }

    set catalog(catalog: HTMLElement) {
        this._catalog = catalog;
    }
}