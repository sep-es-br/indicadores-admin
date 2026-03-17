import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorFormsComponent } from './indicator-forms.component';

describe('IndicatorFormsComponent', () => {
  let component: IndicatorFormsComponent;
  let fixture: ComponentFixture<IndicatorFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
