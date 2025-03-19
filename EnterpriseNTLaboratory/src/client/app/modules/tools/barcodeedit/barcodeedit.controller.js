/* jshint ignore:start */
(function () {
  "use strict";
  angular
    .module("app.barcodeedit")
    .filter("trust", [
      "$sce",
      function ($sce) {
        return function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
        };
      },
    ])
    .controller("barcodeeditController", barcodeeditController);
  barcodeeditController.$inject = [
    "localStorageService",
    "logger",
    "$filter",
    "$rootScope",
    "$scope",
    "demographicDS",
    "barcodeDS",
    "demographicsItemDS",
  ];

  function barcodeeditController(
    localStorageService,
    logger,
    $filter,
    $rootScope,
    $scope,
    demographicDS,
    barcodeDS,
    demographicsItemDS
  ) {
    var vm = this;
    vm.title = "barcodeedit";
    vm.init = init;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0935");
    $rootScope.helpReference = "06.Tools/barcodeedit.htm";

    vm.getBarcode = getBarcode;
    vm.editBarcode = editBarcode;
    vm.newBarcode = newBarcode;
    vm.insertBarcode = insertBarcode;
    vm.updateBarcode = updateBarcode;
    vm.saveBarcode = saveBarcode;
    vm.changebarcodepreview = changebarcodepreview;
    vm.closemodal = closemodal;
    vm.itemdemo = null;

    vm.listbarcode = [];
    vm.listbarcodeadicional = [];
    vm.convertHTML = convertHTML;
    $rootScope.pageview = 1;
    vm.rotateElement = rotateElement;
    vm.removeElement = removeElement;
    vm.changeFont = changeFont;
    vm.changeTicket = changeTicket;
    vm.changeSizeBarcode = changeSizeBarcode;
    vm.addElement = addElement;
    vm.getDemographics = getDemographics;
    vm.changeText = changeText;
    vm.changeReverse = changeReverse;
    vm.changeTypeBarcode = changeTypeBarcode;
    vm.changewidthbarcode = changewidthbarcode;
    vm.managedocumenttype =
      localStorageService.get("ManejoTipoDocumento") === "True";
    vm.beforeChangeBarcode = beforeChangeBarcode;
    vm.modalconfirmpreviebarcode = UIkit.modal("#modalconfirmpreviebarcode", {
      modal: false,
      bgclose: false,
      escclose: false,
      keyboard: true,
    });

    vm.itemSelect = null;

    var xInic, yInic;
    var estaPulsado = false;
    vm.position = 0;
    vm.countElement = 0;

    vm.options = { expandOnClick: true };
    vm.listdemo = [
      {
        id: null,
        name: "-- " + $filter("translate")("0162") + " --",
      },
    ];
    vm.itemdemo = null;
    vm.demoitems = [
      {
        id: null,
        name: "-- " + $filter("translate")("0162") + " --",
      },
    ];
    vm.itemsselect = null;

    $scope.$on("selection-changed", function (e, node) {
      if (node.parentId !== undefined) {
        vm.addElement(node);
      }
    });

    function closemodal() {
      vm.prueba = true;
      vm.itemSelect = null;
      UIkit.modal("#editbarcode").hide();
    }

    function getBarcode(typebarcodepreview) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return barcodeDS.getBarcode(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            //barcode.print
            if (typebarcodepreview === undefined || typebarcodepreview === 1) {
              vm.listbarcode = $filter("filter")(data.data, { type: "1" });
              vm.listbarcode = _.orderBy(
                vm.listbarcode,
                ["id"],
                ["asc", "desc"]
              );
            }
            if (typebarcodepreview === undefined || typebarcodepreview === 2) {
              vm.listbarcodeadicional = $filter("filter")(data.data, {
                type: "2",
              });
              vm.listbarcodeadicional = _.orderBy(
                vm.listbarcodeadicional,
                ["id"],
                ["asc", "desc"]
              );
            }

            if (typebarcodepreview === undefined || typebarcodepreview === 3) {
              vm.listbarcodepatient = $filter("filter")(data.data, {
                type: "3",
              });
              vm.listbarcodepatient = _.orderBy(
                vm.listbarcodepatient,
                ["id"],
                ["asc", "desc"]
              );
            }

            if (typebarcodepreview === undefined || typebarcodepreview === 4) {
              vm.listbarcoderack = $filter("filter")(data.data, { type: "4" });
              vm.listbarcoderack = _.orderBy(
                vm.listbarcoderack,
                ["id"],
                ["asc", "desc"]
              );
            }

            vm.prueba = true;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function editBarcode(barcode) {
      vm.selectbarcode = barcode;
      vm.typeelement = "";
      vm.prueba = false;
      vm.typeTransaction = "E";
      vm.selectitem =
        vm.selectbarcode.orderType === null
          ? null
          : parseInt(vm.selectbarcode.orderType);
      var element = document.getElementById("contentBarcode");
      element.innerHTML = barcode.template;
      var listelement = element.children[0].children;
      vm.countElement = listelement.length;
      for (var i = 0; i < listelement.length; i++) {
        listelement[i].addEventListener("click", function () {
          if (vm.itemSelect.id === this.id && this.classList.length === 2) {
            vm.itemSelect = null;
            this.setAttribute("class", "estiloCuadro");
          } else if (
            this.classList.length === 1 ||
            vm.itemSelect.id !== this.id
          ) {
            var x = document.getElementsByClassName("estiloCuadroSeleccionado");
            if (x.length > 0) {
              x[0].setAttribute("class", "estiloCuadro");
            }

            vm.itemSelect = this;
            this.setAttribute("class", "estiloCuadro estiloCuadroSeleccionado");
          } else {
            vm.itemSelect = null;
            this.setAttribute("class", "estiloCuadro");
          }
        });
        listelement[i].addEventListener("mousedown", ratonPulsado, false);
        listelement[i].addEventListener("mouseup", ratonSoltado, false);
        document.addEventListener("mousemove", ratonMovido, false);
      }
      setTimeout(function () {
        var generalelement = document.getElementById("generalContent");
        vm.ticketsize = generalelement.getAttribute("data-ticketsize");

        var size = JSON.parse(vm.ticketsize);

        generalelement.style.height = size[1] + "cm";
        generalelement.style.width = size[0] + "cm";
      }, 500);

      UIkit.modal("#editbarcode", { bgclose: false, keyboard: false }).show();
    }

    function newBarcode(type) {
      vm.prueba = false;
      vm.ticketsize = null;
      vm.typeTransaction = "N";
      vm.selectbarcode = {
        id: null,
        template: "",
        command: "",
        type: type,
        version:
          type === "4"
            ? vm.listbarcoderack.length + 1
            : type === "3"
            ? vm.listbarcodepatient.length + 1
            : type === "2"
            ? vm.listbarcodeadicional.length + 1
            : vm.listbarcode.length + 1,
        active:
          type === "4" && vm.listbarcoderack.length === 0
            ? true
            : type === "3" && vm.listbarcodepatient.length === 0
            ? true
            : type === "2" && vm.listbarcodeadicional.length === 0
            ? true
            : vm.listbarcode.length === 0
            ? true
            : false,
      };

      vm.itemdemo = null;
      vm.itemsselect = null;
      var element = document.getElementById("contentBarcode");
      element.innerHTML =
        '<div id="generalContent" style="background-color: white; border: 1px solid #80808063;padding: 0px"> </div>';
      UIkit.modal("#editbarcode", { bgclose: false, keyboard: false }).show();
    }

    function saveBarcode(type) {
      if (document.getElementById("generalContent").children.length === 0) {
        logger.warning($filter("translate")("0967"));
      } else {
        vm.convertHTML();
        var x = document.getElementsByClassName("estiloCuadroSeleccionado");
        if (x.length > 0) {
          x[0].setAttribute("class", "estiloCuadro");
        }
        vm.itemSelect = null;

        if (vm.selectbarcode.id === null) {
          vm.selectbarcode.version =
            parseInt(vm.selectbarcode.type) === 4
              ? vm.listbarcoderack.length + 1
              : vm.selectbarcode.type === 3
              ? vm.listbarcodepatient.length + 1
              : vm.selectbarcode.type === 2
              ? vm.listbarcodeadicional.length + 1
              : vm.listbarcode.length + 1;
          vm.insertBarcode();
        } else {
          vm.updateBarcode();
        }
      }
    }

    function updateBarcode() {
      vm.selectbarcode.template =
        document.getElementById("contentBarcode").innerHTML;
      vm.selectbarcode.orderType = vm.itemsselect;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return barcodeDS.updateBarcode(auth.authToken, vm.selectbarcode).then(
        function (data) {
          if (data.status === 200) {
            logger.success($filter("translate")("0149"));
            UIkit.modal("#editbarcode").hide();
            vm.prueba = true;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function insertBarcode() {
      vm.selectbarcode.template =
        document.getElementById("contentBarcode").innerHTML;
      vm.selectbarcode.orderType = vm.itemsselect;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return barcodeDS.insertBarcode(auth.authToken, vm.selectbarcode).then(
        function (data) {
          if (data.status === 200) {
            vm.getBarcode();
            logger.success($filter("translate")("0149"));
            UIkit.modal("#editbarcode").hide();
            vm.prueba = true;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function changebarcodepreview() {
      vm.barcodeselectespreview = [];
      switch (vm.typebarcodepreview) {
        case 1:
          vm.barcodeselectespreview = _.filter(vm.listbarcode, function (o) {
            return o.active && o.id !== vm.barcodepreview.id;
          });
          break;
        case 2:
          vm.barcodeselectespreview = _.filter(
            vm.listbarcodeadicional,
            function (o) {
              return o.active && o.id !== vm.barcodepreview.id;
            }
          );
          break;
        case 3:
          vm.barcodeselectespreview = _.filter(
            vm.listbarcodepatient,
            function (o) {
              return o.active && o.id !== vm.barcodepreview.id;
            }
          );
          break;
        case 4:
          vm.barcodeselectespreview = _.filter(
            vm.listbarcoderack,
            function (o) {
              return o.active && o.id !== vm.barcodepreview.id;
            }
          );
          break;
      }
      if (vm.barcodeselectespreview.length > 0) {
        vm.barcodeselectespreview[0].active = false;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return barcodeDS
          .updateBarcode(auth.authToken, vm.barcodeselectespreview[0])
          .then(
            function (data) {
              vm.barcodepreview.active = true;
              var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
              return barcodeDS
                .updateBarcode(auth.authToken, vm.barcodepreview)
                .then(
                  function (data) {
                    if (data.status === 200) {
                      vm.getBarcode();
                      UIkit.modal("#modalconfirmpreviebarcode").hide();
                      logger.success($filter("translate")("0149"));
                    }
                  },
                  function (error) {
                    vm.modalError(error);
                  }
                );
            },
            function (error) {
              vm.modalError(error);
            }
          );
      }
    }

    function beforeChangeBarcode(barcode, type) {
      vm.msgQuestion = !barcode.active
        ? $filter("translate")("1086").replace("##", barcode.version)
        : $filter("translate")("1087").replace("##", barcode.version);
      vm.barcodepreview = barcode;
      vm.typebarcodepreview = type;
      if (type === 1 && !barcode.active) {
        vm.modalconfirmpreviebarcode.show();
      }
    }

    function convertHTML() {
      var zebra = "\n\r\nN\n\r\n\r";
      var countTest = 0;
      var countListTest = 0;
      var listelement = document.getElementById("generalContent").children;
      for (var i = 0; i < listelement.length; ++i) {
        var elementtype = listelement[i].id.split("}")[0];
        var elementtype = elementtype.replace("demo_ ", "demo_") + "}";
        var p8 = "";

        var command =
          elementtype === "{barcode}" || elementtype === "{barcodeText}"
            ? "B"
            : "A";

        var p3 = listelement[i].getAttribute("data-rotate");
        var p1 = parseInt((listelement[i].offsetLeft * 25.4) / 12.7);
        var p2 = parseInt((listelement[i].offsetTop * 25.4) / 12.7);

        if (command === "A") {
          var p4 = parseInt(listelement[i].getAttribute("data-fontsize"));
          var p5 = "1";
          var p6 = "1";
          var p7 = listelement[i].getAttribute("data-reverse");
        } else {
          var p4 = parseInt(
            listelement[i].firstChild.getAttribute("data-typebarcode")
          );
          var p5 = parseInt(
            listelement[i].firstChild.getAttribute("data-widthbarcode")
          );
          var p6 = "7";
          var p7 = parseInt(
            listelement[i].firstChild.getAttribute("data-heightbarcode")
          );
          p8 = elementtype === "{barcode}" ? "N," : "B,";
        }

        if (elementtype === "{text}") {
          var data = '"' + listelement[i].getAttribute("data-text") + '"';
        } else if (elementtype === '{t}') {
          var data = '\"{t' + countListTest + '}\"' ;
          //var data = '\"{test}\"' ;
          countListTest++;
        } else if (elementtype === "{test}") {
          if (countTest === 0) {
            var data = '"' + elementtype + '"';
            countTest++;
          } else {
            var data = '"{test1}"';
          }
        } else {
          var data = '"' + elementtype + '"';
        }
        zebra =
          zebra +
          command +
          p1 +
          "," +
          p2 +
          "," +
          p3 +
          "," +
          p4 +
          "," +
          p5 +
          "," +
          p6 +
          "," +
          p7 +
          "," +
          p8 +
          data +
          "\n\r\n\n\r\n";
      }
      vm.selectbarcode.command = zebra + "P1\n\r\n";
    }

    function getDemographics(type) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.getDemographicsALL(auth.authToken).then(
        function (data) {
          vm.changeitemdemo();
          vm.listdemocode = [];
          vm.listdemo = [
            {
              id: null,
              name: "-- " + $filter("translate")("0162") + " --",
            },
          ];
          vm.itemdemo = null;
          vm.demoitems = [
            {
              id: null,
              name: "-- " + $filter("translate")("0162") + " --",
            },
          ];
          vm.itemsselect = null;
          if (data.status === 200) {
            data.data.forEach(function (value, key) {
              if (value.id !== -10 && value.id !== -4) {
                var id = JSON.parse(JSON.stringify(value.id));
                vm.listdemo.push(JSON.parse(JSON.stringify(value)));
                value.id = "{demo_" + value.id + "}";
                vm.listdemocode.push(JSON.parse(JSON.stringify(value)));
                if (value.id !== -111 && value.id !== -106) {
                  value.id = JSON.parse(JSON.stringify(id));
                  value.name = $filter("translate")("0098") + " " + value.name;
                  vm.listdemo.push(JSON.parse(JSON.stringify(value)));
                  value.id = "{demo_" + value.id + "_code}";
                  vm.listdemocode.push(JSON.parse(JSON.stringify(value)));
                }
              }
            });
            var general = {
              name: $filter("translate")("0078"),
              children: [
                { id: "{text}", name: $filter("translate")("0968") },
                { id: "{dateandtime}", name: $filter("translate")("0969") },
                { id: "{date}", name: $filter("translate")("0325") },
                { id: "{time}", name: $filter("translate")("0970") },
              ],
            };

            var orderEntry = {
              name: $filter("translate")("0011"),
              children: [
                { id: "{codeSample}", name: $filter("translate")("0972") },
                { id: "{nameSample}", name: $filter("translate")("0971") },
                { id: "{container}", name: $filter("translate")("0867") },
              ],
            };

            var order = {
              name: $filter("translate")("0110"),
              children: [
                { id: "{order}", name: $filter("translate")("0061") },
                {
                  id: "{datecreationorder}",
                  name: $filter("translate")("3273"),
                },
                { id: "{barcode}", name: $filter("translate")("0211") },
                { id: "{ordertypecode}", name: $filter("translate")("0974") },
                { id: "{ordertypename}", name: $filter("translate")("0975") },
                { id: "{externalid}", name: "Numero externo" },
              ],
            };

            var patient = {
              name: $filter("translate")("0398"),
              children: [
                { id: "{history}", name: $filter("translate")("0117") },
                { id: "{namePatient}", name: $filter("translate")("0398") },
                { id: "{age}", name: $filter("translate")("0102") },
                { id: "{gender}", name: $filter("translate")("0426") },
                { id: "{birthday}", name: $filter("translate")("0976") },
                { id: "{phone}", name: $filter("translate")("0188") }
              ],
            };

            var rack = {
              name: $filter("translate")("0705"),
              children: [
                { id: "{name_rack}", name: $filter("translate")("0118") },
                { id: "{date_rack}", name: $filter("translate")("3273") },
              ],
            };

            var demographics = {
              name: $filter("translate")("0083"),
              children: vm.listdemocode,
            };

            if (type === 1) {
              general.children.push(
                { id: "{t}", name: $filter("translate")("0459") },
                { id: "{test}", name: $filter("translate")("0013") },
                { id: "{area}", name: $filter("translate")("0079") }
              );
              order.children.push(
                {
                  id: "{ordersample}",
                  name:
                    $filter("translate")("0110") +
                    "." +
                    $filter("translate")("0111"),
                },
                { id: "{barcodeText}", name: $filter("translate")("0973") }
              );
              vm.basicTree = [
                general,
                orderEntry,
                order,
                patient,
                demographics,
              ];
            } else if (type === 2) {
              vm.basicTree = [general, order, patient, demographics];
            } else if (type === 3) {
              vm.basicTree = [general, patient];
            } else {
              vm.basicTree = [general, rack];
            }

            if (vm.managedocumenttype) {
              vm.basicTree[3].children.push(
                {
                  id: "{documenttypecode}",
                  name: $filter("translate")("0977"),
                },
                { id: "{documenttypename}", name: $filter("translate")("0978") }
              );
            }
          } else {
            vm.isOpenReport = true;
            vm.ListOrder = [];
            logger.success($filter("translate")("0684"));
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function ratonPulsado(evt) {
      //Obtener la posición de inicio

      xInic = evt.clientX;
      yInic = evt.clientY;
      estaPulsado = true;
      vm.itemSelect = this;
      //Para Internet Explorer: Contenido no seleccionable
      document.getElementById(this.id).unselectable = true;
    }

    function ratonMovido(evt) {
      if (estaPulsado) {
        //Calcular la diferencia de posición
        var xActual = evt.clientX;
        var yActual = evt.clientY;
        var xInc = xActual - xInic;
        var yInc = yActual - yInic;
        xInic = xActual;
        yInic = yActual;

        //Establecer la nueva posición
        var elemento = document.getElementById(vm.itemSelect.id);
        var position = getPosicion(elemento);
        elemento.style.top = position[0] + yInc + "px";
        elemento.style.left = position[1] + xInc + "px";
      }
    }

    function ratonSoltado(evt) {
      var elemento = document.getElementById(vm.itemSelect.id);
      var position = getPosicion(elemento);

      vm.fontsize =
        elemento.getAttribute("data-fontsize") !== null
          ? elemento.getAttribute("data-fontsize").toString()
          : null;

      var size = JSON.parse(vm.ticketsize);

      vm.typeelement = elemento.getAttribute("data-typeelement");
      vm.reverse = elemento.getAttribute("data-reverse") === "N" ? false : true;

      if (
        vm.itemSelect.id.split("-")[0] === "{barcode}" ||
        vm.itemSelect.id.split("-")[0] === "{barcodeText}"
      ) {
        vm.imageHeight = parseInt(
          (elemento.firstChild.getAttribute("data-heightbarcode") * 12.5) / 25.4
        );
        vm.widthbarcode = $filter("filter")(
          vm.narrowWidthBarcode,
          function (e) {
            return (
              e.Text === elemento.firstChild.getAttribute("data-widthbarcode")
            );
          }
        )[0];
        vm.typeBarcode = elemento.firstChild.getAttribute("data-typebarcode");
      } else if (vm.itemSelect.id.split("-")[0] === "{text}") {
        vm.textopen = document.getElementById(vm.itemSelect.id).innerHTML;
      }
      /*
            var limitheight = elemento.parentElement.offsetHeight;
            var limitwidth = elemento.parentElement.offsetWidth;


            if (position[0] < 0 || limitheight < elemento.offsetTop) {
              elemento.style.top = elemento.getBoundingClientRect().height + 'px';
            }
            if (position[1] < 0 || limitwidth < elemento.offsetLeft) {
              elemento.style.left = elemento.getBoundingClientRect().width + 'px';
            }
      */

      estaPulsado = false;
    }

    /*
     * Función para obtener la posición en la que se encuentra el
     * elemento indicado como parámetro.
     * Retorna un array con las coordenadas x e y de la posición
     */
    function getPosicion(elemento) {
      var posicion = new Array(2);
      if (document.defaultView && document.defaultView.getComputedStyle) {
        posicion[0] = parseInt(
          document.defaultView
            .getComputedStyle(elemento, null)
            .getPropertyValue("top")
        );
        posicion[1] = parseInt(
          document.defaultView
            .getComputedStyle(elemento, null)
            .getPropertyValue("left")
        );
      } else {
        //Para Internet Explorer
        posicion[0] = parseInt(elemento.currentStyle.top);
        posicion[1] = parseInt(elemento.currentStyle.left);
      }
      return posicion;
    }

    function rotateElement(position) {
      var element = document.getElementById(vm.itemSelect.id);

      var positionElement =
        element.getAttribute("data-rotate") === "3"
          ? 270
          : element.getAttribute("data-rotate") === "1"
          ? 90
          : element.getAttribute("data-rotate");
      var positionElement = parseInt(positionElement);

      if (position === "right") {
        positionElement =
          positionElement === 270
            ? 0
            : positionElement === 90
            ? positionElement + 180
            : positionElement + 90;

        var element = document.getElementById(vm.itemSelect.id);
        if (vm.itemSelect.id.split("-")[0] === "{barcode}") {
          element.style.height = vm.imageHeight + "px";
          element.style.width = vm.widthbarcode.Value + "cm";
        }
      } else {
        positionElement =
          positionElement === 0
            ? 270
            : positionElement === 270
            ? positionElement - 180
            : positionElement - 90;
      }

      var referencerotate =
        positionElement === 270
          ? 3
          : positionElement === 90
          ? 1
          : positionElement;
      element.setAttribute("data-rotate", referencerotate);
      element.style.webkitTransform = "rotate(" + positionElement + "deg)";
      element.style.mozTransform = "rotate(" + positionElement + "deg)";
      element.style.oTransform = "rotate(" + positionElement + "deg)";
      element.style.msTransform = "rotate(" + positionElement + "deg)";
      element.style.transformOrigin = "0 0";

      var x = termin.top + Math.cos(angle) * div.height;
    }

    function addElement(item) {
      if (vm.ticketsize !== undefined && vm.ticketsize !== null) {
        var element = document.getElementById("generalContent");

        var newElement = document.createElement("div");

        if (item.id === "{barcode}" || item.id === "{barcodeText}") {
          var elem = document.createElement("img");
          elem.setAttribute(
            "src",
            item.id === "{barcode}"
              ? "images/barcode/barcode.jpg"
              : $filter("translate")("0000") === "enUsa"
              ? "images/barcode/barcodeTextEN.jpg"
              : "images/barcode/barcodeTextES.jpg"
          );
          elem.style.height = "50px";
          elem.style.width = "1.5cm";
          elem.setAttribute("data-heightbarcode", 100);
          elem.setAttribute("data-widthbarcode", 1.5);
          elem.setAttribute("data-typebarcode", 1);

          newElement.appendChild(elem);

          newElement.style.height = "50px";
          newElement.style.width = "1.5cm";
        } else {
          newElement.setAttribute("data-fontsize", 1);
          var newContent = document.createTextNode(item.name);
          newElement.appendChild(newContent);
        }

        if (item.id === "{text}") {
          newElement.setAttribute("data-text", "TEXT");
        }

        newElement.setAttribute("data-typeelement", item.id);
        newElement.setAttribute("id", item.id + "-" + vm.countElement);
        newElement.setAttribute("class", "estiloCuadro");
        newElement.setAttribute("data-rotate", 0);
        newElement.setAttribute("data-reverse", "N");
        newElement.style.fontSize = "4pt";
        newElement.style.letterSpacing = "0.2em";

        vm.countElement = vm.countElement + 1;

        element.appendChild(newElement);

        if (newElement.addEventListener) {
          newElement.addEventListener("click", function () {
            if (vm.itemSelect.id === this.id && this.classList.length === 2) {
              vm.itemSelect = null;
              this.setAttribute("class", "estiloCuadro");
            } else if (
              this.classList.length === 1 ||
              vm.itemSelect.id !== this.id
            ) {
              var x = document.getElementsByClassName(
                "estiloCuadroSeleccionado"
              );
              if (x.length > 0) {
                x[0].setAttribute("class", "estiloCuadro");
              }

              vm.itemSelect = this;
              this.setAttribute(
                "class",
                "estiloCuadro estiloCuadroSeleccionado"
              );
            } else {
              vm.itemSelect = null;
              this.setAttribute("class", "estiloCuadro");
            }
          });
          newElement.addEventListener("mousedown", ratonPulsado, false);
          newElement.addEventListener("mouseup", ratonSoltado, false);
          document.addEventListener("mousemove", ratonMovido, false);
        } else {
          //Para IE
          newElement.attachEvent("dblclick", function () {
            if (this.classList.length === 1) {
              vm.itemSelect = this;
              this.setAttribute(
                "class",
                "estiloCuadro estiloCuadroSeleccionado"
              );
            } else {
              vm.itemSelect = null;
              this.setAttribute("class", "estiloCuadro");
            }
          });
          newElement.attachEvent("onmousedown", ratonPulsado);
          newElement.attachEvent("onmouseup", ratonSoltado);
          document.attachEvent("onmousemove", ratonMovido);
        }
      } else {
        logger.warning($filter("translate")("0987"));
      }
    }

    function removeElement() {
      var element = document.getElementById(vm.itemSelect.id);
      element.remove();
      var elementsearch = _.filter(vm.basicTree[0].children, {
        id: vm.itemSelect.id,
      });
      if (elementsearch.length > 0) {
        elementsearch[0].disabled = false;
      } else {
        var elementsearch = _.filter(vm.basicTree[1].children, {
          id: vm.itemSelect.id,
        });
        if (elementsearch.length > 0) {
          elementsearch[0].disabled = false;
        } else {
          var elementsearch = _.filter(vm.basicTree[2].children, {
            id: parseInt(vm.itemSelect.id),
          });
          if (elementsearch.length > 0) {
            elementsearch[0].disabled = false;
          }
        }
      }

      vm.itemSelect = null;
    }

    function changeFont() {
      var element = document.getElementById(vm.itemSelect.id);

      var valuedata = _.filter(vm.listFont, { Value: vm.fontsize });
      element.style.fontSize = valuedata[0].Text;
      element.setAttribute("data-fontsize", valuedata[0].Value);
    }

    function changeTicket() {
      var generalContent = document.getElementById("generalContent");
      generalContent.setAttribute("data-ticketsize", vm.ticketsize);
      var size = JSON.parse(vm.ticketsize);
      generalContent.style.height = size[1] + "cm";
      generalContent.style.width = size[0] + "cm";
    }

    function changeSizeBarcode() {
      var element = document.getElementById(vm.itemSelect.id);
      element.style.height = vm.imageHeight + "px"; // * 3 + 'cm';
      //  element.style.width = '100px'//vm.imageWidth + 'px' ;//* 3 + 'cm';

      element.firstChild.setAttribute(
        "data-heightbarcode",
        (vm.imageHeight * 25.4) / 12.7
      );
      //element.firstChild.setAttribute('data-widthbarcode', vm.imageWidth * 3);
      element.firstChild.style.height = vm.imageHeight + "px";
      //element.firstChild.style.width = '100px'//vm.imageWidth * 3 + 'cm';
    }

    function changewidthbarcode() {
      var element = document.getElementById(vm.itemSelect.id);
      element.firstChild.setAttribute(
        "data-widthbarcode",
        vm.widthbarcode.Text
      );
      element.style.width = vm.widthbarcode.Value + "cm";
      element.firstChild.style.width = vm.widthbarcode.Value + "cm";
    }

    function changeText() {
      if (vm.textopen !== undefined && vm.textopen !== null) {
        document.getElementById(vm.itemSelect.id).innerHTML = vm.textopen;
        document
          .getElementById(vm.itemSelect.id)
          .setAttribute("data-text", vm.textopen);
      }
    }

    vm.changeitemdemo = changeitemdemo;
    function changeitemdemo() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.demoitems = [];
      return demographicsItemDS
        .getDemographicsItemsAll(auth.authToken, 0, -4)
        .then(function (data) {
          if (data.data.length > 0) {
            data.data.forEach(function (value, key) {
              var object = {
                id: value.demographicItem.id,
                name: value.demographicItem.name,
                code: value.demographicItem.code,
              };
              vm.demoitems.push(object);
            });
            vm.itemsselect = vm.selectitem;
          }
        });
    }

    function changeReverse() {
      var element = document.getElementById(vm.itemSelect.id);
      if (vm.reverse === true) {
        element.setAttribute("data-reverse", "R");
        element.style.backgroundColor = "#212121";
        element.style.color = "white";
      } else {
        element.setAttribute("data-reverse", "N");
        element.style.backgroundColor = "transparent";
        element.style.color = "#444";
      }
    }

    function changeTypeBarcode() {
      var element = document.getElementById(vm.itemSelect.id);
      element.firstChild.setAttribute("data-typebarcode", vm.typeBarcode);
    }

    function init() {
      vm.getBarcode();

      vm.listFont = [
        {
          Text: "2pt",
          Value: "0.5",
        },
        {
          Text: "4pt",
          Value: "1",
        },
        {
          Text: "6pt",
          Value: "2",
        },
        {
          Text: "8pt",
          Value: "3",
        },
        {
          Text: "10pt",
          Value: "4",
        },
        {
          Text: "21pt",
          Value: "5",
        },
      ];

      vm.listTypeBarcode = [
        {
          Text: "128",
          Value: "1",
        },
        {
          Text: "39",
          Value: "3",
        },
      ];

      vm.narrowWidthBarcode = [
        {
          Text: "1",
          Value: "1.5",
        },
        {
          Text: "2",
          Value: "3.2",
        },
        {
          Text: "3",
          Value: "5",
        },
        {
          Text: "4",
          Value: "6.8",
        },
        {
          Text: "5",
          Value: "8.6",
        },
      ];

      vm.Etiquetas = [
        {
          Text: "3,2cm x 2,5cm",
          Value: "[3.2,2.5]",
        },
        {
          Text: "4cm x 4cm",
          Value: "[4,4]",
        },
        {
          Text: "5,01cm x 2,5cm",
          Value: "[5.01,2.5]",
        },
        {
          Text: "7,4cm x 5cm",
          Value: "[7.4,5]",
        },
        {
          Text: "10cm x 2,5cm",
          Value: "[10,2.5]",
        },
        {
          Text: "10cm x 8cm",
          Value: "[10,8]",
        },
        {
          Text: "10cm x 15cm",
          Value: "[10,15]",
        },
        {
          Text: "10,2cm x 4,9cm",
          Value: "[10.2,4.9]",
        },
      ];
    }

    vm.init();
  }
})();
/* jshint ignore:end */
