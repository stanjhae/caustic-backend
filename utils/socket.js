const IO = require('socket.io');

const io = new IO();
let namespaces = [];

io.on('connection', () => {
  console.log('a user connected');
});

exports.initSocket = (server) => {
  io.attach(server);
};

exports.initNamespace = () => {
  const nsp = io.of(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/);
  nsp.on('connection', (socket) => {
    namespaces.push(socket.nsp);
    socket.on('disconnect', () => {
      console.log('a user has disconnected');
      exports.removeNamespace(socket.nsp);
    });
  });
};

io.of('/').emit('hi', 'everyone');

exports.getAllNamespace = () => namespaces;

exports.getNamespace = (userspace) => {
  let namespace = {};
  namespaces.forEach((space) => {
    if (space.name.toString().replace('/', '') === userspace.toString()) {
      namespace = space;
    }
  });

  return namespace;
};

exports.removeNamespace = (userspace) => {
  namespaces = namespaces.filter(space => space.name !== userspace.name);
};

exports.excludeNamespace = (userspace) => {
  const exnamespaces = [];
  namespaces.forEach((space) => {
    if (space.name.toString().replace('/', '') !== userspace.toString()) {
      exnamespaces.push(space);
    }
  });
  return exnamespaces;
};

exports.broadcastNamespace = (spaces, item, event, message) => {
  spaces.forEach((space) => {
    console.log('space', space.name);
    space.emit(event, {
      message,
      result: item,
    });
  });
};
