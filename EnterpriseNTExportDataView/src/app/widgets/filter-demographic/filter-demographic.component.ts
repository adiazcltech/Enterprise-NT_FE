import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DemographicItemService } from 'src/app/services/configuration/demographicItem/demographic-item.service';
import { DemographicsService } from 'src/app/services/configuration/demographics/demographics.service';
import { ListService } from 'src/app/services/configuration/list/list.service';
import { Demographic } from 'src/app/interfaces/configuration/demographic';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _ from 'lodash';

@Component({
  selector: 'app-filter-demographic',
  templateUrl: './filter-demographic.component.html',
  styleUrls: ['./filter-demographic.component.css']
})
export class FilterDemographicComponent implements OnInit,OnChanges {

  @Input() id: string;
  @Input() info: string;
  @Input() maxDemographics: number;
  @Input() type: string;
  @Input() demosmask: string;
  @Input() excludeTypeOrder: string;
  @Input() includeNotEncoded: string;
  @Input() jsonDemographics: any;

  @Output() finalJson = new EventEmitter<any>();

  demostatic = false;
  isAdd = false;
  numFilterDemographics = [];
  listdemographicAll = [];
  activeDemographic = [];
  filterDemographic = [];
  demotext = [];
  demoItem = [];
  demographic = [];
  all = [];
  firstValue = [];
  selected = [];
  encoded = [];
  listdemographicItems = [];
  listdemographicItemsApply = []

  form: FormGroup;
  token: string;
  demographicQuery: number;
  demographicItemQuery: number;
  numDemog = 0

  get demos() {
    return this.form.get('demos') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private demographicDS: DemographicsService,
    private authDS: AuthService,
    private demographicsItemDS: DemographicItemService,
    private listDS: ListService
  ) { }

  ngOnInit(): void {
    this.loadForm();
    this.maxDemographics = this.maxDemographics === undefined ? 0 : this.maxDemographics;
    this.login();
  }

  ngOnChanges() {
    if(this.form && this.demos) {
      this.clearItemsFormArray();
      if (this.jsonDemographics) {
        this.addFilterDemographic(true, 0);
      } 
    }
  }

  login() {
    const auth = atob(this.info);
    const jsonAuth = JSON.parse(auth);
    if(auth) {
      this.token = jsonAuth.authToken;
      this.loadDemos();
    } else {
      this.token = null;
    }
    // const auth = atob(this.info);
    // if (auth) {
    //   const jsonAuth = JSON.parse(auth);
    //   this.demographicQuery = jsonAuth.demographicQuery;
    //   this.demographicItemQuery = jsonAuth.demographicItemQuery;
    //   this.authDS.auth(jsonAuth).subscribe((resp: any) => {
    //     if (resp.success) {
    //       this.token = resp.token;
    //       this.loadDemos();
    //     } else {
    //       this.token = null;
    //     }
    //   }, error => {
    //     this.generateMessage('Error!', 'error', 'Autenticación fallida');
    //   });
    // }
  }

  loadForm() {
    this.form = this.fb.group({
      demos: this.fb.array([]),
    });
  }

  loadDemos() {
    if (this.demographicQuery !== 0 && this.demographicQuery !== null && this.demographicQuery !== undefined) {
      this.demostatic = true;
      this.demographicDS.getDemographicsALL(this.token).subscribe((resp: any) => {
        resp.forEach((value: any, key: any) => {
          switch (value.id) {
            case -1: resp[key].name = "Cliente".toUpperCase(); value.origin = "O"; break; //Cliente
            case -2: resp[key].name = "Médico".toUpperCase(); value.origin = "O"; break; //Médico
            case -3: resp[key].name = "Tarifa".toUpperCase(); value.origin = "O"; break; //Tarifa
            case -4: resp[key].name = "Tipo de orden".toUpperCase(); value.origin = "O"; break; //Tipo de orden
            case -166: resp[key].name = "Sede".toUpperCase(); value.origin = "O"; break; //Sede
            case -6: resp[key].name = "Servicio".toUpperCase(); value.origin = "O"; break; //Servicio
            case -7: resp[key].name = "Raza".toUpperCase(); value.origin = "H"; break; //Raza
            case -10: resp[key].name = "Tipo documento".toUpperCase(); value.origin = "H"; break; //Tipo de documento
            case -111: resp[key].name = "ORDEN HIS"; value.origin = "O"; break; //ORDEN HIS
            case -106: resp[key].name = "EMAIL"; value.origin = "H"; break; //EMAIL
            default: resp[key].name = (resp[key].name).toUpperCase();
          }
        });
        this.listdemographicAll[0] = resp;
        this.demographicsItemDS.getDemographicsItemsAll(this.token, 0, this.demographicQuery).subscribe((resp2: any) => {
          let demo = this.listdemographicAll[0].filter(e => e.id === this.demographicQuery);
          demo[0].disabled = true;
          // $scope.demographic = [{
          //   'demographic': demo[0].id,
          //   'demographicname': demo[0].name,
          //   'demographicItems': [this.permissionuser.demographicItemQuery],
          //   'value': '',
          //   'encoded': demo[0].encoded,
          //   'origin': demo[0].origin
          // }];
          this.numFilterDemographics.push({ 'id': 0, 'demographics': demo[0] });
          this.activeDemographic.push(true);
          this.filterDemographic.push(0);
          this.demotext.push(0);
          if (resp2.length > 0) {
            this.demoItem = resp2.find(e => e.demographicItem.id === this.demographicItemQuery);
          }
        }, error => {
          this.generateMessage('Error!', 'error', 'Error obteniendo los items de los demográficos');
        });
      }, error => {
        this.generateMessage('Error!', 'error', 'Error obteniendo los demográficos');
      });
    }
  }

  emitFinalJson() {
    const listDemos = this.form.value.demos.filter((d: any) => d.text !== "" || (d.valueIds !== null && d.valueIds.length > 0));
    if (listDemos.length > 0) {
      let finalDemos = [];
      let listDemosBD = [];
      listDemos.forEach((d: any) => {
        const findDemo = d.demographics.find((demo: any) => demo.id === d.value);
        if (findDemo) {
          if (d.encoded) {
            finalDemos.push({
              demographic: findDemo.id,
              demographicItems: d.valueIds,
              encoded: d.encoded,
              origin: findDemo.origin,
              value: ''
            });
          } else {
            finalDemos.push({
              demographic: findDemo.id,
              demographicItems: [],
              encoded: d.encoded,
              origin: findDemo.origin,
              value: d.text
            });
          }
          listDemosBD.push({
            demographic: findDemo.id,
            demographicItems: d.valueItems,
            value: d.text
          });
        }
      });
      this.finalJson.emit({
        demographics    : finalDemos,
        demographicsBD  : listDemosBD
      });
    } else {
      this.finalJson.emit({
        demographics: []
      });
    }
  }

  createDemo(index: number): FormGroup {
    return this.fb.group({
      id: [index, Validators.required],
      value: ['', Validators.required],
      demographics: [this.listdemographicAll[index]],
      items: [''],
      valueItems: [''],
      all: [false],
      valueIds: [''],
      encoded: [true],
      text: ['']
    });
  }

  clearItemsFormArray() {
    if(this.demos.length > 0) {
      this.demos.clear();
      this.emitFinalJson();
    }
  }

  removeFilterDemographic() {
    const demosLength = this.demos.length;
    if (demosLength > 0) {
      this.demos.removeAt(demosLength - 1);
      this.emitFinalJson();
    }
    this.isAdd = false;
  }

  addTagFn = (name: any, demo: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (name.name === '*') {
          demo.get('all').setValue(true);
          let itemsIds = demo.get('items').value.map((d: any) => d.id);
          demo.get('valueIds').setValue(itemsIds);
          demo.get('valueItems').setValue([{ id: 0, name: 'Todos' }])
        } else if (name === '-*' || name === '-+') {
          demo.get('all').setValue(false);
          demo.get('valueIds').setValue(null);
          demo.get('valueItems').setValue(null);
        }

        if (name.name === '*' || name === '-*' || name === '-+') {
          this.emitFinalJson();
          resolve(true);
        } else {
          resolve(true);
        }
      }, 200);
    })
  }

  async addFilterDemographic(filter:boolean, indexJson?: number) {
    this.isAdd = true;
    let index = this.demos.length;
    if (this.isAdd && (index < this.numDemog || this.numDemog === 0)) {
      if (index < this.maxDemographics || this.maxDemographics === 0) {
        this.getDemographicsALL(index).then(() => {
          const newDemo = this.createDemo(index);
          //Codificado
          newDemo.get('value').valueChanges.subscribe(value => {
            if (value) {
              let exists = this.demos.value.find(d => d.value === value);
              const item = this.demos.at(index);
              if (item) {
                const demo = item.get('demographics').value.find((d: any) => d.id === value);
                item.get('all').setValue(false);
                item.get('valueIds').setValue(null);
                item.get('valueItems').setValue(null);
                if (exists) {
                  this.generateMessage('Error!', 'error', 'El demográfico ya esta en la lista');
                  item.get('value').setValue(null);
                } else if (demo.encoded) {
                  item.get('encoded').setValue(true);
                  this.changeDemographicsItems(item, demo);
                } else {
                  item.get('encoded').setValue(false);
                }
              }
            }
          });
          // No Codificado
          newDemo.get('text').valueChanges.pipe(debounceTime(500)).subscribe((text) => {
            //Emitir al padre
            if (text) {
              this.emitFinalJson();
            }
          });
          this.demos.push(newDemo);
          if(filter && this.jsonDemographics && indexJson < this.jsonDemographics.length) {
            let demoFilter = this.jsonDemographics[indexJson];
            if(demoFilter) {
              newDemo.get('value').setValue(demoFilter.demographic);
              if(!newDemo.get('encoded').value) {
                newDemo.get('text').setValue(demoFilter.value);
              } else {

                const firtItem = demoFilter.demographicItems.find(e => e.id === 0);
                if(firtItem) {
                  this.addTagFn({ name:'*' }, newDemo);
                }

                setTimeout(() => {
                  const items = demoFilter.demographicItems.filter( (e:any) => e.id > 0);
                  if( items ) {
                    const actualValue = newDemo.get('valueItems').value;
                    actualValue ? newDemo.get('valueItems').setValue([...actualValue, ...items]) : newDemo.get('valueItems').setValue(items);
                    this.validTag(newDemo);
                  }
                }, 500);

              }
            }
            indexJson = indexJson + 1;
            if (indexJson < this.jsonDemographics.length) {
              this.addFilterDemographic(true, indexJson);
            }
          }
        });
      }
    }
    this.isAdd = false;
  }

  validTag(demo: any) {
    const all = demo.get('valueItems').value.find(e => e.id === 0);
    if (all) {
      demo.get('all').setValue(true);
      demo.get('valueItems').value.forEach((value: any) => {
        if (value.id > 0) {
          let index = demo.get('valueIds').value.indexOf(value.id);
          if (index > -1) {
            demo.get('valueIds').setValue(demo.get('valueIds').value.filter((_, i) => i !== index));
          }
        }
      });
    } else {
      const all = demo.get('valueItems').value.find(e => e.name === '*');
      if (!all) {
        demo.get('valueIds').setValue(demo.get('valueItems').value.map((e: any) => e.id));
      }
    }
    this.isAdd = false;
    this.emitFinalJson();
  }

  removeTag(item: any, demo: any) {
    if (item.id === 0) {
      demo.get('all').setValue(false);
      demo.get('valueIds').setValue(null);
      demo.get('valueItems').setValue(null);
    } else {
      const all = demo.get('valueItems').value.find(e => e.id === 0);
      if (all) {
        demo.get('valueIds').setValue([...demo.get('valueIds').value, item.id]);
        const items = demo.get('valueItems').value.filter(d => d.id !== item.id);
        demo.get('valueItems').setValue(items);
      } else {
        let index = demo.get('valueIds').value.indexOf(item.id);
        if (index > -1) {
          demo.get('valueIds').setValue(demo.get('valueIds').value.filter((_, i) => i !== index));
        }
        const items = demo.get('valueItems').value.filter(d => d.id !== item.id);
        demo.get('valueItems').setValue(items);
      }
    }
    this.emitFinalJson();
  }

  changeDemographicsItems(item: any, obj: any) {
    if (obj === null || obj === -100) return;
    let icon = '';
    switch (obj.id) {
      case -1: icon = 'copyright'; break;
      case -2: icon = 'assignment_ind'; break;
      case -3: icon = 'monetization_on'; break;
      case -4: icon = 'format_list_numbered'; break;
      case -166: icon = 'home'; break;
      case -6: icon = 'verified_user'; break;
      case -7: icon = 'hdr_strong'; break;
      case -104: icon = 'face'; break;
      default: icon = 'filter_non';
    }
    this.isAdd = true;
    if (obj.id === -104) {
      this.listDS.getList(this.token, 6).subscribe((resp: any) => {
        if (resp === undefined) resp = '';
        if (resp.length > 0) {
          let list = [];
          resp.forEach((value: any, key: any) => {
            if ((value.esCo).toUpperCase() !== 'AMBOS') {
              list.push({ 'id': value.id, 'name': value.esCo, 'icon': icon, 'v': '|' });
            }
          });
          item.get('items').setValue(list);
        }
      }, error => {
        this.generateMessage('Error!', 'error', 'Error cargando la lista');
      });
    } else {
      this.demographicsItemDS.getDemographicsItemsAll(this.token, 0, obj.id).subscribe(resp => {
        if (resp === undefined) resp = '';
        if (resp.length > 0) {
          let list = [];
          resp.forEach((value: any, key: any) => {
            list.push({ 'id': value.demographicItem.id, 'name': value.demographicItem.code + ' | ' + value.demographicItem.name, 'icon': icon, 'v': '|' });
          });
          item.get('items').setValue(list);
        }
      });
    }
  }

  getDemographicsALL(index: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.demographicDS.getDemographicsALL(this.token).subscribe(async (resp: Demographic[]) => {
        this.listdemographicAll[index] = [];
        this.numDemog = 0;
        if (this.type === 'H') {
          resp = _.filter(resp, (v) => { return v.origin === 'H' });
        }
        this.demosmask = this.demosmask === undefined ? '' : this.demosmask;
        if (this.demosmask.search('-104') === -1) {
          let demo1 = {
            "canCreateItemInOrder": false,
            "coded": false,
            "encoded": true,
            "id": -104,
            "items": [],
            "lastOrder": false,
            "modify": false,
            "name": "Sexo".toUpperCase(), //SEXO
            "origin": "H",
            "state": false,
            "statistics": false
          }
          resp.push(demo1);
        }
        if (this.demosmask.search('-110') === -1) {
          let demo1 = {
            "canCreateItemInOrder": false,
            "coded": false,
            "encoded": false,
            "format": "00.00.00",
            "id": -110,
            "items": [],
            "lastOrder": false,
            "modify": true,
            "name": "Edad".toUpperCase(), //Edad
            "origin": "H",
            "state": false,
            "statistics": false
          }
          resp.push(demo1);
        }
        if (this.demosmask.search('-100') === -1) {
          let demo1 = {
            "canCreateItemInOrder": false,
            "coded": false,
            "encoded": false,
            "id": -100,
            "items": [],
            "lastOrder": false,
            "modify": true,
            "name": "Historia".toUpperCase(), // historia
            "origin": "H",
            "state": false,
            "statistics": false
          }
          resp.push(demo1);
        }
        if (this.demosmask.search('-101') === -1) {
          let demo1 = {
            "canCreateItemInOrder": false,
            "coded": false,
            "encoded": false,
            "id": -101,
            "items": [],
            "lastOrder": false,
            "modify": true,
            "name": "Primer Apellido".toUpperCase(), // primer apellido
            "origin": "H",
            "state": false,
            "statistics": false
          }
          resp.push(demo1);
        }
        if (this.demosmask.search('-102') === -1) {
          let demo1 = {
            "canCreateItemInOrder": false,
            "coded": false,
            "encoded": false,
            "id": -102,
            "items": [],
            "lastOrder": false,
            "modify": true,
            "name": "Segundo Apellido".toUpperCase(), // segundo apellido
            "origin": "H",
            "state": false,
            "statistics": false
          }
          resp.push(demo1);
        }
        if (this.demosmask.search('-103') === -1) {
          let demo1 = {
            "canCreateItemInOrder": false,
            "coded": false,
            "encoded": false,
            "id": -103,
            "items": [],
            "lastOrder": false,
            "modify": true,
            "name": "Primer Nombre".toUpperCase(), // primer nombre
            "origin": "H",
            "state": false,
            "statistics": false
          }
          resp.push(demo1);
        }
        if (this.demosmask.search('-103') === -1) {
          let demo1 = {
            "canCreateItemInOrder": false,
            "coded": false,
            "encoded": false,
            "id": -109,
            "items": [],
            "lastOrder": false,
            "modify": true,
            "name": "Segundo Nombre".toUpperCase(), // segundo nombre
            "origin": "H",
            "state": false,
            "statistics": false
          }
          resp.push(demo1);
        }

        for (const [key, value] of Object.entries(resp)) {
          let typeOrder = this.excludeTypeOrder && value.id === -4;
          if (!typeOrder) {
            switch (value.id) {
              case -1: resp[key].name = "Cliente".toUpperCase(); value.origin = "O"; break; //Cliente
              case -2: resp[key].name = "Médico".toUpperCase(); value.origin = "O"; break; //Médico
              case -3: resp[key].name = "Tarifa".toUpperCase(); value.origin = "O"; break; //Tarifa
              case -4: resp[key].name = "Tipo de orden".toUpperCase(); value.origin = "O"; break; //Tipo de orden
              case -166: resp[key].name = "Sede".toUpperCase(); value.origin = "O"; break; //Sede
              case -6: resp[key].name = "Servicio".toUpperCase(); value.origin = "O"; break; //Servicio
              case -7: resp[key].name = "Raza".toUpperCase(); value.origin = "H"; break; //Raza
              case -10: resp[key].name = "Tipo de documento".toUpperCase(); value.origin = "H"; break; //Tipo de documento
              case -111: resp[key].name = "ORDEN HIS"; value.origin = "O"; break; //ORDEN HIS
              case -106: resp[key].name = "EMAIL"; value.origin = "H"; break; //EMAIL
              default: resp[key].name = (resp[key].name).toUpperCase();
            }
            if (value.id === -104 || value.id === -110 || value.id === -100 || value.id === -101 || value.id === -102 || value.id === -103 || value.id === -109) {
              if (value.id === -110) {
                this.listdemographicAll[index].push(
                  {
                    'id': value.id,
                    'name': value.name,
                    'encoded': value.encoded,
                    'origin': value.origin,
                    'operator': '2',
                    'unidAge': '1'
                  });
              } else {
                this.listdemographicAll[index].push({ 'id': value.id, 'name': value.name, 'encoded': value.encoded, 'origin': value.origin });
              }
              this.numDemog++;
            } else {
              let notEncodedAndEncoded = this.includeNotEncoded ? true : value.encoded;
              if (notEncodedAndEncoded) {
                if (value.encoded) {
                  await new Promise((resolve, reject) => {
                    this.demographicsItemDS.getDemographicsItemsAll(this.token, 0, value.id).subscribe(resp2 => {
                      if (resp2 !== null && resp2 !== undefined && resp2.length > 0) {
                        this.listdemographicAll[index].push({ 'id': value.id, 'name': value.name, 'encoded': value.encoded, 'origin': value.origin });
                      }
                      resolve(true);
                    });
                  });
                } else {
                  this.listdemographicAll[index].push({ 'id': value.id, 'name': value.name, 'encoded': value.encoded, 'origin': value.origin });
                }
              }
              if (value.encoded) {
                this.numDemog++;
              }
            }
          }
        }
        resolve();
      }, error => {
        this.generateMessage('Error!', 'error', 'Error obteniendo los demográficos');
      });
    });
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
