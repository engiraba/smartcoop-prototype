import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import mock from 'src/app/mock/sample.mock.json';
import cities from 'src/app/mock/cities.mock.json';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  // temporary, will recode this one once connected with the api
  getMany(): Observable<any> {
    return of([mock]);
  }

  getCities(): Observable<any> {
    return of(cities);
  }
}
