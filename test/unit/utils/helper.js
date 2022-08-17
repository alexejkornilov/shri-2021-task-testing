import {render} from "@testing-library/react";
import {Router} from "react-router";
import {Provider} from "react-redux";
import {Application} from "../../../src/client/Application";
import React from "react";
import {CartApi, ExampleApi} from "../../../src/client/api";
import {initStore} from "../../../src/client/store";

export const basename = '/hw/store';

const api = new ExampleApi(basename);
const cart = new CartApi();
const storeBase = initStore(api, cart);


export const historyRender = (history, store = storeBase) => render(
    <Router history={history}>
        <Provider store={store}>
            <Application />
        </Provider>
    </Router>
);

export const mockCartValue = {
    0: {
        name: 'Product 1',
        count: 2,
        price: 300,
    },
    1: {
        name: 'Product 4',
        count: 5,
        price: 600,
    },
};

export const mockProductList = [
    {
        id: 0,
        name: 'Product 1',
        price: 300,
    },
    {
        id: 1,
        name: 'Product 2',
        price: 300,
    },
];