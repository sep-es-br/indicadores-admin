import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { IBreadcrumbItem } from '../../../core/interfaces/breadcrumb-item.interface';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IIndicator, IIndicatorForm } from '../../../core/interfaces/indicator.interface';
import { IManagementOrganizerChallenge, IOrganizerChallenge } from '../../../core/interfaces/managament-organizer-challente.interface';
import { IndicatorService } from '../../../core/service/indicator.service';
import { IOds } from '../../../core/interfaces/ods.interface';
import { organizerList } from '../../../core/interfaces/organizer.interface';


@Component({
  selector: 'ngx-new-indicator',
  templateUrl: './new-indicator.component.html',
  styleUrls: ['./new-indicator.component.scss'],
})
export class NewIndicatorComponent {
  mode: string = "create";
  breadCrumb = [{ label: "Cadastrar"}]
}
