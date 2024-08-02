import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarangForm } from './barang-form';
import { Barang } from '../../../../../../types/barang';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-barang-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, FormsModule],
  templateUrl: './barang-form.component.html',
  styleUrl: './barang-form.component.scss',
})
export class BarangFormComponent {
  @Input({ required: true }) form: BarangForm = new BarangForm();
  @Input({ required: false }) barang?: Barang | null;
  @Output() formSubmit: EventEmitter<BarangForm> = new EventEmitter<BarangForm>();

  submit() {
    this.formSubmit.emit(this.form);
  }
}
