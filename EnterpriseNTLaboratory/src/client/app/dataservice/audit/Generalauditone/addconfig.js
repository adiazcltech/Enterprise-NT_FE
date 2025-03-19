/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addconfig', addconfig);

    addconfig.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function addconfig(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//Entrevista  
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'panic'|| data.fields[j].field === 'informedConsent') {
                        var object = {
                            'mastert': ($filter('translate')('0191')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': data.fields[j].field === 'panic' ? labelaudit.changelabels('panicA') : labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'questions') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { select: true });
                        var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { select: true });
                        var listold = '';
                        var listnew = '';

                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].question +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].question +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0191')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'typeInterview') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { select: true });
                        var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { select: true });
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0191')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'type') {
                        if (data.fields[j].oldValue === null) { data.fields[j].oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { data.fields[j].oldValue = $filter('translate')('0110'); }
                        if (data.fields[j].oldValue === '2') { data.fields[j].oldValue = $filter('translate')('0459'); }
                        if (data.fields[j].oldValue === '3') { data.fields[j].oldValue = $filter('translate')('1024'); }
                        if (data.fields[j].newValue === null) { data.fields[j].newValue = ''; }
                        if (data.fields[j].newValue === '1') { data.fields[j].newValue = $filter('translate')('0110'); }
                        if (data.fields[j].newValue === '2') { data.fields[j].newValue = $filter('translate')('0459'); }
                        if (data.fields[j].newValue === '3') { data.fields[j].newValue = $filter('translate')('1024'); }
                        var object = {
                            'mastert': ($filter('translate')('0191')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'lastUserModify' && data.fields[j].field !== 'open' && data.fields[j].field !== 'required' && data.fields[j].field !== 'select' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0191')).toUpperCase(),
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
            if (name === 1) {//Preguntas
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0994')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'name') {
                        var object = {
                            'mastert': ($filter('translate')('0994')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels('code'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'answers') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { selected: true });
                        var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { selected: true });
                        var listold = '';
                        var listnew = '';

                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0994')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'control') {
                        if (data.fields[j].oldValue === null) { data.fields[j].oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { data.fields[j].oldValue = $filter('translate')('0648'); }
                        if (data.fields[j].oldValue === '2') { data.fields[j].oldValue = $filter('translate')('0496'); }
                        if (data.fields[j].oldValue === '3') { data.fields[j].oldValue = $filter('translate')('0114'); }
                        if (data.fields[j].oldValue === '4') { data.fields[j].oldValue = $filter('translate')('0325'); }
                        if (data.fields[j].oldValue === '5') { data.fields[j].oldValue = $filter('translate')('1405'); }
                        if (data.fields[j].oldValue === '6') { data.fields[j].oldValue = $filter('translate')('1023'); }
                        if (data.fields[j].newValue === null) { data.fields[j].newValue = ''; }
                        if (data.fields[j].newValue === '1') { data.fields[j].newValue = $filter('translate')('0648'); }
                        if (data.fields[j].newValue === '2') { data.fields[j].newValue = $filter('translate')('0496'); }
                        if (data.fields[j].newValue === '3') { data.fields[j].newValue = $filter('translate')('0114'); }
                        if (data.fields[j].newValue === '4') { data.fields[j].newValue = $filter('translate')('0325'); }
                        if (data.fields[j].newValue === '5') { data.fields[j].newValue = $filter('translate')('1405'); }
                        if (data.fields[j].newValue === '6') { data.fields[j].newValue = $filter('translate')('1023'); }

                        var object = {
                            'mastert': ($filter('translate')('0994')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'typeInterview' && data.fields[j].field !== 'open' && data.fields[j].field !== 'required' && data.fields[j].field !== 'select' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction' && data.fields[j].field !== 'lastUserModify') {
                        var object = {
                            'mastert': ($filter('translate')('0994')).toUpperCase(),
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
            if (name === 2) {//Respuestas
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('1099')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'selected' && data.fields[j].field !== 'isOpen' && data.fields[j].field !== 'quantity' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction' && data.fields[j].field !== 'lastUserModify') {
                        var object = {
                            'mastert': ($filter('translate')('1099')).toUpperCase(),
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
            if (name === 3) {//maestro  itemdemografico
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'defaultItem') {
                        var object = {
                            'mastert': ($filter('translate')('0412')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'demographic' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0412')).toUpperCase(),
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
            if (name === 4) {//maestro  demograficos
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'canCreateItemInOrder' ||
                        data.fields[j].field === 'lastOrder' || data.fields[j].field === 'lastOrder' ||
                        data.fields[j].field === 'encoded' || data.fields[j].field === 'statistics' || data.fields[j].field === 'modify') {
                        var object = {
                            'mastert': ($filter('translate')('0083')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'obligatory') {
                        var object = {
                            'mastert': ($filter('translate')('0083')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === '0' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === '0' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'origin') {
                        var object = {
                            'mastert': ($filter('translate')('0083')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'O' ? 'ORDEN' : 'HISTORIA',
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'O' ? 'ORDEN' : 'HISTORIA',
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' &&
                        data.fields[j].field !== 'lastTransaction' && data.fields[j].field !== 'defaultValue' &&
                        data.fields[j].field !== 'demographicItem' && data.fields[j].field !== 'items') {
                        var object = {
                            'mastert': ($filter('translate')('0083')).toUpperCase(),
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
            if (name === 5) { //maestro  médico
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'active' || data.fields[j].field === 'additionalReport') {
                        var object = {
                            'mastert': ($filter('translate')('0086')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'specialty') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0086')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'userName' && data.fields[j].field !== 'lastTransaction' &&
                        data.fields[j].field !== 'institutional' && data.fields[j].field !== 'mmis' && data.fields[j].field !== 'obs' && data.fields[j].field !== 'password') {
                        var object = {
                            'mastert': ($filter('translate')('0086')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field === 'state' ? data.fields[j].field + 'P' : data.fields[j].field),
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
            if (name === 6) { ///maestro  especialidad
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0991')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0991')).toUpperCase(),
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
            if (name === 7) { //maestro de tipo de orden
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0088')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'color') {
                        var object = {
                            'mastert': ($filter('translate')('0088')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : '<span style="color:' + data.fields[j].oldValue + ';font-size: 15px">■</span>',
                            'after': data.fields[j].newValue === null ? '' : '<span style="color:' + data.fields[j].newValue + ';font-size: 15px">■</span>',
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        }
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0088')).toUpperCase(),
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



