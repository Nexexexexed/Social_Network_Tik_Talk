import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileCardComponent } from './common-ui/profile-card/profile-card.component';
import { ProfileService } from './data/services/profile.service';
import { Profile } from './data/interfaces/provide.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProfileCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Social_Network_Tik_Talk';
  profileServices: ProfileService = inject(ProfileService);
  profiles: Profile[] = [];

  constructor() {
    this.profileServices.getTestAccount().subscribe((val) => {
      this.profiles = val;
    });
  }
}
