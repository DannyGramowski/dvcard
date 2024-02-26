import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firebase } from 'firebaseui-angular';
import { Profile } from '../interfaces/profile';
import { FirebaseModule } from '../firebase/firebase.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FirebaseModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private default: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', uuid: '', publicprofile: false};
  public currentUser: Profile = this.default;
  popupActive: boolean = false;
  publicProfileConfirmationActive: boolean = false;
  useQR: boolean = false;
  useName: boolean = false;
  useTestimonials: boolean = false;
//  popupToggles = {useQR: false, useName: false, useTestimonials: false}

  constructor (private authService: AuthService, private router: Router, private api: ApiService) {};

  ngAfterContentInit(): void {
    console.log('ngAftercontentInit')
    let result = this.authService.getProfileSync();
    if (result) {
      console.log('result')
      console.log(result)
      this.currentUser = result;
    }
    else {
      console.log('else')
      firebase.auth().onAuthStateChanged(() => {
        this.authService.getProfile().then(
          profile => {
            this.currentUser = profile; 
            console.log(profile);
          }
        );
      });
    }
  }

  goToSelection() {
    this.router.navigate(['/selection']);
  }
  
  goToEdit() {
    this.router.navigate(['/info-form']);
  }

  openExport() {
    //docx
    //put sliders above for qr code(include disclaimer that this will make your profile public),
    //include name, testimonials
    this.popupActive = true;
    //this.setSliders();
  }

  closeExport() {
    this.popupActive = false;
  }

  onSliderClick(id:string) {
    console.log(id);
  }

  //returning true so I can use it in the ngIf to ensure it gets called
  setSliders() {
    (<HTMLInputElement>document.getElementById("qrSlider")).checked = this.useQR;
    (<HTMLInputElement>document.getElementById("nameSlider")).checked = this.useName;
    (<HTMLInputElement>document.getElementById("testSlider")).checked = this.useTestimonials;
    return true;
  }

  onNameSliderClick() {
    this.useName = !this.useName;
    this.setSliders();
  }

  onTestimonialSliderClick() {
    this.useTestimonials = !this.useTestimonials;
    this.setSliders();
  }

  onQRSliderClick() {
    if(!this.useQR) {
      this.popupActive = false;
      this.publicProfileConfirmationActive = true;
    } else {
      this.useQR = false;
      this.setSliders()
    }
  }

  closeConfirmationAccept() {
    this.publicProfileConfirmationActive = false;
    this.popupActive = true;
    this.useQR = true;
    //this.setSliders();
    console.log(this)
  }

  closeConfirmationCancel() {
    this.publicProfileConfirmationActive = false;
    this.popupActive = true;
    this.useQR = false;
    //this.setSliders();
  }

  exportDocx() {
    console.log(this)
  }

  exportPDF() {
    this.api.getDownload('PDF');
  }

  exportBusinessCard() {
    this.api.getDownload('Business-Card');
  }

  exportQR() {
    this.api.getDownload('QR');
  }

  deleteDisability(i: number) {
    this.currentUser.disabilities.splice(i, 1);
  }
}
