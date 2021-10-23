import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { TranslatorService } from 'src/app/services/translator/translator.service';
import { UtilService } from 'src/app/services/util/util.service';
import { UpsertWorkplaceComponent } from './components/upsert-workplace/upsert-workplace.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
type Role = 'Service provider' | 'Advisor';

@Component({
  selector: 'app-contract-delivery',
  templateUrl: './contract-delivery.component.html',
  styleUrls: ['./contract-delivery.component.scss'],
})
export class ContractDeliveryComponent implements OnInit {
  applicableToAllDates: any = {
    totalHours: false,
    places: false,
  };
  selectedDates: Array<Date> = [];
  closedDates: Array<Date> = [];
  roles: Array<{ value: Role; text: string }> = [
    { value: 'Service provider', text: 'SERVICE_PROVIDER' },
    { value: 'Advisor', text: 'ADVISOR' },
  ]; // temporary, will recode depending on the requirements
  role: Role = 'Advisor';
  hoursType = [
    { type: 'Full-time', hours: 7.6, text: 'FULL_TIME' },
    { type: 'Partial-time', hours: 3.8, text: 'PARTIAL_TIME' },
  ];
  person: any; //temporary variable name
  form = new FormGroup({
    dates: new FormArray([], [Validators.required]),
  });

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private api: ApiService,
    private sb: MatSnackBar,
    private util: UtilService,
    private translator: TranslatorService
  ) {}

  ngOnInit() {
    // get mock data
    this.form = new FormGroup({
      dates: new FormArray([], [Validators.required]),
    });
    this.selectedDates = [];
    this.closedDates = [];

    this.api.getMany().subscribe((res: Array<any>) => {
      this.person = res[0];
      this.initialize();
    });
  }

  // initialize value of selectedDates based on user data
  initialize() {
    [...this.person.dates].forEach((date: any) => {
      let dateAsDate = new Date(date.date);
      this.onSelect(dateAsDate, date.totalHours, false);
      let index = this.selectedDates.findIndex(
        (o) =>
          o.getFullYear() == dateAsDate.getFullYear() &&
          o.getMonth() == dateAsDate.getMonth() &&
          o.getDate() == dateAsDate.getDate()
      );
      // disabled if
      // role is service provider AND
      // date is prior to the current date
      if (
        this.role == 'Service provider' &&
        dateAsDate.getTime() < new Date().getTime()
      ) {
        this.getDatesAsFormArray().at(index).get('totalHours')?.disable();
      }

      // autofill places from the data in the json
      date.places.forEach((place: any) => {
        this.getPlacesAsFormArray(index).push(
          this.convertPlaceAsFormGroup(place)
        );
      });
    });
  }

  // convert place from object to formgroup
  convertPlaceAsFormGroup(place: any) {
    return new FormGroup({
      startTime: new FormControl(place.startTime, [Validators.required]),
      hoursDuration: new FormControl(place.hoursDuration, [
        Validators.required,
      ]),
      address: new FormGroup({
        city: new FormControl(place.address.city, [Validators.required]),
        info: new FormControl(place.address.info, [Validators.required]),
        postalCode: new FormControl(place.address.postalCode, [
          Validators.required,
        ]),
        streetAndNumber: new FormControl(place.address.streetAndNumber, [
          Validators.required,
        ]),
      }),
    });
  }

  // calls when a date is clicked on the calender and on the initial loading
  onSelect(date: Date, totalHours?: number, applyRestriction: boolean = true) {
    // check if the role is Service Provider for additional retriction
    // check if date click is prior to the encoding time
    // applyRestring is always false unless it's initial loading
    if (
      this.role == 'Service provider' &&
      date.getTime() < new Date().getTime() &&
      applyRestriction
    ) {
      this.sb.open(
        this.translator.translate(
          'YOU_CANNOT_PICK_A_DATE_PRIOR_TO_THE_ENCODING_DATE'
        ),
        this.translator.translate('OKAY'),
        { panelClass: ['error'], duration: 5000 }
      );
      return;
    }

    // find if date is existing on the selectedDates
    var index = this.selectedDates.findIndex(
      (o) =>
        o.getFullYear() == date.getFullYear() &&
        o.getMonth() == date.getMonth() &&
        o.getDate() == date.getDate()
    );

    // if in the selectionDates, remove
    if (index >= 0) {
      this.selectedDates.splice(index, 1);
      this.getDatesAsFormArray().removeAt(index);
    }
    // if not on the selectedDates, add
    else {
      this.selectedDates.push(date);
      this.getDatesAsFormArray().push(
        this.fb.group({
          date: this.fb.control(date, [Validators.required]),
          totalHours: this.fb.control(totalHours, [Validators.required]),
          places: this.fb.array([], [Validators.required]),
        })
      );
    }

    // sort selectedDates
    this.selectedDates.sort((a, b) => {
      if (a.getTime() > b.getTime()) return 1;
      return -1;
    });

    // sort dates formarray
    this.getDatesAsFormArray().setValue(
      this.getDatesAsFormArray()
        .getRawValue()
        .sort((a: any, b: any) => {
          if (a.date.getTime() > b.date.getTime()) return 1;
          return -1;
        })
    );
  }

  // open a dialog box to add a place
  upsertPlace(i: number, placeIndex?: number) {
    let date = this.getDatesAsFormArray().at(i).get('date')?.value;
    // Restriction: I cant change a starting date and add location prior to the encoding time
    if (date < new Date() && this.role == 'Service provider') {
      this.sb.open(
        this.translator.translate(
          'YOU_CANNOT_ADD_A_STARTING_TIME_AND_LOCATION_PRIOR_TO_THE_ENCODING_TIME'
        ),
        this.translator.translate('OKAY'),
        { panelClass: ['error'], duration: 5000 }
      );
      return;
    }
    let defaultStartingTime = '10:00';
    let adjustedDefaultStartingTime = '10:00';
    var prevIndex = -1;
    var city = '';

    // check if places has already atleast 1
    // applicable for new insert only
    if (
      this.getPlacesAsFormArray(i).value.length > 0 &&
      placeIndex === undefined
    ) {
      prevIndex = this.getPlacesAsFormArray(i).value.length - 1;
      console.log(prevIndex);
      adjustedDefaultStartingTime = this.getPlacesAsFormArray(i)
        .at(prevIndex)
        .get('startTime')?.value;

      let duration = this.util
        .timeDecimalToTime(
          this.getPlacesAsFormArray(i).at(prevIndex).get('hoursDuration')?.value
        )
        .split(':');

      var splittedadjustedDefaultStartingTime =
        adjustedDefaultStartingTime.split(':');
      var minute = parseInt(splittedadjustedDefaultStartingTime[1]);
      var hour = parseInt(splittedadjustedDefaultStartingTime[0]);

      hour = parseInt(duration[0]) + hour;
      minute = parseInt(duration[1]) + minute;

      if (minute > 59) {
        hour++;
        minute = 0;
      }

      adjustedDefaultStartingTime =
        ('0' + hour).substr(-2) + ':' + ('0' + minute).substr(-2);

      city = (
        this.getPlacesAsFormArray(i).at(prevIndex).get('address') as FormGroup
      ).get('city')?.value;
    }

    // setup for edit
    var place =
      placeIndex !== undefined
        ? this.getPlacesAsFormArray(i).at(placeIndex)
        : undefined;

    this.dialog
      .open(UpsertWorkplaceComponent, {
        disableClose: true,
        width: '50rem',
        height: 'auto',
        data: {
          date: new Date(this.getDatesAsFormArray().at(i).get('date')?.value),
          role: this.role,
          totalHours: this.getDatesAsFormArray().at(i).get('totalHours')?.value,
          defaultStartingTime,
          adjustedDefaultStartingTime,
          city,
          place,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.getPlacesAsFormArray(i).push(res);
        }
      });
  }

  // delete place
  deletePlace(dateIndex: number, placeIndex: number) {
    // add confirmation dialog box
    let date = new Date(
      this.getDatesAsFormArray().at(dateIndex).get('date')?.value
    );
    if (
      this.role == 'Service provider' &&
      date.getTime() < new Date().getTime()
    ) {
      this.sb.open(
        this.translator.translate(
          'UNABLE_TO_DELETE_LOCATION_FROM_THE_DATE_PRIOR_TO_THE_CURRENT_DATE'
        ),
        this.translator.translate('OKAY'),
        { panelClass: ['error'], duration: 5000 }
      );
      return;
    }
    (
      this.getDatesAsFormArray().at(dateIndex).get('places') as FormArray
    ).removeAt(placeIndex);
  }

  submit() {
    this.person.dates = (this.form.get('dates') as FormGroup).getRawValue();
    console.log(this.person);
  }

  getPlacesAsFormArray(i: number) {
    return this.getDatesAsFormArray().at(i).get('places') as FormArray;
  }

  getDatesAsFormArray() {
    return this.form.get('dates') as FormArray;
  }

  applyToAllDates(fcname: string) {
    console.log(fcname);
    this.dialog
      .open(ConfirmationModalComponent, { width: '30rem', height: 'auto' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          let copyFrom = this.getDatesAsFormArray().getRawValue()[0];
          console.log(copyFrom);
          let fctype = typeof copyFrom[fcname];
          let dateLength = this.getDatesAsFormArray().value.length;
          let placesLength = this.getPlacesAsFormArray(0).value.length;
          for (let i = 1; i < dateLength; i++) {
            if (fctype === 'object') {
              // array of object
              if (fcname === 'places') {
                this.getPlacesAsFormArray(i).setValue([]);
                for (let j = 0; j < placesLength; j++) {
                  this.getPlacesAsFormArray(i).push(
                    this.convertPlaceAsFormGroup(copyFrom[fcname][j])
                  );
                }
              }
            } else {
              this.getDatesAsFormArray()
                .at(i)
                .get(fcname)
                ?.setValue(copyFrom[fcname]);
            }
          }
        } else {
          this.applicableToAllDates[fcname] =
            !this.applicableToAllDates[fcname];
        }
      });
  }
}
