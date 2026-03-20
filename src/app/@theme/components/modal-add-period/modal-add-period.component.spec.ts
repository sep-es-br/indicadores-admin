import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPeriodComponent } from './modal-add-period.component';

describe('ModalAddPeriodComponent', () => {
  let component: ModalAddPeriodComponent;
  let fixture: ComponentFixture<ModalAddPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
