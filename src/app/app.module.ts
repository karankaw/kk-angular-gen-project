import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AccordionModule } from "primeng/accordion";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnnotatorDashboardComponent } from 'src/app/components/annotator-dashboard/annotator-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import {ImportProjectComponent} from 'src/app/components/importProject/importProject.component';
import { UploadDocumentsComponent } from './components/upload-documents-modal/uploadDocuments.component'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProductService } from './services/product.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { MiscComponent } from './components/misc/misc.component';
import { FirstComponent } from './components/first/first.component';
import { SecondComponent } from './components/second/second.component';
import { PrimaryComponent } from './components/primary/primary.component';

@NgModule({
  declarations: [
    AppComponent,
    AnnotatorDashboardComponent,
    HeaderComponent,
    ImportProjectComponent,
    HeaderComponent,
    UploadDocumentsComponent,
    PageNotFoundComponent,
    NavbarComponent,
    MiscComponent,
    FirstComponent,
    SecondComponent,
    PrimaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AccordionModule,
    ButtonModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    DialogModule,
    FileUploadModule,
    ToastModule,
    InputTextModule,
    SidebarModule,
    MenuModule
  ],
  bootstrap: [AppComponent],
  providers: [ProductService, MessageService],
})
export class AppModule { }
