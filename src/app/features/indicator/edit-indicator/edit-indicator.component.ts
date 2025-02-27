import { Component, OnInit } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild } from '../../../core/interfaces/organizer.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iconList } from '../../../core/interfaces/iconlist';
import { IndicatorService } from '../../../core/service/indicator.service';


@Component({
  selector: 'ngx-edit-indicator',
  templateUrl: './edit-indicator.component.html',
  styleUrls: ['./edit-indicator.component.scss']
})
export class EditIndicatorComponent implements OnInit{

 form: FormGroup;
 
   submitted = false;
 
   public breadcrumb: Array<IBreadcrumbItem> = [];
 
   constructor(private indicatorService: IndicatorService, private fb: FormBuilder,  private dialogService: NbDialogService, private router: Router, private route: ActivatedRoute, private toastrService: NbToastrService) { 
     this.form = this.fb.group({
           id: [''],
           name: ['', [Validators.required]], 
         });
         this.updateBreadcrumb()
   }
 
   ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const indicatorId = params['id'];

      if (indicatorId) {
        // this.indicatorService.getIndicator(indicatorId).subscribe(
        //   (data) => {

        //   })
      } else {
        this.router.navigate(['/pages/management']);
      }
    });
   }
 
 
   updateBreadcrumb() {
    this.breadcrumb = [
      {
        label: 'Indicador',
      },
      {
        label: 'Editar',
      },
 
 
    ];
  }
 
 
   
   onCancel(): void {
     this.form.reset();
     this.router.navigate(['/pages/indicators']);
   }
   
   onSubmit(): void {
    this.submitted = true;
  
    if (this.form.invalid) {
      return;
    }
  }
  

}
