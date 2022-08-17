import {basename, mockProductList} from "./utils/helper";
import {createMemoryHistory} from "history";
import {CartApi, ExampleApi} from "../../src/client/api";
import {initStore} from "../../src/client/store";
import {findAllByTestId, render, within} from '@testing-library/react'
import {Router} from "react-router";
import {Provider} from "react-redux";
import React from "react";
import {Catalog} from "../../src/client/pages/Catalog";

describe('тест каталога', () => {
    it('в каталоге есть название, цена и ссылка на товар', async function () {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        });

        api.getProducts = jest.fn().mockResolvedValueOnce({data: mockProductList});

        const {findAllByTestId} = render(<Router history={history}>
            <Provider store={store}>
                <Catalog/>
            </Provider>
        </Router>);


        const productCard0 = await findAllByTestId(0);
        const productCard1 = await findAllByTestId(1);
        const productNames = [...productCard0, ...productCard1].map(
            (card) => within(card).getByRole('heading').textContent
        );

        expect(productNames).toContain('Product 1');
        expect(productNames).toContain('Product 2');

    });
})