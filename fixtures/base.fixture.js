import { BasePage, GamePage } from '../pages';
import _ from 'lodash';
import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ENV = process.env.ENV || process.env.NODE_ENV || 'dev';

const test = base.extend(
    {
        testData: async ({}, use, testInfo) => {
            const testData = await getTestData(testInfo);
            await use(testData);
        },
        basePath: async ({}, use, workerInfo) => {
            const basePath = workerInfo.project.use.baseURL;
            await use(basePath);
        },
        basePage: async ({ page, context, locale }, use) => {
            const pageObj = await new BasePage(page, context, locale);
            await use(pageObj);
        },
        gamePage: async ({ page, context, locale }, use) => {
            const pageObj = await new GamePage(page, context, locale);
            await use(pageObj);
        }
    }

);

export { test };
export {
    expect, chromium, webkit, firefox
} from '@playwright/test';

async function getTestData(testInfo) {
    const filePath = await testInfo.file;
    const dataFolder = path.parse(filePath).dir.replace(`${path.sep}tests`, `${path.sep}data`);
    const dataFileName = path.basename(filePath, '.spec.js');
    const dataFilePath = path.join(dataFolder, dataFileName, `${dataFileName}.data`);
    const testData = {};
    for (const file of [
        `${dataFilePath}.js`,
        `${dataFilePath}.${ENV}.js`
    ]) {
        if (fs.existsSync(file)) {
            const data = require(file);
            _.merge(testData, data);
        }
    }
    return testData;
}
