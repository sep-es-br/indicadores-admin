import { NgModule } from "@angular/core";
import { OrganizerComponent } from "./organizer.component";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NbButtonModule, NbContextMenuModule, NbIconModule, NbToggleModule } from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { ManagementRoutingModule } from "../management/management-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrganizerRoutingModule } from "./organizer-routing.module";
import { NewOrganizerComponent } from "./new-organizer/new-organizer.component";



@NgModule({
  declarations: [
    OrganizerComponent,
    NewOrganizerComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NbIconModule,
    NbButtonModule,
    NbContextMenuModule,
    ThemeModule,
    ReactiveFormsModule,
    FormsModule,
    OrganizerRoutingModule,
    NbToggleModule
  ]
})
export class  OrganizerModule { }
