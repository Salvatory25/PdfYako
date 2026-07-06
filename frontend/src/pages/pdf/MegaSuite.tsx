import React from 'react';
import { 
  FileText, RotateCw, RefreshCw, Globe, Maximize, Hash, 
  FileSearch, FileCheck
} from 'lucide-react';
import GenericTool from '../../components/GenericTool';

export const ScanToPdf = () => <GenericTool title="Scan to PDF" description="Convert images to PDF." icon={Maximize} colorClass="bg-indigo-600" apiEndpoint="/pdf/jpg-to-pdf" accept="image/*" maxFiles={20} />;
export const PageNumbers = () => <GenericTool title="Page Numbers" description="Add page numbers to your PDF." icon={Hash} colorClass="bg-pink-600" apiEndpoint="/pdf/page-numbers" />;

export const PdfToWord = () => <GenericTool title="PDF to Word" description="Convert PDF to Word document (.docx)." icon={FileText} colorClass="bg-blue-600" apiEndpoint="/pdf/pdf-to-word" />;
export const PdfToExcel = () => <GenericTool title="PDF to Excel" description="Convert PDF to Excel spreadsheet (.csv)." icon={FileText} colorClass="bg-emerald-600" apiEndpoint="/pdf/pdf-to-excel" />;
export const PdfToHtml = () => <GenericTool title="PDF to HTML" description="Convert PDF to HTML." icon={Globe} colorClass="bg-slate-700" apiEndpoint="/pdf/pdf-to-html" />;
