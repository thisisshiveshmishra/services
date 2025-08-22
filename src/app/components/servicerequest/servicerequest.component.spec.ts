import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicerequestComponent } from './servicerequest.component';

describe('ServicerequestComponent', () => {
  let component: ServicerequestComponent;
  let fixture: ComponentFixture<ServicerequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicerequestComponent]
    });
    fixture = TestBed.createComponent(ServicerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
