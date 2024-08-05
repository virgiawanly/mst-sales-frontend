import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarangModalComponent } from './search-barang-modal.component';

describe('SearchBarangModalComponent', () => {
  let component: SearchBarangModalComponent;
  let fixture: ComponentFixture<SearchBarangModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarangModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarangModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
