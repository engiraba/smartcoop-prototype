import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertWorkplaceComponent } from './upsert-workplace.component';

describe('UpsertWorkplaceComponent', () => {
  let component: UpsertWorkplaceComponent;
  let fixture: ComponentFixture<UpsertWorkplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertWorkplaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertWorkplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
