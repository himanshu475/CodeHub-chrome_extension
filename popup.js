document.addEventListener("DOMContentLoaded", () => {
  const snippetTitle = document.getElementById("snippetTitle");
  const snippetCode = document.getElementById("snippetCode");
  const saveSnippet = document.getElementById("saveSnippet");
  const snippetList = document.getElementById("snippetList");
  const searchInput = document.getElementById("searchInput");

  // Function to render all snippets
  function renderSnippets(filter = "") {
    chrome.storage.local.get(["snippets"], (result) => {
      const snippets = result.snippets || [];
      snippetList.innerHTML = "";

      snippets
        .filter((snippet) => snippet.title.toLowerCase().includes(filter.toLowerCase()))
        .forEach((snippet, index) => {
          const snippetItem = document.createElement("li");
          snippetItem.className = "snippet-item";

          const titleSpan = document.createElement("span");
          titleSpan.className = "snippet-title";
          titleSpan.textContent = snippet.title;

          const actionsDiv = document.createElement("div");
          actionsDiv.className = "snippet-actions";

          // View Button
          const viewBtn = document.createElement("button");
          viewBtn.className = "action-btn view-btn";
          viewBtn.textContent = "View";
          viewBtn.onclick = () => displayCode(snippet.code);

          // Copy Button
          const copyBtn = document.createElement("button");
          copyBtn.className = "action-btn copy-btn";
          copyBtn.textContent = "Copy";
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(snippet.code).then(() => {
              showMessage("Code copied!");
            });
          };

          // Delete Button
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "action-btn delete-btn";
          deleteBtn.textContent = "Delete";
          deleteBtn.onclick = () => {
            snippets.splice(index, 1);
            chrome.storage.local.set({ snippets }, renderSnippets);
          };

          actionsDiv.appendChild(viewBtn);
          actionsDiv.appendChild(copyBtn);
          actionsDiv.appendChild(deleteBtn);

          snippetItem.appendChild(titleSpan);
          snippetItem.appendChild(actionsDiv);
          snippetList.appendChild(snippetItem);
        });
    });
  }

  // Function to display code in a popup/modal
  function displayCode(code) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#fff";
    modal.style.padding = "20px";
    modal.style.border = "1px solid #ccc";
    modal.style.borderRadius = "5px";
    modal.style.zIndex = "1000";
    modal.style.width = "90%";
    modal.style.maxHeight = "70%";
    modal.style.overflowY = "auto";

    const codeBlock = document.createElement("pre");
    codeBlock.textContent = code;
    codeBlock.style.whiteSpace = "pre-wrap";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginTop = "10px";
    closeButton.style.backgroundColor = "#dc3545";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "3px";
    closeButton.onclick = () => modal.remove();

    modal.appendChild(codeBlock);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  }

  // Function to show a temporary message
  function showMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.position = "fixed";
    messageDiv.style.bottom = "10px";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translateX(-50%)";
    messageDiv.style.backgroundColor = "#28a745";
    messageDiv.style.color = "#fff";
    messageDiv.style.padding = "10px";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.zIndex = "1000";

    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 2000);
  }

  // Save snippet
  saveSnippet.addEventListener("click", () => {
    const title = snippetTitle.value.trim();
    const code = snippetCode.value.trim();

    if (title && code) {
      chrome.storage.local.get(["snippets"], (result) => {
        const snippets = result.snippets || [];
        snippets.push({ title, code });
        chrome.storage.local.set({ snippets }, () => {
          snippetTitle.value = "";
          snippetCode.value = "";
          renderSnippets();
        });
      });
    } else {
      alert("Please provide both a title and code.");
    }
  });

  // Filter snippets based on search input
  searchInput.addEventListener("input", (e) => {
    renderSnippets(e.target.value);
  });

  // Initial render
  renderSnippets();
});
