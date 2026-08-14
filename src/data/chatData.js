// Pre-seeded initial community messages across channels
export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-init-1',
    channel: 'general',
    sender: 'Jace',
    badge: 'Creator',
    avatar: '👑',
    chatColor: '#ef4444',
    status: 'Developer 🚀',
    text: 'Welcome to the official NeoSphere Multi-Room Lounge! 🎮 Paper.io 2 is now live with 100% offline Linewize filter protection.',
    timestamp: '10:15 AM',
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
    text: 'Ask me anything about gaming tips, secret unblocked tricks, or Paper.io 2 strategy! Type @NeoBot to get instant guidance.',
    timestamp: '10:18 AM',
    reactions: { '✨': 6, '👍': 4 }
  },
  {
    id: 'msg-init-3',
    channel: 'general',
    sender: 'CyberPhantom_42',
    avatar: '👾',
    chatColor: '#c084fc',
    status: 'In-Game 🕹️',
    text: 'Paper.io 2 runs so smoothly now! Just reached 48% map conquest on my first try.',
    timestamp: '10:22 AM',
    reactions: { '🚀': 4, '💯': 3 }
  },
  {
    id: 'msg-init-4',
    channel: 'game-tips',
    sender: 'HexBlade',
    avatar: '⚡',
    chatColor: '#fbbf24',
    status: 'Paper.io 2 Grinding ⚡',
    text: 'Paper.io 2 Pro Tip: Stick to the map borders first and build small territory loops. Heading straight to the middle leaves your tail vulnerable!',
    timestamp: '10:35 AM',
    reactions: { '🔥': 9, '✨': 3 }
  },
  {
    id: 'msg-init-5',
    channel: 'paper-io-2',
    sender: 'VoodooKing',
    avatar: '👑',
    chatColor: '#34d399',
    status: 'Conquering 100% 🏆',
    text: 'Who has hit the 80% conquest milestone yet? Let me know your top scores in this channel!',
    timestamp: '11:00 AM',
    reactions: { '👑': 7, '🔥': 4 }
  },
  {
    id: 'msg-init-6',
    channel: 'stealth-mode',
    sender: 'ShadowOperative',
    avatar: '🕶️',
    chatColor: '#c084fc',
    status: 'In Class (Stealth Mode) 🤫',
    text: 'School Filter Lifehack: Press [Escape] or click the Panic button in the header anytime to instantly disguise the screen as Google Classroom or Wikipedia!',
    timestamp: '11:15 AM',
    reactions: { '💀': 5, '👀': 4 }
  },
  {
    id: 'msg-init-7',
    channel: 'off-topic',
    sender: 'PixelKnight',
    avatar: '🎮',
    chatColor: '#f472b6',
    status: 'Playing NeoSphere 🎮',
    text: 'What game should Jace add next to the NeoSphere portal? Leave your votes here!',
    timestamp: '11:30 AM',
    reactions: { '🎮': 5, '❤️': 3 }
  }
];

// Active virtual community members
export const ONLINE_MEMBERS = [
  { name: 'Jace', badge: 'Creator', avatar: '👑', chatColor: '#ef4444', status: 'Developer 🚀' },
  { name: 'NeoBot', badge: 'AI Bot', avatar: '🤖', chatColor: '#38bdf8', status: 'Online 24/7 ⚡' },
  { name: 'HexBlade', badge: 'Pro Gamer', avatar: '⚡', chatColor: '#fbbf24', status: 'Paper.io 2 (92%) 🏆' },
  { name: 'CyberPhantom_42', badge: 'VIP', avatar: '👾', chatColor: '#c084fc', status: 'In-Game 🕹️' },
  { name: 'VoodooKing', badge: 'Champion', avatar: '👑', chatColor: '#34d399', status: 'Territory Master 🚩' },
  { name: 'ShadowOperative', badge: 'Stealth', avatar: '🕶️', chatColor: '#a1a1aa', status: 'In Class 🤫' },
  { name: 'PixelKnight', badge: 'Member', avatar: '🎮', chatColor: '#f472b6', status: 'Arcade Hopper 🕹️' },
  { name: 'AeroStrike', badge: 'Member', avatar: '🚀', chatColor: '#38bdf8', status: 'Slope Highscore 🏁' }
];

// Contextual dynamic bot response engine
export const generateBotResponse = (userText, channel, senderName) => {
  const text = (userText || '').toLowerCase();

  // Determine replying bot persona
  let bot = ONLINE_MEMBERS[1]; // NeoBot default
  let reply = '';
  let reaction = null;

  if (text.includes('paper') || text.includes('tail') || text.includes('territory') || channel === 'paper-io-2') {
    bot = Math.random() > 0.5 ? ONLINE_MEMBERS[2] : ONLINE_MEMBERS[4]; // HexBlade or VoodooKing
    const paperTips = [
      `Great strategy @${senderName}! In Paper.io 2, never stretch your trail beyond 30% of the screen width unless you see all enemies turn away. Small tight loops are unstoppable! 🔥`,
      `Nice one! If you eliminate a player by biting their tail while they are expanding, you can quickly claim their left-behind zone before anyone else does! ⚡`,
      `@${senderName} My personal Paper.io 2 record is 89.4% map coverage! Focus on hugging the screen edges first to build an unassailable corner base! 🏆`,
      `Pro tactic for Paper.io: Whenever an aggressive bot rushes you, retreat into your solid color zone immediately—inside your territory you are completely invincible! 🛡️`
    ];
    reply = paperTips[Math.floor(Math.random() * paperTips.length)];
    reaction = '🔥';
  } else if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('yo') || text.includes('sup') || text.includes('anyone')) {
    bot = Math.random() > 0.5 ? ONLINE_MEMBERS[1] : ONLINE_MEMBERS[0]; // NeoBot or Jace
    const greetings = [
      `Hey there @${senderName}! Welcome to the NeoSphere Lounge! What game are you playing today? 🎮`,
      `Yo @${senderName}! Great to see you in #${channel}. Need any game recommendations or secrets? ⚡`,
      `Hello @${senderName}! Ready for some high-score action? The chat is buzzing today! 🚀`,
      `Sup @${senderName}! Everything is running super fast and unblocked today. Enjoy the arcade! 🕹️`
    ];
    reply = greetings[Math.floor(Math.random() * greetings.length)];
    reaction = '👍';
  } else if (text.includes('panic') || text.includes('school') || text.includes('stealth') || text.includes('block') || text.includes('linewize') || channel === 'stealth-mode') {
    bot = ONLINE_MEMBERS[5]; // ShadowOperative
    const stealthTips = [
      `@${senderName} Always remember the emergency key! Hit [Escape] at any moment to trigger instant Google Classroom or Wikipedia disguise mode. 🕶️`,
      `Also you can use the Tab Cloaker in Panic Settings to change your browser tab title and favicon to Google Docs or Canvas LMS! 🛡️`,
      `NeoSphere runs 100% client-side with zero blocked external analytics or GameMonetize tracker stalls. Stay stealthy! 🤫`
    ];
    reply = stealthTips[Math.floor(Math.random() * stealthTips.length)];
    reaction = '💀';
  } else if (text.includes('jace') || text.includes('creator') || text.includes('dev') || text.includes('update')) {
    bot = ONLINE_MEMBERS[0]; // Jace
    reply = `Hey @${senderName}, Jace here! Thanks for hanging out on NeoSphere! Let me know if you want any specific games added or features improved. 🚀`;
    reaction = '👑';
  } else if (text.includes('game') || text.includes('recommend') || text.includes('play') || text.includes('best') || channel === 'game-tips') {
    bot = Math.random() > 0.5 ? ONLINE_MEMBERS[1] : ONLINE_MEMBERS[6]; // NeoBot or PixelKnight
    const recommendations = [
      `@${senderName} Definitely check out Paper.io 2, Slope Runner, Cyber Flap, or Retro Arcade! What genre is your favorite? 👾`,
      `If you like fast reflex games, try Slope! For tactical territory wars, Paper.io 2 is the most addictive! ⚡`,
      `Don't forget you can add any custom unblocked game link by clicking the "+ Add Game" button in the top right! 🎮`
    ];
    reply = recommendations[Math.floor(Math.random() * recommendations.length)];
    reaction = '🎮';
  } else {
    // General friendly conversational reply
    const randomGamers = [ONLINE_MEMBERS[1], ONLINE_MEMBERS[3], ONLINE_MEMBERS[6], ONLINE_MEMBERS[7]];
    bot = randomGamers[Math.floor(Math.random() * randomGamers.length)];
    const generalReplies = [
      `Totally agree with you @${senderName}! 💯`,
      `@${senderName} That's awesome! Let's get some matches in! 🚀`,
      `Good point @${senderName}! What's your current high score? 🏆`,
      `Haha true! NeoSphere is the best place to chill after classes. 🎮`,
      `@${senderName} Thanks for the message! Keep grinding! 🔥`
    ];
    reply = generalReplies[Math.floor(Math.random() * generalReplies.length)];
    reaction = '✨';
  }

  return {
    bot,
    reply,
    reaction
  };
};

// Web Audio API Retro Sound Synthesizer (Zero external audio files, 100% offline & fast)
export const playChatChime = (type = 'receive') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'send') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // AudioContext blocked by browser autoplay policy until user gesture
  }
};
