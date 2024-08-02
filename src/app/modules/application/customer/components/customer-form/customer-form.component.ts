import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Customer } from '../../../../../../types/customers';
import { CustomerForm } from './customer-form';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, FormsModule],
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
