import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: '.g-box.g-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  displayImportProject: boolean;

  showImportProjectDialog(): any {
    this.displayImportProject = true;
  }

  cancel() {
    this.displayImportProject = false;
  }

}
