import { Component, OnInit } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild } from '../../../core/interfaces/organizer.interface';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iconList } from '../../../core/interfaces/iconlist';
import { IndicatorService } from '../../../core/service/indicator.service';
import { IOds } from '../../../core/interfaces/ods.interface';
import { IManagementOrganizerChallenge, IOrganizerChallenge } from '../../../core/interfaces/managament-organizer-challente.interface';
import { IIndicator, IIndicatorForm, IOdsGoal } from '../../../core/interfaces/indicator.interface';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'ngx-edit-indicator',
  templateUrl: './edit-indicator.component.html',
  styleUrls: ['./edit-indicator.component.scss']
})
export class EditIndicatorComponent implements OnInit {

  submitted = false;
  form: FormGroup;

  public breadcrumb: Array<IBreadcrumbItem> = []

  indicator: IIndicator;

  units: string[] = [];

  organizationAcronyms: string[] = [];

  years: number[] = [];

  odsList: IOds[] = [];

  isOtherUnit = false;

  challengeList: IManagementOrganizerChallenge[] = []

  filteredOrganizers: IOrganizerChallenge[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private dialogService: NbDialogService, private router: Router, private indicatorService: IndicatorService, private toastrService: NbToastrService) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      polarity: ['', Validators.required],
      ods: [[]],
      management: [[]],
      challenges: [[]],
      unit: ['', Validators.required],
      customUnit: [''],
      challengesOrgans: this.fb.array([]),
      yearResultTargets: this.fb.array([])
    });
    this.updateBreadcrumb()

    this.form.get('management').valueChanges.subscribe((selectedManagement) => {
      this.onManagementChange(selectedManagement);
    });

    this.form.get('unit').valueChanges.subscribe((event) => {
      this.onUnitChange(event);
    });

    this.form.get('challenges')?.valueChanges.subscribe((selectedChallenges) => {
      this.updateChallengesOrgans(selectedChallenges);
    });

    this.form.get('unit')?.valueChanges.subscribe(value => {
      const customUnitControl = this.form.get('customUnit');
      if (value === 'other') {
        customUnitControl?.setValidators([Validators.required]);
      } else {
        customUnitControl?.clearValidators();
      }
      customUnitControl?.updateValueAndValidity();
    });

  }
  ngOnInit(): void {

    this.getManagementOrganizerChallenges()
    this.getDistinctMeasureUnits()
    this.getDistinctOrganizationAcronyms()
    this.getYears()
    this.getOdsList()

    this.route.queryParams.subscribe((params) => {
      const indicatorId = params['id'];

      if (indicatorId) {
        this.indicatorService.getIndicator(indicatorId).pipe(
        ).subscribe(
          (data: IIndicator) => {

            this.indicator = data;
            this.form.patchValue({
              id: data.uuId,
              name: data.name,
              polarity: data.polarity,
              unit: data.measureUnit,
              ods: this.extractOdsOrders(data.odsgoal),
              challenges: data.measures.map(m => m.challengeId)
            });

            const selectedChallengeIds = data.measures.map(m => m.challengeId);
            const managementNames = this.getManagementNamesByChallengeIds(selectedChallengeIds)

            this.form.get('management')?.setValue(managementNames);

            const currentChallengesOrgans = this.challengesOrgans.controls;

            currentChallengesOrgans.forEach((control) => {
              const challengeId = control.get('challengeId')?.value;

              const measure = data.measures.find(m => m.challengeId === challengeId);

              if (measure) {
                control.patchValue({
                  organ: measure.organ
                });
              }
            });

            const yearTargetsArray = this.form.get('yearResultTargets') as FormArray;
            data.targetsFor.forEach(target => {
              yearTargetsArray.push(
                this.fb.group({
                  year: [target.year, Validators.required],
                  result: [null],
                  showResult: [''],
                  target: [target.value],
                  showTarget: [target.showValue],
                  yearSelectVisible: [false]
                })
              );
            });

            data.resultedIn.forEach(result => {
              const existingEntry = yearTargetsArray.controls.find(
                control => control.get('year')?.value === result.year
              );

              if (existingEntry) {
                existingEntry.patchValue({
                  result: result.value,
                  showResult: result.showValue
                });
              } else {
                yearTargetsArray.push(
                  this.fb.group({
                    year: [result.year, Validators.required],
                    result: [result.value],
                    showResult: [result.showValue],
                    target: [null],
                    showTarget: [''],
                    yearSelectVisible: [false]
                  })
                );
              }
            }
            );
            yearTargetsArray.controls.sort((a, b) => a.get('year')?.value - b.get('year')?.value);
          })
      } else {
        this.router.navigate(['/pages/indicators']);
      }
    });
  }

  getManagementNamesByChallengeIds(challengeIds: string[]): string[] {
    const managementNames: string[] = [];
  
    challengeIds.forEach(challengeId => {
      const management = this.challengeList.find(mgmt =>
        mgmt.organizers.some(organizer => 
          organizer.challenges.some(challenge => challenge.uuId === challengeId)
        )
      );
  
      if (management && !managementNames.includes(management.managementName)) {
        managementNames.push(management.managementName);
      }
    });
  
    return managementNames;
  }

  isYearAlreadySelected(year: number): boolean {
    const yearTargetsArray = this.form.get('yearResultTargets') as FormArray;

    return yearTargetsArray.controls.some(control => control.get('year')?.value === year);
  }

  private extractOdsOrders(odsList: IOdsGoal[]): string[] {
    return odsList.map(ods => ods.order);
  }


  get yearResultTargets() {
    return this.form.get('yearResultTargets') as FormArray;
  }

  addNewYearRow(): void {
    this.yearResultTargets.push(
      this.fb.group({
        year: ['', Validators.required],
        result: [null,],
        showResult: [''],
        target: [null],
        showTarget: [''],
        yearSelectVisible: [false]
      })
    );
  }

  removeYearRow(index: number) {
    this.yearResultTargets.removeAt(index);
  }

  updateChallengesOrgans(selectedChallenges: string[]): void {
    const currentChallengesOrgans = this.challengesOrgans.controls;

    for (let i = currentChallengesOrgans.length - 1; i >= 0; i--) {
      const challengeId = currentChallengesOrgans[i].get('challengeId')?.value;

      if (!selectedChallenges.includes(challengeId)) {
        this.challengesOrgans.removeAt(i);
      }
    }

    selectedChallenges.forEach((challengeId) => {
      const exists = currentChallengesOrgans.some(
        (control) => control.get('challengeId')?.value === challengeId
      );
      if (!exists) {
        this.challengesOrgans.push(
          this.fb.group({
            challengeId: [challengeId, Validators.required],
            organ: ['', Validators.required],
          })
        );
      }
    });
  }

  removeOrganRow(index: number): void {
    const challengeIdToRemove = this.challengesOrgans.at(index).get('challengeId')?.value;

    if (challengeIdToRemove) {
      let selectedChallenges: string[] = this.form.get('challenges')?.value || [];

      selectedChallenges = selectedChallenges.filter(id => id !== challengeIdToRemove);

      this.form.get('challenges')?.setValue(selectedChallenges);

      for (let i = this.challengesOrgans.length - 1; i >= 0; i--) {
        if (this.challengesOrgans.at(i).get('challengeId')?.value === challengeIdToRemove) {
          this.challengesOrgans.removeAt(i);
        }
      }
    }
  }


  get challengesOrgans() {
    return this.form.get('challengesOrgans') as FormArray;
  }

  getManagementOrganizerChallenges() {
    this.indicatorService.getManagementOrganizerChallenges().subscribe(
      (data) => {
        this.challengeList = data
        this.filteredOrganizers = this.challengeList.flatMap(management => management.organizers);
      }
    );
  }

  getDistinctMeasureUnits() {
    this.indicatorService.getDistinctMeasureUnits().subscribe(
      (data) => {
        this.units = data
      }
    );
  }

  getYears() {
    this.indicatorService.getYears().subscribe(
      (data) => {
        this.years = data
      }
    );
  }

  getOdsList() {
    this.indicatorService.getOdsList().subscribe(
      (data) => {
        this.odsList = data
      }
    );
  }

  getDistinctOrganizationAcronyms() {
    this.indicatorService.getDistinctOrganizationAcronyms().subscribe(
      (data) => {
        this.organizationAcronyms = data
      }
    );
  }


  updateBreadcrumb() {
    this.breadcrumb = [
      {
        label: 'Indicadores',
      },
      {
        label: 'Editar',
      },

    ];
  }

  onManagementChange(selectedManagements: string[]): void {
    if (!selectedManagements || selectedManagements.length === 0) {
      this.filteredOrganizers = this.challengeList.flatMap(management => management.organizers);
    } else {
      const selectedManagementData = this.challengeList.filter(management =>
        selectedManagements.includes(management.managementName)
      );
      this.filteredOrganizers = selectedManagementData.flatMap(management => management.organizers);
    }

    this.updateChallengesAndOrgans();
  }

  updateChallengesAndOrgans(): void {
    const selectedChallenges = this.form.get('challenges')?.value || [];
    const currentChallengesOrgansLength = this.challengesOrgans.length;

    for (let i = currentChallengesOrgansLength - 1; i >= 0; i--) {
      const challengeId = selectedChallenges[i];
      if (!this.isChallengeInSelectedManagements(challengeId)) {
        this.challengesOrgans.removeAt(i);
        selectedChallenges.splice(i, 1);
      }
    }

    this.form.get('challenges')?.setValue(selectedChallenges);
  }

  isChallengeInSelectedManagements(challengeId: string): boolean {
    return this.filteredOrganizers.some(organizer =>
      organizer.challenges.some(challenge => challenge.uuId === challengeId)
    );
  }

  getChallengeNameById(challengeId: string): string {
    const challenge = this.filteredOrganizers.flatMap(o => o.challenges).find(c => c.uuId === challengeId);
    return challenge ? challenge.name : '';
  }

  onUnitChange(selectedValue: string) {
    this.isOtherUnit = selectedValue === 'other';
    if (!this.isOtherUnit) {
      this.form.get('customUnit')?.setValue('');
    }
  }


  onCancel(): void {
    this.router.navigate(['/pages/indicators']);
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;

      const indicatorData: IIndicatorForm = {
        id: formValue.id,
        name: formValue.name,
        polarity: formValue.polarity,
        measureUnit: this.isOtherUnit ? formValue.customUnit : formValue.unit,
        ods: formValue.ods,
        organizationAcronym: formValue.challengesOrgans.map((challenge: any) => ({
          challengeId: challenge.challengeId,
          organ: challenge.organ,
        })),
        targetsFor: formValue.yearResultTargets.map((target: any) => ({
          year: target.year,
          showValue: target.showTarget,
          value: target.target,
        })),
        resultedIn: formValue.yearResultTargets.map((result: any) => ({
          year: result.year,
          showValue: result.showResult,
          value: result.result,
        })),
      };

      this.indicatorService.updateIndicator(indicatorData).subscribe({
        next: (response) => {
          this.toastrService.show(
            '', 'Indicador editado com sucesso!',
            { status: 'success', duration: 8000 }
          );
          this.router.navigate(['/pages/indicators']);
        },
        error: (error) => {
          this.toastrService.show(
            error, 'Erro ao editar o indicador ',
            { status: 'danger', duration: 8000 }
          );
          this.router.navigate(['/pages/indicators']);
        },
      });
    }
  }


}
