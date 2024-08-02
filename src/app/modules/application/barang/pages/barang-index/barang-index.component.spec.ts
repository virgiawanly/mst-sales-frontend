import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangIndexComponent } from './barang-index.component';

describe('BarangIndexComponent', () => {
  let component: BarangIndexComponent;
  let fixture: ComponentFixture<BarangIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarangIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarangIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
