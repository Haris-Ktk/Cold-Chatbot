// script.js
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  if (userInput.value.trim() === '') return;

  // Display user message with animation
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user');
  userMessage.innerHTML = `<p>${userInput.value}</p>`;
  chatBox.appendChild(userMessage);

  // Animate input message
  userMessage.style.opacity = "0";
  userMessage.style.transform = "translateY(20px)";
  setTimeout(() => {
    userMessage.style.opacity = "1";
    userMessage.style.transform = "translateY(0)";
    userMessage.style.transition = "all 0.3s ease-out";
  }, 50);

  // Clear input
  const inputText = userInput.value;
  userInput.value = '';

  // Smooth scroll to bottom
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });

  // Display loading indicator
  const loadingMessage = document.createElement('div');
  loadingMessage.classList.add('message', 'bot');
  loadingMessage.innerHTML = `<p>Typing...</p>`;
  chatBox.appendChild(loadingMessage);

  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });

  // Make API call to OpenRouter
  fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "HTTP-Referer": "<YOUR_SITE_URL>",
      "X-Title": "ColdChatbot",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "deepseek/deepseek-r1:free",
      "messages": [
        {
          "role": "user",
          "content": inputText
        }
      ],
      "top_p": 1,
      "temperature": 0.9,
      "repetition_penalty": 1
    })
  })
  .then(response => response.json())
  .then(data => {
    chatBox.removeChild(loadingMessage);

    // Display bot message with animation
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot');
    botMessage.innerHTML = `<p>${data.choices[0].message.content}</p>`;
    chatBox.appendChild(botMessage);

    // Animate bot message
    botMessage.style.opacity = "0";
    botMessage.style.transform = "translateY(20px)";
    setTimeout(() => {
      botMessage.style.opacity = "1";
      botMessage.style.transform = "translateY(0)";
      botMessage.style.transition = "all 0.3s ease-out";
    }, 50);

    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  })
  .catch(error => {
    console.error('Error:', error);
    chatBox.removeChild(loadingMessage);

    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot');
    botMessage.innerHTML = `<p>Sorry, something went wrong. Please try again.</p>`;
    chatBox.appendChild(botMessage);

    botMessage.style.opacity = "0";
    botMessage.style.transform = "translateY(20px)";
    setTimeout(() => {
      botMessage.style.opacity = "1";
      botMessage.style.transform = "translateY(0)";
      botMessage.style.transition = "all 0.3s ease-out";
    }, 50);

    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  });
}
