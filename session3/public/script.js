const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Keep track of the conversation history for the API
let conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userText = input.value.trim();
  if (!userText) return;

  // Add the user's message to our local conversation history
  conversation.push({ role: 'user', text: userText });

  // Add the user's message to the UI
  appendMessage('user', userText);
  input.value = '';

  // Show a temporary "Thinking..." bot message
  const thinkingElement = appendMessage('model', 'Thinking...');

  try {
    // Send the conversation history to our backend endpoint
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.result) {
      // Replace the "Thinking..." message with the actual AI response
      thinkingElement.innerHTML = marked.parse(data.result);

      // Save the model's response to the conversation history
      conversation.push({ role: 'model', text: data.result });
    } else {
      thinkingElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error communicating with the chat API:', error);
    thinkingElement.textContent = 'Failed to get response from server.';
  }
});

// Helper function to append a message to the DOM
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  // Use "user" or "model" as the class based on who is sending it
  msg.classList.add('message', sender);
  
  // Format the text: Parse Markdown for AI models, use safe textContent for users
  if (sender === 'model') {
    msg.innerHTML = marked.parse(text);
  } else {
    msg.textContent = text;
  }

  chatBox.appendChild(msg);

  // Auto-scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg;
}

// Display a greeting message when the page loads
window.addEventListener('DOMContentLoaded', () => {
  const greetingText = "Halo! Selamat datang Kopi Senja. Ada yang bisa saya bantu untuk pesanan kopi atau cemilannya hari ini? ☕";

  // Tampilkan di UI
  appendMessage('model', greetingText);

  // Masukkan ke memori percakapan agar AI mengingat sapaannya
  conversation.push({ role: 'model', text: greetingText });
});
