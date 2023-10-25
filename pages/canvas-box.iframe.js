import { BasePage } from './base.page';

export class CanvasBoxIframe extends BasePage {
    // locators
    #footerInfo = '[class*="game_inlinePuzzleInfo"]';
    #dateCards = '[class*="gameStart_puzzle"]';
    #dateHeader = 'section>button~span';
    #revealButton = 'button[data-tip="(Ctrl+V)"]';
    #allCells = 'g:not([class=""]) text[font-family="Arial"]';
    #crossLine = 'g>line';
    #gameEndPopup = 'section[class*="gameEndPopup_window"]';

    constructor(page, canvasIframe)  {
        super(page);
        this.frame = canvasIframe;
    }
    // Page Object methods
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
    clickRevealButton = () => this.frame.locator(this.#revealButton).click();
    getAllCells = () => this.frame.locator(this.#allCells).all();
    getGameEndPopup = () => this.frame.locator(this.#gameEndPopup);

    resolveCrosswordWithRevealing = async () => {
        // reveal word for each iteration then go to the next word
        for (let i = 0; i < 26; i++) {
            await this.clickRevealButton();
            await this.clickByText('Reveal word');
            await this.page.keyboard.press('Enter');
        }
    };

    invokeDateFromFooter = async () => {
        const footerInfo = await this.getFooterInfo().innerText();
        const dateRegex = /(\d{1,2}\s\w+\s\d{4})/; // regular expression for date in the footer info
        return footerInfo.match(dateRegex)[0];
    };
}
