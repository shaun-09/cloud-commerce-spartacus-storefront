import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CartService } from '@spartacus/core';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { of, BehaviorSubject } from 'rxjs';

import { SpinnerModule } from './../../../ui/components/spinner/spinner.module';

import { AddedToCartDialogComponent } from './added-to-cart-dialog.component';
import {
  DebugElement,
  Pipe,
  PipeTransform,
  Component,
  Input
} from '@angular/core';

class MockNgbActiveModal {
  dismiss() {}
  close() {}
}

class MockCartService {
  updateEntry(_entryNumber, _updatedQuantity) {}
  removeEntry(_entry) {}
}

@Component({
  selector: 'cx-cart-item',
  template: ''
})
class MockCartItemComponent {
  @Input()
  compact = false;
  @Input()
  item;
  @Input()
  potentialProductPromotions: any[];
  @Input()
  isReadOnly = false;
  @Input()
  cartIsLoading = false;
}

@Pipe({
  name: 'cxTranslateUrl'
})
class MockTranslateUrlPipe implements PipeTransform {
  transform() {}
}

describe('AddedToCartDialogComponent', () => {
  let component: AddedToCartDialogComponent;
  let fixture: ComponentFixture<AddedToCartDialogComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, NgbModule, SpinnerModule],
      declarations: [
        AddedToCartDialogComponent,
        MockCartItemComponent,
        MockTranslateUrlPipe
      ],
      providers: [
        {
          provide: NgbActiveModal,
          useClass: MockNgbActiveModal
        },
        {
          provide: CartService,
          useClass: MockCartService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedToCartDialogComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading placeholder', () => {
    component.loaded$ = of(false);
    fixture.detectChanges();
    expect(
      el
        .query(By.css('.cx-added-to-cart-dialog__title'))
        .nativeElement.textContent.trim()
    ).toEqual('Updating cart...');
    expect(el.query(By.css('cx-spinner')).nativeElement).toBeDefined();
  });

  it('should handle focus of elements', () => {
    component.entry$ = of({
      id: 111,
      product: {
        code: 'CODE1111'
      }
    });

    const loaded$ = new BehaviorSubject<boolean>(false);
    component.loaded$ = loaded$.asObservable();

    fixture.detectChanges();
    loaded$.next(true);
    fixture.detectChanges();
    expect(el.query(By.css('.btn-primary')).nativeElement).toEqual(
      document.activeElement
    );
  });

  it('should display quantity', () => {
    component.quantity = 10;
    component.loaded$ = of(true);
    fixture.detectChanges();
    expect(
      el
        .query(By.css('.cx-added-to-cart-dialog__title'))
        .nativeElement.textContent.trim()
    ).toEqual('10 item(s) added to your cart');
  });

  it('should display cart item', () => {
    component.entry$ = of({
      id: 111,
      product: {
        code: 'CODE1111'
      }
    });
    component.loaded$ = of(true);
    fixture.detectChanges();
    expect(el.query(By.css('cx-cart-item'))).toBeDefined();
  });

  it('should display cart total', () => {
    component.entry$ = of({
      id: 111,
      product: {
        code: 'CODE1111'
      }
    });
    component.cart$ = of({
      deliveryItemsQuantity: 1,
      totalPrice: {
        formattedValue: '$100.00'
      }
    });
    component.loaded$ = of(true);
    fixture.detectChanges();
    const cartTotalEl = el.query(By.css('.cx-added-to-cart-dialog__total'))
      .nativeElement;
    expect(cartTotalEl.children[0].textContent).toEqual('Cart total (1 items)');
    expect(cartTotalEl.children[1].textContent).toEqual('$100.00');
  });
});
