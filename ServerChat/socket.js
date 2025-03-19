//Se manejan dos arrays de usuarios para no enviar el socket por el canal y saturarlo
var activeUsers = [];
var userSockets = [];
export default function(socket) {

    // Envia al nuevo usuario los usuarios que estan conectados
    socket.emit('init', [...activeUsers]);

    /*Carga el usuario que se conecto*/
    socket.on("user:join", function(data) {
        data.socket = socket.id;
        activeUsers.push(data);

        var socketId = userSockets.findIndex(s => s.id == socket.id);

        if(socketId < 0) {
            userSockets.push({
                user: data.id,
                socket: socket,
                id: socket.id
            })
        } else {
            if(userSockets[socketId].user != data.id) {
                userSockets[socketId].user = data.id
            }
        }

        socket.broadcast.emit('user:join', data);
    });

    // Se envia mensaje privado a un usuario
    socket.on('send:message', function(data) {
        for (var user in userSockets) {
            var val = userSockets[user];
            if (val.user == data.to) {
                val.socket.emit('send:message', data);
            }
        }
    });

    /*Se desconecta un usuario*/
    socket.on('disconnect', function() {
        /*Elimina el socket del usuario*/
        var socketIndex = userSockets.findIndex(s => s.id == socket.id);
        if (socketIndex >= 0) {
            userSockets.splice(socketIndex, 1);
        }

        /*Elimina el usuario del array de usuarios conectados*/
        var index = activeUsers.findIndex(user => user.socket == socket.id);
        if (index >= 0) {
            activeUsers.splice(index, 1);
        }

        /*Emitir nuevamente los usuarios conectados*/ 
        socket.broadcast.emit('init', [...activeUsers]);
    });

    /*cierra sesion el usuario*/
    socket.on('sign:off', function(data) {
        for (var i = 0; i < activeUsers.length; i++) {
            if (activeUsers[i].id == data) {
                activeUsers.splice(i, 1);
                i--;
            }
        }
        socket.broadcast.emit('init', [...activeUsers]);
    });


    // Se envia notificacion de cambio en llaves de configuración , configuración general y dependendia de demograficos
    socket.on('change:configuration', function(data) {
        for (var user in userSockets) {
            var val = userSockets[user];
            val.socket.emit('change:configuration', data);
        }
    });

    //Consultar lista de usuarios conectados
    socket.on('user:connect', function() {
        socket.emit('init', [...activeUsers]);
    });

    //Cerrar sesion de usuario
    socket.on('user:closesession', function(data) {
        for (var user in userSockets) {
            var val = userSockets[user];
            if (val.user == data.user) {
                val.socket.emit('user:closesession', data);
            }
        } 
    });
};