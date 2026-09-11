const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.topbar nav');

toggle?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.topbar nav a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const chat = document.querySelector('#gio-chat');
const openChat = document.querySelector('#open-gio-chat');
const closeChat = document.querySelector('.chat-close');
const messages = document.querySelector('#chat-messages');
const options = document.querySelector('#chat-options');
const chatForm = document.querySelector('#gio-chat-form');
const chatInput = document.querySelector('#gio-chat-input');
let liveTimer;

const answers = {
  work: 'Gio is a Machine Learning Engineer at Aerendir Mobile Inc. while pursuing an M.S. in Computer Engineering at San José State University. He works across applied ML, privacy-focused technology, and production software.',
  ml: 'His ML work includes biometric and motion-signal modeling, age assurance, AI-generated video detection, and predictive maintenance. He has experience with PyTorch, TensorFlow, Scikit-learn, CNNs, model calibration, and classical ML methods.',
  skills: 'Gio’s strongest areas are machine learning, Python, signal and image processing, full-stack development, and native mobile integration across Android and iOS.',
  opportunities: 'Yes. Gio is open to thoughtful conversations about machine learning, software engineering, research, and roles where technical work can create real-world impact.'
};

function addMessage(text, visitor = false) {
  const message = document.createElement('div');
  message.className = `chat-message ${visitor ? 'visitor-message' : 'assistant-message'}`;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.appendChild(paragraph);
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

function askTopic(topic, label) {
  addMessage(label, true);
  if (topic === 'live') {
    startLiveChat();
    return;
  }
  window.setTimeout(() => addMessage(answers[topic]), 220);
}

function startLiveChat() {
  window.clearInterval(liveTimer);
  const whatsappUrl = 'https://wa.me/14173078134?text=Hi%20Giovanni%2C%20I%27m%20visiting%20your%20portfolio%20and%20would%20like%20to%20chat%20live.';
  const status = addMessage('WhatsApp is opening with a message ready to send. After you send it, give Gio up to one minute to reply.');
  const countdown = document.createElement('p');
  countdown.className = 'chat-countdown';
  status.appendChild(countdown);

  window.open(whatsappUrl, '_blank', 'noopener');

  let seconds = 60;
  const updateCountdown = () => {
    countdown.textContent = `Waiting for Gio · 0:${String(seconds).padStart(2, '0')}`;
  };
  updateCountdown();

  liveTimer = window.setInterval(() => {
    seconds -= 1;
    updateCountdown();
    if (seconds <= 0) {
      window.clearInterval(liveTimer);
      status.remove();
      const fallback = addMessage('If Gio has not replied in WhatsApp, he is probably unavailable right now. Leave him a message or send an email — he’ll respond as soon as possible.');
      const actions = document.createElement('div');
      actions.className = 'chat-fallback';
      actions.innerHTML = `<a class="whatsapp-link" href="${whatsappUrl}" target="_blank" rel="noreferrer">Message on WhatsApp</a><a href="mailto:casconegb@gmail.com?subject=Portfolio%20inquiry">Send an email</a>`;
      fallback.appendChild(actions);
      messages.scrollTop = messages.scrollHeight;
    }
  }, 1000);
}

function answerFreeform(question) {
  const query = question.toLowerCase();
  if (/live|talk|chat|call|whatsapp/.test(query)) return startLiveChat();
  if (/skill|stack|technology|tools/.test(query)) return addMessage(answers.skills);
  if (/machine learning|\bml\b|ai|project|a-ge|checker|autoprognosis/.test(query)) return addMessage(answers.ml);
  if (/job|work|role|company|aerendir/.test(query)) return addMessage(answers.work);
  if (/available|opportunit|hire|recruit/.test(query)) return addMessage(answers.opportunities);
  addMessage('I can tell you about Gio’s work, machine-learning projects, technical skills, or availability. You can also choose “Chat with Gio live” below.');
}

openChat?.addEventListener('click', () => {
  chat.showModal();
  chatInput.focus();
});

closeChat?.addEventListener('click', () => chat.close());
chat?.addEventListener('click', (event) => {
  if (event.target === chat) chat.close();
});

options?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-topic]');
  if (!button) return;
  askTopic(button.dataset.topic, button.textContent.trim());
});

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  addMessage(question, true);
  chatInput.value = '';
  window.setTimeout(() => answerFreeform(question), 220);
});
