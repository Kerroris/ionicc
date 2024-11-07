import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CantactDetallePage } from './cantact-detalle.page';

describe('CantactDetallePage', () => {
  let component: CantactDetallePage;
  let fixture: ComponentFixture<CantactDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CantactDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
