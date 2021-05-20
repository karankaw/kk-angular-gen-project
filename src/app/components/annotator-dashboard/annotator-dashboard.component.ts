import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Product } from "src/app/model/product.model";
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ProductService } from 'src/app/services/product.service';



@Component({
  // selector: '.g-box.g-content',
  templateUrl: './annotator-dashboard.component.html',
  styleUrls: ['./annotator-dashboard.component.css'],
  styles: [
    `
    :host ::ng-deep button {
      margin-right: .5em;
    }
  `
    ,
    `
    :host ::ng-deep p-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  `
    ,
  ],
  providers: []
})
export class AnnotatorDashboardComponent implements OnInit {

  title = 'cora-ai-annotator-ui';
  isEnabled: boolean[] = [];
  projectDetails;
  products: Product[];
  displayUploadDocuments: boolean;
  selectedProjectId: string;
  

  constructor(private primengConfig: PrimeNGConfig, private dashboardService: DashboardService, private productService : ProductService) {
    this.projectDetails = ['Project 1', 'Project 2', 'Project 3'];
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.productService.getProductsSmall().then(data => this.products = data);
    this.productService.search();

    // this.dashboardService.projectDetails.subscribe((response) => {
    //   this.projectDetails = response;
    // })

    this.dashboardService.fetchProjectDetails().subscribe((response) => {
      this.dashboardService.addProjectDetailsList(response.payload.responseData);
    })
  }

  onTabOpen(event: any): void {
    this.isEnabled.fill(false);
    this.isEnabled[event.index] = true;
  }

  onTabClose(event: any): void {
    this.isEnabled.fill(false);
  }

  showUploadDocumentsDialog(selectedProject){
    this.displayUploadDocuments = true;
    this.selectedProjectId = selectedProject.id;
  }

}








