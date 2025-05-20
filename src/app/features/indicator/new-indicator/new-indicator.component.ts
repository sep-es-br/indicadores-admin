import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IIndicator, IIndicatorForm } from '../../../core/interfaces/indicator.interface';
import { IManagementOrganizerChallenge, IOrganizerChallenge } from '../../../core/interfaces/managament-organizer-challente.interface';
import { IndicatorService } from '../../../core/service/indicator.service';
import { IOds } from '../../../core/interfaces/ods.interface';
import { organizerList } from '../../../core/interfaces/organizer.interface';


@Component({
  selector: 'ngx-new-indicator',
  templateUrl: './new-indicator.component.html',
  styleUrls: ['./new-indicator.component.scss']
})
export class NewIndicatorComponent implements OnInit{

  submitted = false;
  isSubmitting = false;
  form: FormGroup;

  public breadcrumb: Array<IBreadcrumbItem> = []

  indicator: IIndicator;

  selectedPdfFile: File | null = null;
  
  units: string[] = [];

  organizationAcronyms: organizerList[] = [];

  years: number[] = [];

  odsList: IOds[] = [];

  isOtherUnit = false;

  challengeList: IManagementOrganizerChallenge[] = []

  filteredOrganizers: IOrganizerChallenge[] = [];

  constructor(private fb: FormBuilder, private dialogService: NbDialogService, private router: Router, private indicatorService: IndicatorService,private toastrService: NbToastrService) { 
    this.form = this.fb.group({
      name: ['', Validators.required], 
      polarity: ['', Validators.required],
      ods: [[]],
      management: [[]],
      challenges: [[]],
      unit: ['', Validators.required],
      customUnit: [''] ,
      challengesOrgans: this.fb.array([]),
      yearResultTargets: this.fb.array([]),
      justificationBase: [''],
      justificationGoal: [''],
      observations: ['']
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
  }

  get yearResultTargets() {
    return this.form.get('yearResultTargets') as FormArray;
  }

  addNewYearRow(): void {
    this.yearResultTargets.push(
      this.fb.group({
        year: ['', Validators.required],
        result: [null, ],
        showResult: [''],
        target: [null, Validators.required],
        showTarget: ['', Validators.required],
        yearSelectVisible: [false]  
      })
    );
  } 

  isYearAlreadySelected(year: number): boolean {
    const yearTargetsArray = this.form.get('yearResultTargets') as FormArray;

    return yearTargetsArray.controls.some(control => control.get('year')?.value === year);
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
  
  getManagementOrganizerChallenges(){
    this.indicatorService.getManagementOrganizerChallenges().subscribe(
      (data) => {
        this.challengeList = data
        this.filteredOrganizers = this.challengeList.flatMap(management => management.organizers);
      }
    );
  }

  getDistinctMeasureUnits(){
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

  getDistinctOrganizationAcronyms(){
    this.indicatorService.getDistinctOrganizationAcronyms().subscribe(
      (data) => {
        this.organizationAcronyms = data
      }
    );
  }


  onCancel(): void {
    this.router.navigate(['/pages/indicators']);
  }


  updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: 'Indicadores',
			},
      {
				label: 'Cadastrar',
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
    for (const organizer of this.filteredOrganizers) {
      const challenge = organizer.challenges.find(c => c.uuId === challengeId);
      if (challenge) {
        const managementPrefix = organizer.name.split(' - ')[0].trim();
  
        const management = this.challengeList.find(m => m.managementName.includes(managementPrefix));
  
        const managementName = management ? management.managementName : managementPrefix;
  
        return `${managementName} - ${challenge.name}`;
      }
    }
  }

  onUnitChange(selectedValue: string) {
    this.isOtherUnit = selectedValue === 'other';
    if (!this.isOtherUnit) {
      this.form.get('customUnit')?.setValue('');
    }
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
          justificationBase: formValue.justificationBase, 
          justificationGoal: formValue.justificationGoal,
          observations: formValue.observations
        };
    
        this.indicatorService.createIndicator(newIndicator, this.selectedPdfFile).subscribe({
          next: (response) => {
            this.toastrService.show(
              '' , 'Indicador criado com sucesso!',
              { status: 'success', duration: 8000 }
            );
            this.router.navigate(['/pages/indicators']);
          },
          error: (error) => {
            this.toastrService.show(
              error , 'Erro ao criar o indicador ',
              { status: 'danger', duration: 8000 }
            );
            this.router.navigate(['/pages/indicators']);
          },
          complete: () => {
            this.isSubmitting = false; 
          }
        });
    }
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
    }
  }
  
  removePdf(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.selectedPdfFile = null;
  }
  
}
