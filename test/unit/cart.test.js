import {basename, mockCartValue} from "./utils/helper";
import {CartApi, ExampleApi} from "../../src/client/api";
import {createMemoryHistory} from "history";
import {initStore} from "../../src/client/store";
import {Router} from "react-router";
import {Provider} from "react-redux";
import {Cart} from "../../src/client/pages/Cart";
import React from "react";
import {render, within, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import events from '@testing-library/user-event';

describe('тест корзины', () => {
    let api;
    let cart;
    let history;

    beforeEach(() => {
        api = new ExampleApi(basename);
        cart = new CartApi();

        history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0,
        });
    });

    it('показывает информацию о товарах и общую цену', async function () {
        cart.getState = jest.fn().mockReturnValueOnce(mockCartValue);

        const store = initStore(api, cart);
        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </Router>
        );

        const {findByTestId, container} = render(application);

        const row0 = await findByTestId(0);
        const cellsContent0 = within(row0)
            .getAllByRole('cell')
            .map((cell) => cell.textContent);
        expect(cellsContent0).toContain('Product 1');
        expect(cellsContent0).toContain('2');
        expect(cellsContent0).toContain('$300');
        expect(cellsContent0).toContain('$600');

        const row1 = await findByTestId(1);
        const cellsContent1 = within(row1)
            .getAllByRole('cell')
            .map((cell) => cell.textContent);
        expect(cellsContent1).toContain('Product 4');
        expect(cellsContent1).toContain('5');
        expect(cellsContent1).toContain('$600');
        expect(cellsContent1).toContain('$3000');

        const totalOrderPrice =
            container.querySelector('.Cart-OrderPrice').textContent;

        expect(totalOrderPrice).toEqual('$3600');
    });

    it('показывает пустую корзину и ссылку на каталог', async function (){
        cart.getState = jest.fn().mockReturnValueOnce({});
        const store = initStore(api, cart);
        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </Router>
        );

        const {queryByText, getByRole} = render(application);

        expect(
            queryByText(/cart is empty\. please select products in the \./i)
        ).toBeInTheDocument();

        const catalogLinkHref = getByRole('link', {
            name: /catalog/i,
        }).getAttribute('href');
        expect(catalogLinkHref).toEqual('/catalog');
    });

    it('не показывает пустую корзину и ссылку на каталог когда не пусто', async function () {
        cart.getState = jest.fn().mockReturnValueOnce(mockCartValue);
        const store = initStore(api, cart);
        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { queryByText } = render(application);

        expect(
            queryByText(/cart is empty\. please select products in the \./i)
        ).not.toBeInTheDocument();
    });

    it('displays checkout if cart is not empty', async function () {
        cart.getState = jest.fn().mockReturnValueOnce(mockCartValue);
        const store = initStore(api, cart);
        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { queryByRole } = render(application);
        expect(queryByRole('heading', { name: /сheckout/i })).toBeInTheDocument();
    });

    it('not displays checkout if cart is empty', async function (){
        cart.getState = jest.fn().mockReturnValueOnce({});
        const store = initStore(api, cart);
        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { queryByRole } = render(application);

        expect(
            queryByRole('heading', { name: /сheckout/i })
        ).not.toBeInTheDocument();
    });



    it('отправляет заказ при верном заполнении формы', async function () {

        const mockFormData = {
            name: 'John Smith',
            phone: '1234567890',
            address: 'Simple address',
        };
        cart.getState = jest.fn().mockReturnValueOnce(mockCartValue);
        let sendedForm;
        let sendedCart;
        const response = {
            data: { id: 5 },
            status: 200,
            statusText: 'OK',
            config: {},
            headers: {},
        };

        api.checkout = jest
            .fn()
            .mockImplementation((form, cart) => {
                sendedForm = form;
                sendedCart = cart;
                return Promise.resolve(response);
            });

        const store = initStore(api, cart);
        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { getByRole, container } = render(application);

        const nameField = getByRole('textbox', {
            name: /name/i,
        });
        await events.type(nameField, mockFormData.name);

        const phoneField = getByRole('textbox', {
            name: /phone/i,
        });
        await events.type(phoneField, mockFormData.phone);

        // const addressField = getByRole('textbox', {
        //     name: /address/i,
        // }).focus();
        getByRole('textbox', {
            name: /address/i,
        }).focus();
        // await events.type(addressField, form.address);
        await events.paste(mockFormData.address)
        const submitBtn = getByRole('button', {
            name: /checkout/i,
        });
        await events.click(submitBtn);

        expect(sendedCart).toEqual(mockCartValue);
        expect(sendedForm).toEqual(mockFormData);

        await waitFor(() =>
            expect(container.querySelector('.Cart-Number').textContent).toEqual('5')
        );
    });

    it('не позволяет оформить заказ если заполнены не все поля формы', async function () {

        cart.getState = jest.fn().mockReturnValueOnce(mockCartValue);
        const store = initStore(api, cart);
        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </Router>
        );

        const { getByRole, container } = render(application);
        const submitBtn = getByRole('button', {
            name: /checkout/i,
        });
        await events.click(submitBtn);

        expect(container.querySelector('.is-invalid')).toBeInTheDocument();
    });
})
