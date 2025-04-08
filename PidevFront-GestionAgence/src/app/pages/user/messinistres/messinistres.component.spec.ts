import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessinistresComponent } from './messinistres.component';

describe('MessinistresComponent', () => {
  let component: MessinistresComponent;
  let fixture: ComponentFixture<MessinistresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessinistresComponent]
    });
    fixture = TestBed.createComponent(MessinistresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
