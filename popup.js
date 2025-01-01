document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const toneInput = document.getElementById('summaryTone');
    const status = document.getElementById('status');

    // Load saved settings
    chrome.storage.local.get(['geminiApiKey', 'summaryTone'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
        if (result.summaryTone) {
            toneInput.value = result.summaryTone;
        }
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
        const tone = toneInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key');
            return;
        }

        chrome.storage.local.set({
            geminiApiKey: apiKey,
            summaryTone: tone
        }, () => {
            showStatus('Settings saved!');
        });
    });

    // Clear all settings
    document.getElementById('clearButton').addEventListener('click', () => {
        apiKeyInput.value = '';
        toneInput.value = '';
        chrome.storage.local.remove(['geminiApiKey', 'summaryTone'], () => {
            showStatus('All settings cleared!');
        });
    });
}); 