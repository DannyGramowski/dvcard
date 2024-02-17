import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firebase } from 'firebaseui-angular';
import { Profile } from '../interfaces/profile';
import { FirebaseModule } from '../firebase/firebase.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FirebaseModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public currentUser: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', uuid: '', publicprofile: false};
  popupActive: boolean = true;
  constructor (private authService: AuthService, private router: Router) {};

  ngAfterContentInit(): void {
    let result = this.authService.getProfileSync();
    if (result) {
      this.currentUser = result;
    }
    else {
      firebase.auth().onAuthStateChanged(() => {
        this.authService.getProfile().then(
          profile => {this.currentUser = profile;}
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

  getPopupToggles() {
    let qr = (document.getElementById("qrSlider") as HTMLInputElement).checked;
    let name = (document.getElementById("nameSlider") as HTMLInputElement).checked;
    let test = (document.getElementById("testSlider") as HTMLInputElement).checked;
    
    return {useQR: qr, useName: name, useTestimonials: test};
  }

  openExport() {
    //docx
    //put sliders above for qr code(include disclaimer that this will make your profile public),
    //include name, testimonials
    this.popupActive = true;
  }

  closeExport() {
    this.popupActive = false
  }

  exportDocx() {
    console.log(this.getPopupToggles())
  }

  deleteDisability(i: number) {
    this.currentUser.disabilities.splice(i, 1);
  }
}
