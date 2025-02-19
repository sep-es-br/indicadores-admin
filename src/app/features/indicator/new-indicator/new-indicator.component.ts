import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IManagement } from '../../../core/interfaces/management.interface';
import { ManagementService } from '../../../core/service/management.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IStructureChild } from '../../../core/interfaces/organizer.interface';
import { ConfirmationDialogComponent } from '../../../@theme/components/confirmation-dialog/ConfirmationDialog.component';
import { IIndicator } from '../../../core/interfaces/indicator.interface';
import { MeasurementUnit } from '../../../core/interfaces/measurement-unit.interface';
import { IChallengeNameId, IManagementOrganizerChallenge } from '../../../core/interfaces/managament-organizer-challente.interface';
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
  
  units = Object.values(MeasurementUnit);

  isOtherUnit = false;

  challengeList: IManagementOrganizerChallenge[] = []

  constructor(private fb: FormBuilder, private dialogService: NbDialogService, private router: Router, private indicatorService: IndicatorService,private toastrService: NbToastrService) { 
    this.form = this.fb.group({
      name: ['', [Validators.required]], 
      polarity: ['', [Validators.required]], 
      desafio: [[], Validators.required],
      unit: ['', Validators.required],
      customUnit: [''] 
    });
    this.updateBreadcrumb()
  }

  ngOnInit(): void {
    this.indicatorService.getManagementOrganizerChallenges().subscribe(
      (data) => {
        this.challengeList = data
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

  onUnitChange(event: Event) {
    console.log("opa")
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.isOtherUnit = selectedValue === 'other';
    if (!this.isOtherUnit) {
      this.form.get('customUnit')?.setValue('');
    }
  }

  onSubmit(){
    this.submitted = true;
    if (this.form.valid) {
      console.log(this.form.value)
    }
  }
  
}
