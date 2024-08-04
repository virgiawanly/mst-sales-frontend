import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { Barang } from '../../../../../../types/barang';
import { BarangForm } from './barang-form';

@Component({
  selector: 'app-barang-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, FormsModule, CommonModule, TranslateModule],
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
