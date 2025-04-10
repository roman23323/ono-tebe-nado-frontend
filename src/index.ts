import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { AppData } from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/page';
import { ILotItem } from './types';
import { Card } from './components/card';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card');
console.log(cardTemplate);

// Модель данных приложения
const appData = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(ensureElement('.page'), {onClick: () => console.log('нажата корзина')});

// Переиспользуемые части интерфейса


// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно
events.on<{items: ILotItem[]}>('appdata:changed:catalog', catalog => {
    const catalogItems = catalog.items.map(item => {
        return new Card(cloneTemplate(cardTemplate), {onClick: () => console.log(`Нажат айтем ${item.title}`)}).render(item);
    });
    page.render({
        catalog: catalogItems
    });
});

// Получаем лоты с сервера
api.getLotList()
    .then(result => {
        // вместо лога поместите данные в модель
        appData.catalog = result;
        console.log(result);
    })
    .catch(err => {
        console.error(err);
    });


