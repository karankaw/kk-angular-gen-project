import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Severity, Messages } from 'src/app/shared/Globals'

@Component({
  selector: 'app-upload-documents-modal',
  templateUrl: './uploadDocuments.component.html',
  styleUrls: ['./uploadDocuments.component.css'],
  providers: [MessageService]
})
export class UploadDocumentsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() 
  modalWindowVisible: boolean | string;

  @Input()
  projectId: string;

  @Output() 
  modalWindowVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  uploadId: string;

  @ViewChild('uploadIDTemplate') uploadIDTemplate;

  constructor(private messageService: MessageService, private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  ngOnChanges(): void {
  }

  cancel() {
    this.modalWindowVisible = false;
    this.uploadIDTemplate.reset();
    this.modalWindowVisibleChange.emit(this.modalWindowVisible)
  }

  uploadFiles(event) {
    const formData : FormData = new FormData();
    formData.append("projectId", this.projectId);
    formData.append("uploadId", this.uploadId);
    formData.append("inputZip", event.files[0]);
    formData.append("username", "ABC");

    this.dashboardService.uploadDocuments(formData).subscribe(data => {
      this.relayMessage(Severity.SUCCESS);
      this.postUploadCleanup();
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
    DashboardService
  }

}