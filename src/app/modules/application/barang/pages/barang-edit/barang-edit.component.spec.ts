import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangEditComponent } from './barang-edit.component';

describe('BarangEditComponent', () => {
  let component: BarangEditComponent;
  let fixture: ComponentFixture<BarangEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarangEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarangEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
