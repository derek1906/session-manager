import { BackgroundService, BackgroundPage } from './../background.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.css']
})
export class DomainListComponent implements OnInit {

  domains: string[];

  constructor(private backgroundService: BackgroundService) {}

  async ngOnInit() {
    const
        background: BackgroundPage = await this.backgroundService.getBackgroundPage(),
        datastore: Datastore = await background._require("datastore");

    this.domains = Object.keys(await datastore.get("domains"));
    console.log(this.domains);
  }
}
