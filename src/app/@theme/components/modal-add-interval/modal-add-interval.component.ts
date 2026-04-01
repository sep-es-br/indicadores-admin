import { Component } from '@angular/core';
import { PeriodPopoverService } from '../../../core/service/period-popover.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';

@Component({
  selector: 'ngx-modal-add-interval',
  standalone: true,
  imports: [CommonModule, FormsModule, NbButtonModule, NbCardModule, NbInputModule],
  templateUrl: './modal-add-interval.component.html',
  styleUrls: ['./modal-add-interval.component.scss'],
})
export class ModalAddIntervalComponent {
 from: number = new Date().getFullYear();
  to: number = new Date().getFullYear() + 3;
  type = 'ANUAL';
  typeDropdownOpen = false;
  diff = 0;
  lines = 0;

  typeOptions = [
    { value: 'ANUAL',   label: 'Anual',   freq: '1 por ano',        icon: '📅' },
    { value: 'BIANUAL', label: 'Bianual', freq: '1 ciclo / 2 anos', icon: '🗓️' },
  ];

  constructor(private popoverService: PeriodPopoverService) {
    this.calcLines();
  }

  calcLines() {
    if (!this.from || !this.to || this.to < this.from) {
      this.lines = 0;
      this.diff = 0;
      return;
    }
    this.diff = this.to - this.from + 1;
    this.lines = this.type === 'BIANUAL' ? Math.ceil(this.diff / 2) : this.diff;
  }

  selectType(val: string) {
    this.type = val;
    this.typeDropdownOpen = false;
    this.calcLines();
  }

  getTypeLabel(val: string) { return this.typeOptions.find(o => o.value === val)?.label ?? val; }
  getTypeFreq(val: string)  { return this.typeOptions.find(o => o.value === val)?.freq ?? ''; }
  getTypeIcon(val: string)  { return this.typeOptions.find(o => o.value === val)?.icon ?? '📅'; }

    generate() {
      this.popoverService.closeInterval({
        from: this.from,
        to: this.to,
        type: this.type
      });
    }
}
