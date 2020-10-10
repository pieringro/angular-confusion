import { Component, Inject, OnInit } from '@angular/core';
import { expand, flyInOut } from '../animations/app.animation';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];

  leaderErrMess: string;

  constructor(private leadersService: LeaderService,
    @Inject("BaseURL") private baseURL) { }

  ngOnInit() {
    this.leadersService.getLeaders().subscribe(leaders => this.leaders = leaders,
      errmess => this.leaderErrMess = <any>errmess);
  }

}
