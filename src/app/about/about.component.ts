import { Component, Inject, OnInit } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders: Leader[];

  constructor(private leadersService: LeaderService,
    @Inject("BaseURL") private baseURL) { }

  ngOnInit() {
    this.leadersService.getLeaders()
      .subscribe(leaders => this.leaders = leaders);
  }

}
