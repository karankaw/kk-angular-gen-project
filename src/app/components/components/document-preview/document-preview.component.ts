import { Component, OnInit, Input, ElementRef, Inject } from '@angular/core';
import { DocumentService } from 'src/app/services/Document/document.service';
import { PdfImageModel } from 'src/app/model/pdf.image.model';
import { PdfSegment } from 'src/app/model/pdfsegment.model';
import {ViewChild} from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { ContextMenuService } from 'ngx-contextmenu';
import { Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

interface Document {
  documentId: string;
  pageCount: number;
  name: string;
}

@Component({
  selector: 'document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css']
})

export class DocumentPreviewComponent implements OnInit {

  constructor(private documentService: DocumentService,
    private el: ElementRef, @Inject(DOCUMENT) private documentEle: any,
    private contextMenuService: ContextMenuService) {
    this.componentHeight = el.nativeElement.offsetHeight;
  }

  items: any[];
  componentHeight: number;
  screenHeight: number;
  segmentsVisibility: boolean = false;
  fixedContainerWidth: number;
  fixedContainerHeight: number;
  newxFactor: number = 0;
  newyFactor: number = 0;
  maxX: number = 1;
  maxY: number = 1;
  pagePdfImage: {};
  url: string = '';
  segmentsFontColor: string = 'black';
  pageWisePdfSegments: PdfSegment[] = [];
  pdfSegments: PdfSegment[] = [];
  pdfImageModel: PdfImageModel = new PdfImageModel();
  isTextDocument: boolean = false;
  textContent: string = '';

  pageWiseSegmentXYMap: Map<number,Map<number,PdfSegment[]>> = new Map();
  xMarginForBoundingBox:number = 3;
  yMarginForBoundingBox:number = 3;

  menuTop = 50;
  menuLeft = 10;

  @Input()
  document: Document;

  @Input()
  pageNo: string;

  @Input()
  mode: string;

  @Input() 
  annotationJson: any;

  @Output() selectionEvent = new EventEmitter<string>();

  //@ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  
  @ViewChild("canvas") public canvasDiv;
  
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
  }

  ngOnChanges(): void {
    if (this.document != undefined && this.document.documentId != "-1") {
      if (this.document.name.toLowerCase().endsWith(".pdf")) {
        this.isTextDocument = false;
        if (this.pageNo != undefined && this.pageNo != "" && this.mode != "") {
          this.documentService.getPDFPageData(this.document.documentId, this.pageNo, this.mode).subscribe(resp => {
            this.items = resp.payload.responseData;

            if (this.items != undefined && this.items.length > 0) {
              this.pdfImageModel = this.items[0];

              this.pdfImageModel.documentId = this.document.documentId;
              this.pdfImageModel.xScale = this.items[0].xScale;
              this.pdfImageModel.yScale = this.items[0].yScale;
              this.pdfImageModel.maxX = this.items[0].maxX;
              this.pdfImageModel.maxY = this.items[0].maxY;
              this.pdfImageModel.segmentList = this.items[0].segmentList;
              this.pdfImageModel.pageNo = this.pageNo;

              this.url = this.items[0].imageString;

              this.pageWisePdfSegments = this.items[0].segmentList;

              this.maxX = this.pdfImageModel.maxX;
              this.maxY = this.pdfImageModel.maxY;

              this.segmentsFontColor = 'transparent';

              //for recalculating max height and width
              //disable the segments initially , and display them only after text is formatted properly
              this.segmentsVisibility = false;
              this.fixedContainerWidth = (window.innerWidth / 2);

              this.fixedContainerHeight = (this.fixedContainerWidth * this.pdfImageModel.height) / this.pdfImageModel.width;
              this.newxFactor = (this.fixedContainerWidth / this.pdfImageModel.width);
              this.newyFactor = (this.fixedContainerHeight / this.pdfImageModel.height);

              //Clear Previous rectangles.
              this.documentEle.querySelectorAll('.rectangle').forEach(el => el.remove());
             /* let elements = this.documentEle.querySelectorAll('.rectangle').forEach(el => el.remove());
             for(let element of elements){
                element.remove();
              }*/
              //Prepare segment map.
              this.prepareSegmentMap();
            }
          });
        }
      } else if (this.document.name.toLowerCase().endsWith(".txt")) {
        this.isTextDocument = true;
        this.documentService.getTextFileContent(this.document.documentId).subscribe(resp => {
          this.textContent = resp.payload.responseData;
        });
      }
    }
  }

  /**********************************HTML Rect Drawing ************************************ */
  mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };
  element = null;

  customSetMousePos(event) {
    var ev = event || window.event; //Moz || IE
    if (ev.pageX) { //Moz
      var mouseX = ev.pageX-110;
      var mouseY = ev.pageY-120;
      this.mouse.x = mouseX + window.pageXOffset;
      this.mouse.y = mouseY + window.pageYOffset;
  } else if (ev.clientX) { //IE
    var mouseX = ev.clientX-110;
    var mouseY = ev.clientY-120;
    this.mouse.x = mouseX + document.body.scrollLeft;
    this.mouse.y = mouseY + document.body.scrollTop;
  }
    // if (ev.pageX) { //Moz
    //     this.mouse.x = ev.pageX + window.pageXOffset;
    //     this.mouse.y = ev.pageY + window.pageYOffset;
    // } else if (ev.clientX) { //IE
    //   this.mouse.x = ev.clientX + document.body.scrollLeft;
    //   this.mouse.y = ev.clientY + document.body.scrollTop;
    // }
  }

customOnMouseMove(event){
  this.customSetMousePos(event);
  if (this.element !== null) {
    var mouseX = this.mouse.x; //-50;
    var mouseY = this.mouse.y;//-110;
    this.element.style.width = Math.abs(mouseX - this.mouse.startX) + 'px';
    this.element.style.height = Math.abs(mouseY - this.mouse.startY) + 'px';
    this.element.style.left = (mouseX - this.mouse.startX < 0) ? mouseX + 'px' : this.mouse.startX + 'px';
    //this.element.style.left = (this.mouse.x - this.mouse.startX < 0) ? this.mouse.x + 'px' : this.mouse.startX + 'px';
    this.element.style.top = (mouseY - this.mouse.startY < 0) ? mouseY + 'px' : this.mouse.startY + 'px';
    //this.element.style.top = (this.mouse.y - this.mouse.startY < 0) ? this.mouse.y + 'px' : this.mouse.startY + 'px';
  

    // this.element.style.width = Math.abs(this.mouse.x - this.mouse.startX) + 'px';
    // this.element.style.height = Math.abs(this.mouse.y - this.mouse.startY) + 'px';
    // this.element.style.left = (this.mouse.x - this.mouse.startX < 0) ? this.mouse.x + 'px' : this.mouse.startX + 'px';
    // this.element.style.top = (this.mouse.y - this.mouse.startY < 0) ? this.mouse.y + 'px' : this.mouse.startY + 'px';

  }
}

customOnMouseDown (event) {
  // if (this.element !== null) {
  //   this.element = null;
  //   this.canvasDiv.nativeElement.style.cursor = "default";
  //     console.log("finsihed.");
  // } else {
    if(event.which==1){
      console.log("begun.");
      this.mouse.startX = this.mouse.x;// - 50;
      this.mouse.startY = this.mouse.y;// - 60;
      this.element = document.createElement('div');
      this.element.className = 'rectangle'
      this.element.style.left = this.mouse.startX + 'px';
      this.element.style.top = this.mouse.startY + 'px';
      this.element.style.height = 10 + 'px';
      this.element.style.border = '1px solid #FF0000';
      this.element.style.position = 'absolute';
      this.canvasDiv.nativeElement.appendChild(this.element)
      this.canvasDiv.nativeElement.style.cursor = "crosshair";
    }
     
 // }
}

customOnMouseUp(event){
  if (this.element !== null) {
    this.menuTop = this.mouse.y;
    this.menuLeft = this.mouse.x;
    this.trigger.openMenu();
    this.selectionEvent.emit("childVal");
    this.processUserSelection(event);
    this.element = null;
    this.canvasDiv.nativeElement.style.cursor = "default";
      console.log("finsihed.");
  } 
}

prepareSegmentMap(){
  //Empty the segment Map.
  this.pageWiseSegmentXYMap = new Map();
  //Iterate through pageWisePdfSegments list.
  this.pageWisePdfSegments.forEach(segObj => {
    //Calculate y1 (segment.y1*newyFactor*maxY)
    var segY1 = segObj.y1*this.newyFactor*this.maxY;
    //Calculate the next 10s digit.
    var segYCeil = Math.ceil(segY1);
    var segCalcYBucket = (segYCeil+9) - ((segYCeil+9)%10); //(n+9) - ((n+9)%10)
    //Get/Create the bucket for the 10s digit. (1st level map)
    var ySegmentMapObj: Map<number,PdfSegment[]> = null;
    if(this.pageWiseSegmentXYMap.has(segCalcYBucket)){ // Item exist. Get and hold for further processing.
      ySegmentMapObj = this.pageWiseSegmentXYMap.get(segCalcYBucket);
    }else{ //Item does not exist. Create new one.
      ySegmentMapObj = new Map();
      this.pageWiseSegmentXYMap.set(segCalcYBucket, ySegmentMapObj); // Add to original map.
    }

    //Calculate x1 (segment.x1*newxFactor*maxX)
    var segX1 = segObj.x1*this.newxFactor*this.maxX;
    //Calculate the next 10s digit.
    var segXCeil = Math.ceil(segX1);
    var segCalcXBucket = (segXCeil+9) - ((segXCeil+9)%10); //((segXCeil + 9) / 10) * 10;
    //Get/Create the bucket for the 10s digit. (1st level map)
    var segList: PdfSegment[] = null;
    if(ySegmentMapObj.has(segCalcXBucket)){ // Item exist. Get and hold for further processing.
      segList = ySegmentMapObj.get(segCalcXBucket);
    }else{ //Item does not exist. Create new one.
      segList = [];
      ySegmentMapObj.set(segCalcXBucket, segList); // Add to original map.
    }
    // Add to the segment list.
    segList.push(segObj);
  });
}

processUserSelection(event){
  //element object would be holding the current bounding box.
  var bboxY1 = parseInt(this.element.style.top.replaceAll("px","")) - this.yMarginForBoundingBox; //this.element.style.top;
  var bboxX1 = parseInt(this.element.style.left.replaceAll("px","")) - this.xMarginForBoundingBox; //this.element.style.left;
  var bboxY2 = parseInt(this.element.style.top.replaceAll("px","")) + parseInt(this.element.style.height.replaceAll("px","")) + this.yMarginForBoundingBox; //this.element.style.top + this.element.style.height;
  var bboxX2 = parseInt(this.element.style.left.replaceAll("px","")) + parseInt(this.element.style.width.replaceAll("px","")) + this.xMarginForBoundingBox;//this.element.style.left + this.element.style.width;

  console.log("Top::"+bboxY1+" ||| Left::"+bboxX1+" ||| Right::"+bboxX2+" ||| Bottom::"+bboxY2);
  //Iterate through pageWiseSegmentXYMap and get the process the qualifying elements.
  var exitMainLoop = false;

  for (let yKey of this.pageWiseSegmentXYMap.keys()) {
    if(exitMainLoop){
      break;
    }
   if(yKey>=bboxY1 && yKey<=bboxY2){
    var xSegmentMapObj = this.pageWiseSegmentXYMap.get(yKey);
    //Process identified segementYMap.
    for (let xKey of xSegmentMapObj.keys()) {
      if(xKey>=bboxX1 && xKey<=bboxX2){
        var segLst = xSegmentMapObj.get(xKey); //Identified the segment lists.
        //Process the segment list.
        segLst.forEach(segObj => {
          var segY1 = segObj.y1*this.newyFactor*this.maxY;
          var segX1 = segObj.x1*this.newxFactor*this.maxX;
          this.documentEle.getElementById('segment'+segObj.originalSegmentId).classList.add('highlight');//.style.backgroundColor = "#cad907";//.elementFromPoint(segX1,segY1).style.backgroundColor = "#cad907";
          alert("Identified Seg Text:: " + segObj.value);
        });
      }else if(xKey > bboxX2){
        break; // End of processing loop.
      }
    }
   }else if(yKey>bboxY2){
     exitMainLoop = true;
   }

  }

  //Show context menu.
 // this.showContextMenu(event, event.target);
}

addAnnotation($event: MouseEvent){
 console.log("add annotation called.."+ this.annotationJson.grpLst.length);
}

//Trial method..
/*showContextMenu($event: MouseEvent, item: any){
  this.contextMenuService.show.next({
    anchorElement: $event.target,
    // Optional - if unspecified, all context menu components will open
    contextMenu: this.basicMenu,
    event: <any>$event,
    item: item
  });
  $event.preventDefault();
  $event.stopPropagation();
}*/
}
