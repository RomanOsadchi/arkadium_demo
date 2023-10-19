import { expect, test } from '../../fixtures/base.fixture';
// eslint-disable-next-line import/named
import { CanvasBoxIframe } from '../../pages';


test('Resolve crossword', async ({ page, gamePage, testData }) => {
    const dayToPick = 1;
    await gamePage.blockMedia();
    await page.goto('/games/daily-quick-crossword', { waitUntil: 'domcontentloaded' });
    await gamePage.clickAgreeButtonIfExists();
    await gamePage.clickPlayButton();
    const canvasBox = new CanvasBoxIframe(page, await gamePage.getCanvasBox());
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
    await canvasBox.resolveCrosswordWithRevealing();
    await expect(canvasBox.getGameEndPopup()).toBeVisible();
    await page.waitForTimeout(1000);
    expect(await canvasBox.getGameEndPopup().screenshot()).toMatchSnapshot({ maxDiffPixelRatio: 0.15 });
    await canvasBox.clickByText('Submit Total Score');
    // await page.pause();
});
