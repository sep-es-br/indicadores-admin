import { Component, OnInit } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IChallenge } from '../../../core/interfaces/challenge.interface';
import { ChallengeService } from '../../../core/service/challenge.service';


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
 
   constructor(private challengeService: ChallengeService, private fb: FormBuilder,  private dialogService: NbDialogService, private router: Router, private route: ActivatedRoute, private toastrService: NbToastrService) { 
     this.form = this.fb.group({
           id: [''],
           name: ['', [Validators.required]], 
         });
         this.updateBreadcrumb()
   }
 
   ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const challengeId = params['id'];

      if (challengeId) {
        this.challengeService.getChallenge(challengeId).subscribe(
          (data) => {

            this.form.patchValue({ id: challengeId, name: data.name });
          }
        );
      } else {
        this.router.navigate(['/pages/management']);
      }
    });
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
        label: 'Editar',
      },
 
 
    ];
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
  
    this.challenge = {
      ...this.challenge, 
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
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
