import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  agree = false;
  constructor(private dialogRef: MatDialogRef<ConfirmationModalComponent>) {}

  ngOnInit(): void {}

  proceed() {
    this.dialogRef.close(true);
  }
}
