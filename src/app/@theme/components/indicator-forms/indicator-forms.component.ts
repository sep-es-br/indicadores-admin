import {
  Component,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  NbDialogService,
  NbToastrService,
  NbThemeService,
  NbSpinnerModule,
  NbContextMenuModule,
  NbIconModule,
  NbButtonModule,
  NbToggleModule,
  NbSelectModule,
  NbCardFooterComponent,
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
    NbSelectModule,
    NbSelectModule,
    NbPopoverModule,
  ],
  styleUrls: ["./indicator-forms.component.scss"],
})
export class IndicatorFormsComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  isSubmitting = false;

  indicator!: IIndicator;

  selectedPdfFile: File | null = null;

  units: string[] = [];

  organizationAcronyms: organizerList[] = [];

  years: number[] = [];

  odsList: IOds[] = [];

  isOtherUnit = false;

  challengeList: IManagementOrganizerChallenge[] = [];

  filteredOrganizers: IOrganizerChallenge[] = [];

  @Input() configBreadCrumb: IBreadcrumbItem[] = [];

  public breadcrumb: IBreadcrumbItem[] = [];

  @ViewChild(NbPopoverDirective) popover!: NbPopoverDirective;

  addPeriodComponent = ModalAddPeriodComponent;

  private _indicatorService = inject(IndicatorService);
  private _toastService = inject(NbToastrService);

  get challengesOrgans() {
    return this.form.get("challengesOrgans") as FormArray;
  }

  get yearResultTargets() {
    return this.form.get("yearResultTargets") as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private popoverService: PeriodPopoverService,
  ) {
    this.form = this.fb.group({
      name: new FormControl("", [Validators.required]),
      polarity: new FormControl("", [Validators.required]),
      ods: new FormControl([]),
      management: new FormControl([]),
      challenges: new FormControl([]),
      unit: new FormControl("", [Validators.required]),
      customUnit: new FormControl(""),
      challengesOrgans: this.fb.array([]),
      yearResultTargets: this.fb.array([]),
      justificationBase: new FormControl(""),
      observations: new FormControl(""),
    });

    this.updateBreadcrumb();

    this.form
      .get("management")
      ?.valueChanges.subscribe((selectedManagement) => {
        this.onManagementChange(selectedManagement);
      });

    this.form.get("unit")?.valueChanges.subscribe((event) => {
      this.onUnitChange(event);
    });

    this.form
      .get("challenges")
      ?.valueChanges.subscribe((selectedChallenges) => {
        this.updateChallengesOrgans(selectedChallenges);
      });
  }

  ngOnInit() {
    this.initializer();
    this.popoverService.onClose$.subscribe((data) => {
      this.popover?.hide();
      if (data) {
        // adiciona o período
        console.log(data);
      }
    });
  }

  updateBreadcrumb() {
    this.breadcrumb = [
      {
        label: "Indicadores",
      },
      ...this.configBreadCrumb,
    ];
  }

  openInterval() {
    console.log("abrir modal intervalo");
  }
  initializer(): void {
    this.getManagementOrganizerChallenges();
    this.getDistinctMeasureUnits();
    this.getDistinctOrganizationAcronyms();
    this.getYears();
    this.getOdsList();
  }

  getManagementOrganizerChallenges() {
    this._indicatorService
      .getManagementOrganizerChallenges()
      .subscribe((data: IManagementOrganizerChallenge[]) => {
        this.challengeList = data;
        this.filteredOrganizers = this.challengeList.flatMap(
          (management) => management.organizers,
        );
      });
  }

  getDistinctMeasureUnits() {
    this._indicatorService
      .getDistinctMeasureUnits()
      .subscribe((data: string[]) => {
        this.units = data;
      });
  }

  getYears() {
    this._indicatorService.getYears().subscribe((data: number[]) => {
      this.years = data;
    });
  }

  getOdsList() {
    this._indicatorService.getOdsList().subscribe((data: IOds[]) => {
      this.odsList = data;
    });
  }

  getDistinctOrganizationAcronyms() {
    this._indicatorService
      .getDistinctOrganizationAcronyms()
      .subscribe((data: organizerList[]) => {
        this.organizationAcronyms = data;
      });
  }

  onUnitChange(selectedValue: string) {
    this.isOtherUnit = selectedValue === "other";
    if (!this.isOtherUnit) {
      this.form.get("customUnit")?.setValue("");
    }
  }

  updateChallengesOrgans(selectedChallenges: string[]): void {
    const currentChallengesOrgans = this.challengesOrgans.controls;

    for (let i = currentChallengesOrgans.length - 1; i >= 0; i--) {
      const challengeId = currentChallengesOrgans[i].get("challengeId")?.value;

      if (!selectedChallenges.includes(challengeId)) {
        this.challengesOrgans.removeAt(i);
      }
    }

    selectedChallenges.forEach((challengeId) => {
      const exists = currentChallengesOrgans.some(
        (control) => control.get("challengeId")?.value === challengeId,
      );
      if (!exists) {
        this.challengesOrgans.push(
          this.fb.group({
            challengeId: [challengeId, Validators.required],
            organ: ["", Validators.required],
          }),
        );
      }
    });
  }

  onManagementChange(selectedManagements: string[]): void {
    if (!selectedManagements || selectedManagements.length === 0) {
      this.filteredOrganizers = this.challengeList.flatMap(
        (management) => management.organizers,
      );
    } else {
      const selectedManagementData = this.challengeList.filter((management) =>
        selectedManagements.includes(management.managementName),
      );
      this.filteredOrganizers = selectedManagementData.flatMap(
        (management) => management.organizers,
      );
    }

    this.updateChallengesAndOrgans();
  }

  updateChallengesAndOrgans(): void {
    const selectedChallenges = this.form.get("challenges")?.value || [];
    const currentChallengesOrgansLength = this.challengesOrgans.length;

    for (let i = currentChallengesOrgansLength - 1; i >= 0; i--) {
      const challengeId = selectedChallenges[i];
      if (!this.isChallengeInSelectedManagements(challengeId)) {
        this.challengesOrgans.removeAt(i);
        selectedChallenges.splice(i, 1);
      }
    }

    this.form.get("challenges")?.setValue(selectedChallenges);
  }

  isChallengeInSelectedManagements(challengeId: string): boolean {
    return this.filteredOrganizers.some((organizer) =>
      organizer.challenges.some((challenge) => challenge.uuId === challengeId),
    );
  }

  getChallengeNameById(challengeId: string): string {
    let result: string = "";
    for (const organizer of this.filteredOrganizers) {
      const challenge = organizer.challenges.find(
        (c) => c.uuId === challengeId,
      );
      if (challenge) {
        const managementPrefix = organizer.name.split(" - ")[0].trim();

        const management = this.challengeList.find((m) =>
          m.managementName.includes(managementPrefix),
        );

        const managementName = management
          ? management.managementName
          : managementPrefix;

        result = `${managementName} - ${challenge.name}`;
      }
    }
    return result;
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
    }
  }

  addNewYearRow(year: number, type: string) {
    const row = this.fb.group({
      year: [year],
      target: [null],
      showTarget: [""],
      justificationGoal: [""],
      result: [null],
      showResult: [""],
    });

    this.yearResultTargets.push(row);
  }

  // addNewYearRow(): void {
  //   this.yearResultTargets.push(
  //     this.fb.group({
  //       year: ["", Validators.required],
  //       result: [null],
  //       showResult: [""],
  //       target: [null, Validators.required],
  //       showTarget: ["", Validators.required],
  //       yearSelectVisible: [false],
  //       justificationGoal: new FormControl("", [Validators.maxLength(500)]),
  //     }),
  //   );
  // }

  removePdf(fileInput: HTMLInputElement): void {
    fileInput.value = "";
    this.selectedPdfFile = null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.isSubmitting = true;
      const formValue = this.form.value;

      const newIndicator: IIndicatorForm = {
        name: formValue.name,
        polarity: formValue.polarity,
        measureUnit: this.isOtherUnit ? formValue.customUnit : formValue.unit,
        ods: formValue.ods,
        organizationAcronym: formValue.challengesOrgans.map(
          (challenge: any) => ({
            challengeId: challenge.challengeId,
            organ: challenge.organ,
          }),
        ),
        targetsFor: formValue.yearResultTargets.map((target: any) => ({
          year: target.year,
          showValue: target.showTarget,
          value: target.target,
          justificationGoal: target.justificationGoal,
        })),
        resultedIn: formValue.yearResultTargets.map((result: any) => ({
          year: result.year,
          showValue: result.showResult,
          value: result.result,
        })),
        justificationBase: formValue.justificationBase,
        observations: formValue.observations,
      };

      this._indicatorService
        .createIndicator(newIndicator, this.selectedPdfFile)
        .subscribe({
          next: (response: IIndicatorForm) => {
            this._toastService.show("", "Indicador criado com sucesso!", {
              status: "success",
              duration: 8000,
            });
            this.router.navigate(["/pages/indicators"]);
          },
          error: (error) => {
            this._toastService.show(error, "Erro ao criar o indicador ", {
              status: "danger",
              duration: 8000,
            });
            this.router.navigate(["/pages/indicators"]);
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(["/pages/indicators"]);
  }
}
