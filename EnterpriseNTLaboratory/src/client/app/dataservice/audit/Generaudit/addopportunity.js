/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addopportunity', addopportunity);

    addopportunity.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function addopportunity(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//Oportunidad de la prueba
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'service') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1048')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1048')).toUpperCase(),
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
            if (name === 1) {//oportunidad de la muestra
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                    var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue[0].sampleOportunitys.length; m++) {
                            listold = listold +
                                '<b>* :</b>' +
                                oldValue[0].sampleOportunitys[m].service.name +
                                '<br>' +
                                '<b>' + $filter('translate')('0199') + ':</b><br>' +
                                oldValue[0].sampleOportunitys[m].expectedTime +
                                '<br>' +
                                '<b>' + $filter('translate')('0514') + ':</b><br>' +
                                oldValue[0].sampleOportunitys[m].maximumTime +
                                '<br><br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue[0].sampleOportunitys.length; t++) {
                            listnew = listnew +
                                '<b>* </b>' +
                                newValue[0].sampleOportunitys[t].service.name +
                                '<br>' +
                                '<b>' + $filter('translate')('0199') + ':</b><br>' +
                                newValue[0].sampleOportunitys[t].expectedTime +
                                '<br>' +
                                '<b>' + $filter('translate')('0514') + ':</b><br>' +
                                newValue[0].sampleOportunitys[t].maximumTime +
                                '<br><br>';
                        }
                    }
                    var object = {
                        'mastert': ($filter('translate')('1047')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0003'),
                        'before': '',
                        'after': newValue[0].branch === undefined ? '' : newValue[0].branch.name,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                    var object = {
                        'mastert': ($filter('translate')('1047')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0088'),
                        'before': '',
                        'after': newValue[0].typeOrder === undefined ? '' : newValue[0].typeOrder.name,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                    var object = {
                        'mastert': ($filter('translate')('1047')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0111'),
                        'before': '',
                        'after': newValue[0].sample.name,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                    var object = {
                        'mastert': ($filter('translate')('1047')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0157'),
                        'before': '',
                        'after': newValue[0].destination.name,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                    var object = {
                        'mastert': ($filter('translate')('1047')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0241'),
                        'before': listold,
                        'after': listnew,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                }
                return datauser;
            }
            if (name === 2) {//Muestra por servicio
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'service') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1046')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1046')).toUpperCase(),
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
            if (name === 3) {//HISTOGRAMA
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0038')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'minimum' || data.fields[j].field === 'maximum' || data.fields[j].field === 'name') {
                        var object = {
                            'mastert': ($filter('translate')('0038')).toUpperCase(),
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
            if (name === 4) {//SUBMUETRA
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'subSamples') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { selected: 'true' });
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '*' +
                                    oldValue[m].name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '*' +
                                    newValue[t].name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0460')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0460'),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'name') {
                        var object = {
                            'mastert': ($filter('translate')('0460')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0111'),
                            'before': data.fields[j].newValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }

                }
                return datauser;
            }
            if (name === 5) {//Medio de cultivo por prueba
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'mediaCultures') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    oldValue[m].name +
                                    '<br>' +
                                    '<b>' + $filter('translate')('1043') + ':</b><br>' +
                                    oldValue[m].defectValue +
                                    '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    newValue[t].name +
                                    '<br>' +
                                    '<b>' + $filter('translate')('1043') + ':</b><br>' +
                                    newValue[t].defectValue +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1045')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1045')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        }
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 6) {//MEDIOS DE CULTIVO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0486')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'code' || data.fields[j].field === 'name' || data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0486')).toUpperCase(),
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
            if (name === 7) {//Procedimiento por prueba
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { procedure: { selected: 'true' } });
                    var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { procedure: { selected: 'true' } });
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue.length; m++) {
                            listold = listold +
                                '<b>* </b>' +
                                oldValue[m].procedure.name +
                                '<br>' +
                                '<b>' + $filter('translate')('1043') + ':</b><br>';
                            if (oldValue[m].procedure.defaultvalue === true) {
                                listold = listold + $filter('translate')('1091') + '<br>';
                            } else {
                                listold = listold + $filter('translate')('1092') + '<br>';
                            }
                            if (oldValue[m].procedure.confirmatorytestname !== undefined && oldValue[m].procedure.confirmatorytestname !== '') {
                                listold = listold + '<b>' + $filter('translate')('0459') + ':</b>' +
                                    oldValue[m].procedure.confirmatorytestname +
                                    '<br>';
                            }
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue.length; t++) {
                            listnew = listnew + '<b>* </b>' + newValue[t].procedure.name +
                                '<br>' + '<b>' + $filter('translate')('1043') + ':</b><br>';
                            if (newValue[t].procedure.defaultvalue === true) {
                                listnew = listnew + $filter('translate')('1091') + '<br>';
                            } else {
                                listnew = listnew + $filter('translate')('1092') + '<br>';
                            }
                            if (newValue[t].procedure.confirmatorytestname !== undefined && newValue[t].procedure.confirmatorytestname !== '') {
                                + '<b>' + $filter('translate')('0459') + ':</b>' +
                                    newValue[t].procedure.confirmatorytestname +
                                    '<br>';
                            }
                        }
                    }
                    var object = {
                        'mastert': ($filter('translate')('1044')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0459'),
                        'before': oldValue.length === 0 ? '' : oldValue[0].test.name,
                        'after': newValue.length === 0 ? '' : newValue[0].test.name,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                    var object = {
                        'mastert': ($filter('translate')('1044')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0487'),
                        'before': listold + '<br>',
                        'after': listnew + '<br>',
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                }
                return datauser;
            }
            if (name === 8) {//PROCEDIMIENTO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0487')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'code' || data.fields[j].field === 'name' || data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0487')).toUpperCase(),
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
            if (name === 9) {//METODO DE RECOLECION
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0461')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0461')).toUpperCase(),
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
            if (name === 10) {//TAREA
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0578')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'description') {
                        var object = {
                            'mastert': ($filter('translate')('0578')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field + 'A'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0578')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': data.fields[j].field,
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
            if (name === 11) {//SITIO ANATOMICO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0462')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0462')).toUpperCase(),
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
            if (name === 12) {//DESTINO DE MICROOBIOLOGIA
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'analyzersMicrobiologyDestinations') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '*' +
                                    oldValue[m].nameReferenceLaboratory +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '*' +
                                    newValue[t].nameReferenceLaboratory +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1003')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': 'Usuarios analizador',
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'state' || data.fields[j].field === 'reportTask') {
                        var object = {
                            'mastert': ($filter('translate')('1003')).toUpperCase(),
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
                            'mastert': ($filter('translate')('1003')).toUpperCase(),
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
            if (name === 13) {//VALORES DE REFERENCIA DE ANTIBIOTICO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'microorganism') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1002')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'operation') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1002')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'antibiotic') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1002')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'method') {
                        if (data.fields[j].oldValue === '') { var oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('0945'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('0561'); }
                        if (data.fields[j].newValue === '') { var newValue = ''; }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('0945'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('0561'); }
                        var object = {
                            'mastert': ($filter('translate')('1002')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'interpretation') {
                        if (data.fields[j].oldValue === '') { var oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('0562'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('0563'); }
                        if (data.fields[j].oldValue === '3') { var oldValue = $filter('translate')('0564'); }
                        if (data.fields[j].newValue === '') { var newValue = ''; }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('0562'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('0563'); }
                        if (data.fields[j].newValue === '3') { var newValue = $filter('translate')('0564'); }
                        var object = {
                            'mastert': ($filter('translate')('1002')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1002')).toUpperCase(),
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
            if (name === 14) {//ANTIBIOGRAMA
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'suppressionRule') {
                        var object = {
                            'mastert': ($filter('translate')('0414')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'idMicrobialDeteccion' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0414')).toUpperCase(),
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
            if (name === 15) {//ANTIBIOGRAMA antibiotico
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                    var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue.length; m++) {
                            listold = listold +
                                '<b>* </b>' +
                                oldValue[m].antibiotic.name +
                                '<br>' +
                                '<b>' + $filter('translate')('1042') + ':</b>' +
                                oldValue[m].line +
                                '<br>' +
                                '<b>' + $filter('translate')('0125') + ':</b>' +
                                oldValue[m].unit +
                                '<br><br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue.length; t++) {
                            listnew = listnew +
                                '<b>* </b>' +
                                newValue[t].antibiotic.name +
                                '<br>' +
                                '<b>' + $filter('translate')('1042') + ':</b>' +
                                newValue[t].line +
                                '<br>' +
                                '<b>' + $filter('translate')('0125') + ':</b>' +
                                newValue[t].unit +
                                '<br><br>';
                        }
                    }

                    var object = {
                        'mastert': ($filter('translate')('0414')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0557'),
                        'before': listold,
                        'after': listnew,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                }
                return datauser;
            }
            if (name === 16) {//antibiotico
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0557')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0557')).toUpperCase(),
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
            if (name === 17) {//MICROORGANISMO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0608')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'name' || data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0608')).toUpperCase(),
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
