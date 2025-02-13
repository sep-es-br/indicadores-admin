import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ConfirmationDialogComponent } from '../../../@theme/components/confirmation-dialog/ConfirmationDialog.component';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild } from '../../../core/interfaces/organizer.interface';
import { IManagement, IManagementInfo } from '../../../core/interfaces/management.interface';
import { IChallenge } from '../../../core/interfaces/challenge.interface';
import { ChallengeService } from '../../../core/service/challenge.service';


@Component({
  selector: 'ngx-new-challenge',
  templateUrl: './new-challenge.component.html',
  styleUrls: ['./new-challenge.component.scss']
})
export class NewChallengeComponent implements OnInit{

  public breadcrumb: Array<IBreadcrumbItem> = [];

  managementInfo: IManagementInfo = { name: '', id: '', modelName: '' }; 

  challengeList: IChallenge[] = [];

  newItem: IChallenge = {
    name: '',
    editable: true,
  };

  constructor(private challengeService: ChallengeService, private route: ActivatedRoute,  private router: Router, private toastrService: NbToastrService, private dialogService: NbDialogService) { 
    
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
        if (!item.name) {
          this.toastrService.show('', 'Por favor, preencha o Nome antes de salvar.', {
            status: 'warning',
            duration: 8000,
          });
          item.editable = !item.editable;
          return; 
        }
    }
  }

  addNewItem(): void {
    if (this.newItem.name) {
      this.challengeList.push({ ...this.newItem, editable: false });
      this.resetNewItem();
    } else {
      let missingFields = [];
      
      if (!this.newItem.name) missingFields.push('Nome');
  
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
  

  checkInvalidItems(items: IChallenge[]): boolean {
    return items.some(item => {
      if (item.editable) {
        return true;
      }
      return false;
    });
  }
  

  saveItems(): void {
    if (this.checkInvalidItems(this.challengeList)) {
      this.toastrService.show(
        '', 
        'Não é possível salvar. Existe algum item marcado como editável.', 
        { status: 'warning', duration: 8000 }
      );
      return;
    }

    if (!this.challengeList || this.challengeList.length === 0) {
      this.toastrService.show(
        '', 
        'A lista de desafios não pode estar vazia.', 
        { status: 'warning', duration: 8000 }
      );
      return;
    }

      this.challengeService.createChallenge(this.challengeList, this.managementInfo.parentOrganizerId).subscribe({
        next: () => {
          this.toastrService.show(
            '', 
            'desafios salvos com sucesso!', 
            { status: 'success', duration: 8000 }
          );
          this.router.navigate(['/pages/management']);
        },
      });
   }
 }
