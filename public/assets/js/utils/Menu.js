import { UI } from "./UI.js";

export class Menu extends UI {
  constructor(menuBtn, menu,menuShadow) {
    super();
    this.menuBtn = menuBtn;
    this.menu = menu;
    this.menuShadow = menuShadow;
    this.#renderMenu();
  }
  toggleMenu = () => {
    if (!this.menu.classList.contains("showMenu")) {
      TweenMax.to(".menuOverlay", 0.5, {
        opacity: 0.7,
        zIndex:10,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".bar-1", 0.4, {
        rotation: 45,
        X: 0,
        y: 11,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".bar-2", 0.7, {
        X: -70,
        opacity: 0,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".bar-3", 0.4, {
        rotation: -45,
        x: 1,
        y: -10,
        ease: Expo.easeInOut,
      });
    } else {
      TweenMax.to(".menuOverlay", 0.5, {
        opacity: 0,
        zIndex:-1,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".bar-1", 0.4, {
        x: 0,
        y: 0,
        rotation: 0,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".bar-2", 0.7, {
        delay: 0.2,
        X: 0,
        opacity: 1,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".bar-3", 0.4, {
        x: 0,
        y: 0,
        rotation: 0,
        ease: Expo.easeInOut,
      });
    }

    return this.menu.classList.toggle("showMenu");
  };
  #renderMenu() {
    this.menuBtn.addEventListener("click", this.toggleMenu);
    this.menuShadow.addEventListener("click", this.toggleMenu);
  }
}
