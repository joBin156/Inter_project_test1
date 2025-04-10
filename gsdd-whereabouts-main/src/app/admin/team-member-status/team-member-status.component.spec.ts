import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberStatusComponent } from './team-member-status.component';

describe('TeamMemberStatusComponent', () => {
  let component: TeamMemberStatusComponent;
  let fixture: ComponentFixture<TeamMemberStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamMemberStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamMemberStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
