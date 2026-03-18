import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NbToastrService,
  NbSpinnerModule,
  NbContextMenuModule,
  NbIconModule,
  NbButtonModule,
  NbToggleModule,
  NbSelectModule,
  NbCardModule,
  NbInputModule,
  NbDialogModule,
  NbPopoverModule,
  NbPopoverDirective,
} from "@nebular/theme";
import { IndicatorService } from "../../../core/service/indicator.service";
import { IBreadcrumbItem } from "../../../core/interfaces/breadcrumb-item.interface";
import {
  IIndicator,
  IIndicatorForm,
  IOdsGoal,
  ITimes,
} from "../../../core/interfaces/indicator.interface";
import { organizerList } from "../../../core/interfaces/organizer.interface";
import { IOds } from "../../../core/interfaces/ods.interface";
import {
  IManagementOrganizerChallenge,
  IOrganizerChallenge,
} from "../../../core/interfaces/managament-organizer-challente.interface";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IndicatorRoutingModule } from "../../../features/indicator/indicator-routing.module";
import { ThemeModule } from "../../theme.module";
import { ModalAddPeriodComponent } from "../modal-add-period/modal-add-period.component";
import { PeriodPopoverService } from "../../../core/service/period-popover.service";
import { ModalAddIntervalComponent } from "../modal-add-interval/modal-add-interval.component";
import { Observable } from "rxjs";

@Component({
  selector: "ngx-indicator-forms",
  templateUrl: "./indicator-forms.component.html",
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    NbIconModule,
    NbButtonModule,
    NbContextMenuModule,
    ThemeModule,
    ReactiveFormsModule,
    IndicatorRoutingModule,
    FormsModule,
    NbToggleModule,
    NbSelectModule,
    NbSpinnerModule,
    NbCardModule,
    NbInputModule,
    NbDialogModule,
    NbPopoverModule,
  ],
  styleUrls: ["./indicator-forms.component.scss"],
})
export class IndicatorFormsComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  isSubmitting = false;
  isLoading = false;

  @Input() mode: "create" | "edit" = "create";
  @Input() configBreadCrumb: IBreadcrumbItem[] = [];

  // PDF
  selectedPdfFile: File | null = null;
  existingPdfFileName: string | null = null;
  [x: string]: any;
  shouldRemovePdf = false;
  hadOriginalPdf = false;

  units: string[] = [];
  organizationAcronyms: organizerList[] = [];
  years: string[] = [];
  odsList: IOds[] = [];
  isOtherUnit = false;
  challengeList: IManagementOrganizerChallenge[] = [];
  filteredOrganizers: IOrganizerChallenge[] = [];

  expandedPeriods: boolean[] = [];
  typeDropdownIndex: number | null = null;

  public breadcrumb: IBreadcrumbItem[] = [];

  @ViewChild("pop") popover!: NbPopoverDirective;
  addPeriodComponent = ModalAddPeriodComponent;

  @ViewChild("popInterval") popInterval!: NbPopoverDirective;
  addIntervalComponent = ModalAddIntervalComponent;

  private _indicatorService = inject(IndicatorService);
  private _toastService = inject(NbToastrService);

  get challengesOrgans() {
    return this.form.get("challengesOrgans") as FormArray;
  }

  get times() {
    return this.form.get("times") as FormArray;
  }

  typeOptions = [
    { value: "ANUAL", label: "Anual", freq: "1 por ano", icon: "📅" },
    {
      value: "BIANUAL",
      label: "Bianual",
      freq: "1 ciclo / 2 anos",
      icon: "🗓️",
    },
  ];

  getTypeLabel(val: string) {
    return this.typeOptions.find((o) => o.value === val)?.label ?? val;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private popoverService: PeriodPopoverService,
  ) {
    this.form = this.fb.group({
      id: new FormControl(""),
      name: new FormControl("", [Validators.required]),
      polarity: new FormControl("", [Validators.required]),
      ods: new FormControl([]),
      management: new FormControl([]),
      challenges: new FormControl([]),
      unit: new FormControl("", [Validators.required]),
      customUnit: new FormControl(""),
      challengesOrgans: this.fb.array([]),
      times: this.fb.array([]),
      justificationBase: new FormControl(""),
      observations: new FormControl(""),
    });

    this.form
      .get("management")
      ?.valueChanges.subscribe((v) => this.onManagementChange(v));
    this.form.get("unit")?.valueChanges.subscribe((v) => this.onUnitChange(v));
    this.form
      .get("challenges")
      ?.valueChanges.subscribe((v) => this.updateChallengesOrgans(v));

    this.form.get("unit")?.valueChanges.subscribe((value) => {
      const customUnit = this.form.get("customUnit");
      value === "other"
        ? customUnit?.setValidators([Validators.required])
        : customUnit?.clearValidators();
      customUnit?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.updateBreadcrumb();
    this.initializer();

    this.expandedPeriods = this.times.controls.map(() => true);

    this.popoverService.onClose$.subscribe((data) => {
      this.popover?.hide();
      if (data) {
        if (this.isYearAlreadyUsed(data.year, data.type)) {
          this._toastService.show(
            `O período ${data.year} já foi adicionado.`,
            "Atenção",
            { status: "warning", duration: 4000 },
          );
          return;
        }
        this.addNewYearRow(data.year, data.type);
        this.expandedPeriods.push(true);
      }
    });

    this.popoverService.onCloseInterval$.subscribe((data) => {
      this.popInterval?.hide();
      if (data) {
        const { from, to, type } = data;
        const step = type === "BIANUAL" ? 2 : 1;
        let skipped = 0;

        for (let year = from; year <= to; year += step) {
          if (this.isYearAlreadyUsed(year, type)) {
            skipped++;
            continue;
          }
          this.addNewYearRow(year, type);
          this.expandedPeriods.push(true);
        }

        if (skipped > 0) {
          this._toastService.show(
            `${skipped} período(s) já existiam e foram ignorados.`,
            "Atenção",
            { status: "warning", duration: 4000 },
          );
        }
      }
    });

    if (this.mode === "edit") {
      this.loadIndicatorForEdit();
    }
  }

  loadIndicatorForEdit() {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      const indicatorId = params["id"];
      if (!indicatorId) {
        this.router.navigate(["/pages/indicators"]);
        return;
      }

      this._indicatorService.getIndicator(indicatorId).subscribe({
        next: (data: IIndicator) => {
          this.form.patchValue({
            id: data.uuId,
            name: data.name,
            polarity: data.polarity,
            unit: data.measureUnit,
            justificationBase: data.justificationBase,
            observations: data.observations,
            ods: this.extractOdsOrders(data.odsgoal),
            challenges: data.measures.map((m) => m.challengeId),
          });

          if (data.originalFileName) {
            this.existingPdfFileName = data.originalFileName;
            this.hadOriginalPdf = true;
          }

          const managementNames = this.getManagementNamesByChallengeIds(
            data.measures.map((m) => m.challengeId),
          );
          this.form.get("management")?.setValue(managementNames);

          this.challengesOrgans.controls.forEach((control) => {
            const challengeId = control.get("challengeId")?.value;
            const measure = data.measures.find(
              (m) => m.challengeId === challengeId,
            );
            if (measure) control.patchValue({ organ: measure.organ });
          });
          // console.log("qwewqeqwe: ", data);
          data.times.forEach((target) => {
            this.times.push(
              this.fb.group({
                year: new FormControl(target.year),
                type: new FormControl("ANUAL"),
                displayYear: new FormControl(`${target.year}`),
                valueGoal: new FormControl(target.valueGoal || null),
                showValueGoal: new FormControl(target.showValueGoal || ""),
                valueResult: new FormControl(target.valueResult || null),
                showValueResult: new FormControl(target.showValueResult || ""),
                justificationGoal: new FormControl(target.justificationGoal),
              }),
            );
            this.expandedPeriods.push(true);
          });
          this.times.controls.sort(
            (a, b) => a.get("year")?.value - b.get("year")?.value,
          );
        },
        error: () => this.router.navigate(["/pages/indicators"]),
        complete: () => (this.isLoading = false),
      });
    });
  }

  isYearAlreadyUsed(year: number, type: string): boolean {
    return this.times.controls.some((control) => {
      const existingYear = control.get("year")?.value;
      const existingType = control.get("type")?.value;

      if (type === "ANUAL") {
        if (existingType === "ANUAL") return existingYear === year;
        if (existingType === "BIANUAL")
          return existingYear === year || existingYear + 1 === year;
      }

      if (type === "BIANUAL") {
        if (existingType === "ANUAL")
          return existingYear === year || existingYear === year + 1;
        if (existingType === "BIANUAL") return existingYear === year;
      }

      return false;
    });
  }

  private extractOdsOrders(odsList: IOdsGoal[]): string[] {
    return odsList.map((ods) => ods.order);
  }

  getManagementNamesByChallengeIds(challengeIds: string[]): string[] {
    const names: string[] = [];
    challengeIds.forEach((id) => {
      const mgmt = this.challengeList.find((m) =>
        m.organizers.some((o) => o.challenges.some((c) => c.uuId === id)),
      );
      if (mgmt && !names.includes(mgmt.managementName)) {
        names.push(mgmt.managementName);
      }
    });
    return names;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.valid || this.isSubmitting) return;

    this.isSubmitting = true;
    const formValue = this.form.value;
    console.log("Dados chegando do forms: ", formValue);
    const payload: IIndicatorForm = {
      ...(this.mode === "edit" && {
        id: formValue.id,
        removePdf: this.shouldRemovePdf,
      }),
      name: formValue.name,
      polarity: formValue.polarity,
      measureUnit: this.isOtherUnit ? formValue.customUnit : formValue.unit,
      ods: formValue.ods,
      organizationAcronym: formValue.challengesOrgans.map((c: any) => ({
        challengeId: c.challengeId,
        organ: c.organ,
      })),
      times: formValue.times.map((value: ITimes) => ({
        year: value.year,
        type: value.type,
        valueGoal: value.valueGoal || null,
        showValueGoal: value.showValueGoal || "",
        valueResult: value.valueResult || null,
        showValueResult: value.showValueResult || "",
        justificationGoal: value.justificationGoal,
      })),
      justificationBase: formValue.justificationBase,
      observations: formValue.observations,
    };

    console.log("Dados passados pelo forms: ", payload);
    const request$: Observable<any> =
      this.mode === "edit"
        ? this._indicatorService.updateIndicator(payload, this.selectedPdfFile)
        : this._indicatorService.createIndicator(payload, this.selectedPdfFile);

    const successMsg =
      this.mode === "edit"
        ? "Indicador editado com sucesso!"
        : "Indicador criado com sucesso!";

    const errorMsg =
      this.mode === "edit"
        ? "Erro ao editar o indicador"
        : "Erro ao criar o indicador";

    request$.subscribe(
      () => {
        this._toastService.show(successMsg, "Sucesso", {
          status: "success",
          duration: 8000,
        });
        this.router.navigate(["/pages/indicators"]);
        this.isSubmitting = false;
      },
      (error: any) => {
        this._toastService.show(errorMsg, "Erro", {
          status: "danger",
          duration: 8000,
        });
        this.router.navigate(["/pages/indicators"]);
        this.isSubmitting = false;
      },
      () => {
        this.isSubmitting = false;
      },
    );
  }

  addNewYearRow(year: number, type: string) {
    this.times.push(
      this.fb.group({
        year: new FormControl(year),
        type: new FormControl(type),
        displayYear: new FormControl(
          type === "BIANUAL" ? `${year}–${year + 1}` : `${year}`,
        ),
        valueGoal: new FormControl(),
        showValueGoal: new FormControl(),
        valueResult: new FormControl(),
        showValueResult: new FormControl(),
        justificationGoal: new FormControl(),
      }),
    );
  }

  removeYearRow(i: number) {
    this.times.removeAt(i);
    this.expandedPeriods.splice(i, 1);
  }

  togglePeriod(i: number) {
    this.expandedPeriods = this.expandedPeriods.map((val, idx) =>
      idx === i ? !val : val,
    );
  }

  toggleTypeDropdown(i: number) {
    this.typeDropdownIndex = this.typeDropdownIndex === i ? null : i;
  }

  changeType(i: number, type: string) {
    const control = this.times.at(i);
    const year = control.get("year")?.value;
    control.get("type")?.setValue(type);
    control
      .get("displayYear")
      ?.setValue(type === "BIANUAL" ? `${year}–${year + 1}` : `${year}`);
    this.typeDropdownIndex = null;
  }

  updateBreadcrumb() {
    this.breadcrumb = [{ label: "Indicadores" }, ...this.configBreadCrumb];
  }

  initializer() {
    this.getManagementOrganizerChallenges();
    this.getDistinctMeasureUnits();
    this.getDistinctOrganizationAcronyms();
    this.getYears();
    this.getOdsList();
  }

  getManagementOrganizerChallenges() {
    this._indicatorService
      .getManagementOrganizerChallenges()
      .subscribe((data) => {
        this.challengeList = data;
        this.filteredOrganizers = data.flatMap((m) => m.organizers);
      });
  }

  getDistinctMeasureUnits() {
    this._indicatorService
      .getDistinctMeasureUnits()
      .subscribe((data) => (this.units = data));
  }

  getYears() {
    this._indicatorService.getYears().subscribe((data) => (this.years = data));
  }

  getOdsList() {
    this._indicatorService
      .getOdsList()
      .subscribe((data) => (this.odsList = data));
  }

  getDistinctOrganizationAcronyms() {
    this._indicatorService
      .getDistinctOrganizationAcronyms()
      .subscribe((data) => (this.organizationAcronyms = data));
  }

  onUnitChange(selectedValue: string) {
    this.isOtherUnit = selectedValue === "other";
    if (!this.isOtherUnit) this.form.get("customUnit")?.setValue("");
  }

  updateChallengesOrgans(selectedChallenges: string[]) {
    const controls = this.challengesOrgans.controls;
    for (let i = controls.length - 1; i >= 0; i--) {
      if (!selectedChallenges.includes(controls[i].get("challengeId")?.value)) {
        this.challengesOrgans.removeAt(i);
      }
    }
    selectedChallenges.forEach((id) => {
      const exists = controls.some((c) => c.get("challengeId")?.value === id);
      if (!exists) {
        this.challengesOrgans.push(
          this.fb.group({
            challengeId: [id, Validators.required],
            organ: ["", Validators.required],
          }),
        );
      }
    });
  }

  removeOrganRow(index: number) {
    const id = this.challengesOrgans.at(index).get("challengeId")?.value;
    if (!id) return;
    let challenges: string[] = this.form.get("challenges")?.value || [];
    challenges = challenges.filter((c) => c !== id);
    this.form.get("challenges")?.setValue(challenges);
    for (let i = this.challengesOrgans.length - 1; i >= 0; i--) {
      if (this.challengesOrgans.at(i).get("challengeId")?.value === id) {
        this.challengesOrgans.removeAt(i);
      }
    }
  }

  onManagementChange(selectedManagements: string[]) {
    this.filteredOrganizers = !selectedManagements?.length
      ? this.challengeList.flatMap((m) => m.organizers)
      : this.challengeList
          .filter((m) => selectedManagements.includes(m.managementName))
          .flatMap((m) => m.organizers);
    this.updateChallengesAndOrgans();
  }

  updateChallengesAndOrgans() {
    const selected: string[] = this.form.get("challenges")?.value || [];
    for (let i = this.challengesOrgans.length - 1; i >= 0; i--) {
      if (!this.isChallengeInSelectedManagements(selected[i])) {
        this.challengesOrgans.removeAt(i);
        selected.splice(i, 1);
      }
    }
    this.form.get("challenges")?.setValue(selected);
  }

  isChallengeInSelectedManagements(id: string): boolean {
    return this.filteredOrganizers.some((o) =>
      o.challenges.some((c) => c.uuId === id),
    );
  }

  getChallengeNameById(challengeId: string): string {
    for (const organizer of this.filteredOrganizers) {
      const challenge = organizer.challenges.find(
        (c) => c.uuId === challengeId,
      );
      if (challenge) {
        const prefix = organizer.name.split(" - ")[0].trim();
        const mgmt = this.challengeList.find((m) =>
          m.managementName.includes(prefix),
        );
        return `${mgmt?.managementName ?? prefix} - ${challenge.name}`;
      }
    }
    return "";
  }

  onPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedPdfFile = input.files[0];
      if (this.hadOriginalPdf) this.shouldRemovePdf = true;
      this.existingPdfFileName = null;
    }
  }

  removePdf(fileInput: HTMLInputElement) {
    this.selectedPdfFile = null;
    this.existingPdfFileName = null;
    if (this.hadOriginalPdf) this.shouldRemovePdf = true;
    fileInput.value = "";
  }

  onCancel() {
    this.router.navigate(["/pages/indicators"]);
  }
}
