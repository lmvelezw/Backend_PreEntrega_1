document.getElementById("chatFormEntry").addEventListener("submit", async (e) => {
  e.preventDefault();

  let userNameEntry = document.getElementById("userName");
  let userName = userNameEntry.value;
  let messageEntry = document.getElementById("message");
  let message = messageEntry.value;

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: userName, message: message })
    });

    const data = await response.json();

    if (data.result === 'success') {
      const successMessageElement = document.getElementById('successMessage');
      successMessageElement.textContent = 'Message posted successfully!';
    } else {
      console.error(data.error);
    }
  } catch (error) {
    console.error(error);
  }

  userNameEntry.value = "";
  messageEntry.value = "";
});
