import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginserviceProviderComponent } from './loginservice-provider.component';

describe('LoginserviceProviderComponent', () => {
  let component: LoginserviceProviderComponent;
  let fixture: ComponentFixture<LoginserviceProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginserviceProviderComponent]
    });
    fixture = TestBed.createComponent(LoginserviceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
