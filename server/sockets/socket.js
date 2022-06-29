const Usuarios = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    // Escuchar el cliente
    client.on('entrar-chat', (data, callback) => {

        //Evaluamos si viene el nombre del usuario en los params
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        //Lo unimos a una sala
        client.join(data.sala);

        //Agregamos el cliente al arreglo
        usuarios.agregarPersona(client.id,data.nombre,data.sala);

        //Listamos todas las personas conectadas y con el to le indicamos que notifique solo a una sala
        client.broadcast.to(data.sala).emit('lista-persona',usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crear-mensaje',
        crearMensaje('Admin',`${data.nombre} se unió`)   
        );
        
        //Le enviamos al cliente el arreglo de las personas conectadas
        callback(usuarios.getPersonasPorSala(data.sala));
        
        
    });

    client.on('crear-mensaje',(data, callback) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(persona.sala).emit('crear-mensaje', crearMensaje(persona.nombre,data.mensaje));

        callback(crearMensaje(persona.nombre,data.mensaje));

    });
    
    client.on('disconnect',() => {
        
        //Borramos a la persona que se desconecta del arreglo
        const usuarioBorrado = usuarios.borrarPersona(client.id);
        
        //Emitimos un mensaje con la información de la persona que se desconecto a todos los clientes
        client.broadcast.to(usuarioBorrado.sala).emit('crear-mensaje',
        crearMensaje('Admin',`${usuarioBorrado.nombre} salio`)   
        );

        //Volvemos a listar a todas las personas para que escuchen todos los clientes
        client.broadcast.to(usuarioBorrado.sala).emit('lista-persona',usuarios.getPersonasPorSala(usuarioBorrado.sala));
    });
    

    client.on('mensaje-privado',(data) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensaje-privado',crearMensaje(persona.nombre,data.mensaje))

    });
});
