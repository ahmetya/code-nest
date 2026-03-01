import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolshopLobbyComponent } from './toolshop-lobby.component';

describe('ToolshopLobbyComponent', () => {
  let component: ToolshopLobbyComponent;
  let fixture: ComponentFixture<ToolshopLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolshopLobbyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolshopLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
