import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPostComponent } from './personal-post.component';

describe('PersonalPostComponent', () => {
  let component: PersonalPostComponent;
  let fixture: ComponentFixture<PersonalPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
