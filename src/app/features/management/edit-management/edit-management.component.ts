import { Component, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';

import { IManagement } from '../../../core/interfaces/management.interface';
import { ManagementService } from '../../../core/service/management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IStructureChild } from '../../../core/interfaces/organizer.interface';
import { ConfirmationDialogComponent } from '../../../@theme/components/confirmation-dialog/ConfirmationDialog.component';


@Component({
  selector: 'ngx-edit-management',
  templateUrl: './edit-management.component.html',
  styleUrls: ['./edit-management.component.scss']
})
export class EditManagementComponent{

  form: FormGroup;
  submitted = false;

  selectedManagement: IManagement;

  public breadcrumb: Array<IBreadcrumbItem> = [];

  public managements: IManagement;

  
    structureList: IStructureChild[] = [];
  
    structureEditable: boolean = true;
  
    newStructure: IStructureChild = {
      structureName: '',
      namePlural: '',
      children: [],
      editable: true,
    };


  constructor(private managementService: ManagementService, private fb: FormBuilder,  private dialogService: NbDialogService, private router: Router, private route: ActivatedRoute, private toastrService: NbToastrService) { 
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

      const { name, active, startYear, endYear, description, id, modelName, modelNameInPlural } = params;

      if (name && active && startYear && endYear && description && id) {
        this.form.patchValue(params);

        const names: string[] = Array.isArray(modelName) ? modelName : modelName?.split(',') || [];
        const namesPlural: string[] = Array.isArray(modelNameInPlural) ? modelNameInPlural : modelNameInPlural?.split(',') || [];
  
        this.structureList = this.buildHierarchy(names, namesPlural);
        console.log(this.structureList)
      } else {
        this.router.navigate(['/pages/management']);
      }
    });
  }

  private buildHierarchy(names: string[], namesPlural: string[], index: number = 0): IStructureChild[] {
    if (index >= names.length) {
      return [];
    }
  
    return [{
      structureName: names[index],
      namePlural: namesPlural[index] || '',
      children: this.buildHierarchy(names, namesPlural, index + 1),
      editable: false
    }];
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


      this.selectedManagement = {
        id: this.form.value.id,
        name: this.form.value.name,
        description: this.form.value.description,
        startYear: this.form.value.startYear,
        endYear: this.form.value.endYear,
        active: this.form.value.active,
        modelName: modelNames,
        modelNameInPlural: modelNamesInPlural,
      };

      this.managementService.updateManagement(this.selectedManagement).subscribe({
        next: () => {
          this.toastrService.show(
            '' , 'Gestão atualizada com sucesso!',
            { status: 'success', duration: 8000 }
          );
          this.router.navigate(['/pages/management']);
        },
        error: (err) => {
          this.router.navigate(['/pages/management']);
        },
      });
    }
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
