import { Component } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild } from '../../../core/interfaces/organizer.interface';
import { IManagement } from '../../../core/interfaces/management.interface';
import { Icon } from '../../../core/interfaces/iconlist.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'ngx-edit-organizer',
  templateUrl: './edit-organizer.component.html',
  styleUrls: ['./edit-organizer.component.scss']
})
export class EditOrganizerComponent{

 form: FormGroup;
   submitted = false;
 
   selectedManagement: IManagement;
 
   public breadcrumb: Array<IBreadcrumbItem> = [];
 
   public organizer: IOrganizerItem;
 
   hasOrganizerList: boolean = true;
 
   structureList: IStructureChild[] = [];

   iconList: string[] = Object.values(Icon)
 
   constructor(private organizerService: OrganizerService, private fb: FormBuilder,  private dialogService: NbDialogService, private router: Router, private route: ActivatedRoute, private toastrService: NbToastrService) { 
     this.form = this.fb.group({
           id: [''],
           name: ['', [Validators.required]], 
           description: ['', [Validators.required]], 
           icon: ['']
         });
         this.updateBreadcrumb()
   }
 
   ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const organizerId = params['id'];

      if (organizerId) {
        this.organizerService.getOrganizer(organizerId).subscribe(
          (data) => {
            this.form.patchValue({ name: data.name, description: data.description, icon: data.icon });
          }
        );
      } else {
        console.error('ID do organizador não encontrado nos parâmetros.');
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

   }

}
