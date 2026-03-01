import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolshopArtComponent } from './toolshop-art.component';

describe('ToolshopArtComponent', () => {
  let component: ToolshopArtComponent;
  let fixture: ComponentFixture<ToolshopArtComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolshopArtComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolshopArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
