export class PdfSegment
{
    _id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    segmentId: number;
    maxHeight: number;
    maxWidth: number;
    maxPageHeight: number;
    maxPageWidth: number;
    fontsize: number;
    fileName: string;
    value: string;
    pageNo: number;
    rotation: string;
    font: string;
    index: string;
    documentId: number;
    isHighlighted: boolean;
    highLightColor: string;
    groupTags: string[];
    tableTags: string[];
    originalSegmentId: number;
    sentenceId: number;
    customizedSegment: boolean;
}