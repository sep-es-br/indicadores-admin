import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IManagement } from '../../../core/interfaces/management.interface';
import { ManagementService } from '../../../core/service/management.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IStructureChild } from '../../../core/interfaces/organizer.interface';
import { ConfirmationDialogComponent } from '../../../@theme/components/confirmation-dialog/ConfirmationDialog.component';


@Component({
  selector: 'ngx-new-management',
  templateUrl: './new-management.component.html',
  styleUrls: ['./new-management.component.scss']
})
export class NewManagementComponent{

  submitted = false;
  form: FormGroup;

  public breadcrumb: Array<IBreadcrumbItem> = []

  structureList: IStructureChild[] = [];

  structureEditable: boolean = true;

  newStructure: IStructureChild = {
    structureName: '',
    namePlural: '',
    children: [],
    editable: true,
  };

  constructor(private fb: FormBuilder, private dialogService: NbDialogService, private router: Router, private managementService: ManagementService,private toastrService: NbToastrService) { 
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
    if (this.form.valid && this.structureList.length > 0) {

    let modelNames: string[] = [];
    let modelNamesInPlural: string[] = [];

    const addStructureNames = (structures: IStructureChild[]) => {
      structures.forEach((structure) => {
        modelNames.push(structure.structureName);
        modelNamesInPlural.push(structure.namePlural);

        if (structure.children && structure.children.length > 0) {
          addStructureNames(structure.children);
        }
      });
    };

    addStructureNames(this.structureList);

      const management: IManagement = {
        name: this.form.value.name,
        description: this.form.value.description,
        startYear: this.form.value.startYear,
        endYear: this.form.value.endYear,
        modelName: modelNames,
        modelNameInPlural: modelNamesInPlural,
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

  addNewStructure(): void {
    if (this.newStructure.structureName && this.newStructure.namePlural) {
      this.structureList.push({
        ...this.newStructure,
        children: [],
        editable: false  
      });
  
      this.newStructure = { structureName: '', namePlural: '', editable: false };
    } else {
        this.toastrService.show(
          '' , 'Nome e nome no plural são obrigatórios!',
          { status: 'warning', duration: 8000 }
        );
      }

    }

    structureToggleEditable(item: any): void {
      item.editable = !item.editable;
    
      if (!item.editable) {
        if (!item.structureName || !item.namePlural) {
          this.toastrService.show('', 'Por favor, preencha o Nome e o Nome no Plural antes de salvar.', {
            status: 'warning',
            duration: 8000,
          });
          item.editable = !item.editable;
          return; 
        }
      }
  
    }

    hasChildren(structureName: string): boolean {
      const findStructure = (structure: any, name: string): boolean => {
        if (structure.structureName === name) {
          if (structure.editable) {
            return false; 
          }
          const allChildrenValid = structure.children.every(child => !child.editable);
          return structure.children && structure.children.length > 0 && allChildrenValid;
        }
    
        if (structure.children) {
          for (const child of structure.children) {
            const result = findStructure(child, name);
          if (result) {
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
    
    addChildStructure(item: IStructureChild): void {
      if (item.structureName && item.namePlural && !item.editable) {
        item.children = item.children || [];
        item.children.push({
          ...this.newStructure,
          children: [],
          editable: true, 
        });
      }else{
        this.toastrService.show('', 'Favor terminar de editar.', {
          status: 'warning',
          duration: 8000,
        });
      }
    }

    deleteItemStructure(targetArray: any[], item: any): void {
        const index = targetArray.indexOf(item);
        if (index > -1) {
            this.dialogService
              .open(ConfirmationDialogComponent, {
                context: {
                  title: 'Confirmação',
                  message: 'Você tem certeza que deseja excluir esta estrutura?',
                },
              })
              .onClose.subscribe((confirmed: boolean) => {
                if (confirmed) {
                  targetArray.splice(index, 1);
                  this.toastrService.show('', 'Estrutura excluída com sucesso!', {
                    status: 'success',
                    duration: 5000,
                  });
                }
              });
        }
      }

}
