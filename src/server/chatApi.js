// Multi-device real-time chat & presence engine (Linewize-safe HTTP/REST + SSE)

// In-memory store
const MAX_MESSAGES = 500;
let messages = [
  {
    id: 'msg-init-1',
    channel: 'general',
    sender: 'Jace',
    badge: 'Creator',
    avatar: '👑',
    chatColor: '#ef4444',
    status: 'Developer 🚀',
    text: 'Welcome to the live NeoSphere Multi-Device Lounge! 🎮 Real cross-device chat is now fully active across schools & networks.',
    timestamp: '10:15 AM',
    createdAt: Date.now() - 3600000,
    reactions: { '🔥': 8, '👑': 5 }
  },
  {
    id: 'msg-init-2',
    channel: 'general',
    sender: 'NeoBot',
    badge: 'AI Guide',
    avatar: '🤖',
    chatColor: '#38bdf8',
    status: 'Ready to assist ⚡',
    text: 'Talk with anyone on this site in real time! Your messages sync live across different laptops, Chromebooks, and tabs.',
    timestamp: '10:18 AM',
    createdAt: Date.now() - 3000000,
    reactions: { '✨': 6, '👍': 4 }
  },
  {
    id: 'msg-init-3',
    channel: 'paper-io-2',
    sender: 'VoodooKing',
    avatar: '👑',
    chatColor: '#34d399',
    status: 'Conquering 100% 🏆',
    text: 'Drop your highest Paper.io 2 conquest percentage here! I hit 89% today.',
    timestamp: '11:00 AM',
    createdAt: Date.now() - 1800000,
    reactions: { '👑': 7, '🔥': 4 }
  },
  {
    id: 'msg-init-4',
    channel: 'stealth-mode',
    sender: 'ShadowOperative',
    avatar: '🕶️',
    chatColor: '#c084fc',
    status: 'In Class 🤫',
    text: 'Remember to use [Escape] or Stealth Disguise to instantly hide this chat as a Google Classroom study workspace when needed!',
    timestamp: '11:15 AM',
    createdAt: Date.now() - 900000,
    reactions: { '💀': 5, '👀': 4 }
  }
];

// Active real-time online peers
const activeUsers = new Map();

// Active SSE client connections
const sseClients = new Set();

export const broadcastSSE = (eventType, data) => {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch (err) {
      sseClients.delete(res);
    }
  }
};

// Periodic cleanup of stale online users (inactive for > 20s)
setInterval(() => {
  const now = Date.now();
  for (const [userId, user] of activeUsers.entries()) {
    if (now - user.lastSeen > 22000) {
      activeUsers.delete(userId);
    }
  }
}, 5000);

export function setupChatApi(app) {
  // 1. Get all messages (or filtered by channel and since timestamp)
  app.get('/api/chat/messages', (req, res) => {
    const channel = req.query.channel;
    const since = parseInt(req.query.since || '0', 10);

    let filtered = messages;
    if (channel && channel !== 'all') {
      filtered = filtered.filter(m => m.channel === channel);
    }
    if (since > 0) {
      filtered = filtered.filter(m => (m.createdAt || 0) > since);
    }

    const onlineList = Array.from(activeUsers.values()).map(u => ({
      id: u.id,
      nickname: u.nickname,
      avatar: u.avatar,
      chatColor: u.chatColor,
      status: u.status,
      channel: u.channel,
      badge: u.badge || null
    }));

    res.json({
      success: true,
      messages: filtered,
      serverTime: Date.now(),
      onlineCount: Math.max(onlineList.length, 1),
      onlineUsers: onlineList
    });
  });

  // 2. Send a new message
  app.post('/api/chat/messages', (req, res) => {
    try {
      const { channel, sender, avatar, chatColor, status, text, replyTo, badge } = req.body || {};
      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Message text is required' });
      }

      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        channel: channel || 'general',
        sender: (sender || 'Anonymous').trim().substring(0, 24),
        badge: badge || null,
        avatar: avatar || '🎮',
        chatColor: chatColor || '#38bdf8',
        status: status || 'Playing NeoSphere 🎮',
        text: text.trim().substring(0, 500),
        timestamp: formattedTime,
        createdAt: Date.now(),
        replyTo: replyTo || null,
        reactions: {},
      };

      messages.push(newMsg);
      if (messages.length > MAX_MESSAGES) {
        messages = messages.slice(messages.length - MAX_MESSAGES);
      }

      // Broadcast to live SSE subscribers
      broadcastSSE('NEW_MESSAGE', newMsg);

      return res.json({ success: true, message: newMsg });
    } catch (err) {
      console.error('Chat send error:', err);
      return res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // 3. Add or toggle reaction on a message
  app.post('/api/chat/reaction', (req, res) => {
    try {
      const { msgId, emoji } = req.body || {};
      if (!msgId || !emoji) {
        return res.status(400).json({ error: 'msgId and emoji are required' });
      }

      const targetMsg = messages.find(m => m.id === msgId);
      if (!targetMsg) {
        return res.status(404).json({ error: 'Message not found' });
      }

      targetMsg.reactions = targetMsg.reactions || {};
      targetMsg.reactions[emoji] = (targetMsg.reactions[emoji] || 0) + 1;

      broadcastSSE('UPDATE_REACTION', { msgId, reactions: targetMsg.reactions, emoji });

      return res.json({ success: true, message: targetMsg });
    } catch (err) {
      return res.status(500).json({ error: 'Reaction error' });
    }
  });

  // 4. Delete a message
  app.delete('/api/chat/messages/:id', (req, res) => {
    const id = req.params.id;
    messages = messages.filter(m => m.id !== id);
    broadcastSSE('DELETE_MESSAGE', { id });
    return res.json({ success: true });
  });

  // 5. Heartbeat & Online Presence
  app.post('/api/chat/heartbeat', (req, res) => {
    try {
      const { userId, nickname, avatar, chatColor, status, channel } = req.body || {};
      if (userId) {
        activeUsers.set(userId, {
          id: userId,
          nickname: (nickname || 'NeoGamer').trim().substring(0, 24),
          avatar: avatar || '🎮',
          chatColor: chatColor || '#38bdf8',
          status: status || 'Online',
          channel: channel || 'general',
          lastSeen: Date.now()
        });
      }
      return res.json({
        success: true,
        onlineCount: Math.max(activeUsers.size, 1),
        onlineUsers: Array.from(activeUsers.values()).map(u => ({
          id: u.id,
          nickname: u.nickname,
          avatar: u.avatar,
          chatColor: u.chatColor,
          status: u.status,
          channel: u.channel
        }))
      });
    } catch (e) {
      return res.status(200).json({ success: true, onlineCount: 1, onlineUsers: [] });
    }
  });

  // 6. Real-time Server-Sent Events (SSE) Stream
  app.get('/api/chat/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);

    // Initial ping
    res.write(`event: CONNECTED\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`);

    const keepAlive = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch (err) {
        clearInterval(keepAlive);
        sseClients.delete(res);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });
}
