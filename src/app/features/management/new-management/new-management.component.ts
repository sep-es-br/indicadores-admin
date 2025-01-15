import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IManagement } from '../../../core/interfaces/management.interface';
import { ManagementService } from '../../../core/service/management.service';


@Component({
  selector: 'ngx-new-management',
  templateUrl: './new-management.component.html',
  styleUrls: ['./new-management.component.scss']
})
export class NewManagementComponent{

  submitted = false;
  form: FormGroup;

  public breadcrumb: Array<IBreadcrumbItem> = [];

  organizerList: any[] = [];

  structure: any = {
    name: 'Eixo', // Tipo principal
    children: [ // Lista de subitens
      {
        name: 'Área', // Tipo do subitem
      }
    ]
  };

  newItem: any = {
    name: '',
    description: '',
    structure: this.structure.name,
    icon: '',
    status: '',
    children: [],
  };

  // Lista de ícones disponíveis
  iconList: string[] = ['Ícone 1', 'Ícone 2', 'Ícone 3'];


  constructor(private fb: FormBuilder, private router: Router, private managementService: ManagementService) { 
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
          console.log('Gestão criada com sucesso:', response);
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

  addNewItem(): void {
    if (this.newItem.name || this.newItem.description || this.newItem.structure) {
      this.organizerList.push({ ...this.newItem, editable: false }); 

      this.newItem = {
        name: '',
        description: '',
        structure: this.structure,
        icon: '',
        status: '',
        children: [],
        editable: true,
      };
    }
  }


  toggleEditable(item: any): void {
    item.editable = !item.editable;
  }
  

  addChild(item: any): void {
    item.children = item.children || [];
    item.children.push({
      name: '',
      description: '',
      structure: this.structure.children.name,
      icon: '',
      status: '',
      children: [],
      editable: true, // Subitem novo começa editável
    });
  }

  deleteItem(targetArray: any[], item: any): void {
    const index = targetArray.indexOf(item);
    if (index > -1) {
      targetArray.splice(index, 1);
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

  saveItems(): void {
    console.log('Itens criados:', this.organizerList);
    // Se você quiser ver todos os filhos também
    this.organizerList.forEach(item => {
      if (item.children.length > 0) {
        console.log(`Item: ${item.name} possui filhos:`, item.children);
      }
    });
  }

}
