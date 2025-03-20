import { Component, OnInit } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IChallenge } from '../../../core/interfaces/challenge.interface';
import { ChallengeService } from '../../../core/service/challenge.service';
import { IIndicatorDetails } from '../../../core/interfaces/indicator.interface';
import { IOrganizerChallenge } from '../../../core/interfaces/managament-organizer-challente.interface';
import { IndicatorService } from '../../../core/service/indicator.service';
import { ConfirmationDialogComponent } from '../../../@theme/components/confirmation-dialog/ConfirmationDialog.component';


@Component({
  selector: 'ngx-edit-challenge',
  templateUrl: './edit-challenge.component.html',
  styleUrls: ['./edit-challenge.component.scss']
})
export class EditChallengeComponent implements OnInit{

 form: FormGroup;
 
   submitted = false;
 
   public breadcrumb: Array<IBreadcrumbItem> = [];
 
   public challenge: IChallenge;

   organizationAcronyms: string[] = [];

   allIndicator: IIndicatorDetails[] = [];
 
   constructor(private challengeService: ChallengeService, private fb: FormBuilder,  private dialogService: NbDialogService, private router: Router, 
    private route: ActivatedRoute, private toastrService: NbToastrService, private indicatorService: IndicatorService) { 
     this.form = this.fb.group({
           id: [''],
           name: ['', [Validators.required]],
           indicatorList: this.fb.array([]), 
         });
      this.updateBreadcrumb()
   }
 
   ngOnInit(): void {
    this.getDistinctOrganizationAcronyms();
    this.getIndicators()
    this.route.queryParams.subscribe((params) => {
      const challengeId = params['id'];

      if (challengeId) {
        this.challengeService.getChallenge(challengeId).subscribe(
          (data) => {
            this.form.patchValue({ id: challengeId, name: data.name });
            this.setIndicators(data.indicatorList);
          }
        );
      } else {
        this.router.navigate(['/pages/management']);
      }
    });
   }

   addIndicatorRow() {
    const indicatorFormGroup = this.fb.group({
      uuId: [''],
      name: ['', Validators.required],
      organizationAcronym: ['', Validators.required],
    });
    indicatorFormGroup.get('name')?.valueChanges.subscribe((selectedName) => {
      this.onIndicatorSelected(selectedName, indicatorFormGroup);
    });
  
    this.indicatorList.push(indicatorFormGroup);
  }

  onIndicatorSelected(selectedName: string, control: FormGroup): void {
    const selectedIndicator = this.allIndicator.find(ind => ind.name === selectedName);
    if (selectedIndicator) {
      control.get('uuId')?.setValue(selectedIndicator.uuId);
      control.get('organizationAcronym')?.setValue(selectedIndicator.organizationAcronym); 
    } else {
      control.get('uuId')?.reset();
      control.get('organizationAcronym')?.reset();
    }
  }

  removeIndicatorRow(index: number) {
    const indicatorControl = this.indicatorList.at(index);
    const isDisabled = indicatorControl.get('disabled')?.value;
  
    if (isDisabled) {
      this.dialogService.open(ConfirmationDialogComponent, {
        context: {
          title: 'Atenção!',
          message: 'Este indicador já está salvo no banco de dados. Se você removê-lo e salvar, ele será deletado permanentemente. Tem certeza de que deseja continuar?',
        }
      }).onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.indicatorList.removeAt(index); 
        }
      });;
    } else {
      this.indicatorList.removeAt(index); 
    }
  }
  

  get indicatorList() {
    return this.form.get('indicatorList') as FormArray;
  }

  getDistinctOrganizationAcronyms(){
    this.indicatorService.getDistinctOrganizationAcronyms().subscribe(
      (data) => {
        this.organizationAcronyms = data
      }
    );
  }

  getIndicators(){
    this.indicatorService.getAllIndicators().subscribe(
      (data) => {
        this.allIndicator = data
      }
    );
  }
 
 
   updateBreadcrumb() {
    this.breadcrumb = [
      {
        label: 'Gestão Administrativa',
      },
      {
        label: 'Organizador',
      },
      {
        label: 'Desafio',
      },
      {
        label: 'Editar',
      },
 
 
    ];
  }

  setIndicators(indicatorList: IIndicatorDetails[]) {
    const indicatorFormArray = this.form.get('indicatorList') as FormArray;

    indicatorFormArray.clear();

    indicatorList.forEach((indicator) => {
      const indicatorFormGroup = this.fb.group({
        uuId: [indicator.uuId],
        name: [indicator.name.toUpperCase(), [Validators.required]],
        organizationAcronym: [indicator.organizationAcronym, [Validators.required]],
        disabled:[true]
      });
  
      indicatorFormGroup.get('name')?.disable();
  
      indicatorFormArray.push(indicatorFormGroup);
    });
    
  }

  isIndicatorAlreadySelected(indicador: any): boolean {
    const indicatorList = this.form.get('indicatorList') as FormArray;
    return indicatorList.controls.some(control => control.get('uuId')?.value === indicador.uuId);
  }

   
   onCancel(): void {
     this.form.reset();
     this.router.navigate(['/pages/management']);
   }
   
   onSubmit(): void {
    this.submitted = true;
  
    if (this.form.invalid) {
      return;
    }

    const indicatorListValues = this.form.get('indicatorList')?.value.map((control: any) => ({
      uuId: control.uuId,
      organizationAcronym: control.organizationAcronym
    }));
  
    this.challenge = {
      ...this.challenge, 
      uuId: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      indicatorList: indicatorListValues
    };
  
    this.challengeService.updateChallenge(this.challenge).subscribe({
      next: () => {
        this.toastrService.show(
          '', 'Desafio atualizado com sucesso!',
          { status: 'success', duration: 8000 }
        );
        this.router.navigate(['/pages/management']);
      }
    });
  }
  

}
