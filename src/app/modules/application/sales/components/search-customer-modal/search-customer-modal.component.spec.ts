import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCustomerModalComponent } from './search-customer-modal.component';

describe('SearchCustomerModalComponent', () => {
  let component: SearchCustomerModalComponent;
  let fixture: ComponentFixture<SearchCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCustomerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
