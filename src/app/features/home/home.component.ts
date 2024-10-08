import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private homeService: HomeService) { 
  }

  ngOnInit(): void {
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
