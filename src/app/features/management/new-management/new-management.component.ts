import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IManagement } from '../../../core/interfaces/management.interface';
import { ManagementService } from '../../../core/service/management.service';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'ngx-new-management',
  templateUrl: './new-management.component.html',
  styleUrls: ['./new-management.component.scss']
})
export class NewManagementComponent{

  submitted = false;
  form: FormGroup;

  public breadcrumb: Array<IBreadcrumbItem> = []


  constructor(private fb: FormBuilder, private router: Router, private managementService: ManagementService,private toastrService: NbToastrService) { 
    this.form = this.fb.group({
      name: ['', [Validators.required]], 
      description: ['', [Validators.required]], 
      startYear: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]], 
      endYear: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]], 
    });
    this.updateBreadcrumb()
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      const management: IManagement = {
        name: this.form.value.name,
        description: this.form.value.description,
        startYear: this.form.value.startYear,
        endYear: this.form.value.endYear,
      };

      this.managementService.createManagement(management).subscribe({
        next: (response) => {
          this.toastrService.show(
            '' , 'Gestão criada com sucesso!',
            { status: 'success', duration: 8000 }
          );
          this.router.navigate(['/pages/management']);
        },
        error: (error) => {
          console.error('Erro ao criar gestão:', error);
          this.router.navigate(['/pages/management']);
        },
      });
    }
  }

  onCancel(): void {
    this.form.reset();
    this.router.navigate(['/pages/management']);
  }

  onInput(event: any): void {
    const inputElement = event.target;
    if (inputElement.value.length > 4) {
      inputElement.value = inputElement.value.slice(0, 4);
    }
  }

  updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: 'Gestão Administrativa',
			},
      {
				label: 'Cadastrar',
			},

		];
	}

}
