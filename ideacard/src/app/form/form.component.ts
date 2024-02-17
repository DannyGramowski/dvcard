import { Component, QueryList, ViewChildren } from '@angular/core';
import { Disability } from '../interfaces/disability';
import { Profile } from '../interfaces/profile';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { firebase } from 'firebaseui-angular';
import { CommonModule } from '@angular/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { DisabilityInfoService } from '../services/disability-info.service';
import { Accommodation } from '../interfaces/accommodation';
import { RefreshDirective } from '../misc/refreshDirective';
import { Symptom } from '../interfaces/symptom';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FirebaseModule, CommonModule, RefreshDirective],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  public currentUser: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', uuid: '', publicprofile: false};

  selectedPage: number = 0;

  disabilities: Disability[] = [];

  accommodations: Accommodation[] = [];

  constructor(private authService: AuthService, private router: Router, private disabilityInfo: DisabilityInfoService) {} 

  ngAfterContentInit(): void {
    let result = this.authService.getProfileSync();
    if (result) {
      this.currentUser = result;
      this.disabilities = this.currentUser.disabilities.flatMap(d => {
        let v = this.disabilityInfo.getDisabilityById(d.id)
        return v ? [v] : []
      });
      this.generateAccommodations();
    }
    else {
      firebase.auth().onAuthStateChanged(() => {
        this.authService.getProfile().then(
          profile => {this.currentUser = profile; // TODO make the next line grab from service instead of using the canon disabilities bc we want their info not their objects
            this.disabilities = this.currentUser.disabilities.flatMap(d => {
              let v = this.disabilityInfo.getDisabilityById(d.id)
              return v ? [v] : []
            });}
            
        );
      });
    }
    
  }

  selectPage(pageNum: number) {
    if (pageNum == this.selectedPage) { return; }
    this.saveNoteContent();
    this.selectedPage = pageNum;
    this.generateAccommodations();
  }

  // NOTE the following function will run once per symptom. DO NOT expect this to be a once-per-render deal.
  initSymptoms() {
    // This is still broken; specifically reloading a page once you've already been there in a single form session. Don't ask why.
    for (let d of this.disabilities) {
      for (let i in d.symptoms) {
        document.getElementById(`symptom${i}`)?.classList.remove('checked');
      }
    }
    this.disabilities[this.selectedPage].symptoms.forEach((s, i) => {
      if (this.currentUser.disabilities[this.selectedPage].symptoms.includes(s)) {
        document.getElementById(`symptom${i}`)?.classList.add('checked');
      }
    });
    
    (document.getElementById('notes') as HTMLTextAreaElement).value = this.currentUser.disabilities[this.selectedPage].extrainfo;
    for (let item of this.currentUser.disabilities[this.selectedPage].symptoms) {
      if (item.id < 0) {
        if (document.getElementById(`custom-symptom${item.id}`)) {
          (document.getElementById(`custom-symptom${item.id}`) as HTMLTextAreaElement).value = item.name;
        }
      }
    }
  }

  initAccommodations() {
    this.accommodations.forEach((a, i) => {
      if (this.currentUser.disabilities[this.selectedPage].accommodations.includes(a)) {
        document.getElementById(`accommodation${i}`)?.classList.add('checked');
      }
    })
    
    for (let item of this.currentUser.disabilities[this.selectedPage].accommodations) {
      if (item.id < 0) {
        if (document.getElementById(`custom-accommodation${item.id}`)) {
          (document.getElementById(`custom-accommodation${item.id}`) as HTMLTextAreaElement).value = item.name;
        }
      }
    }
  }
  
  goToSelection() {
    this.router.navigate(['/selection']);
  }

  generateAccommodations() {
    let a = this.currentUser.disabilities[this.selectedPage].symptoms.flatMap(s => s.accommodations);
    
    for (let item of this.currentUser.disabilities[this.selectedPage].accommodations) {
      a.push(item);
    }
    a = a.filter((v, i) => a.indexOf(v) == i);
    this.accommodations = a;
  }

  checkSymptom(index: number, symptom: Symptom) {
    if (this.currentUser.disabilities[this.selectedPage].symptoms.some(c => c.id == symptom.id)) {
      this.currentUser.disabilities[this.selectedPage].symptoms = this.currentUser.disabilities[this.selectedPage].symptoms.filter(d => d.id != this.disabilities[this.selectedPage].symptoms[index].id);
      if (symptom.id < 0) {
        this.disabilities[this.selectedPage].symptoms = this.disabilities[this.selectedPage].symptoms.filter(d => d.id != symptom.id);
      }
      else {
        document.getElementById(`symptom${index}`)?.classList.remove('checked');
      }
    }
    else {
      document.getElementById(`symptom${index}`)?.classList.add('checked');
      this.currentUser.disabilities[this.selectedPage].symptoms.push(this.disabilities[this.selectedPage].symptoms[index]);
    }      
    this.generateAccommodations();
  }

  checkAccommodation(index: number, a: Accommodation) {
    if (this.currentUser.disabilities[this.selectedPage].accommodations.some(c => c.id == a.id)) {
      this.currentUser.disabilities[this.selectedPage].accommodations = this.currentUser.disabilities[this.selectedPage].accommodations.filter(d => d.id != a.id);
      if (a.id < 0) {
        this.accommodations = this.accommodations.filter(d => d.id != a.id);
      }
      else {
        document.getElementById(`accommodation${index}`)?.classList.remove('checked');
      }
    }
    else {
      document.getElementById(`accommodation${index}`)?.classList.add('checked');
      this.currentUser.disabilities[this.selectedPage].accommodations.push(a);
    }
  }

  nextDisability() {
    this.selectPage(this.selectedPage + 1);
  }

  continue() {
    this.saveNoteContent();
    this.router.navigate(['/dashboard']);
  }

  saveNoteContent() {
    this.currentUser.disabilities[this.selectedPage].extrainfo = (document.getElementById('notes') as HTMLTextAreaElement).value;
    (document.getElementById('notes') as HTMLTextAreaElement).value = "";
    for (let item of this.currentUser.disabilities[this.selectedPage].symptoms) {
      if (item.id < 0) {
        if ((document.getElementById(`custom-symptom${item.id}`) as HTMLTextAreaElement).value == "") {
          this.currentUser.disabilities[this.selectedPage].symptoms = this.currentUser.disabilities[this.selectedPage].symptoms.filter(s => s.id != item.id);
          this.disabilities[this.selectedPage].symptoms = this.disabilities[this.selectedPage].symptoms.filter(s => s.id != item.id);
        }
        item.name = (document.getElementById(`custom-symptom${item.id}`) as HTMLTextAreaElement).value;
      }
    }
    for (let item of this.currentUser.disabilities[this.selectedPage].accommodations) {
      if (item.id < 0) {
        if ((document.getElementById(`custom-accommodation${item.id}`) as HTMLTextAreaElement).value == "") {
          this.currentUser.disabilities[this.selectedPage].accommodations = this.currentUser.disabilities[this.selectedPage].accommodations.filter(a => a.id != item.id);
          this.accommodations = this.accommodations.filter(a => a.id != item.id);
        }
        item.name = (document.getElementById(`custom-accommodation${item.id}`) as HTMLTextAreaElement).value;
      }
    }
  }

  addNewSymptom() {
    this.saveNoteContent();
    let min = 0;
    for (let s of this.currentUser.disabilities[this.selectedPage].symptoms) {
      if (s.id < min) {
        min = s.id;
      }
    }
    let s = {id: min - 1, name: "", description: "", accommodations: []};
    this.currentUser.disabilities[this.selectedPage].symptoms.push(s);
    this.disabilities[this.selectedPage].symptoms.push(s);
  }

  addNewAccommodation() {
    this.saveNoteContent();
    let min = 0;
    for (let a of this.currentUser.disabilities[this.selectedPage].accommodations) {
      if (a.id < min) {
        min = a.id;
      }
    }
    let a = {id: min - 1, name: "", description: "", link: ""};
    this.currentUser.disabilities[this.selectedPage].accommodations.push(a);
    this.disabilities[this.selectedPage].accommodations.push(a);
    this.generateAccommodations();
  }
}
