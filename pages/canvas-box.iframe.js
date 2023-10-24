import { BasePage } from './base.page';

export class CanvasBoxIframe extends BasePage {
    #footerInfo = '[class*="game_inlinePuzzleInfo"]';
    #dateCards = '[class*="gameStart_puzzle"]';
    #dateHeader = 'section>button~span';
    #checkButton = 'button[data-tip="(Ctrl+C)"]';
    #revealButton = 'button[data-tip="(Ctrl+V)"]';
    #allCells = 'g:not([class=""]) text[font-family="Arial"]';
    #autocheckCheckbox = '[class*="game_dropdown"] li:has(#skip)';
    #crossLine = 'g>line';
    #gameEndPopup = 'section[class*="gameEndPopup_window"]';

    constructor(page, canvasIframe)  {
        super(page);
        this.frame = canvasIframe;
    }

    clickByText = (text) => this.frame.getByText(text, { exact: true }).click();
    getHeaderMonthAndYear = async () => {
        const dateStr = await this.frame.locator(this.#dateHeader).innerText({ timeout: 80000 });
        return dateStr.split(' ');
    };
    clickPlayByDate = (day) => this.frame.locator(this.#dateCards)
        .getByText(day.toString(), { exact: true })
        .click({ force: true });
    getFooterInfo = () => this.frame.locator(this.#footerInfo);
    getCrossLines = () => this.frame.locator(this.#crossLine);
    clickCheckButton = () => this.frame.locator(this.#checkButton).click();
    clickRevealButton = () => this.frame.locator(this.#revealButton).click();
    getAllCells = () => this.frame.locator(this.#allCells).all();
    getEmptyCells = () => this.frame.locator(this.#allCells).filter({ hasNotText: /\w+/ });
    checkAutoCheckCheckbox = () => this.frame.locator(this.#autocheckCheckbox).click();
    getGameEndPopup = () => this.frame.locator(this.#gameEndPopup);
    resolveCrosswordWithChecks = async () => {
        await this.clickCheckButton();
        await this.checkAutoCheckCheckbox();
        const cells = await this.getAllCells();
        console.log(cells.length);
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        for (const cell of cells) {
            for (const letter of alphabet) {
                await cell.type(letter);
                if (await this.getCrossLines().count()) {
                    await this.page.keyboard.press('Backspace');
                }else break;
            }

            await this.page.keyboard.press('Enter');
        }
    };

    resolveCrosswordWithRevealing = async () => {
        for (let i = 0; i < 26; i++) {
            await this.clickRevealButton();
            await this.clickByText('Reveal word');
            await this.page.keyboard.press('Enter');
        }
    };

    invokeDateFromFooter = async () => {
        const footerInfo = await this.getFooterInfo().innerText();
        const dateRegex = /(\d{1,2}\s\w+\s\d{4})/;
        return footerInfo.match(dateRegex)[0];
    };
}
