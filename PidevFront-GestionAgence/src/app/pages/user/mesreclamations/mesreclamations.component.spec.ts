import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesreclamationsComponent } from './mesreclamations.component';

describe('MesreclamationsComponent', () => {
  let component: MesreclamationsComponent;
  let fixture: ComponentFixture<MesreclamationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesreclamationsComponent]
    });
    fixture = TestBed.createComponent(MesreclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
