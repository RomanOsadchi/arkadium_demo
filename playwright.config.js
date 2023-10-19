
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';


const ENV = process.env.ENV || process.env.NODE_ENV || 'dev';
dotenv.config({ path: `config/env-config.${ENV}.env` });

export default defineConfig({
    testDir: './tests',
    timeout: 60 * 60 * 1000,
    globalTimeout: 4 * 60 * 60 * 1000,
    expect: { timeout: 15000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ['line'],
        [
            'allure-playwright', {
                detail: false,
                suiteTitle: false,
                stripANSIControlSequences: true,
                attachmentsBaseURL: true
            }
        ]
    ],
    use: {
        baseURL: 'https://www.gamelab.com',
        navigationTimeout: 30000,
        actionTimeout: 20000,
        ignoreHTTPSErrors: true,
        trace: 'off',
        screenshot: 'on',
        video: 'on'

    },
    projects: [
        {
            name: 'chromium-en',
            use: {
                ...devices['Desktop Chrome'],
                // channel: 'chrome',
                locale: 'en-US'
            }
        }
    ]

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});

