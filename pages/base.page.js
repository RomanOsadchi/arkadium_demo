import { PlaywrightBlocker } from '@cliqz/adblocker-playwright';
import { expect } from '../fixtures/base.fixture';
import fetch from 'cross-fetch';

export class BasePage {
    #antiAdblockerBox = '[data-element-description="game"]';

    constructor(page) {
        this.page = page;
    }

    blockMedia = async () => {
        await this.page.route('**/*', (route) => {
            return route.request().resourceType() === 'media' ?
                route.abort() : route.continue();
        });
    };

    enableAdblocker = async () => {
        await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInPage(this.page);
        });
        await this.page.route('**/*', (route) => {
            return route.request().resourceType() === 'media' ?
                route.abort() : route.continue();
        });
    };

    clickAgreeButtonIfExists = async () => {
        const btnEl = await this.page.getByRole('button', { name: 'AGREE', exact: true });
        try {
            await this.page.waitForSelector('[role="dialog"]', { timeout: 2000 });
            await btnEl.click();
        } catch (er) {
            // no popup, continue test
        }
    };

    getYouAreUsingAdBlockerContainer = () => this.page.locator(this.#antiAdblockerBox);

    compareMonthAndYearWithCurrent = (month, year) => {
        const targetDate = new Date(Date.UTC(year, month, 1));
        const currentDate = new Date();
        expect(targetDate.getUTCMonth()).toEqual(currentDate.getUTCMonth());
        expect(targetDate.getUTCFullYear()).toEqual(currentDate.getUTCFullYear());
    };
}
