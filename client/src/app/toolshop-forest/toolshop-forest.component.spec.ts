import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolshopForestComponent } from './toolshop-forest.component';

describe('ToolshopForestComponent', () => {
  let component: ToolshopForestComponent;
  let fixture: ComponentFixture<ToolshopForestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolshopForestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolshopForestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
