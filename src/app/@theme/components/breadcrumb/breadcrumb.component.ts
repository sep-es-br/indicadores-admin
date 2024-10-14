import { Component, Input } from "@angular/core";

@Component({
	selector: "ngx-breadcrumb",
	templateUrl: "./breadcrumb.component.html",
	styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent {

	@Input() public breadcrumb: any = [];
	

	constructor() {
		
	}


}