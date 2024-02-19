import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Testimonial } from '../interfaces/testimonial';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [];
  // [{name: "Danny", relationship:"GOAT", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", timestamp: Date.now()}, 
  // {name: "Ava", relationship:"Bitch", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", timestamp: Date.now()}]
  uuid: string = ""
  constructor(authservice: AuthService) {
    authservice.getProfile()
    .then(profile => {
      this.testimonials = profile.testimonials
      this.uuid = profile.uuid
    }).then(() => {  
      let link = document.getElementById("abcdef") as HTMLAnchorElement
      console.log(link)
      link.setAttribute("href", this.getLink());
    });
    // let link = document.getElementsByClassName("link")
    
    
    // link.getAttribute("href");
    // link.setAttribute("href", this.getLink());
    // link.textContent = this.getLink();
  }

  getLink(): string {
     return `http://idea-card.com/submittestimonial/${this.uuid}`
    //  return `www.ideacard.com/submittestimonial/${this.uuid}`
    // return 1`https://www.w3schools.com/html/html_links.asp
  }
}
