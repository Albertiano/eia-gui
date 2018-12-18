import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[eiaFone]'
})
export class FoneDirective implements OnInit {

  @Output() pressEnter: EventEmitter<any> = new EventEmitter();

  private el: HTMLInputElement;

  arrayFunction: any[] = [, 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  onTouched: any;
  onChange: any;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.convert(this.el.value);
  }

  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    if ($event.key === 'Enter') {
      this.pressEnter.emit();
    } else if (this.arrayFunction.indexOf($event.key) < 0) {
      $event.target.value = this.convert($event.target.value);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    if ($event.target.value.length === 13) {
      this.el.value = this.convert(this.el.value);
      return;
    }
    if ($event.target.value.length === 14) {
      this.el.value = this.convert(this.el.value);
      return;
    }

    $event.target.value = '';
  }

  convert(num) {
    if (num) {
      num = num.toString();
      num = num.replace(/\D/g, '');

      switch (num.length) {
        case 3:
          num = num.replace(/(\d{2})(\d+)/, '($1)$2');
          break;
        case 4:
          num = num.replace(/(\d{2})(\d+)/, '($1)$2');
          break;
        case 5:
          num = num.replace(/(\d{2})(\d+)/, '($1)$2');
          break;
        case 6:
          num = num.replace(/(\d{2})(\d+)/, '($1)$2');
          break;
        case 7:
          num = num.replace(/(\d{2})(\d{4})(\d+)/, '($1)$2-$3');
          break;
        case 8:
          num = num.replace(/(\d{2})(\d{4})(\d+)/, '($1)$2-$3');
          break;
        case 9:
          num = num.replace(/(\d{2})(\d{4})(\d+)/, '($1)$2-$3');
          break;
        case 10:
          num = num.replace(/(\d{2})(\d{4})(\d+)/, '($1)$2-$3');
          break;
        case 11:
          num = num.replace(/(\d{2})(\d{5})(\d+)/, '($1)$2-$3');
          break;
      }
    }
    return num;
  }
}
