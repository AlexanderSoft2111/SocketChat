//var socket = io();
var params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre');
let divUsuarios = $('#divUsuarios');
let formChat = $('#formChat');
let textMensaje = $('#textMensaje');
let divChatbox = $('#divChatbox');

const renderizarUsuarios = (personas) => {

    let html = '';

    html += '<li>'; 
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>'+params.get('sala')+'</span></a>';     
    html += '</li>'; 

    for (let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="'+personas[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+personas[i].nombre+' <small class="text-success">online</small></span></a>';    
        html += '</li>';
        
    }

    divUsuarios.html(html);

}

const renderizarMensajes = (mensaje, yo) => {

    let html = '';
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ' : ' + fecha.getMinutes();
    let adminClass = 'info';

    if(mensaje.nombre === 'Admin'){
        adminClass = 'danger';
    }

    if(yo){

        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.nombre+'</h5>';
        html += '        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    } else {

        html += '<li>';
        if(mensaje.nombre !== 'Admin'){

            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.nombre+'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'.</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }

    divChatbox.append(html);

}

const scrollBottom = () => {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//listeners para obtener el id del usuario
divUsuarios.on('click','a', function() {
    const id = $(this).data('id');
    
    if(id){
        
        console.log(id);
    }
    
});

//listeners para obtener el valor de la caja de texto
formChat.on('submit',function(e) {
    e.preventDefault();

    if(textMensaje.val().trim() === 0){
        return;
    }
 
 //   Enviar información
 socket.emit('crear-mensaje', {
     nombre: nombre,
     mensaje: textMensaje.val()
 }, function(mensaje) {
    renderizarMensajes(mensaje,true);
     textMensaje.val('').focus();
     scrollBottom();
 });


});
