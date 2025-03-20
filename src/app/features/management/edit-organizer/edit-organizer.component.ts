import { Component, OnInit } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild } from '../../../core/interfaces/organizer.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iconList } from '../../../core/interfaces/iconlist';


@Component({
  selector: 'ngx-edit-organizer',
  templateUrl: './edit-organizer.component.html',
  styleUrls: ['./edit-organizer.component.scss']
})
export class EditOrganizerComponent implements OnInit{

 form: FormGroup;
 
   submitted = false;
 
   public breadcrumb: Array<IBreadcrumbItem> = [];
 
   public organizer: IOrganizerItem;

   iconList = iconList.map(icon => ({
    value: icon.nome,
    label: icon.palavras_chave[0]
  }));
 
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

            const iconValue = data.icon === null ? '' : data.icon;

            this.form.patchValue({ id: organizerId, name: data.name, description: data.description, icon: iconValue });
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
  
    this.organizer = {
      ...this.organizer, 
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      icon: this.form.get('icon')?.value,
      editable: this.organizer?.editable ?? false
    };
  
    this.organizerService.updateOrganizer(this.organizer).subscribe({
      next: () => {
        this.toastrService.show(
          '', 'Organizador atualizado com sucesso!',
          { status: 'success', duration: 8000 }
        );
        this.router.navigate(['/pages/management']);
      }
    });
  }
  

}
