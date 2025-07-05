

let clients = {}

export const getWebSocket = (key) => clients[key]

export const putWebSocket = (key, socket) => {
  clients[key] = socket
}

export const clearWebSockets = () => clients = {}
