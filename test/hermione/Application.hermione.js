const {assert} = require("chai");

describe("Компонент Application", async function () {
    afterEach(async function({ browser }) {
        await browser.execute(() => localStorage.clear());
    });

    it('На ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async function ({browser}) {
        await browser.url("/");
        await browser.setWindowSize(540, 960);

        const hamburger = await browser.$('.navbar-toggler'),
            menu = await browser.$('.navbar-collapse');

        assert.isFalse(await menu.isDisplayed());

        hamburger.click();

        assert.isTrue(await menu.isDisplayed());
    });

    it('При выборе элемента из меню "гамбургера", меню должно закрываться', async function ({browser}) {
        await browser.url("/");
        await browser.setWindowSize(540, 960);

        const hamburger = await browser.$('.navbar-toggler'),
            menu = await browser.$('.navbar-collapse');

        await hamburger.click();

        await (await menu.$('.nav-link')).click();

        assert.isFalse(await menu.isDisplayed())
    });
});