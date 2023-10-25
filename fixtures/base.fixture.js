import { BasePage, GamePage } from '../pages';
import _ from 'lodash';
import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ENV = process.env.ENV || process.env.NODE_ENV || 'dev';

/*
This fixture will be used to initialize tests.
Additionally testData, basePage, gamePage can be extracted from "test" fixture
 */
const test = base.extend(
    {
        // testData - data for each individual test case stored in data folder
        testData: async ({}, use, testInfo) => {
            const testData = await getTestData(testInfo);
            await use(testData);
        },
        // basePage page object
        basePage: async ({ page, context, locale }, use) => {
            const pageObj = await new BasePage(page, context, locale);
            await use(pageObj);
        },
        // gamePage page object
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

/*
getTestData function resolves data file for the corresponding spec and return the data.
The file with the date should be located in the folder data/e2e/{name of spec without .spec}/{name of spec + .date}
Example data/e2e/specName/specName.data.js
Data file for specific environment: data/e2e/specName/specName.data.dev.js
Used for storing large data (patterns, mappers, etc.), in order not to clutter the test script
 */
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
