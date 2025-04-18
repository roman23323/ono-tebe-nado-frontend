import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { AppData } from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { ILotItem } from './types';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Preview } from './components/Preview';
import { Auction, IBidSubmit } from './components/Auction';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card');
const previewTemplate = ensureElement<HTMLTemplateElement>('#preview');
const auctionTemplate = ensureElement<HTMLTemplateElement>('#auction');

// Модель данных приложения
const appData = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(ensureElement('.page'), {onClick: () => console.log('нажата корзина')});
const modalContainer = ensureElement('#modal-container'); // Пустое модальное окно


// const testModal = new Modal(modalContainer, events)
// testModal.render({
//     content: cloneTemplate(previewTemplate)
// });
// testModal.open();

// Переиспользуемые части интерфейса


// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

interface ICardClick {
    id: string
}

events.on<{items: ILotItem[]}>('appdata:changed:catalog', catalog => {
    const catalogItems = catalog.items.map(item => {
        return new Card(cloneTemplate(cardTemplate), {
            onClick: () => events.emit<ICardClick>('card:click', {id: item.id})
        }).render(item);
    });
    page.render({
        catalog: catalogItems
    });
});

events.on<ICardClick>('card:click', event => {
    api.getLotItem(event.id)
        .then(itemData => {
            console.log('Данные о лоте: ', itemData);
            const previewModal = new Modal(modalContainer, events);
            const status = new Auction(cloneTemplate(auctionTemplate), events);
            previewModal.render({
                content: new Preview(cloneTemplate(previewTemplate)).render({
                    title: itemData.title,
                    description: itemData.description,
                    image: itemData.image,
                    status: status.render({
                        id: itemData.id,
                        datetime: itemData.datetime,
                        price: itemData.price,
                        status: itemData.status,
                        history: itemData.history
                    })
                })
            });
    });
});

events.on('bid:submit', (bidInfo: IBidSubmit) => {
    api.placeBid(bidInfo.id, {price: bidInfo.bid})
        .then(lot => {
            console.log('lot update received: ', lot);
            const updatedItem = appData.catalog.find(lot => lot.id === bidInfo.id);
            updatedItem.
            // Надо обновить каталог
        });
})

events.on('modal:open', () => {
    // TODO: заблокировать прокрутку страницы
})

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


