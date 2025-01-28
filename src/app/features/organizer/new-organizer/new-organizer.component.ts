import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ConfirmationDialogComponent } from '../../../@theme/components/confirmation-dialog/ConfirmationDialog.component';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild } from '../../../core/interfaces/organizer.interface';
import { IManagement } from '../../../core/interfaces/management.interface';


@Component({
  selector: 'ngx-new-organizer',
  templateUrl: './new-organizer.component.html',
  styleUrls: ['./new-organizer.component.scss']
})
export class NewOrganizerComponent{

  public breadcrumb: Array<IBreadcrumbItem> = [];

  managementList: IManagement[] = [];

  selectedManagement: string = '';

  organizerList: IOrganizerItem[] = [];

  structureList: IStructureChild[] = [];

  oldValue: string;

  savedData: IOrganizerItem[];

  newStructure: IStructureChild = {
    structureName: '',
    namePlural: '',
    children: [],
    editable: true,
  };


  newItem: IOrganizerItem = {
    name: '',
    description: '',
    structureName: this.structureList?.[0]?.structureName ?? '',
    structureNamePlural: this.structureList?.[0]?.namePlural ?? '',
    icon: '',
    children: [],
    editable: true,
  };

  iconList: string[] = ['Ícone 1', 'Ícone 2', 'Ícone 3'];


  constructor(private organizerService: OrganizerService, private router: Router, private toastrService: NbToastrService, private dialogService: NbDialogService) { 
    this.updateBreadcrumb()
    this.getManagementList()
  }


  onCancel(): void {
    this.router.navigate(['/pages/organizer']);
  }

  onInput(event: any): void {
    const inputElement = event.target;
    if (inputElement.value.length > 4) {
      inputElement.value = inputElement.value.slice(0, 4);
    }
  }

  onManagementChange(selectedId: string): void {
    this.structureList = []
    if (selectedId !== '') {
      this.organizerService.getStructureList(selectedId).subscribe(data => {

        if (data.length === 0) {
          this.resetNewItem();
          return; 
        }

        const newStructure: IStructureChild = {
          structureName: '',
          namePlural: '',
          children: [],
          editable: false
        };

        data.forEach(item => {
          if (item.relationshipType === 'parent') {
            newStructure.structureName = item.name;
            newStructure.namePlural = item.nameInPlural;
          } else if (item.relationshipType === 'child') {
            const childStructure: IStructureChild = {
              structureName: item.name,
              namePlural: item.nameInPlural,
              children: [],
              editable: false
            };
            newStructure.children.push(childStructure);
          }
        });

        this.structureList.push(newStructure);
        this.resetNewItem();

      });
    }
  }

  

  updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: 'Organizador',
			},
      {
				label: 'Cadastrar',
			},

		];
	}

  getManagementList(){
    const responseData = this.organizerService.administrationList();
		responseData.subscribe(
			data=> {
        this.managementList = data;
      })
  }
  
  toggleEditable(item: IOrganizerItem): void {
    item.editable = !item.editable;

    if (!item.editable) {
      if (!item.name || !item.description) {
        this.toastrService.show('', 'Por favor, preencha o Nome e a Descrição antes de salvar.', {
          status: 'warning',
          duration: 8000,
        });
        item.editable = !item.editable;
        return; 
      }
    }
  }

  addNewItem(): void {
    if (this.newItem.name && this.newItem.description && this.newItem.structureName) {
      this.organizerList.push({ ...this.newItem, editable: false });
      this.resetNewItem();
    }else{
      this.toastrService.show('', 'Por favor, preencha todos os campos obrigatórios: Nome, Descrição e Estrutura.', {
        status: 'warning',
        duration: 8000,
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

      this.resetNewItem();
  
      this.newStructure = { structureName: '', namePlural: '', editable: false };
    } else {
      this.toastrService.show(
        '' , 'Nome e nome no plural são obrigatórios!',
        { status: 'warning', duration: 8000 }
      );
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
      this.updateItemInList(item);  
      this.resetNewItem();
    } else {
      this.oldValue = item.structureName;
    }

  }
  
  updateItemInList(updatedItem: any): void {
    this.updateStructureRecursively(this.organizerList, updatedItem);
  }

  updateStructureRecursively(items: IOrganizerItem[], updatedItem: any): void {
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
  

  addChild(item: IOrganizerItem): void {
    const findNextChild = (structure: IStructureChild, targetName: string): { structureName: string; structureNamePlural: string } | null => {
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
      this.dialogService
        .open(ConfirmationDialogComponent, {
          context: {
            title: 'Confirmação',
            message: 'Você tem certeza que deseja excluir este item?',
          },
        })
        .onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {
            targetArray.splice(index, 1);
            this.toastrService.show('', 'Item excluído com sucesso!', {
              status: 'success',
              duration: 5000,
            });
          }
        });
    }
  }
  
  deleteItemStructure(targetArray: any[], item: any): void {
    const index = targetArray.indexOf(item);
    if (index > -1) {
      if (!this.checkIfStructureExists(item)) {
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
              this.resetNewItem();
              this.toastrService.show('', 'Estrutura excluída com sucesso!', {
                status: 'success',
                duration: 5000,
              });
            }
          });
      } else {
        this.toastrService.show(
          '',
          'Você não pode excluir um item que já está sendo usado no organizador.',
          { status: 'warning', duration: 8000 }
        );
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

  checkInvalidItems(items: IOrganizerItem[]): boolean {
    return items.some(item => {
      if (item.editable) {
        return true;
      }
      if (item.children && item.children.length > 0) {
        return this.checkInvalidItems(item.children);
      }
      return false;
    });
  }
  

  saveItems(): void {
    if (this.checkInvalidItems(this.organizerList)) {
      this.toastrService.show(
        '', 
        'Não é possível salvar. Existe um item pai ou filho marcado como editável.', 
        {
          status: 'warning',
          duration: 8000,
        }
      );
      return;
    }
  
    if (!this.organizerList || this.organizerList.length === 0) {
      this.toastrService.show(
        '', 
        'A lista de organizadores não pode estar vazia.', 
        {
          status: 'warning',
          duration: 8000,
        }
      );
      return;
    }
  
    this.organizerService.createOrganizer(this.organizerList, this.selectedManagement).subscribe({
      next: () => {
        this.toastrService.show(
          '', 
          'Organizadores salvos com sucesso!', 
          {
            status: 'success',
            duration: 8000,
          }
        );
      },
    });
  }
  

  updateStructure(structureName: string) {
    this.newItem.structureName = structureName;
  }

}
