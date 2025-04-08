import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesdevisComponent } from './mesdevis.component';

describe('MesdevisComponent', () => {
  let component: MesdevisComponent;
  let fixture: ComponentFixture<MesdevisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesdevisComponent]
    });
    fixture = TestBed.createComponent(MesdevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
