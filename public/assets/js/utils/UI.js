export class UI {
    constructor() {

    }
    
    getItem(item) {
        return document.querySelector(item);
    }
    getAll(items) {
        return document.querySelectorAll(items);
    }
}
