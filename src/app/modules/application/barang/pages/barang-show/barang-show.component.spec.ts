import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangShowComponent } from './barang-show.component';

describe('BarangShowComponent', () => {
  let component: BarangShowComponent;
  let fixture: ComponentFixture<BarangShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarangShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarangShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
