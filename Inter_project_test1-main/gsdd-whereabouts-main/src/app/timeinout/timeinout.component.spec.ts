import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeinoutComponent } from './timeinout.component';

describe('TimeinoutComponent', () => {
  let component: TimeinoutComponent;
  let fixture: ComponentFixture<TimeinoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeinoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeinoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
