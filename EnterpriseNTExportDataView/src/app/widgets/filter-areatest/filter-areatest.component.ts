import { Component, Input, OnInit, Output, EventEmitter, OnChanges, ChangeDetectorRef  } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AreaService } from 'src/app/services/configuration/area/area.service';
import { TestService } from 'src/app/services/configuration/test/test.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { WorksheetService } from 'src/app/services/configuration/worksheet/worksheet.service';

@Component({
  selector: 'app-filter-areatest',
  templateUrl: './filter-areatest.component.html',
  styleUrls: ['./filter-areatest.component.css']
})
export class FilterAreatestComponent implements OnInit, OnChanges  {

  @Input() id: string;
  @Input() confidential: string;
  @Input() resultsentry: boolean;
  @Input() numlist: number;
  @Input() listtests: any;
  @Input() listareas: any;
  @Input() listWorkSheets: any;
  @Input() inviewarea: boolean;
  @Input() onlyareas: boolean;
  @Input() info: string;
  @Input() state: number;
  @Input() filter: number;
  @Input() jsonAreaTest: any;

  @Output() finalJson = new EventEmitter<any>();

  token: string;
  numFilterAreaTest = 0;
  typeFilter = '0';
  placeholder:string;

  dataAreaTest = [];
  filterAreaTests = [];
  ListAreas = [];
  ListTest = [];
  ListTestConfidential = [];
  ListWorkSheets = [];
  Listgroups = [];
  alltest = [];
  listworksheets = [];

  firstValue = false;

  constructor(
    private authDS: AuthService,
    private areaDS: AreaService,
    private testService: TestService,
    private worksheetDS: WorksheetService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.login();
  }

  ngOnChanges() {
    if (this.filter) {
      this.typeFilter = String(this.filter);
    
      this.clickfilterByAreaTest(this.filter);
      
    } else {
      this.typeFilter = '0';
      this.clickfilterByAreaTest(0);
    }

    if (this.jsonAreaTest) {
      const firtItem = this.jsonAreaTest.find(e => e.id === 0);
      if(firtItem) {
        this.addTagFn('*');
        setTimeout(() => {
          this.filterAreaTests = [firtItem];
          this.cdr.detectChanges();
          this.validTag();
        }, 500);
      }

      setTimeout(() => {
        const items = this.jsonAreaTest.filter( (e:any) => e.id > 0);
        if( items ) {
          this.filterAreaTests = [...this.filterAreaTests, ...items];
          this.cdr.detectChanges();
          this.validTag();
        }
      }, 500);

    }
  }

  addTagFn = (name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (name === '*') {
          if (!this.filterAreaTests.find(e => e.id === 0)) {
            this.filterAreaTests = [];
            this.firstValue = true;
            setTimeout(() => {
              this.listtests = [];
              this.listareas = [];
              this.listWorkSheets = [];
              if (this.numFilterAreaTest === 1) {
                this.dataAreaTest.forEach((value: any) => {
                  this.listareas.push(value.id);
                });
                this.numlist = this.listareas.length;
                this.listtests = [];
                this.listWorkSheets = [];
              }
              else if (this.numFilterAreaTest === 4) {
                this.dataAreaTest.forEach((value: any) => {
                  this.listWorkSheets.push(value.id);
                });
                this.numlist = this.listWorkSheets.length;
                this.listtests = [];
                this.listareas = [];
              } else if (this.numFilterAreaTest === 5) {
                this.alltest = JSON.parse(JSON.stringify(this.Listgroups));
                this.dataAreaTest.forEach((value: any) => {
                  this.listtests = _.uniq(_.concat(this.listtests, value.test))
                });
                this.numlist = this.listtests.length;
                this.listareas = [];
                this.listWorkSheets = [];
              } else {
                this.dataAreaTest.forEach((value: any) => {
                  if (value.id !== undefined) {
                    this.listtests.push(value.id);
                  }
                });
                this.numlist = this.listtests.length;
                this.listareas = [];
                this.listWorkSheets = [];
              }
              resolve({ id: 0, name: 'Todos', tag: true });
            }, 100);
          }
        } else if (name === '-*' || name === '-+') {
          setTimeout(() => {
            this.listtests = [];
            this.listareas = [];
            this.listWorkSheets = [];
            this.filterAreaTests = [];
            this.numlist = 0;
            this.firstValue = false;
          }, 100);
        }
      }, 200);
    })
  }

  removeTag(item:any) {
    if(item.id === 0) {
      this.listtests = [];
      this.listareas = [];
      this.listWorkSheets = [];
      this.filterAreaTests = [];
      this.firstValue = false;
      this.numlist = 0;
    } else {
      this.filterAreaTests = this.filterAreaTests.filter(e => e.id !== item.id);
      const firstValue = this.filterAreaTests.find(e => e.id === 0);
      if (firstValue) {
        if (this.numFilterAreaTest === 1) {
          this.listareas.push(item.id);
          this.numlist = this.listareas.length;
          this.listtests = [];
          this.listWorkSheets = [];
        } else if (this.numFilterAreaTest === 4) {
          this.listWorkSheets.push(item.id);
          this.numlist = this.listWorkSheets.length;
          this.listtests = [];
          this.listareas = [];
        } if (this.numFilterAreaTest === 5) {
          this.alltest.push(item);
          this.listtests = _.uniq(_.concat(this.listtests, item.test));
          this.numlist = this.filterAreaTests.length;
          this.listareas = [];
          this.listWorkSheets = [];
        } else {
          this.listtests.push(item.id);
          this.numlist = this.listtests.length;
          this.listareas = [];
          this.listWorkSheets = [];
        }
      } else {
        if (this.numFilterAreaTest === 1) {
          let index = this.listareas.findIndex( i => i.id === item.id);
          if (index > -1) this.listareas.splice(index, 1);
          this.numlist = this.listareas.length;
        }
        else if (this.numFilterAreaTest === 4) {
          let index = this.listWorkSheets.findIndex( i => i.id === item.id);
          if (index > -1) this.listWorkSheets.splice(index, 1);
          this.numlist = this.listWorkSheets.length;
        } else if (this.numFilterAreaTest === 5) {
          this.listtests = [];
          this.filterAreaTests.forEach((value) => {
            this.listtests = _.uniq(_.concat(this.listtests, value.test))
          });
          this.numlist = this.filterAreaTests.length;
        } else {
          let index = this.listtests.findIndex( i => i.id === item.id);
          if (index > -1) this.listtests.splice(index, 1);
          this.numlist = this.listtests.length;
        }
      }
    }
    if(this.state === undefined) {
      const finalAreas = [];
      this.listareas.forEach((value) => {
        finalAreas.push(value);
      });
      const finalWorksheets = [];
      this.listWorkSheets.forEach((value) => {
        finalWorksheets.push(value);
      });
      const finalTests = [];
      this.listtests.forEach((value) => {
        if (value !== undefined) {
          if(typeof value === 'object') {
            finalTests.push(value.id);
          } else {
            finalTests.push(value)
          }
        }
      });
      this.finalJson.emit({
        finalAreas,
        finalWorksheets,
        finalTests,
        filterAreaTest: this.filterAreaTests,
        filter: this.numFilterAreaTest
      });
    }
  }

  validTag() {
    const firstValue = this.filterAreaTests.find(e => e.id === 0);
    if (firstValue) {
      if (this.numFilterAreaTest === 1) {
        this.filterAreaTests.forEach((value) => {
          if (value.id > 0) {
            let index = this.listareas.indexOf(value.id);
            if (index > -1) {
              this.listareas.splice(index, 1);
            }
          }
        });
        this.numlist = this.listareas.length;
        this.listtests = [];
        this.listWorkSheets = [];
      } else if (this.numFilterAreaTest === 4) {
        this.filterAreaTests.forEach((value) => {
          if (value.id > 0) {
            let index = this.listWorkSheets.indexOf(value.id);
            if (index > -1) this.listWorkSheets.splice(index, 1);
          }
        });
        this.numlist = this.listWorkSheets.length;
        this.listtests = [];
        this.listareas = [];
      } else if (this.numFilterAreaTest === 5) {
        this.listtests = [];
        this.filterAreaTests.forEach((value) => {
          if (value.id > 0) {
            this.alltest = _.remove(this.alltest, (n: any) => {
              return n.id != value.id;
            });
          }
        });
        this.alltest.forEach((value) => {
          this.listtests = _.uniq(_.concat(this.listtests, value.test))
        });
        this.numlist = this.alltest.length;
        this.listareas = [];
        this.listWorkSheets = [];
      } else {
        this.filterAreaTests.forEach((value) => {
          if (value.id > 0) {
            let index = this.listtests.indexOf(value.id);
            if (index > -1) this.listtests.splice(index, 1);
          }
        });
        this.numlist = this.listtests.length;
        this.listareas = [];
        this.listWorkSheets = [];
      }
    } else {
      if (this.dataAreaTest.length <= this.listareas.length) {
        this.listareas = [];
        this.numlist = this.listareas.length;
      }
      if (this.dataAreaTest.length <= this.listtests.length) {
        this.listtests = [];
        this.numlist = this.listtests.length;
      }
      if (this.dataAreaTest.length <= this.listWorkSheets.length) {
        this.listWorkSheets = [];
        this.numlist = this.listWorkSheets.length;
      }
      if (this.numFilterAreaTest === 1) {
        this.listareas = this.filterAreaTests.filter(e => e.id > 0);
        this.numlist = this.listareas.length;
        this.listtests = [];
        this.listWorkSheets = [];
      } else if (this.numFilterAreaTest === 4) {
        this.listWorkSheets = this.filterAreaTests.filter(e => e.id > 0);
        this.numlist = this.listWorkSheets.length;
        this.listtests = [];
        this.listareas = [];
      } else if (this.numFilterAreaTest === 5) {
        this.listtests = [];
        this.filterAreaTests.forEach((value) => {
          this.listtests = _.uniq(_.concat(this.listtests, value.test))
        });
        this.numlist = this.filterAreaTests.length;
        this.listareas = [];
        this.listWorkSheets = [];
      } else {
        this.listtests = this.filterAreaTests.filter(e => e.id > 0);
        this.numlist = this.listtests.length;
        this.listareas = [];
        this.listWorkSheets = [];
      }
    }

    if(this.state === undefined) {
      const finalAreas = [];
      this.listareas.forEach((value) => {
        finalAreas.push(value);
      });
      const finalWorksheets = [];
      this.listWorkSheets.forEach((value) => {
        finalWorksheets.push(value);
      });
      const finalTests = [];
      this.listtests.forEach((value) => {
        if (value !== undefined) {
          if(typeof value === 'object') {
            finalTests.push(value.id);
          } else {
            finalTests.push(value)
          }
        }
      });
      this.finalJson.emit({
        finalAreas,
        finalWorksheets,
        finalTests,
        filterAreaTest: this.filterAreaTests,
        filter: this.numFilterAreaTest
      });
    }
  }

  login() {
    const auth = atob(this.info);
    const jsonAuth = JSON.parse(auth);
    if(auth) {
      this.token = jsonAuth.authToken;
      this.getArea();
      this.getTest();
      this.groups();
      this.getTestConfidential();
      this.getWorkSheets();
    } else {
      this.token = null;
    }
  }

  getWorkSheets() {
    this.ListWorkSheets = [];
    this.worksheetDS.getWorkSheet(this.token).subscribe((resp: any) => {
      resp.forEach((value: any) => {
        this.ListWorkSheets.push({
          id: value.id,
          name: value.name,
          icon: 'assignment', 'v': '|'
        });
      });
    }, error => {
      this.generateMessage('Error!', 'error', 'Error obteniendo las áreas');
    });
  }

  getTestConfidential() {
    this.ListTestConfidential = [];
    this.testService.getTestConfidential(this.token).subscribe((resp: any) => {
      resp.forEach((value: any) => {
        this.ListTestConfidential.push({
          id: value.id,
          code: value.code,
          name: value.code + ' | ' + value.name,
          icon: 'remove_circle', 'v': '|'
        });
      });
    }, error => {
      this.generateMessage('Error!', 'error', 'Error obteniendo las áreas');
    });

  }

  groups() {
    this.Listgroups = [];
    this.testService.getgroups(this.token).subscribe((resp: any) => {
      resp = _.groupBy(resp, 'id');
      for (var propiedad in resp) {
        var test = _.map(resp[propiedad], 'idTest');
        this.Listgroups.push({
          'id': resp[propiedad][0].id,
          'code': resp[propiedad][0].code,
          'name': resp[propiedad][0].code + ' | ' + resp[propiedad][0].name,
          'icon': 'assignment',
          'v': '|',
          'test': test
        });
      }
    }, error => {
      this.generateMessage('Error!', 'error', 'Error obteniendo las áreas');
    });
  }

  getTest() {
    this.ListTest = [];
    this.testService.getTestArea(this.token, 3, 1, 0).subscribe((resp: any) => {
      resp.forEach((value: any) => {
        if (!value.confidential) {
          this.ListTest.push({
            id: value.id,
            code: value.code,
            name: value.code + ' | ' + value.name,
            icon: 'assignment', 'v': '|'
          });
        }
      });
    }, error => {
      this.generateMessage('Error!', 'error', 'Error obteniendo las áreas');
    });
  }

  getArea() {
    this.ListAreas = [];
    this.areaDS.get(this.token).subscribe((resp: any) => {
      resp.splice(0, 1);
      resp.forEach((value: any) => {
        this.ListAreas.push({
          id: value.id,
          code: value.ordering,
          name: value.ordering + ' | ' + value.name,
          icon: 'font_download', 'v': '|'
        });
      });
    }, error => {
      this.generateMessage('Error!', 'error', 'Error obteniendo las áreas');
    });
  }

  clickfilterByAreaTest(filter: number) {
    if (this.confidential && filter === 3) {
      return true;
    }
    this.numFilterAreaTest = filter;
    if (this.resultsentry === true && this.numFilterAreaTest === 0) {
      this.numFilterAreaTest = filter;
    } else if (!this.resultsentry || this.resultsentry === undefined) {
      this.numFilterAreaTest = filter;
    }
    this.firstValue = false;
    this.numlist = filter === 0 ? 1 : 0;
    this.listtests = [];
    this.dataAreaTest = [];
    this.filterAreaTests = [];
    this.listareas = [];
    this.listtests = [];
    this.listWorkSheets = [];
    switch (filter) {
      case 1: this.dataAreaTest = this.ListAreas; this.placeholder = "Seleccione las áreas"; break;
      case 2: this.dataAreaTest = this.ListTest; this.placeholder = "Seleccione las pruebas";break;
      case 3: this.dataAreaTest = this.ListTestConfidential; this.placeholder = "Seleccione las pruebas";break;
      case 4: this.dataAreaTest = this.ListWorkSheets; this.placeholder = "Seleccione las hojas de trabajo";break;
      case 5: this.dataAreaTest = this.Listgroups; this.placeholder = "Seleccione los grupos";break;
      default: this.dataAreaTest = []; break;
    }
    if(filter === 0) {
      const finalAreas = [];
      const finalWorksheets = [];
      const finalTests = [];
      this.finalJson.emit({
        finalAreas,
        finalWorksheets,
        finalTests,
        filterAreaTest: this.filterAreaTests,
        filter: this.numFilterAreaTest
      });
    }
  }

  generateMessage(title, type, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: type,
      confirmButtonText: 'Ok'
    })
  }


}
