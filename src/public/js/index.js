const socket = io()


function obtainProduct(){
    const newProduct = document.getElementById("formEntry")
    socket.emit('obtainProducts', newProduct)
}




socket.emit('message', 'Hola! Me c omu nico desde un websockjet')