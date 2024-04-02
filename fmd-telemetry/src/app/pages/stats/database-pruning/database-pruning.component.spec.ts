import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabasePruningComponent } from './database-pruning.component';

describe('DatabasePruningComponent', () => {
  let component: DatabasePruningComponent;
  let fixture: ComponentFixture<DatabasePruningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatabasePruningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabasePruningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
