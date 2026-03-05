import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolshopAnimationComponent } from './toolshop-animation.component';

describe('ToolshopAnimationComponent', () => {
  let component: ToolshopAnimationComponent;
  let fixture: ComponentFixture<ToolshopAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolshopAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolshopAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
