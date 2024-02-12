import { Injectable } from '@angular/core';
import { PopupComponent } from '../popup/popup.component';

//snackbar
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupTexts: string[] = ["error", "no error"]
  private popupComponent: PopupComponent | null = null
  constructor() { 

  }

  addPopupComponent(popupComponent: PopupComponent) {
    this.popupComponent = popupComponent;
  }

  getNextPopup() {
      let val =  this.popupTexts.pop();
      return typeof val === "string" ? val : ""
  }

  addPopup(text: string) {
    console.log("added pop")
    this.popupTexts.push(text);
    this.popupComponent?.onPopupAdd();
  } 

  hasPopups() {
    return this.popupTexts.length > 0;
  }
}
