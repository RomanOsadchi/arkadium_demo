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
