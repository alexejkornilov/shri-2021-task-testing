const {assert} = require("chai");

describe("Проверки корзины", async function () {
    beforeEach(async ({browser}) => {
        await browser.setWindowSize(1600, 900);
        await browser.url("/");
    });

    afterEach(async ({browser}) => {
        await browser.execute(() => localStorage.clear());
    });

    it('товар добавляется в корзину', async function ({browser}) {
        await browser.url('/catalog');

        const product = await browser.$('.ProductItem:first-child');

        const id = await product.getAttribute("data-testid");

        await browser.$('.ProductItem:first-child .ProductItem-DetailsLink').click();

        const add = await browser.$('.ProductDetails-AddToCart');
        const cart = await browser.$(".nav-link[href*=cart]");

        const cartTextBefore = await cart.getText();

        await add.click();

        const cartTextAfterOneClick = await cart.getText();

        await add.click();

        const cartTextAfterSecondClick = await cart.getText();

        assert.isTrue(await browser.$(".CartBadge").isDisplayed());

        await browser.url('/catalog');

        await browser.waitUntil(async () => {
            return await browser.$(`.ProductItem[data-testid="${id}"] .CartBadge`).isDisplayed();
        })

        assert.notEqual(cartTextBefore, cartTextAfterOneClick);
        assert.equal(cartTextAfterOneClick, cartTextAfterSecondClick);
    });

    it("повторное добавление товара в корзину должно увеличивать его количество в корзине", async function ({browser}) {
        await browser.url('/catalog');
        await browser.$('.ProductItem:first-child .ProductItem-DetailsLink').click();

        const productUrl = await browser.getUrl();

        const addToCart = await browser.$(".ProductDetails-AddToCart");
        await addToCart.click();

        await browser.url("/cart");
        const countBefore = await browser.$(".Cart-Count");
        const countBeforeText = await countBefore.getText();

        await browser.url(productUrl);
        await addToCart.click();

        await browser.url("/cart");
        const countAfter = await browser.$(".Cart-Count");
        const countAfterText = await countAfter.getText();

        assert.equal(parseInt(countAfterText) - parseInt(countBeforeText), 1);
    });

    it('содержимое корзины сохраняется при перезагрузке', async function ({browser}) {
        await browser.url('/catalog');

        await browser.$('.ProductItem-DetailsLink').click();
        await browser.$('.ProductDetails-AddToCart').click();
        await browser.url('/cart');

        await browser.refresh();
        const count = await browser.$$('.Cart-Table > tbody > tr').length;

        assert.equal(count, 1);
    });
});