/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addrateone', addrateone);

    addrateone.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function addrateone(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//CLIENTE
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'invoice' || data.fields[j].field === 'agreement' || data.fields[j].field === 'selfPay' || data.fields[j].field === 'connectivityEMR' || data.fields[j].field === 'faxSend' || data.fields[j].field === 'automaticEmail' || data.fields[j].field === 'print') {
                        var object = {
                            'mastert': ($filter('translate')('0085')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'nit') {
                        var object = {
                            'mastert': ($filter('translate')('0085')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0132'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'address') {
                        var object = {
                            'mastert': ($filter('translate')('0085')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0187') + ' 1',
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'city') {
                        var object = {
                            'mastert': ($filter('translate')('0085')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1420'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'sendEnd') {
                        var object = {
                            'mastert': ($filter('translate')('0085')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1421'),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'false' ? $filter('translate')('0382') : $filter('translate')('0381'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'false' ? $filter('translate')('0382') : $filter('translate')('0381'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'institutional') {
                        var object = {
                            'mastert': ($filter('translate')('0085')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1422'),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'false' ? $filter('translate')('1423') : $filter('translate')('1424'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'false' ? $filter('translate')('1423') : $filter('translate')('1424'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'encryptionReportResult' && data.fields[j].field !== 'password' && data.fields[j].field !== 'username' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0085')).toUpperCase(),
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
            if (name === 1) {//ENTIDAD
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'active' || data.fields[j].field === 'applyParticular') {
                        var object = {
                            'mastert': ($filter('translate')('1007')).toUpperCase(),
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
                            'mastert': ($filter('translate')('1007')).toUpperCase(),
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
            if (name === 2) {//TARJETA DE CREDITO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0822')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0822')).toUpperCase(),
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
            if (name === 3) {//BANCO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0821')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0821')).toUpperCase(),
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
            if (name === 4) {//TIPO DE PAGO
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'card' || data.fields[j].field === 'bank' || data.fields[j].field === 'number' || data.fields[j].field === 'adjustment' || data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('1006')).toUpperCase(),
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
                            'mastert': ($filter('translate')('1006')).toUpperCase(),
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
            if (name === 5) { //Asignación de destino
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'orderType') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1041')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'branch') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1041')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'sample') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1041')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'destinationRoutes') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listtestsold = '';
                        var listtestsnew = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listtestsold = '';
                                oldValue[m].tests = $filter('filter')(oldValue[m].tests, { selected: 'true' });
                                for (var t = 0; t < oldValue[m].tests.length; t++) {
                                    listtestsold = listtestsold + oldValue[m].tests[t].name + '<br>';
                                }
                                var type = $filter('translate')('0000') === 'esCo' ? oldValue[m].destination.type.esCo : oldValue[m].destination.type.enUsa;
                                listold = listold + '<b>' + $filter('translate')('0157') + ':</b><br>' +
                                    oldValue[m].destination.name + '<br>' + '<b>' +
                                    $filter('translate')('0680') + ':</b><br>' + type + '<br>';

                                if (oldValue[m].tests.length !== 0) {
                                    + '<b>' + $filter('translate')('0459') + ':</b><br>'
                                        + listtestsold + '<br>';
                                } else {
                                    + '</b>';
                                }
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var m = 0; m < newValue.length; m++) {
                                listtestsnew = '';
                                newValue[m].tests = $filter('filter')(newValue[m].tests, { selected: 'true' });
                                for (var t = 0; t < newValue[m].tests.length; t++) {
                                    listtestsnew = listtestsnew + newValue[m].tests[t].name + '<br>';
                                }
                                var type = $filter('translate')('0000') === 'esCo' ? newValue[m].destination.type.esCo : oldValue[m].destination.type.enUsa;
                                listnew = listnew +
                                    '<b>' + $filter('translate')('0157') + ':</b><br>' +
                                    newValue[m].destination.name + '<br>' +
                                    '<b>' + $filter('translate')('0680') + ':</b><br>' + type + '<br>';

                                if (newValue[m].tests.length !== 0) {
                                    listnew = listnew + '<b>' + $filter('translate')('0459') +
                                        ':</b><br>' + listtestsnew + '<br>';
                                } else {
                                    listnew = listnew + '<br>';
                                }
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1041')).toUpperCase(),
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
            if (name === 6) { //destino
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0157')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'type') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0157')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'description') {
                        var object = {
                            'mastert': ($filter('translate')('0157')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field + 'A'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'color') {
                        var object = {
                            'mastert': ($filter('translate')('0157')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : '<span style="color:' + data.fields[j].oldValue + ';font-size: 15px">■</span>',
                            'after': data.fields[j].newValue === null ? '' : '<span style="color:' + data.fields[j].newValue + ';font-size: 15px">■</span>',
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'lastUserModify' && data.fields[j].field !== 'typeOfDestination' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0157')).toUpperCase(),
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
            if (name === 7) { //motivo
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0113')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'type') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0113')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'description') {
                        var object = {
                            'mastert': ($filter('translate')('0113')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0113')).toUpperCase(),
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
            if (name === 8) { //nevera
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0710')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'branch') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0710')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0710')).toUpperCase(),
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
            if (name === 9) {//Tipos de impuesto
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ("Tipos de impuesto").toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'idUserCreating'&& data.fields[j].field !== 'dateCreation') {
                        var object = {
                            'mastert': ("Tipos de impuesto").toUpperCase(),
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
            /* if (name === 10) {//RIPS
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ("RIPS").toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'idUserCreating'&& data.fields[j].field !== 'dateCreation') {
                        var object = {
                            'mastert': ("RIPS").toUpperCase(),
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
            } */
        }
    }
})();
/* jshint ignore:end */



