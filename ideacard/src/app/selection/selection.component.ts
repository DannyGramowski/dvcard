import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: string,
  name: string,
  description: string
}

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css'
})
export class SelectionComponent {
  categories: string[] = ['AIDS / HIV', 'ADDICTION', 'ALLERGIES', 'AMPUTATION', 'ANXIETY / PANIC DISORDER', 'ADD / ADHD', 'BLOOD DISORDERS', 'BODY SIZE', 'BRAIN INJURY', 'CONGENITAL', 'COVID-19 RELATED', 'GASTROINTESTINAL DISORDERS', 'HEADACHES', 'HEARING IMPAIRMENT', 'HEART CONDITION', 'HEIGHT', 'INTELLECTUAL IMPAIRMENT', 'LEARNING DISABILITY', 'MENTAL HEALTH CONDITIONS', 'PALSY', 'PARALYSIS', 'SPEECH IMPAIRMENT', 'VISION IMPAIRMENT', 'WEIGHT'];
  categoryDict: Object = {'AIDS / HIV': [], 'ADDICTION', 'ALLERGIES', 'AMPUTATION', 'ANXIETY / PANIC DISORDER', 'ADD / ADHD', 'BLOOD DISORDERS', 'BODY SIZE', 'BRAIN INJURY', 'CONGENITAL', 'COVID-19 RELATED', 'GASTROINTESTINAL DISORDERS', 'HEADACHES', 'HEARING IMPAIRMENT', 'HEART CONDITION', 'HEIGHT', 'INTELLECTUAL IMPAIRMENT', 'LEARNING DISABILITY', 'MENTAL HEALTH CONDITIONS', 'PALSY', 'PARALYSIS', 'SPEECH IMPAIRMENT', 'VISION IMPAIRMENT', 'WEIGHT'};
  selectedCategory: number = 0;


  selectCategory(category: string, i: number) {
    console.log(category);
    document.getElementById(`category${this.selectedCategory}`)?.classList.remove('selected-category');
    document.getElementById(`category${i}`)?.classList.add('selected-category');
    this.selectedCategory = i;
  }
}
