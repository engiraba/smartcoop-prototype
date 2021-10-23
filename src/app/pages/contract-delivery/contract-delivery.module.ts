import { UpsertWorkplaceComponent } from './components/upsert-workplace/upsert-workplace.component';
import { ContractDeliveryRoutingModule } from './contract-delivery-routing.module';
import { ContractDeliveryComponent } from './contract-delivery.component';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ContractDeliveryComponent,
    UpsertWorkplaceComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    ContractDeliveryRoutingModule,
    SharedModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    HttpClientModule,
    CommonModule,
  ],
})
export class ContractDeliveryModule {}
