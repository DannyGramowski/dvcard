import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disability } from '../interfaces/disability';
import { DisabilityInfoService } from '../services/disability-info.service';
import { Category } from '../interfaces/category';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Profile } from '../interfaces/profile';
import { firebase } from 'firebaseui-angular';


@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css'
})
export class SelectionComponent {
  
  currentUser: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', user_id: '', publicprofile: false};
  //categoryDict: Object = {'AIDS / HIV': [], 'ADDICTION', 'ALLERGIES', 'AMPUTATION', 'ANXIETY / PANIC DISORDER', 'ADD / ADHD', 'BLOOD DISORDERS', 'BODY SIZE', 'BRAIN INJURY', 'CONGENITAL', 'COVID-19 RELATED', 'GASTROINTESTINAL DISORDERS', 'HEADACHES', 'HEARING IMPAIRMENT', 'HEART CONDITION', 'HEIGHT', 'INTELLECTUAL IMPAIRMENT', 'LEARNING DISABILITY', 'MENTAL HEALTH CONDITIONS', 'PALSY', 'PARALYSIS', 'SPEECH IMPAIRMENT', 'VISION IMPAIRMENT', 'WEIGHT'};
  selectedCategory: number = -1;

  searchValue: string = "";

  categories: Category[] = this.disabilityInfo.getCategories();
  searchResults: Disability[] = [];
  selectedDisabilities: Disability[] = [];

  inspected: Disability | null = null;
  isAddGreyed: boolean = false;

  constructor (private disabilityInfo: DisabilityInfoService, private router: Router, private authService: AuthService) { this.getDisabilities(); }

  ngAfterContentInit(): void {
    let result = this.authService.getProfileSync();
    if (result) {
      this.currentUser = result;
      this.selectedDisabilities = this.currentUser.disabilities;
    }
    else {
      firebase.auth().onAuthStateChanged(() => {
        this.authService.getProfile().then(
          profile => {this.currentUser = profile; this.selectedDisabilities = this.currentUser.disabilities;}
        );
      });
    }
  }

  selectCategory(category: Category, i: number) {
    if (this.selectedCategory == i) {
      document.getElementById(`category${this.selectedCategory}`)?.classList.remove('selected-category');
      this.selectedCategory = -1;
      this.getDisabilities();
      return;
    }
    document.getElementById(`category${this.selectedCategory}`)?.classList.remove('selected-category');
    document.getElementById(`category${i}`)?.classList.add('selected-category');
    this.selectedCategory = i;
    this.getDisabilities();
  }

  getDisabilities() {
    // account for search value, disability filters
    let disabilities = this.disabilityInfo.getDisabilities();
    disabilities = disabilities.filter((d) => d.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    if (this.selectedCategory >= 0) {
      disabilities = disabilities.filter((d) => this.categories[this.selectedCategory].disabilities.map(item => item.name).includes(d.name));
    }
    this.searchResults = disabilities;
  }

  trackSearch (index: number, disability: Disability) {
    return disability.id;
  }

  inspectDisability(disability: Disability, i: number) {
    this.inspected = disability;
    if (this.selectedDisabilities.map(item => item.name).includes(disability.name)) {
      this.isAddGreyed = true;
    }
    else {
      this.isAddGreyed = false;
    }
    return;
  }

  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLTextAreaElement).value;
    this.getDisabilities();
  }

  closePopup() {
    this.inspected = null;
  }

  addDisability() {
    if (this.isAddGreyed) {
      return;
    }
    this.selectedDisabilities.push(this.disabilityInfo.getRawDisability(this.inspected!.id)!);
    this.inspected = null;
  }

  removeSelected(selected: string) {
    this.selectedDisabilities = this.selectedDisabilities.filter((d) => d.name != selected);
  }

  continue() {
    this.authService.getProfile().then(
      profile => {profile.disabilities = this.selectedDisabilities.flatMap(d => 
        {
          for (let db of profile.disabilities) {
            if (db.id == d.id) { return db; }
          }
          let v = this.disabilityInfo.getRawDisability(d.id);
          return v ? [v] : []
        }
        ); this.router.navigate(['/info-form']);}
    );
    
  }
}
