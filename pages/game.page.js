import { BasePage } from './base.page';


export class GamePage extends BasePage {
    // locators
    #canvasBox = 'iframe[title="canvas box"]';
    #headerTitle = 'h1[data-element-description="game title"]';
    #playAgainButton = '[data-element-description="game-end play-again-button"]';
    // Page Object methods
    getPlayButton = () =>  this.page.getByRole('button', { name: 'Play', exact: true });
    clickPlayButton = () => this.getPlayButton().click();
    getCanvasBox = () => this.page.frameLocator(this.#canvasBox);
    getGameHeaderTitle = () => this.page.locator(this.#headerTitle);
    getPlayAgainButton =  () => this.page.locator(this.#playAgainButton);
}
