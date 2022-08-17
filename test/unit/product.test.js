import {basename, historyRender} from "./utils/helper";
import {createMemoryHistory} from "history";
import {CartApi, ExampleApi} from "../../src/client/api";
import React from "react";
import {initStore} from "../../src/client/store";
import '@testing-library/jest-dom';
import events from '@testing-library/user-event';

describe('тест товарной карточки', () => {
    let api;
    let cart;
    let history;

    const mockProduct = {
        id: 0,
        name: 'Product 0',
        price: 100,
        description: 'Description of product 0.',
        material: 'wood',
        color: 'white',
    };


    beforeEach(() => {
        api = new ExampleApi(basename);
        api.getProductById = jest.fn().mockResolvedValueOnce({data: mockProduct});

        cart = new CartApi();

        history = createMemoryHistory({
            initialEntries: ['/catalog/0'],
            initialIndex: 0,
        });
    });

    it('показывает дополнительную информацию о товаре', async function () {
        const store = initStore(api, cart);
        const {findByRole, findByText} = historyRender(history, store);

        const heading = await findByRole('heading');
        expect(heading.textContent).toEqual(mockProduct.name);
        expect(await findByText(mockProduct.description)).toBeInTheDocument();
        const re = new RegExp(`\\b${mockProduct.price}\\b`, 'i');
        expect(await findByText(re)).toBeInTheDocument();
        expect(await findByText(mockProduct.material)).toBeInTheDocument();
        expect(await findByText(mockProduct.color)).toBeInTheDocument();
    });

    it('добавляет товар в корзину по клику на кнопку', async function () {
        let cartState;
        cart.setState = jest.fn((cart) => {
            cartState = cart;
        });

        const store = initStore(api, cart);
        const {findByRole} = historyRender(history, store);

        const addToCartBtn = await findByRole('button', {
            name: /add to cart/i,
        });

        await events.click(addToCartBtn);

        expect(cartState).toEqual({
            0: {
                name: 'Product 0',
                count: 1,
                price: 100,
            },
        });

        await events.click(addToCartBtn);

        expect(cartState).toEqual({
            0: {
                name: 'Product 0',
                count: 2,
                price: 100,
            },
        });

    });


})