import { expect, test } from '../../fixtures/base.fixture';
// eslint-disable-next-line import/named
import { CanvasBoxIframe } from '../../pages';
import { allure } from 'allure-playwright';


test('Resolve crossword', async ({ page, gamePage, testData }) => {
    const dayToPick = 1;
    await allure.id('1');

    await test.step('Go to game page', async () => {
        await gamePage.blockMedia();
        await page.goto('/games/daily-quick-crossword', { waitUntil: 'domcontentloaded' });
    });

    await test.step('Click play button', async () => {
        await gamePage.clickAgreeButtonIfExists();
        await gamePage.clickPlayButton();
    });

    let canvasBox;
    await test.step('Wait for ad finish and canvas box appears', async () => {
        canvasBox = new CanvasBoxIframe(page, await gamePage.getCanvasBox());
    });

    await test.step('Pick date and check it in game', async () => {
        const [monthText, yearText] = await canvasBox.getHeaderMonthAndYear();
        const month = testData['monthMap'][monthText.toUpperCase()];
        const targetDate = new Date(Date.UTC(yearText, month, dayToPick));
        const currentDate = new Date();
        expect(targetDate.getUTCMonth()).toEqual(currentDate.getUTCMonth());
        expect(targetDate.getUTCFullYear()).toEqual(currentDate.getUTCFullYear());
        await canvasBox.clickPlayByData(dayToPick);
        const footerInfo = await canvasBox.getFooterInfo().innerText();
        const dateRegex = /(\d{1,2}\s\w+\s\d{4})/;
        const footerDate = footerInfo.match(dateRegex)[0];
        expect(footerDate.toLowerCase()).toEqual(`${dayToPick} ${monthText.toLowerCase()} ${yearText}`);
    });

    await test.step('Resolve crossword and wait for endgame popup', async () => {
        await canvasBox.resolveCrosswordWithRevealing();
        await expect(canvasBox.getGameEndPopup()).toBeVisible();
    });

    await test.step('Compare screenshot of endgame popup with the saved one', async () => {
        await page.waitForLoadState();
        expect(await canvasBox.getGameEndPopup().screenshot()).toMatchSnapshot({ maxDiffPixelRatio: 0.15 });
    });

    await test.step('Submit total score', async () => {
        await canvasBox.clickByText('Submit Total Score');
    });
});

test('Check anti-adblocker', async ({ page, gamePage }) => {
    await allure.id('2');

    await test.step('Activate adblocker', async () => {
        await gamePage.enableAdblocker();
    });

    await test.step('Go to game page', async () => {
        await page.goto('/games/daily-quick-crossword', { waitUntil: 'domcontentloaded' });
    });

    await test.step('"We noticed that you are using an ad blocker" banner should be visible', async () => {
        await gamePage.clickAgreeButtonIfExists();
        await expect(gamePage.getYouAreUsingAdBlockerContainer()).toBeVisible();
        await expect(gamePage.getYouAreUsingAdBlockerContainer())
            .toContainText('We noticed that you are using an ad blocker.');
    });

    await test.step('Match banner screenshot with the saved one', async () => {
        expect(await gamePage.getYouAreUsingAdBlockerContainer().screenshot()).toMatchSnapshot();
    });
});


test('Failed test example', async ({ page, gamePage }) => {
    await test.step('Go to game page', async () => {
        await page.goto('/games/daily-quick-crossword', { waitUntil: 'domcontentloaded' });
    });

    await test.step('Purposely replacing header fonts', async () => {
        const header = gamePage.getGameHeaderTitle();
        await header.evaluate((el) => el.style['font-family'] = 'Serif,sans-serif');
    });

    await test.step('Match banner screenshot with the saved one', async () => {
        expect(await gamePage.getGameHeaderTitle().screenshot()).toMatchSnapshot();
    });
});
