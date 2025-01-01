document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const status = document.getElementById('status');

    // Load saved API key
    chrome.storage.local.get(['geminiApiKey'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
    });

    function showStatus(message) {
        status.textContent = message;
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    }

    // Save API key
    document.getElementById('saveButton').addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showStatus('Please enter an API key');
            return;
        }
        chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
            showStatus('API key saved!');
        });
    });

    // Clear API key
    document.getElementById('clearButton').addEventListener('click', () => {
        apiKeyInput.value = '';
        chrome.storage.local.remove('geminiApiKey', () => {
            showStatus('API key cleared!');
        });
    });
}); 