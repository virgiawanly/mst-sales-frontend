import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangFormComponent } from './barang-form.component';

describe('BarangFormComponent', () => {
  let component: BarangFormComponent;
  let fixture: ComponentFixture<BarangFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarangFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarangFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
