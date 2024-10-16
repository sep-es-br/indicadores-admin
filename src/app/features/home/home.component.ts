import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { menulinks } from '../../@core/utils/menuLinks';
import { HomeService } from '../../core/service/home.service';
import { IOds } from '../../core/interfaces/ods.interface';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public menulinks = menulinks;

  public odsData:IOds;

  public odsNumbers = Array.from({ length: 17 }, (_, i) => i + 1);

  constructor(private homeService: HomeService, private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('ID:', params['id']); // Exibe no console para teste
    });
    this.getOdsInfo(1)
  }

  getOdsInfo(order: number){
    this.homeService.getOdsInfo(order).subscribe(
      data => {
        console.log('ODS Info:', data);
        this.odsData = data;
      },
      error => {
        console.error('Erro ao obter ODS Info:', error);
      }
    );
  }
}
