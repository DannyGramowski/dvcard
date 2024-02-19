import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../interfaces/profile';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.css'
})
export class PublicProfileComponent implements OnInit {
  uuid: string;
  profile: Profile
  publicProfile: boolean
  profileLoaded: boolean

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
    this.uuid = this.route.snapshot.paramMap.get('uuid') ?? "not valid uuid";
    this.publicProfile = false
    this.profileLoaded = false;
    this.profile = {name: "", language: "", location: "", uuid: "", publicprofile: false, exists: false, disabilities: [], testimonials: []}
  }
  
  ngOnInit(): void {
    fetch(`${this.api.url}/publicprofile?user_id=${this.uuid}`)
    .then(res => {
      res.json()
      .then(data => {
        this.publicProfile = "publicprofile" in data;
        this.profile = data;
        this.profileLoaded = true;
        console.log(this.profile);
      })
    });  
  }
}
