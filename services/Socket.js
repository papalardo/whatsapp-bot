function Socket() {
    let server;

    const emit = (eventName, payload) => server.emit(eventName, payload);

    const setServer = (newServer) => server = newServer;

    return {
        server,
        emit,
        setServer,
    }
}

export default Socket();