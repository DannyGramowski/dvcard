import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  variable: string = "Test";

  constructor() {};

  onLoadData() {
    console.log('rna');
    this.variable = "New";
  }
}
