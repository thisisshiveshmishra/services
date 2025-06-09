import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterserviceProviderComponent } from './registerservice-provider.component';

describe('RegisterserviceProviderComponent', () => {
  let component: RegisterserviceProviderComponent;
  let fixture: ComponentFixture<RegisterserviceProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterserviceProviderComponent]
    });
    fixture = TestBed.createComponent(RegisterserviceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
