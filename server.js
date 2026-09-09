const http = require('http');
const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map();

function makeRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}

function broadcast(room, data, except = null) {
  for (const player of room.players) {
    if (player.ws !== except) send(player.ws, data);
  }
}

function serializePlayers(room) {
  return room.players.map(p => ({ id: p.id, x: p.x, y: p.y, name: p.name }));
}

wss.on('connection', (ws) => {
  const player = {
    ws,
    id: Math.random().toString(36).slice(2, 10),
    roomCode: null,
    x: 160,
    y: 220,
    name: 'Player'
  };

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.type === 'create_room') {
      let code;
      do code = makeRoomCode(); while (rooms.has(code));
      const room = { players: [] };
      rooms.set(code, room);
      player.roomCode = code;
      player.name = String(msg.name || 'Player').slice(0, 12);
      room.players.push(player);
      send(ws, { type: 'joined', roomCode: code, id: player.id, players: serializePlayers(room) });
      return;
    }

    if (msg.type === 'join_room') {
      const code = String(msg.roomCode || '').trim().toUpperCase();
      const room = rooms.get(code);
      if (!room) return send(ws, { type: 'error', message: '방을 찾을 수 없습니다.' });
      if (room.players.length >= 2) return send(ws, { type: 'error', message: '이 테스트 방은 2명까지 입장할 수 있습니다.' });
      player.roomCode = code;
      player.name = String(msg.name || 'Player').slice(0, 12);
      player.x = 500;
      player.y = 220;
      room.players.push(player);
      send(ws, { type: 'joined', roomCode: code, id: player.id, players: serializePlayers(room) });
      broadcast(room, { type: 'players', players: serializePlayers(room) });
      return;
    }

    if (msg.type === 'move' && player.roomCode) {
      const room = rooms.get(player.roomCode);
      if (!room) return;
      player.x = Math.max(24, Math.min(776, Number(msg.x) || player.x));
      player.y = Math.max(24, Math.min(426, Number(msg.y) || player.y));
      broadcast(room, { type: 'player_move', id: player.id, x: player.x, y: player.y }, ws);
    }
  });

  ws.on('close', () => {
    if (!player.roomCode) return;
    const room = rooms.get(player.roomCode);
    if (!room) return;
    room.players = room.players.filter(p => p !== player);
    broadcast(room, { type: 'player_left', id: player.id });
    if (room.players.length === 0) rooms.delete(player.roomCode);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
