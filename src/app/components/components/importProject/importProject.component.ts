import { Component, Input, OnChanges, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {Severity, Messages} from 'src/app/shared/Globals'
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'import-project',
  templateUrl: './importProject.component.html',
  styleUrls: ['./importProject.component.css'],
  providers: [MessageService]
})
export class ImportProjectComponent implements OnInit, OnDestroy, OnChanges {

  @Input() modalWindowVisible: boolean;

  projectDetails;

  constructor(private messageService: MessageService, private dashboardService: DashboardService) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dashboardService.projectDetails.subscribe((response) => {
      this.projectDetails = response;
    })
  }

  ngOnChanges(): void {
    
  }

  uploadFiles(event): any {

    this.dashboardService.importProjectJson(event.files[0]).subscribe(data => {
      this.relayMessage(Severity.SUCCESS);
      this.postUploadCleanup();
      this.dashboardService.updateProjectDetails(data.payload.responseData);
    },
    (error) => {
      this.relayMessage(Severity.WARN);
      this.postUploadCleanup();
    });

  }

  relayMessage(status: Severity): void {
    this.messageService.add({
      severity: status.toString().toLowerCase(),
      summary: status === Severity.SUCCESS ? Messages.SUCCESS_MSG.toString() : Messages.FAILED_MSG.toString(),
      detail: '',
      life: 2000
    });
  }

  postUploadCleanup(): void {
    
  }

  /**
   * p-fileUpload Cancel button callback method
   */
  clearAll(): void {
  }

  /**
   * p-fileUpload Delete button callback method
   */
  removeAll(): void {
  }

}

