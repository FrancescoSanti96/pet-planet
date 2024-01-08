import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPostDialogComponent } from './modify-post-dialog.component';

describe('ModifyPostDialogComponent', () => {
  let component: ModifyPostDialogComponent;
  let fixture: ComponentFixture<ModifyPostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyPostDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
