import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { speedDialFabAnimations } from './speed-dial-fab.animations';

@Component({
  selector: 'eiasiscon-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {

  @Input() options: any;
  buttons = [];
  fabTogglerState = 'inactive';

  @Output('fabClick') fabClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
    const maxButtons = 6;
    if (this.options.buttons.length > maxButtons) {
      this.options.buttons.splice(5, this.options.buttons.length - maxButtons);
    }
  }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.options.buttons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  public onClickFab(btn: {icon: string}) {
    this.hideItems();
    this.fabClick.emit(btn);
  }

}
