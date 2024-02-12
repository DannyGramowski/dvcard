import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disability } from '../interfaces/disability';
import { DisabilityInfoService } from '../services/disability-info.service';
import { Category } from '../interfaces/category';



@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css'
})
export class SelectionComponent {
  
  //categoryDict: Object = {'AIDS / HIV': [], 'ADDICTION', 'ALLERGIES', 'AMPUTATION', 'ANXIETY / PANIC DISORDER', 'ADD / ADHD', 'BLOOD DISORDERS', 'BODY SIZE', 'BRAIN INJURY', 'CONGENITAL', 'COVID-19 RELATED', 'GASTROINTESTINAL DISORDERS', 'HEADACHES', 'HEARING IMPAIRMENT', 'HEART CONDITION', 'HEIGHT', 'INTELLECTUAL IMPAIRMENT', 'LEARNING DISABILITY', 'MENTAL HEALTH CONDITIONS', 'PALSY', 'PARALYSIS', 'SPEECH IMPAIRMENT', 'VISION IMPAIRMENT', 'WEIGHT'};
  selectedCategory: number = -1;

  searchValue: string = "";

  inspected: Disability | null = null;

  constructor (private disabilityInfo: DisabilityInfoService) {}

  selectCategory(category: Category, i: number) {
    console.log(category);
    if (this.selectedCategory == i) {
      document.getElementById(`category${this.selectedCategory}`)?.classList.remove('selected-category');
      this.selectedCategory = -1;
      return;
    }
    document.getElementById(`category${this.selectedCategory}`)?.classList.remove('selected-category');
    document.getElementById(`category${i}`)?.classList.add('selected-category');
    this.selectedCategory = i;
  }

  getCategories() {
    return this.disabilityInfo.getCategories();
  }

  getDisabilities() {
    // account for search value, disability filters
    let disabilities = this.disabilityInfo.getDisabilities();
    disabilities = disabilities.filter((d) => d.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    console.log('test');
    return disabilities;
  }

  trackSearch (index: number, disability: Disability) {
    return disability.id;
  }

  inspectDisability(disability: Disability, i: number) {
    this.inspected = disability;
    return;
  }

  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLTextAreaElement).value;
  }
}
