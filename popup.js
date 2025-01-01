document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleSwitch = document.getElementById('toggleSummarization');    
    const toneInput = document.getElementById('summaryTone');
    const settingsContainer = document.getElementById('settingsContainer');
    const status = document.getElementById('status');

    function updateSettingsState(enabled) {
        if (enabled) {
            settingsContainer.classList.remove('disabled');
            apiKeyInput.disabled = false;
            toneInput.disabled = false;
            document.getElementById('saveButton').disabled = false;
            document.getElementById('clearButton').disabled = false;
        } else {
            settingsContainer.classList.add('disabled');
            apiKeyInput.disabled = true;
            toneInput.disabled = true;
            document.getElementById('saveButton').disabled = true;
            document.getElementById('clearButton').disabled = true;
        }
    }

    // Load saved settings
    chrome.storage.local.get(['geminiApiKey', 'summaryTone', 'summarizationEnabled'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
        if (result.summaryTone) {
            toneInput.value = result.summaryTone;
        }
        const isEnabled = result.summarizationEnabled !== false;
        toggleSwitch.checked = isEnabled;
        updateSettingsState(isEnabled);
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
            summarizationEnabled: toggleSwitch.checked,
            summaryTone: tone
        }, () => {
            showStatus('Settings saved!');
        });
    });

    // Handle toggle changes
    toggleSwitch.addEventListener('change', () => {
        const isEnabled = toggleSwitch.checked;
        updateSettingsState(isEnabled);
        chrome.storage.local.set({ 
            summarizationEnabled: isEnabled 
        }, () => {
            showStatus(isEnabled ? 'Summarization enabled' : 'Summarization disabled');
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