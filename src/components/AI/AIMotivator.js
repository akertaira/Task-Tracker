// src/components/AI/AIMotivator.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/AIMotivator.css';

function AIMotivator() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState('neutral');

  // Мотивационные фразы и советы
  const motivationalQuotes = {
    tired: [
      "💪 Ты уже прошел большой путь! Усталость - это признак того, что ты стараешься. Сделай короткий перерыв и продолжай!",
      "😊 Помни: даже самый длинный путь начинается с первого шага. Ты уже сделал этот шаг!",
      "🌟 Твоя усталость говорит о том, что ты вкладываешь душу в дело. Отдохни 5 минут и возвращайся с новыми силами!",
      "🎯 Каждая маленькая победа приближает тебя к большой цели. Ты справишься!"
    ],
    stressed: [
      "🧘 Глубокий вдох... Выдох... Ты контролируешь ситуацию, а не она тебя.",
      "🌸 Стресс - это временно. Твои достижения останутся навсегда. Сделай паузу и оцени, как много ты уже сделал!",
      "🎨 Попробуй разбить сложную задачу на маленькие шаги. Так она покажется менее пугающей.",
      "💆 Помни: идеального результата не существует. Сделай достаточно хорошо и двигайся дальше!"
    ],
    stuck: [
      "🔓 Застрял? Попробуй посмотреть на задачу под другим углом. Иногда ответ находится там, где его не ждешь.",
      "🤝 Не бойся попросить помощи или совета. Даже гении консультируются с коллегами.",
      "📝 Выпиши все, что тебе нужно сделать, и отметь уже выполненное. Ты увидишь прогресс!",
      "⏰ Если задача кажется непосильной, установи таймер на 25 минут и работай только над одной маленькой частью."
    ],
    unmotivated: [
      "🔥 Вспомни, зачем ты начал этот путь. Твоя цель все еще ждет тебя!",
      "🏆 Каждая выполненная задача - это маленькая победа. Отмечай их и хвали себя!",
      "🎬 Представь, как ты будешь гордиться собой, когда закончишь. Это чувство стоит усилий.",
      "📈 Сделай всего один маленький шаг. Всего один. А дальше будет легче."
    ],
    confused: [
      "🧩 Сложные задачи - это просто набор простых действий. Разложи все по полочкам.",
      "🗺️ Составь план действий: что сделать сначала, что потом. Дорога появится под ногами идущего.",
      "📚 Возможно, тебе нужно немного изучить тему. Не стесняйся гуглить и спрашивать!",
      "💡 Попробуй объяснить задачу кому-то вслух. Часто решение приходит во время объяснения."
    ],
    successful: [
      "🎉 Поздравляю! Ты отлично справился! Твои усилия принесли плоды!",
      "🏅 Ты настоящий герой! Каждая победа делает тебя сильнее!",
      "⭐ Блестящая работа! Ты доказал, что способен на многое!",
      "🚀 Вот это результат! Твоя настойчивость и труд окупились сторицей!",
      "💪 Ты справился! Помни это чувство победы - оно поможет в будущих задачах.",
      "🎯 Цель достигнута! Ты показал отличный результат. Горжусь тобой!",
      "🌟 Отличная работа! Ты превзошел ожидания!",
      "🏆 Победа! Ты сделал это! Теперь можно и отдохнуть с чистой совестью."
    ]
  };

  // Анализ настроения пользователя
  const analyzeMood = (message) => {
    const text = message.toLowerCase();
    
    // Успех - проверяем первым, так как это позитивные фразы
    const successKeywords = [
      'успех', 'получилось', 'сделал', 'сделала', 'ура', 'готово', 'справился', 
      'справилась', 'победа', 'отлично', 'замечательно', 'классно', 'супер',
      'молодец', 'хвастаться', 'похвастаться', 'горжусь', 'доволен', 'довольна',
      'наконец-то', 'доделал', 'закончил', 'финиш', 'готово', 'выполнил', 'выполнила',
      'сдал', 'защитил', 'проект готов', 'задача решена', 'баг пофиксил'
    ];
    
    for (const word of successKeywords) {
      if (text.includes(word)) {
        return 'successful';
      }
    }
    
    // Остальные проверки
    if (text.includes('устал') || text.includes('устала') || text.includes('нет сил') || text.includes('вымотан')) {
      return 'tired';
    }
    if (text.includes('стресс') || text.includes('нерв') || text.includes('волнуюсь') || text.includes('давление') || text.includes('тревога')) {
      return 'stressed';
    }
    if (text.includes('застрял') || text.includes('застряла') || text.includes('не знаю как') || text.includes('тупик') || text.includes('не могу решить')) {
      return 'stuck';
    }
    if (text.includes('не хочу') || text.includes('лень') || text.includes('нет мотивации') || text.includes('бросить') || text.includes('надоело')) {
      return 'unmotivated';
    }
    if (text.includes('запутался') || text.includes('запуталась') || text.includes('не понимаю') || text.includes('сложно') || text.includes('тяжело')) {
      return 'confused';
    }
    
    return 'neutral';
  };

  // Получение ответа от ИИ
  const getAIResponse = async (message, moodType) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (moodType === 'successful') {
      const quotes = motivationalQuotes.successful;
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    if (moodType === 'neutral') {
      const neutralResponses = [
        "🙂 Я здесь, чтобы поддержать тебя. Расскажи, что тебя беспокоит или с чем нужна помощь?",
        "🤗 Привет! Как проходят твои дела? Может, нужен совет или просто поддержка?",
        "💬 Чем могу помочь сегодня? Вместе мы справимся с любой задачей!"
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
    }
    
    const quotes = motivationalQuotes[moodType];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  // Отправка сообщения
  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    
    const userMsg = { text: userMessage, sender: 'user', timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    
    const currentMessage = userMessage;
    const moodType = analyzeMood(currentMessage);
    setMood(moodType);
    setUserMessage('');
    setIsTyping(true);
    
    const response = await getAIResponse(currentMessage, moodType);
    
    setIsTyping(false);
    const aiMsg = { text: response, sender: 'ai', mood: moodType, timestamp: new Date() };
    setChatHistory(prev => [...prev, aiMsg]);
  };

  // Приветственное сообщение
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const welcomeMsg = {
        text: "👋 Привет! Я твой мотивационный помощник. Расскажи, как твои дела? Что тебя беспокоит или с чем нужна помощь? Я здесь, чтобы поддержать и помочь справиться с любыми трудностями! 💪",
        sender: 'ai',
        timestamp: new Date()
      };
      setChatHistory([welcomeMsg]);
    }
  }, [isOpen]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickTips = [
    { emoji: "💪", text: "Я устал(а)", mood: "tired" },
    { emoji: "😰", text: "Мне тревожно", mood: "stressed" },
    { emoji: "🔒", text: "Застрял на задаче", mood: "stuck" },
    { emoji: "😔", text: "Нет мотивации", mood: "unmotivated" },
    { emoji: "🤔", text: "Запутался(лась)", mood: "confused" },
    { emoji: "🎉", text: "У меня успех!", mood: "successful" }
  ];

  const handleQuickTip = (tipMood, tipText) => {
    setUserMessage(tipText);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <div className="ai-motivator">
      <button 
        className="motivator-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="btn-icon">💬</span>
        <span className="btn-text">Поддержка</span>
      </button>
      
      {isOpen && (
        <div className="motivator-panel">
          <div className="motivator-header">
            <div className="header-info">
              <span className="header-icon">🤗</span>
              <div>
                <h3>Твой мотивационный помощник</h3>
                <p>Я здесь, чтобы поддержать и помочь</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="motivator-chat">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'ai' ? '🤗' : '👤'}
                </div>
                <div className="message-bubble">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message ai">
                <div className="message-avatar">🤗</div>
                <div className="message-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="quick-tips">
            <p className="tips-title">⚡ Быстрые ответы:</p>
            <div className="tips-grid">
              {quickTips.map((tip, idx) => (
                <button
                  key={idx}
                  className="tip-btn"
                  onClick={() => handleQuickTip(tip.mood, tip.text)}
                >
                  <span>{tip.emoji}</span>
                  <span>{tip.text}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="motivator-input">
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напиши, что тебя беспокоит или поделись успехом..."
              rows="2"
            />
            <button onClick={sendMessage} disabled={!userMessage.trim()}>
              Отправить
            </button>
          </div>
          
          <div className="motivator-footer">
            <p>✨ Ты не один. Я всегда рядом, чтобы поддержать.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIMotivator;