import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IManagement, OrganizerItem, StructureChild } from '../../../core/interfaces/management.interface';
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

  organizerList: OrganizerItem[] = [];

  structureList: StructureChild[] = [];

  oldValue: string;

  savedData: any;

  newStructure: StructureChild = {
    structureName: '',
    namePlural: '',
    children: [],
    editable: true,
  };


  newItem: OrganizerItem = {
    name: '',
    description: '',
    structureName: this.structureList?.[0]?.structureName ?? '',
    structureNamePlural: this.structureList?.[0]?.namePlural ?? '',
    icon: '',
    children: [],
    editable: true,
  };

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
    if (this.newItem.name && this.newItem.description && this.newItem.structureName) {
      this.organizerList.push({ ...this.newItem, editable: false });
      this.resetNewItem();
    }else{
      alert("Por favor, preencha todos os campos obrigatórios: Nome, Descrição e Estrutura.");
    }
  }

  addNewStructure(): void {
    if (this.newStructure.structureName && this.newStructure.namePlural) {
      this.structureList.push({
        ...this.newStructure,
        children: [],
        editable: false  
      });

      this.resetNewItem();
  
      this.newStructure = { structureName: '', namePlural: '', editable: false };
    } else {
      alert('Nome e nome no plural são obrigatórios!');
    }
  }

  resetNewItem(): void {
    this.newItem = {
      name: '',
      description: '',
      structureName: this.structureList?.[0]?.structureName ?? '',
      structureNamePlural: this.structureList?.[0]?.namePlural ?? '',
      icon: '',
      children: [],
      editable: true,
    };
  }

  toggleEditable(item: any): void {
    item.editable = !item.editable;
  }

  structureToggleEditable(item: any): void {
    item.editable = !item.editable;
  
    if (!item.editable) {
      if (!item.structureName || !item.namePlural) {
        alert('Por favor, preencha o Nome e o Nome no Plural antes de salvar.');
        item.editable = !item.editable;
        return; 
      }
      this.updateItemInList(item);  
      this.resetNewItem();
    } else {
      this.oldValue = item.structureName;
    }

  }
  
  updateItemInList(updatedItem: any): void {
    this.updateStructureRecursively(this.organizerList, updatedItem);
  }

  updateStructureRecursively(items: OrganizerItem[], updatedItem: any): void {
    console.log(updatedItem)
    items.forEach(item => {
      if (item.structureName === this.oldValue) {
        item.structureName = updatedItem.structureName;
        item.structureNamePlural = updatedItem.namePlural
      }
  
      if (item.children && item.children.length > 0) {
        this.updateStructureRecursively(item.children, updatedItem); 
      }
    });
  }
  
  hasChildren(structureName: string): boolean {
    const findStructure = (structure: any, name: string): boolean => {
      if (structure.structureName === name) {
        if (structure.editable) {
          return false; 
        }
        return structure.children && structure.children.length > 0;
      }
  
      if (structure.children) {
        for (const child of structure.children) {
          if (findStructure(child, name)) {
            return true;
          }
        }
      }
  
      return false;  
    };
  
    for (const structure of this.structureList) {
      if (findStructure(structure, structureName)) {
        return true;  
      }
    }
  
    return false;  
  }
  
  addChildStructure(item: StructureChild): void {
    if (item.structureName && item.namePlural && !item.editable) {
      item.children = item.children || [];
      item.children.push({
        ...this.newStructure,
        children: [],
        editable: true, 
      });
    }else{
      alert("Favor terminar de editar")
    }
  }
  

  addChild(item: OrganizerItem): void {
    const findNextChild = (structure: StructureChild, targetName: string): { structureName: string; structureNamePlural: string } | null => {
      if (structure.structureName === targetName) {
        if (structure.children && structure.children.length > 0) {
          const child = structure.children[0];
          return { structureName: child.structureName, structureNamePlural: child.namePlural };
        }
        return null; 
      }
      
      if (structure.children) {
        for (const child of structure.children) {
          const result = findNextChild(child, targetName);
          if (result) {
            return result; 
          }
        }
      }
      
      return null; 
    };
    let nextChild: { structureName: string; structureNamePlural: string } | null = null;

    for (const structure of this.structureList) {
      nextChild = findNextChild(structure, item.structureName);
      if (nextChild) {
        break;
      }
    }
  
    if (nextChild) {
      item.children.push({
        name: '',  
        description: '',
        structureName: nextChild.structureName,
        structureNamePlural: nextChild.structureNamePlural,  
        icon: '',
        children: [],  
        editable: true,
      });
    } else {
      console.log('Nenhum filho encontrado para a estrutura fornecida.');
    }
  }
  
  
  
  deleteItem(targetArray: any[], item: any): void {
    const index = targetArray.indexOf(item);
    if (index > -1) {
      if (confirm('Você tem certeza que deseja excluir este item?')) {
        targetArray.splice(index, 1);
      }
    }
  }

  deleteItemStructure(targetArray: any[], item: any): void {
    const index = targetArray.indexOf(item);
    if (index > -1) {
      if(!this.checkIfStructureExists(item)){
        if (confirm('Você tem certeza que deseja excluir este item?')) {
          targetArray.splice(index, 1);
        }
      }else{
        alert("Você nao pode excluir um item que ja esta sendo usado no organizador")
      }
    }
  }

  checkIfStructureExists(item: any): boolean {
    const findStructureRecursively = (structure: any, targetName: string): boolean => {
      if (structure.structureName === targetName) {
        return true;
      }
      if (structure.children && structure.children.length > 0) {
        return structure.children.some((child: any) => findStructureRecursively(child, targetName));
      }
      return false;
    };
  
    return this.organizerList.some(organizerItem => findStructureRecursively(organizerItem, item.structureName));
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

  saveItems() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    if (!this.organizerList || this.organizerList.length === 0) {
      alert('A lista de organizadores não pode estar vazia.');
      return;
    }
  
    this.savedData = {
      form: this.form.value,
      organizers: this.organizerList,
    };
  
    console.log('Dados Salvos:', this.savedData);
  }
  

  updateStructure(structureName: string) {
    this.newItem.structureName = structureName;
  }

}
