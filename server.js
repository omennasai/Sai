const http = require('http');
const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map();
const RECONNECT_GRACE_MS = 30000;

function makeRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function makeToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function send(ws, data) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}

function broadcast(room, data, except = null) {
  for (const p of room.players) {
    if (p.ws && p.ws !== except) send(p.ws, data);
  }
}

function serializePlayers(room) {
  return room.players.map(p => ({ id: p.id, x: p.x, y: p.y, name: p.name, connected: !!p.ws }));
}

function cleanupRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.players = room.players.filter(p => p.ws || !p.disconnectedAt || Date.now() - p.disconnectedAt < RECONNECT_GRACE_MS);
  if (room.players.length === 0) rooms.delete(roomCode);
}

wss.on('connection', (ws) => {
  let player = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.type === 'ping') {
      send(ws, { type: 'pong', sentAt: Number(msg.sentAt) || Date.now() });
      return;
    }

    if (msg.type === 'resume_room') {
      const code = String(msg.roomCode || '').trim().toUpperCase();
      const token = String(msg.sessionToken || '');
      const room = rooms.get(code);
      if (!room) return send(ws, { type: 'resume_failed' });
      const found = room.players.find(p => p.sessionToken === token);
      if (!found) return send(ws, { type: 'resume_failed' });
      if (found.disconnectTimer) clearTimeout(found.disconnectTimer);
      found.ws = ws;
      found.disconnectedAt = null;
      found.disconnectTimer = null;
      player = found;
      send(ws, {
        type: 'joined',
        resumed: true,
        roomCode: code,
        id: found.id,
        sessionToken: found.sessionToken,
        players: serializePlayers(room),
        chatHistory: room.chat.slice(-30)
      });
      broadcast(room, { type: 'players', players: serializePlayers(room) });
      return;
    }

    if (msg.type === 'create_room') {
      let code;
      do code = makeRoomCode(); while (rooms.has(code));
      const room = { players: [], chat: [] };
      rooms.set(code, room);
      player = { ws, id: Math.random().toString(36).slice(2, 10), sessionToken: makeToken(), roomCode: code, x: 160, y: 220, name: String(msg.name || 'Player').slice(0, 12), disconnectedAt: null, disconnectTimer: null };
      room.players.push(player);
      send(ws, { type: 'joined', roomCode: code, id: player.id, sessionToken: player.sessionToken, players: serializePlayers(room), chatHistory: [] });
      return;
    }

    if (msg.type === 'join_room') {
      const code = String(msg.roomCode || '').trim().toUpperCase();
      const room = rooms.get(code);
      if (!room) return send(ws, { type: 'error', message: '방을 찾을 수 없습니다.' });
      cleanupRoom(code);
      const activeCount = room.players.filter(p => p.ws).length;
      if (activeCount >= 2) return send(ws, { type: 'error', message: '이 테스트 방은 2명까지 입장할 수 있습니다.' });
      player = { ws, id: Math.random().toString(36).slice(2, 10), sessionToken: makeToken(), roomCode: code, x: 500, y: 220, name: String(msg.name || 'Player').slice(0, 12), disconnectedAt: null, disconnectTimer: null };
      room.players.push(player);
      send(ws, { type: 'joined', roomCode: code, id: player.id, sessionToken: player.sessionToken, players: serializePlayers(room), chatHistory: room.chat.slice(-30) });
      broadcast(room, { type: 'players', players: serializePlayers(room) });
      return;
    }

    if (!player || !player.roomCode) return;
    const room = rooms.get(player.roomCode);
    if (!room) return;

    if (msg.type === 'move') {
      player.x = Math.max(24, Math.min(776, Number(msg.x) || player.x));
      player.y = Math.max(24, Math.min(426, Number(msg.y) || player.y));
      broadcast(room, { type: 'player_move', id: player.id, x: player.x, y: player.y }, ws);
      return;
    }

    if (msg.type === 'chat') {
      const text = String(msg.text || '').trim().slice(0, 200);
      if (!text) return;
      const chat = { type: 'chat', id: player.id, name: player.name, text, at: Date.now() };
      room.chat.push(chat);
      if (room.chat.length > 50) room.chat.splice(0, room.chat.length - 50);
      broadcast(room, chat);
    }
  });

  ws.on('close', () => {
    if (!player || !player.roomCode) return;
    const room = rooms.get(player.roomCode);
    if (!room) return;
    player.ws = null;
    player.disconnectedAt = Date.now();
    broadcast(room, { type: 'players', players: serializePlayers(room) });
    player.disconnectTimer = setTimeout(() => {
      const currentRoom = rooms.get(player.roomCode);
      if (!currentRoom || player.ws) return;
      currentRoom.players = currentRoom.players.filter(p => p !== player);
      broadcast(currentRoom, { type: 'player_left', id: player.id });
      if (currentRoom.players.length === 0) rooms.delete(player.roomCode);
    }, RECONNECT_GRACE_MS);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
