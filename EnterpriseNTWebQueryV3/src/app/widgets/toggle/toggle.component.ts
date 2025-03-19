import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})
export class ToggleComponent {
  @Input() id: string;
  @Input() status: boolean;
  @Output() changed = new EventEmitter<boolean>();
}
