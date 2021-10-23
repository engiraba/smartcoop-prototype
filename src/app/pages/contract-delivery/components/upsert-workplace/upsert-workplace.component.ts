import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-upsert-workplace',
  templateUrl: './upsert-workplace.component.html',
  styleUrls: ['./upsert-workplace.component.scss'],
})
export class UpsertWorkplaceComponent implements OnInit {
  totalHours: number = this.data.totalHours;
  cities: Array<{ name: string; postalCode: string }> = [];

  // setting up default starting time, can be recode depending on the requirement
  place = new FormGroup({
    startTime: new FormControl(this.data.defaultStartingTime, [
      Validators.required,
    ]),
    hoursDuration: new FormControl(this.totalHours, [Validators.required]),
    address: new FormGroup({
      city: new FormControl('', [Validators.required]),
      info: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      streetAndNumber: new FormControl('', [Validators.required]),
    }),
  });

  constructor(
    private dialogRef: MatDialogRef<UpsertWorkplaceComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private sb: MatSnackBar,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.api
      .getCities()
      .subscribe((res: Array<{ name: string; postalCode: string }>) => {
        this.cities = res;
      });
    if (this.data.place) {
      this.place = this.data.place;
    } else {
      (this.place.get('address') as FormGroup)
        .get('city')
        ?.valueChanges.subscribe((res) => {
          (this.place.get('address') as FormGroup)
            .get('postalCode')
            ?.setValue(this.cities.find((o) => o.name == res)?.postalCode);
          if (this.data.city && res == this.data.city) {
            this.place
              .get('startTime')
              ?.setValue(this.data.defaultStartingTime);
          } else {
            this.place
              .get('startTime')
              ?.setValue(this.data.adjustedDefaultStartingTime);
          }
        });
    }
  }

  add() {
    // Restriction: You can't pick a starting time prior to the encoding time
    if (this.data?.role == 'Service provider') {
      var startTime = this.place.get('startTime')?.value.split(':');
      var currentDate = new Date();
      var startingDateTime = new Date(
        this.data.date.getFullYear(),
        this.data.date.getMonth(),
        this.data.date.getDate(),
        startTime[0], //hour
        startTime[1] //minute
      );
      // check if starting datetime is behind than the current date before adding
      if (currentDate > startingDateTime) {
        this.sb.open(
          "You can't pick a starting time prior to the encoding time",
          'Okay',
          { panelClass: ['error'], duration: 5000 }
        );
        return;
      }
    }
    this.dialogRef.close(this.place);
  }

  close() {
    this.dialogRef.close();
  }
}
