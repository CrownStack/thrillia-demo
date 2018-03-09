import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  selectedMerchantsList: any;
  public keyUp = new Subject<string>();
  merchants$: Observable<Merchant[]>
  selectedMerchants$: Observable<Merchant[]>

  constructor(
    protected http: Http
  ) {
    this.keyUp
      .map((event: any) => { return event.target.value.toLowerCase() })
      .debounceTime(50)
      .distinctUntilChanged()
      .subscribe(searchString => {
        this.merchants$.subscribe(merchants => {
          this.selectedMerchantsList = merchants.filter(merchant => (merchant.activities.filter(activity => activity.toLowerCase().indexOf(searchString) != -1)).length > 0)
        })
      });
  }

  ngOnInit() {
    this.merchants$ = this.getAllMerchants();

  }

  getAllMerchants(params?: any): Observable<Merchant[]> {
    //The branches list  is going to be constant all the time
    //therefore loading it from JSON file rather than the API.
    return this.http.get('assets/merchants.json')
      .map(res => res.json())
      .map(res => res.data)
  }
}


export interface Merchant {
  name: string
  address_city: string
  address_state: string
  address_zip: string
  website: string
  phone: string
  activities: string[]
}
