import { expect, test } from '../../fixtures/base.fixture';
// eslint-disable-next-line import/named
import { CanvasBoxIframe } from '../../pages';
import { allure } from 'allure-playwright';
import { convertMonthToNumber } from '../../utills/crossword.utills';

test('Resolve crossword', async ({ page, gamePage }) => {
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
        await gamePage.compareMonthAndYearWithCurrent(convertMonthToNumber(monthText), yearText);
        await canvasBox.clickPlayByData(dayToPick);
        const footerDate = await canvasBox.invokeDateFromFooter();
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

test('Check anti-adblocker', async ({ page, gamePage, testData }) => {
    await allure.id('34');

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
            .toContainText(testData.youUseAdblockerText);
    });

    await test.step('Match banner screenshot with the saved one', async () => {
        expect(await gamePage.getYouAreUsingAdBlockerContainer().screenshot()).toMatchSnapshot();
    });
});


test('Failed test example', async ({ page, gamePage }) => {
    await allure.id('67');

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

test.only('canvas test', async ({ page, context }) => {
    await page.goto('http://127.0.0.1:3000/index.html');
    const canvasHandle = await page.locator('#canvas');

    const objects = async () => await canvasHandle.evaluate((canvas) => {
        canvas.addEventListener('click', (event) => {
            const x = event.clientX - canvas.getBoundingClientRect().left;
            const y = event.clientY - canvas.getBoundingClientRect().top;
            console.log(`Click - X: ${x}, Y: ${y}`);
        });
        const ctx = canvas.getContext('2d');
        return structuredClone(ctx.getObjects()).map((el) => {
            el.x -= canvas.getBoundingClientRect().left;
            el.y -= canvas.getBoundingClientRect().top;
            return el;
        });
    });

    const getPlayers = async () => {
        const obj = await objects();
        return[
            obj.find((o) => o.player === 1),
            obj.find((o) => o.player === 2),
            obj.find((o) => o.type === 'puck')
        ];
    };
    for (let i = 0; i < 100; i++) {
        let [player1, player2, ball] = await getPlayers();
        await page.mouse.move(player1.x, player1.y);
        await page.mouse.down();
        await page.mouse.move(ball.x, ball.y - 4, { steps:10 });
        await page.mouse.up();
        await page.waitForTimeout(2000);
        console.log(player1, player2, ball);
        [player1, player2, ball] = await getPlayers();
        await page.mouse.move(player2.x, player2.y);
        await page.mouse.down();
        await page.mouse.move(ball.x, ball.y + 5, { steps:10 });
        await page.mouse.up();
        await page.waitForTimeout(2000);
    }


    // await page.pause();
});
