const socket = io();

let params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('el nombre es necesario');
}

const usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')

};



socket.on('connect', function() {
    console.log('Conectado al servidor');
    
    //Emitimos el evento para obtener la personas conectadas
    socket.emit('entrar-chat',usuario,(personas) => {
        console.log(personas)
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/* socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */



// Escuchar información cuando un usuario se desconecta
socket.on('crear-mensaje', (mensaje) => {

    console.log('Servidor:', mensaje);

});

// Escuchar información de las personas conectadas
socket.on('listar-personas', (usuarios) => {

    console.log(usuarios);

});

socket.on('mensaje-privado',(mensaje) => {
    console.log(mensaje)
});