import { Component, OnInit } from '@angular/core';
import { Testimonial } from '../interfaces/testimonial';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit{
  testimonials: Testimonial[] = [{name: "Danny", relationship:"GOAT", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", timestamp: Date.now()}, 
  {name: "Ava", relationship:"Bitch", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", timestamp: Date.now()}]

  ngOnInit() {
    (<HTMLAnchorElement>document.getElementById("linkDisplay")).href = this.getLink()
  }

  getLink(): string {
    // return "www.ideacard.com/testimonial/[userid]"
    return "https://www.w3schools.com/html/html_links.asp"
  }
}
