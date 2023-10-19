import { BasePage } from './base.page';


export class GamePage extends BasePage {
    #canvasBox = 'iframe[title="canvas box"]';
    getPlayButton = () =>  this.page.getByRole('button', { name: 'Play', exact: true });
    clickPlayButton = () => this.getPlayButton().click();
    getCanvasBox = () => this.page.frameLocator(this.#canvasBox);
}
