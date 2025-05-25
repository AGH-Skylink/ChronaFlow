const outputContainer = document.getElementById("output-container");

function appendMessage(message, type = "info") {
  const p = document.createElement("p");
  p.textContent = message;
  p.classList.add(type);
  outputContainer.appendChild(p);
  outputContainer.scrollTop = outputContainer.scrollHeight; // Auto-scroll
}

window.electronAPI.onServerOutput((data) => {
  appendMessage(data, "info");
});

window.electronAPI.onServerError((data) => {
  appendMessage(`ERROR: ${data}`, "error");
});

window.electronAPI.onServerExit((code) => {
  appendMessage(
    `Expo server process exited with code ${code}.`,
    code === 0 ? "success" : "error"
  );
});
