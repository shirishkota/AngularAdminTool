import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllowedValues } from '../../models/allowed-values';

@Component({
  selector: 'app-select-data',
  template: `
      <select class="form-control" (change)="selectItem($event.target.value)">
        <option value="null"> Select </option>
        <option *ngFor="let displayValue of displayValues" value={{displayValue.id}} > 
          {{displayValue.displayName}} 
        </option>
      </select>
  `
})
export class SelectDataComponent {
  
  @Input()
  displayValues: AllowedValues[] ;

  @Output()
  selectedValue: EventEmitter<AllowedValues>;

  constructor() {
    this.selectedValue = new EventEmitter();
  }

  selectItem(value) {
    this.selectedValue.emit(value);
  }
}
