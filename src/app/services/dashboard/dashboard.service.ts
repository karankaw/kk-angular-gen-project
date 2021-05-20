import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService{

  public projectDetails = new BehaviorSubject<any>([]);

  updateProjectDetails(project){
    let projectList = this.projectDetails.getValue();
    projectList.push(project);
    this.projectDetails.next(projectList);
  }

  addProjectDetailsList(projectList){
    this.projectDetails.next(projectList);
  }

  constructor(httpClient: HttpClient) {
    super(httpClient);
   }

  fetchProjectDetails(){
    var url = "project/all";
    return this.get(url);
  }

  importProjectJson(file : File){

    const formData : FormData = new FormData();
    formData.append("file", file);

    var url = "project/import";

    return this.postMultipartFile(url, formData);
  }

  uploadDocuments(formData: FormData) {
    return this.postMultipartFile('document/upload', formData);
  }
}
