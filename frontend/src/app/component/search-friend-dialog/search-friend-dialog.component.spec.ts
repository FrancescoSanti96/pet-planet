import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFriendDialogComponent } from './search-friend-dialog.component';

describe('SearchFriendDialogComponent', () => {
  let component: SearchFriendDialogComponent;
  let fixture: ComponentFixture<SearchFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFriendDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
