import { Component, QueryList, ViewChildren } from '@angular/core';
import { Disability } from '../interfaces/disability';
import { Profile } from '../interfaces/profile';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { firebase } from 'firebaseui-angular';
import { CommonModule } from '@angular/common';
import { FirebaseModule } from '../firebase/firebase.module';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FirebaseModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  public currentUser: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', user_id: '', publicprofile: false};
  
  selectedPage: number = 0;

  disabilities: Disability[] = [];

  constructor(private authService: AuthService, private router: Router) {} 

  ngAfterContentInit(): void {
    firebase.auth().onAuthStateChanged(() => {
      this.authService.getProfile().then(
        profile => {this.currentUser = profile; // TODO make the next line grab from service instead of using the canon disabilities bc we want their info not their objects
          this.disabilities = this.currentUser.disabilities}
      );
    });
  }

  selectPage(pageNum: number) {
    this.selectedPage = pageNum;
  }
  
  runFunc() {

  }

  goToSelection() {
    this.router.navigate(['/selection']);
  }

  generateAccommodations() {

  }

  checkSymptom(index: number) {
    if (document.getElementById(`symptom${index}`)?.classList.contains('checked')) {
      document.getElementById(`symptom${index}`)?.classList.remove('checked');
      this.currentUser.disabilities[this.selectedPage].symptoms = this.currentUser.disabilities[this.selectedPage].symptoms.filter(d => d.id != this.disabilities[this.selectedPage].symptoms[index].id);
      this.generateAccommodations();
    }
    else {
      document.getElementById(`symptom${index}`)?.classList.add('checked');
      this.currentUser.disabilities[this.selectedPage].symptoms.push(this.disabilities[this.selectedPage].symptoms[index]);
      this.generateAccommodations();
    }
  }
}
