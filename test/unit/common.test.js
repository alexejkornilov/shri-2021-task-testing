import '@testing-library/jest-dom';
import {CartApi, ExampleApi} from "../../src/client/api";
import {initStore} from "../../src/client/store";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import React from "react";
import {render} from '@testing-library/react'
import {createMemoryHistory} from 'history'
import {basename, historyRender} from "./utils/helper";


describe('Общие требования', () => {
    let application;
    beforeEach(() => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        application = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>
        );
    });


    it('в шапке отображаются ссылки на страницы магазина, корзину', async function () {
        const {container} = render(application);
        let navMenu = Array.from(container.querySelectorAll('.nav-link'))
        navMenu = navMenu.map((el) => el.getAttribute("href"))
        const navMenuLink = [basename + '/catalog', basename + '/delivery', basename + '/contacts', basename + '/cart']
        expect(navMenu).toEqual(expect.arrayContaining(navMenuLink))
    });

    it('название магазина в шапке должно быть ссылкой на главную страницу', async function () {
        const {container} = render(application);
        const linkMain = container.querySelector('.Application-Brand')
        expect(linkMain.getAttribute("href")).toEqual(basename + '/')
    });
})

describe('наличие страниц', () => {

    it('в магазине есть главная страница', async function () {
        const history = createMemoryHistory({
            initialEntries: ['/'],
            initialIndex: 0
        });
        const {container} = historyRender(history)
        expect(container.getElementsByClassName('Home').length).toBe(1);
    });

    it('в магазине есть страница каталога', async function () {
        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });
        const {container} = historyRender(history)
        expect(container.getElementsByClassName('Catalog').length).toBe(1);
    });

    it('в магазине есть страница информации о товаре', async function () {
        const history = createMemoryHistory({
            initialEntries: ['/catalog/1'],
            initialIndex: 0
        });
        const {container} = historyRender(history)
        expect(container.getElementsByClassName('Product').length).toBe(1);
    });

    it('в магазине есть страница доставки', async function () {
        const history = createMemoryHistory({
            initialEntries: ['/delivery'],
            initialIndex: 0
        });
        const {container} = historyRender(history)
        expect(container.getElementsByClassName('Delivery').length).toBe(1);
    });

    it('в магазине есть страница контактов', async function () {
        const history = createMemoryHistory({
            initialEntries: ['/contacts'],
            initialIndex: 0
        });
        const {container} = historyRender(history)
        expect(container.getElementsByClassName('Contacts').length).toBe(1);
    });

    it('в магазине есть страница корзины', async function () {
        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });
        const {container} = historyRender(history)
        expect(container.getElementsByClassName('Cart').length).toBe(1);
    });
})
