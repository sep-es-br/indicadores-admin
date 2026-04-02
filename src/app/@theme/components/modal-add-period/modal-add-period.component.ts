import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
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
  ],
  templateUrl: "./modal-add-period.component.html",
  styleUrls: ["./modal-add-period.component.scss"],
})
export class ModalAddPeriodComponent implements OnInit {
  year: number = new Date().getFullYear();
  yearInvalido = false;
  type = "YEAR";
  maxLenght: string = "4";
  typeDropdownOpen = false;

  typeOptions = [
    { value: "YEAR",     label: "Anual",   freq: "1 por ano",        icon: "📅" },
    { value: "BIANNUAL", label: "Bianual", freq: "1 ciclo / 2 anos", icon: "🗓️" },
  ];

  constructor(private popoverService: PeriodPopoverService) {}

  ngOnInit() {
    this.year = this.popoverService.suggestedYear;
  }

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
    this.popoverService.close({ year: this.year, type: this.type });
  }

  verifyYear(year: number | string) {
    const yearStr = String(year);
    const isValidFormat = /^[0-9]{4}$/.test(yearStr);
    const yearNum = Number(yearStr);
    this.yearInvalido =
      !isValidFormat || yearNum < 1900 || yearNum > new Date().getFullYear() + 5;
  }

  close() {
    this.popoverService.close(null);
  }
}
