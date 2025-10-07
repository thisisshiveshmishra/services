import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsconditionComponent } from './termscondition.component';

describe('TermsconditionComponent', () => {
  let component: TermsconditionComponent;
  let fixture: ComponentFixture<TermsconditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsconditionComponent]
    });
    fixture = TestBed.createComponent(TermsconditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
