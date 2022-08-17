const { assert } = require("chai");

describe("Проверки каталога", async function () {
    beforeEach(async ({ browser }) => {
        await browser.setWindowSize(1600, 900);
        await browser.url("/");
    });

    it('каталог отображает товары', async function ({browser}) {
        await browser.url('/catalog');

        assert.isTrue((await this.browser.$$(".Catalog")).length > 0);

    });
});