import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { NumeroConversor } from './../util/numero';

@Directive({
  selector: '[eiaNumero]'
})
export class NumeroDirective implements OnInit {

  @Input() minFractionDigits: number;
  @Input() maxFractionDigits: number;
  @Output() pressEnter: EventEmitter<any> = new EventEmitter();

  private el: HTMLInputElement;
  decimalPipe: DecimalPipe;
  numeroConversor: NumeroConversor;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
    this.decimalPipe = new DecimalPipe('pt-BR');
    this.numeroConversor = new NumeroConversor();
    this.minFractionDigits = 0;
    this.maxFractionDigits = 10;
  }

  ngOnInit() {
    this.el.value = this.transform(this.el.value);
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.el.value = this.transform(value);
  }

  transform(value: string): string {
    return this.decimalPipe.transform(
      this.numeroConversor.parse(value), `1.${this.minFractionDigits}-${this.maxFractionDigits}`
    );
  }
}
