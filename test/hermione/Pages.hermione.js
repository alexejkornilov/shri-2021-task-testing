const { assert } = require("chai");

describe("Проверки страниц", async function () {
    beforeEach(async ({ browser }) => {
        await browser.url("/");
    });

    it("главная, условия доставки, контакты на статическое содержимое", async function ({browser}) {
        await browser.setWindowSize(1600, 900);

        await browser.url('/');
        await this.browser.assertView("home", ".Application", {
            allowViewportOverflow: true,
        });

        await browser.url("/delivery");
        await browser.assertView("delivery", ".Application", {
            allowViewportOverflow: true,
        });

        await this.browser.url("/contacts");
        await this.browser.assertView("contacts", ".Application", {
            allowViewportOverflow: true,
        });
    })


    it("главная, каталог, условия доставки, контакты присутствуют", async function ({ browser }) {
        await browser.setWindowSize(1600, 900);

        await browser.url("/");
        assert.isTrue(await browser.$('.Home').isDisplayed());

        await browser.url("/catalog");
        assert.isTrue(await browser.$('.Catalog').isDisplayed());

        await browser.url("/delivery");
        assert.isTrue(await browser.$('.Delivery').isDisplayed());

        await browser.url("/contacts");
        assert.isTrue(await browser.$('.Contacts').isDisplayed());
    });

    it('страницы имеют адаптивную верстку', async function ({browser}) {
        await browser.setWindowSize(500, 900);

        await browser.url('/');
        await this.browser.assertView("home-500-adaptive", ".Application", {
            allowViewportOverflow: true,
        });

        await browser.url("/delivery");
        await browser.assertView("delivery-500-adaptive", ".Application", {
            allowViewportOverflow: true,
        });

        await this.browser.url("/contacts");
        await this.browser.assertView("contacts-500-adaptive", ".Application", {
            allowViewportOverflow: true,
        });
    });

});