const socket = new WebSocket('ws://localhost:3001');

socket.onopen = () => {
    console.log('Verbunden mit dem Server');
    // Nachrichten an den Server senden
    socket.send('Hallo Server');
};

socket.onmessage = (event) => {
    console.log('Nachricht vom Server:', event.data);
};

socket.onclose = () => {
    console.log('Verbindung zum Server geschlossen');
};

socket.onerror = (error) => {
    console.error('WebSocket-Fehler:', error);
};