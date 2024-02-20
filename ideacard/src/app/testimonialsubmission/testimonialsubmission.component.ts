import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-testimonialsubmission',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './testimonialsubmission.component.html',
  styleUrl: './testimonialsubmission.component.css'
})
export class TestimonialSubmissionComponent {
  name: string = ""
  relationship: string = ""
  message: string = ""
  maxMessageLength: number = 450
  uuid: string;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
      this.uuid = this.route.snapshot.paramMap.get('uuid') ?? "not valid uuid";
  }

  submit() {
    console.log(this)
    if(this.name.length === 0 || this.relationship.length === 0 || this.message.length === 0) {
      console.log("entries incomplete")
      return;
    } 
    let headers = new Headers();
    headers.set("Content-Type", 'application/json')
    headers.set("uuid", this.uuid)
    fetch(`${this.api.url}/testimonial`, {
      method: 'POST', headers: headers,
      body: JSON.stringify({
        from_name: this.name,
        relationship: this.relationship,
        description: this.message
      })
    }).then(() => {this.router.navigateByUrl('submitsuccess')})
    // let headers = new Headers();
    //     console.log(result)
    //     fetch(`${this.url}/login`, {headers: headers})
    //     .then( () => {
    //       fetch(`${this.url}/user`, 
    //         {method: 'PUT', headers: headers, 
    //           body: JSON.stringify({
    //             name: name,
    //             location: country,
    //             language: language
    //           })
    //         }
    //       )
  }

  messageCallback() {
    console.log("message callback")
    let textArea: HTMLTextAreaElement = document.getElementById("messageInput") as HTMLTextAreaElement
    let text:string = (textArea)?.value
    if(text.length > this.maxMessageLength) {
      textArea.value = text.slice(0, this.maxMessageLength) // = value.slice(0, this.maxMessageLength);
    }
    
  }
}
