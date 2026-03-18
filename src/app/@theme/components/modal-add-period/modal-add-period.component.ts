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
  type = "ANUAL";

  typeDropdownOpen = false;

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
      this.popoverService.close({ year: this.year, type: this.type });
    }
}
