import { Menu } from "../utils/Menu.js"
import { UI } from "../utils/UI.js"


class App extends UI {
    constructor() {
        super()
        this.render()
    }
    render() {
        const menu = new Menu(this.getItem('#Hamburger'),this.getItem('#MainMenu'), this.getItem("#MenuOverlay"));
    }
}

const app = new App()