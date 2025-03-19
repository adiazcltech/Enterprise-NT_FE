/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addobjectuser', addobjectuser);

    addobjectuser.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function addobjectuser(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//usuario
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' ||data.fields[j].field === 'preValidationRequired' ||data.fields[j].field === 'dashboard' || data.fields[j].field === 'editPatients' ||
                        data.fields[j].field === 'addExams' || data.fields[j].field === 'printInReports' ||
                        data.fields[j].field === 'creatingItems' || data.fields[j].field === 'secondValidation' ||
                        data.fields[j].field === 'printResults' || data.fields[j].field === 'quitValidation' ||
                        data.fields[j].field === 'confidential') {
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'activation' || data.fields[j].field === 'passwordExpiration' || data.fields[j].field === 'expiration') {
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : moment(parseInt(data.fields[j].oldValue)).format('DD/MM/YYYY'),
                            'after': data.fields[j].newValue === null ? '' : moment(parseInt(data.fields[j].newValue)).format('DD/MM/YYYY'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'areas') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].area.name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].area.name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'branches') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].branch.name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].branch.name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'roles') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].role.name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].role.name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'type') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'orderType') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && 
                               data.fields[j].field !== 'photo' && 
                               data.fields[j].field !== 'password' && 
                               data.fields[j].field !== 'penultimatePassword' && 
                               data.fields[j].field !== 'antepenultimatePassword' && 
                               data.fields[j].field !== 'signature' && 
                               data.fields[j].field !== 'user' && 
                               data.fields[j].field !== 'destination' && 
                               data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 1) {//Rol
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'administrator') {
                        var object = {
                            'mastert': ($filter('translate')('1013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'modules') {
                        var listnew = '';
                        var listold = '';
                        if (data.fields[j].newValue !== null) {
                            var datalismater = $filter('filter')(JSON.parse(data.fields[j].newValue), function (e) {
                                return e.idFather === 1 && e.access === true;
                            })
                            var listnew = '';
                            if (datalismater.length !== 0) {
                                for (var t = 0; t < datalismater.length; t++) {
                                    listnew = listnew +
                                        '<b>' + $filter('translate')('0874') + ' ' +
                                        labelaudit.changelabels(datalismater[t].name) +
                                        '</b> <br>';
                                    datalismater[t].submodules = $filter('orderBy')(datalismater[t].submodules, 'id');
                                    for (var m = 0; m < datalismater[t].submodules.length; m++) {
                                        if (datalismater[t].submodules[m].submodules.length === 0) {
                                            listnew = listnew +
                                                '*' +
                                                labelaudit.changelabels(datalismater[t].submodules[m].name) +
                                                '<br>';
                                        }
                                        if (datalismater[t].submodules[m].submodules.length !== 0) {
                                            datalismater[t].submodules[m].submodules = $filter('orderBy')(datalismater[t].submodules[m].submodules, 'id');
                                        }
                                        for (var n = 0; n < datalismater[t].submodules[m].submodules.length; n++) {
                                            if (datalismater[t].submodules[m].submodules[n].access === true) {
                                                if (datalismater[t].submodules[m].submodules[n].name === 'Usuario') {
                                                    datalismater[t].submodules[m].submodules[n].name = 'usuarioE';
                                                }
                                                if (datalismater[t].submodules[m].submodules[n].name === 'Demográficos') {
                                                    datalismater[t].submodules[m].submodules[n].name = 'DemográficosE';
                                                }
                                                listnew = listnew +
                                                    '*' +
                                                    labelaudit.changelabels(datalismater[t].submodules[m].submodules[n].name) +
                                                    '<br>';
                                            }
                                        }

                                    }
                                    listnew = listnew + '<br>';
                                }
                            }
                            var accesLaboratory = $filter('filter')(JSON.parse(data.fields[j].newValue), function (e) {
                                return e.idFather === 200 && e.access === true;
                            })
                            if (accesLaboratory.length !== 0) {
                                for (var t = 0; t < accesLaboratory.length; t++) {
                                    if (accesLaboratory[t].name === 'Informes y consultas' && accesLaboratory[t].id === 207) {
                                        accesLaboratory[t].name = 'Estadísticas';
                                    }
                                    listnew = listnew +
                                        '<b>' + $filter('translate')('0874') + ' ' +
                                        labelaudit.changelabels(accesLaboratory[t].name) +
                                        '</b> <br>';
                                    accesLaboratory[t].submodules = $filter('orderBy')(accesLaboratory[t].submodules, 'id');
                                    for (var m = 0; m < accesLaboratory[t].submodules.length; m++) {
                                        if (accesLaboratory[t].submodules[m].submodules.length === 0) {
                                            listnew = listnew +
                                                '*' +
                                                labelaudit.changelabels(accesLaboratory[t].submodules[m].name) +
                                                '<br>';
                                        }
                                        if (accesLaboratory[t].submodules[m].submodules.length !== 0) {
                                            accesLaboratory[t].submodules[m].submodules = $filter('orderBy')(accesLaboratory[t].submodules[m].submodules, 'id');
                                        }
                                        for (var n = 0; n < accesLaboratory[t].submodules[m].submodules.length; n++) {
                                            if (accesLaboratory[t].submodules[m].submodules[n].access === true) {
                                                listnew = listnew +
                                                    '*' +
                                                    labelaudit.changelabels(accesLaboratory[t].submodules[m].submodules[n].name) +
                                                    '<br>';
                                            }
                                        }
                                    }
                                    listnew = listnew + '<br>';
                                }
                            }
                        }
                        var listLISold = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { name: 'LIS' }, true)[0].submodules;
                        var listLaboratoryold = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { name: 'Managment' }, true)[0].submodules;
                        listLISold = listLISold.length === 0 ? '' : listLISold;
                        listLaboratoryold = listLaboratoryold.length === 0 ? '' : listLaboratoryold;
                        var listold = '';
                        var accesLaboratoryold = $filter('orderBy')($filter('filter')(listLaboratoryold, { access: true }), 'id', { reverse: false });
                        if (accesLaboratoryold.length !== 0) {
                            for (var t = 0; t < accesLaboratoryold.length; t++) {
                                listold = listold +
                                    '<b>' + $filter('translate')('0874') + ' ' +
                                    labelaudit.changelabels(accesLaboratoryold[t].name) +
                                    '</b> <br>';
                                accesLaboratoryold[t].submodules = $filter('orderBy')(accesLaboratoryold[t].submodules, 'id');
                                for (var m = 0; m < accesLaboratoryold[t].submodules.length; m++) {
                                    if (accesLaboratoryold[t].submodules[m].submodules.length === 0) {
                                        listold = listold +
                                            '*' +
                                            labelaudit.changelabels(accesLaboratoryold[t].submodules[m].name) +
                                            '<br>';
                                    }
                                    if (accesLaboratoryold[t].submodules[m].submodules.length !== 0) {
                                        accesLaboratoryold[t].submodules[m].submodules = $filter('orderBy')(accesLaboratoryold[t].submodules[m].submodules, 'id');
                                    }
                                    for (var n = 0; n < accesLaboratoryold[t].submodules[m].submodules.length; n++) {
                                        if (accesLaboratoryold[t].submodules[m].submodules[n].name === 'Usuario') {
                                            accesLaboratoryold[t].submodules[m].submodules[n].name = 'usuarioE';
                                        }
                                        if (accesLaboratoryold[t].submodules[m].submodules[n].name === 'Demograficos') {
                                            accesLaboratoryold[t].submodules[m].submodules[n].name = 'DemográficosE';
                                        }

                                        if (accesLaboratoryold[t].submodules[m].submodules[n].access === true) {
                                            listold = listold +
                                                '*' +
                                                labelaudit.changelabels(accesLaboratoryold[t].submodules[m].submodules[n].name) +
                                                '<br>';
                                        }
                                    }
                                }
                                listold = listold + '<br>';
                            }
                        }
                        var accesLISold = $filter('orderBy')($filter('filter')(listLISold, { access: true }), 'id')
                        if (accesLISold.length !== 0) {
                            for (var t = 0; t < accesLISold.length; t++) {
                                listold = listold +
                                    '<b>' + $filter('translate')('0874') + ' ' +
                                    labelaudit.changelabels(accesLISold[t].name) +
                                    '</b> <br>';
                                accesLISold[t].submodules = $filter('orderBy')(accesLISold[t].submodules, 'id');
                                for (var m = 0; m < accesLISold[t].submodules.length; m++) {
                                    if (accesLISold[t].submodules[m].submodules.length === 0) {
                                        listold = listold +
                                            '*' +
                                            labelaudit.changelabels(accesLISold[t].submodules[m].name) +
                                            '<br>';
                                    }
                                    if (accesLISold[t].submodules[m].submodules.length !== 0) {
                                        accesLISold[t].submodules[m].submodules = $filter('orderBy')(accesLISold[t].submodules[m].submodules, 'id');
                                    }
                                    for (var n = 0; n < accesLISold[t].submodules[m].submodules.length; n++) {
                                        if (accesLISold[t].submodules[m].submodules[n].access === true) {
                                            listold = listold +
                                                '*' +
                                                labelaudit.changelabels(accesLISold[t].submodules[m].submodules[n].name) +
                                                '<br>';
                                        }
                                    }
                                }
                                listold = listold + '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1418'),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 2) {//Homologación de pruebas
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'codes') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1050')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0098'),
                            'before': oldValue === null ? '' : oldValue,
                            'after': newValue === null ? '' : newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'centralSystem') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1050')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1004'),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'name') {
                        var object = {
                            'mastert': ($filter('translate')('1050')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0013'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 3) {//Homologación de demograficos
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'demographic') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1049')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    if (data.fields[j].field === 'demographicItem') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1049')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'centralCode') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    parseInt(oldValue[m]) +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    parseInt(newValue[t]) +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1049')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 4) {//HOMOLOGACIÓN USUARIO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'user') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        if (newValue.name !== undefined) {
                            var object = {
                                'mastert': ($filter('translate')('1005')).toUpperCase(),
                                'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                                'name': labelaudit.changelabels(data.fields[j].field),
                                'before': oldValue === null ? '' : oldValue.name,
                                'after': newValue === null ? '' : newValue.name,
                                'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                                'user': data.userName
                            };
                            datauser.push(object);
                        }
                    } else if (data.fields[j].field === 'name') {
                        var object = {
                            'mastert': ($filter('translate')('1005')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1004'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'state' && data.fields[j].field !== 'repeatCode' && data.fields[j].field !== 'ehr' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1005')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 5) {//SISTEMA CENTRAL
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'ehr' || data.fields[j].field === 'repeatCode') {
                        var object = {
                            'mastert': ($filter('translate')('1004')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1004')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 6) {//integración de middleware por laboratorio
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'entry') {
                        var object = {
                            'mastert': ($filter('translate')('1281')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'check') {
                        var object = {
                            'mastert': ($filter('translate')('1281')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field + 'I'),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1281')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
        }
    }
})();
/* jshint ignore:end */
