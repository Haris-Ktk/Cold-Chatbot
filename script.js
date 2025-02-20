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

  // Display user message
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user');
  userMessage.innerHTML = `<p>${userInput.value}</p>`;
  chatBox.appendChild(userMessage);

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

  // Smooth scroll to bottom after adding loading message
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });

  // Make API call to OpenRouter
  fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "ColdChatbot", // Optional. Site title for rankings on openrouter.ai.
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
      "top_p": 1, // Controls diversity of responses
      "temperature": 0.9, // Controls creativity (0 = deterministic, 1 = creative)
      "repetition_penalty": 1 // Penalizes repetition (1 = no penalty, >1 = less repetition)
    })
  })
  .then(response => response.json())
  .then(data => {
    // Remove loading indicator
    chatBox.removeChild(loadingMessage);

    // Display bot message
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot');
    botMessage.innerHTML = `<p>${data.choices[0].message.content}</p>`;
    chatBox.appendChild(botMessage);

    // Smooth scroll to bottom
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  })
  .catch(error => {
    console.error('Error:', error);
    // Remove loading indicator
    chatBox.removeChild(loadingMessage);

    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot');
    botMessage.innerHTML = `<p>Sorry, something went wrong. Please try again.</p>`;
    chatBox.appendChild(botMessage);

    // Smooth scroll to bottom
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  });
}