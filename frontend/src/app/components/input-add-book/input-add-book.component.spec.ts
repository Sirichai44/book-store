import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAddBookComponent } from './input-add-book.component';

describe('InputAddBookComponent', () => {
  let component: InputAddBookComponent;
  let fixture: ComponentFixture<InputAddBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputAddBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputAddBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
