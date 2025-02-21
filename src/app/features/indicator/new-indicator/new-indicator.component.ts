import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IIndicator } from '../../../core/interfaces/indicator.interface';
import { IManagementOrganizerChallenge, IOrganizerChallenge } from '../../../core/interfaces/managament-organizer-challente.interface';
import { IndicatorService } from '../../../core/service/indicator.service';


@Component({
  selector: 'ngx-new-indicator',
  templateUrl: './new-indicator.component.html',
  styleUrls: ['./new-indicator.component.scss']
})
export class NewIndicatorComponent implements OnInit{

  submitted = false;
  form: FormGroup;

  public breadcrumb: Array<IBreadcrumbItem> = []

  indicator: IIndicator;
  
  units: string[] = [];

  organizationAcronyms: string[] = [];

  isOtherUnit = false;

  challengeList: IManagementOrganizerChallenge[] = []

  filteredOrganizers: IOrganizerChallenge[] = [];

  constructor(private fb: FormBuilder, private dialogService: NbDialogService, private router: Router, private indicatorService: IndicatorService,private toastrService: NbToastrService) { 
    this.form = this.fb.group({
      name: ['', Validators.required], 
      polarity: ['', Validators.required],
      management: [[]],
      challenges: [[], Validators.required],
      unit: ['', Validators.required],
      customUnit: [''] ,
      challengesOrgans: this.fb.array([], Validators.required)
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

  }

  ngOnInit(): void {
    this.getManagementOrganizerChallenges()
    this.getDistinctMeasureUnits()
    this.getDistinctOrganizationAcronyms()
  }

  //ajustar
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

  getDistinctOrganizationAcronyms(){
    this.indicatorService.getDistinctOrganizationAcronyms().subscribe(
      (data) => {
        this.organizationAcronyms = data
      }
    );
  }


  onCancel(): void {
    this.form.reset();
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
      organizer.challenges.some(challenge => challenge.id === challengeId)
    );
  }

  getChallengeNameById(challengeId: string): string {
    const challenge = this.filteredOrganizers.flatMap(o => o.challenges).find(c => c.id === challengeId);
    return challenge ? challenge.name : '';
  }

  onUnitChange(selectedValue: string) {
    this.isOtherUnit = selectedValue === 'other';
    if (!this.isOtherUnit) {
      this.form.get('customUnit')?.setValue('');
    }
  }

  onSubmit(){
    this.submitted = true;
    if (this.challengesOrgans.valid) {
      console.log(this.form.value)
    }
  }
  
}
