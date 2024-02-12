import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  test: boolean = false
  currentPopup: string = "";

  constructor(private popupService: PopupService){
    popupService.addPopupComponent(this)
    popupService.addPopup("new test");
  }

  onPopupAdd() {
    console.log("on popup add")
    console.log("first" + this.currentPopup);
    if(this.currentPopup == "") {
      this.currentPopup = this?.popupService?.getNextPopup();
      console.log("second" + this.currentPopup);
      console.log(this.currentPopup)
    }  
  }

  canDisplay() {
    return this.currentPopup !== "";
  }
}
