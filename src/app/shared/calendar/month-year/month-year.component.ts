import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MONTHS } from 'src/app/constant/months.const';

@Component({
  selector: 'app-month-year',
  templateUrl: './month-year.component.html',
  styleUrls: ['./month-year.component.scss'],
})
export class MonthYearComponent implements OnInit {
  months = [...MONTHS];
  years: Array<number> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MonthYearComponent>
  ) {}

  ngOnInit(): void {
    var start_year = this.data.year - 5;
    var end_year = new Date().getFullYear() + 5;
    var loopCount = end_year - start_year;

    for (let i = 0; i < loopCount; i++) {
      this.years.push(start_year + i);
    }
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data);
  }
}
