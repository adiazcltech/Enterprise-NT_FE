import { Component } from '@angular/core';
import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.blockly.editor';
import 'stimulsoft-reports-js/Css/stimulsoft.designer.office2013.whiteblue.css';
import 'stimulsoft-reports-js/Css/stimulsoft.viewer.office2013.whiteblue.css';
import { environment } from 'src/environments/environment';
import * as JSLZString from 'lz-string';

@Component({
  selector: 'app-viewer',
  template: `<div>
            <div id="viewerContent"></div>
            </div>`,
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {

  keyStimulsoft: string;
  parameters:any = {};
  data:any = {};
  labels:any = {};

  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);

  ngOnInit() {
    this.keyStimulsoft = environment.keyStimulsoft;

    let data = JSLZString.decompressFromUTF16(sessionStorage.getItem("dataReport"));
    let parametersReport = sessionStorage.getItem("parameterReport");

	 	this.data = JSON.parse(data);
		this.parameters = JSON.parse(parametersReport);

		this.labels = JSON.parse(this.parameters.labelsreport);

    this.options.height = '100%';
    this.options.appearance.scrollbarsMode = true;
    this.options.toolbar.showDesignButton = false;
    this.options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
    this.options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;

    this.parameters.variables.entity = sessionStorage.getItem("Entidad");
    this.parameters.variables.abbreviation = sessionStorage.getItem("Abreviatura");

    this.loadReport();
  }

  loadReport() {

    Stimulsoft.Base.StiLicense.key = this.keyStimulsoft;
    const report = Stimulsoft.Report.StiReport.createNewReport();

    report.loadFile(this.parameters.pathreport);

    report.dictionary.databases.clear();
    let jsonData:any = {}

    if(this.parameters.variables.reportOrder === true){
      jsonData = { 'order'  :  this.data ,'Labels' : [ this.labels ], 'Variables': [this.parameters.variables]};
    }
    else{
      jsonData = { 'data'  : [ this.data ],'Labels' : [ this.labels ], 'variables': [this.parameters.variables]};
    }

    const dataSet = new Stimulsoft.System.Data.DataSet();
    dataSet.readJson(jsonData);

    report.dictionary.databases.clear();
    report.regData('Demo', 'Demo', dataSet);

    this.options.appearance.fullScreenMode = true;
    this.options.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;

    this.viewer.report = report;
    this.viewer.renderHtml('viewerContent');
  }

}
