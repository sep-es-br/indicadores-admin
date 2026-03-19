import { CommonModule } from "@angular/common";
import { Component, Optional } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbDialogRef,
  NbInputModule,
  NbPopoverModule,
  NbSelectModule,
} from "@nebular/theme";
import { PeriodPopoverService } from "../../../core/service/period-popover.service";

@Component({
  selector: "ngx-modal-add-period",
  standalone: true,
  imports: [
    CommonModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbPopoverModule,
    FormsModule,
    NbPopoverModule,
    NbSelectModule,
  ],
  templateUrl: "./modal-add-period.component.html",
  styleUrls: ["./modal-add-period.component.scss"],
})
export class ModalAddPeriodComponent {
  year: number = new Date().getFullYear();
  yearInvalido = false;
  type = "ANUAL";

  maxLenght: string = "4";

  typeDropdownOpen = false;

  yearFrom: number | null = null;
  yearTo: number | null = null;
  typeOptions = [
    { value: "ANUAL", label: "Anual", freq: "1 por ano", icon: "📅" },
    {
      value: "BIANUAL",
      label: "Bianual",
      freq: "1 ciclo / 2 anos",
      icon: "🗓️",
    },
  ];

  constructor(private popoverService: PeriodPopoverService) {}

  getTypeLabel(val: string) {
    return this.typeOptions.find((o) => o.value === val)?.label ?? val;
  }
  getTypeFreq(val: string) {
    return this.typeOptions.find((o) => o.value === val)?.freq ?? "";
  }
  getTypeIcon(val: string) {
    return this.typeOptions.find((o) => o.value === val)?.icon ?? "📅";
  }

  selectType(val: string) {
    this.type = val;
    this.typeDropdownOpen = false;
  }

addPeriod() {
  if (this.yearInvalido) return;

  this.popoverService.close({
    year: this.year,
    type: this.type,
  });
}

  verifyYear(year: number | string) {
    const yearStr = String(year);

    const isValidFormat = /^[0-9]{4}$/.test(yearStr);
    const yearNum = Number(yearStr);

    if (!isValidFormat || yearNum < 1900 || yearNum > this.year + 5) {
      this.yearInvalido = true;
    } else {
      this.yearInvalido = false;
    }
  }
}
