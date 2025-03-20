import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ConfirmationDialogComponent } from '../../../@theme/components/confirmation-dialog/ConfirmationDialog.component';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild } from '../../../core/interfaces/organizer.interface';
import { IManagement, IManagementInfo } from '../../../core/interfaces/management.interface';
import { iconList } from '../../../core/interfaces/iconlist';


@Component({
  selector: 'ngx-new-organizer',
  templateUrl: './new-organizer.component.html',
  styleUrls: ['./new-organizer.component.scss']
})
export class NewOrganizerComponent implements OnInit{

  public breadcrumb: Array<IBreadcrumbItem> = [];

  managementInfo: IManagementInfo = { name: '', id: '', modelName: '' }; 

  organizerList: IOrganizerItem[] = [];

  newStructure: IStructureChild = {
    structureName: '',
    namePlural: '',
    children: [],
    editable: true,
  };


  newItem: IOrganizerItem = {
    name: '',
    description: '',
    icon: '',
    editable: true,
  };

  iconList = iconList.map(icon => ({
    value: icon.nome,
    label: icon.palavras_chave[0] 
  }));

  constructor(private organizerService: OrganizerService, private route: ActivatedRoute,  private router: Router, private toastrService: NbToastrService, private dialogService: NbDialogService) { 
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.managementInfo.id = params['id'];
      this.managementInfo.name = params['name'];
      this.managementInfo.modelName = params['modelName'];
      this.managementInfo.parentOrganizerId = params['parentOrganizerId'] || '';
    });
    this.updateBreadcrumb()
  }


  onCancel(): void {
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
        label: this.managementInfo.modelName,
      },
      {
        label: 'Cadastrar',
      },
    ];
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
    if (this.newItem.name && this.newItem.description) {
      this.organizerList.push({ ...this.newItem, editable: false });
      this.resetNewItem();
    } else {
      let missingFields = [];
      
      if (!this.newItem.name) missingFields.push('Nome');
      if (!this.newItem.description) missingFields.push('Descrição');
  
      this.toastrService.show(
        '',
        `Por favor, preencha todos os campos obrigatórios: ${missingFields.join(', ')}.`,
        {
          status: 'warning',
          duration: 8000,
        }
      );
    }
  }

  resetNewItem(): void {
    this.newItem = {
      name: '',
      description: '',
      icon: '',
      editable: true,
    };
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
  

  checkInvalidItems(items: IOrganizerItem[]): boolean {
    return items.some(item => {
      if (item.editable) {
        return true;
      }
      return false;
    });
  }
  

  saveItems(): void {
    if (this.checkInvalidItems(this.organizerList)) {
      this.toastrService.show(
        '', 
        'Não é possível salvar. Existe algum item marcado como editável.', 
        { status: 'warning', duration: 8000 }
      );
      return;
    }

    if (!this.organizerList || this.organizerList.length === 0) {
      this.toastrService.show(
        '', 
        'A lista de organizadores não pode estar vazia.', 
        { status: 'warning', duration: 8000 }
      );
      return;
    }

    if (this.managementInfo.parentOrganizerId) {
      this.organizerService.createOrganizerChildren(this.organizerList, this.managementInfo.parentOrganizerId).subscribe({
        next: () => {
          this.toastrService.show(
            '', 
            'Organizadores filhos salvos com sucesso!', 
            { status: 'success', duration: 8000 }
          );
          this.router.navigate(['/pages/management']);
        },
      });
    } else {
      this.organizerService.createOrganizer(this.organizerList, this.managementInfo.id).subscribe({
        next: () => {
          this.toastrService.show(
            '', 
            'Organizadores salvos com sucesso!', 
            { status: 'success', duration: 8000 }
          );
          this.router.navigate(['/pages/management']);
        },
      });
    }
  }
}
