import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesShowComponent } from './sales-show.component';

describe('SalesShowComponent', () => {
  let component: SalesShowComponent;
  let fixture: ComponentFixture<SalesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesShowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
