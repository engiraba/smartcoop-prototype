import { MonthYearComponent } from './month-year/month-year.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() selectedDates: Array<Date> = [];
  @Input() closedDates: Array<Date> = [];
  @Input() month: number = new Date().getMonth(); // 0 as january
  @Input() year: number = new Date().getFullYear();
  @Output() dateClicked = new EventEmitter<Date>();
  show = false;
  weeks: Array<Array<any>> = [];
  monthYear = new Date();
  dayNames = [
    'SUNDAY_ABBR',
    'MONDAY_ABBR',
    'TUESDAY_ABBR',
    'WEDNESDAY_ABBR',
    'THURSDAY_ABBR',
    'FRIDAY_ABBR',
    'SATURDAY_ABBR',
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.month > 11) {
      return alert('input ' + this.month + ' is not allowed.');
    }
    this.show = true;
    this.monthYear = new Date(this.year, this.month);
    var startDay = new Date(this.year, this.month, 1).getDay();
    var endDate = new Date(this.year, this.month + 1, 1);
    endDate.setDate(endDate.getDate() - 1);
    var endDateAsNumber = endDate.getDate();
    var dates = [];
    for (let i = -1 * startDay + 1; i <= 42; i++) {
      if (i > 0 && i <= endDateAsNumber) dates.push(i);
      else dates.push(null);
    }

    this.weeks = [];
    for (let i = 0; i < 6; i++) {
      this.weeks.push(dates.splice(0, 7));
    }
  }

  isCurrent(day: number) {
    var today = new Date();
    var conditions = [
      today.getFullYear() == this.year,
      today.getMonth() == this.month,
      today.getDate() == day,
    ];
    if (!conditions.includes(false)) return 'current-date';

    return 'normal-date';
  }

  getToday() {
    this.month = new Date().getMonth(); // 0 as january
    this.year = new Date().getFullYear();
    this.ngOnInit();
  }

  delete() {}

  isSelected(day: number) {
    if (day) {
      var temp = this.selectedDates.find(
        (o) =>
          o.getFullYear() == this.year &&
          o.getMonth() == this.month &&
          o.getDate() == day
      );
      // console.log(temp);
      if (temp)
        //here
        return 'selected-date';
    }
    return 'normal-date';
  }

  isClosed(day: number) {
    if (day) {
      var temp = this.closedDates.find(
        (o) =>
          o.getFullYear() == this.year &&
          o.getMonth() == this.month &&
          o.getDate() == day
      );
      // console.log(temp);
      if (temp)
        //here
        return 'closed-date';
    }
    return 'normal-date';
  }

  onDateClicked(day: number) {
    if (day) {
      var date = new Date(this.year, this.month, day, 23, 59);
      this.dateClicked.emit(date);
      console.log(date);
    }
  }

  nextMonth() {
    this.month++;
    if (this.month > 11) {
      this.year++;
      this.month = 0;
    }
    this.ngOnInit();
  }

  previousMonth() {
    this.month--;
    if (this.month < 0) {
      this.year--;
      this.month = 11;
    }
    this.ngOnInit();
  }

  changeMonthYear() {
    this.dialog
      .open(MonthYearComponent, {
        disableClose: true,
        width: '30rem',
        height: 'auto',
        data: {
          month: this.month,
          year: this.year,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.month = res.month;
          this.year = res.year;
          this.ngOnInit();
        }
      });
  }
}
