module.exports = {
    gridUrl: 'http://127.0.0.1:4444',
    baseUrl: 'https://shri-homework.usr.yandex-academy.ru/',

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            },
        }
    },

    sets: {
        common: {
            files: 'test/hermione'
        }
    },
    screenshotsDir: (test) => `test/hermione/screenshots/${test.parent.title}`,
    plugins: {
        'html-reporter/hermione': {
            path: 'hermione-html-reporter'
        },
        'hermione-selenium-standalone-runner': true
    },
};