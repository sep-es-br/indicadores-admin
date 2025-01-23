import { Component, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';

import { IManagement } from '../../../core/interfaces/management.interface';
import { ManagementService } from '../../../core/service/management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'ngx-edit-management',
  templateUrl: './edit-management.component.html',
  styleUrls: ['./edit-management.component.scss']
})
export class EditManagementComponent{

  form: FormGroup;
  submitted = false;

  selectedManagement: IManagement;

  public loading: boolean = true;

  public breadcrumb: Array<IBreadcrumbItem> = [];

  public managements: IManagement;


  constructor(private managementService: ManagementService, private fb: FormBuilder,  private router: Router, private route: ActivatedRoute) { 
    this.form = this.fb.group({
          id: [''],
          name: ['', [Validators.required]], 
          description: ['', [Validators.required]], 
          startYear: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]], 
          endYear: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]], 
          active: [],
        });
        this.updateBreadcrumb()
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

      const { name, active, startYear, endYear, description, id } = params;

      if (name && active && startYear && endYear && description && id) {
        this.form.patchValue(params);
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
    if (this.form.valid) {
      this.selectedManagement = {
        id: this.form.value.id,
        name: this.form.value.name,
        description: this.form.value.description,
        startYear: this.form.value.startYear,
        endYear: this.form.value.endYear,
        active: this.form.value.active,
      };
      console.log(this.selectedManagement)
      this.managementService.updateManagement(this.selectedManagement).subscribe({
        next: () => {
          console.log('Gestão atualizada com sucesso!');
          // Redirecionar ou atualizar a interface após o sucesso
        },
        error: (err) => {
          console.error('Erro ao atualizar a gestão:', err);
        },
      });
    }
  }

}
