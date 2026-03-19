import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { OrganizerService } from '../../../core/service/organizer.service';
import { IOrganizerItem, IStructureChild, organizerList } from '../../../core/interfaces/organizer.interface';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, FormControl } from '@angular/forms';
import { iconList } from '../../../core/interfaces/iconlist';
import { IndicatorService } from '../../../core/service/indicator.service';
import { IOds } from '../../../core/interfaces/ods.interface';
import { IManagementOrganizerChallenge, IOrganizerChallenge } from '../../../core/interfaces/managament-organizer-challente.interface';
import { IIndicator, IIndicatorForm, IOdsGoal } from '../../../core/interfaces/indicator.interface';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'ngx-edit-indicator',
  templateUrl: './edit-indicator.component.html',
  styleUrls: ['./edit-indicator.component.scss']
})
export class EditIndicatorComponent {
  mode: string = "edit";
  breadCrumb = [{ label: "Editar"}]

}
