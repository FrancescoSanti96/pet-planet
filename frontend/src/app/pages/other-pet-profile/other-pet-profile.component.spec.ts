import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPetProfileComponent } from './other-pet-profile.component';

describe('OtherPetProfileComponent', () => {
  let component: OtherPetProfileComponent;
  let fixture: ComponentFixture<OtherPetProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtherPetProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherPetProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
