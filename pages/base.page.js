import { PlaywrightBlocker } from '@cliqz/adblocker-playwright';
import fetch from 'cross-fetch';

export class BasePage {
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
        PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInPage(this.page);
        });
        await this.page.route('**/*', (route) => {
            return route.request().resourceType() === 'media' ?
                route.abort() : route.continue();
        });
    };

    clickAgreeButtonIfExists = async () => {
        const btn = await this.page.getByRole('button', { name: 'AGREE', exact: true });
        if(await btn.count()) await btn.click();
    };
    waitForSpinner = async (loader = '.ListArray-loader') => {
        let spinner = false;
        let time = 0;
        while (!spinner && time < 40) {
            if (await this.page.locator(loader).count()) {
                await this.page.locator(loader).scrollIntoViewIfNeeded();
                // await expect(this.page.locator(loader)).toHaveCount(0, {timeout: 300000});
                if (await this.page.locator(loader).count() === 0) {
                    spinner = true;
                    break;
                }
                await this.page.waitForTimeout(50);
            }
            await this.page.waitForTimeout(50);
            time++;
        }
    };
}
