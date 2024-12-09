import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrabacionPage } from './grabacion.page';

describe('GrabacionPage', () => {
  let component: GrabacionPage;
  let fixture: ComponentFixture<GrabacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrabacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
