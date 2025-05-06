import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepinComponent } from './changepin.component';

describe('ChangepinComponent', () => {
  let component: ChangepinComponent;
  let fixture: ComponentFixture<ChangepinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangepinComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangepinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
