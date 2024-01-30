import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFriendDialogComponent } from './pet-friend-dialog.component';

describe('PetFriendDialogComponent', () => {
  let component: PetFriendDialogComponent;
  let fixture: ComponentFixture<PetFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetFriendDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
