import { Component } from '@angular/core';
import { APIService } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private appsync: APIService
  ) { }

  items = [];

  ngOnInit() {
    let self = this;
    let subscription = this.appsync.OnOrderFinalizedListener;

    subscription.subscribe(result => {
      console.log(result);

      const item = result.value.data.onOrderFinalized;
      self.items.push(item);
    })

  }

}
