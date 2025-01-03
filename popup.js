document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleSwitch = document.getElementById('toggleSummarization');
    const status = document.getElementById('status');

    // Load saved settings
    chrome.storage.local.get(['geminiApiKey', 'summarizationEnabled'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
        toggleSwitch.checked = result.summarizationEnabled !== false; // Default to true
    });

    function showStatus(message) {
        status.textContent = message;
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    }

    // Save settings
    document.getElementById('saveButton').addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showStatus('Please enter an API key');
            return;
        }
        chrome.storage.local.set({ 
            geminiApiKey: apiKey,
            summarizationEnabled: toggleSwitch.checked
        }, () => {
            showStatus('Settings saved!');
        });
    });

    // Handle toggle changes
    toggleSwitch.addEventListener('change', () => {
        chrome.storage.local.set({ 
            summarizationEnabled: toggleSwitch.checked 
        }, () => {
            showStatus(toggleSwitch.checked ? 'Summarization enabled' : 'Summarization disabled');
        });
    });

    // Clear settings
    document.getElementById('clearButton').addEventListener('click', () => {
        apiKeyInput.value = '';
        toggleSwitch.checked = true;
        chrome.storage.local.remove(['geminiApiKey', 'summarizationEnabled'], () => {
            showStatus('All settings cleared!');
        });
    });
}); 