import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangCreateComponent } from './barang-create.component';

describe('BarangCreateComponent', () => {
  let component: BarangCreateComponent;
  let fixture: ComponentFixture<BarangCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarangCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarangCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
