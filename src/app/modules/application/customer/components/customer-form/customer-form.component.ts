import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Customer } from '../../../../../../types/customers';
import { CustomerForm } from './customer-form';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, FormsModule, CommonModule, TranslateModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent {
  @Input({ required: true }) form: CustomerForm = new CustomerForm();
  @Input({ required: false }) customer?: Customer | null;
  @Output() formSubmit: EventEmitter<CustomerForm> = new EventEmitter<CustomerForm>();

  submit() {
    this.formSubmit.emit(this.form);
  }
}
