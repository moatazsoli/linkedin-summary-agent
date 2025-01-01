async function aiSummarize(text) {
    try {
        // Get API key and tone from storage
        const result = await chrome.storage.local.get(['geminiApiKey', 'summaryTone']);
        if (!result.geminiApiKey) {
            throw new Error('No API key found');
        }

        console.log('Attempting Gemini API summarization...');
        
        // Construct prompt based on tone setting
        let prompt = 'Summarize this LinkedIn post in one concise sentence';
        if (result.summaryTone) {
            prompt = `${prompt} ${result.summaryTone}`;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${result.geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${prompt}: ${text}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 60,
                    topK: 1,
                    topP: 0.8
                }
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        console.log('Successfully generated Gemini API summary');
        return {
            summary: data.candidates[0].content.parts[0].text,
            source: 'Gemini'
        };
    } catch (error) {
        console.log('Gemini API failed, falling back to compromise.js', error);
        try {
            const doc = nlp(text);
            const sentences = doc.sentences().out('array');
            const importantSentences = sentences.filter(sentence => {
                const s = nlp(sentence);
                return s.has('#Noun') && s.has('#Verb');
            });
            console.log('Successfully generated compromise.js summary');
            return {
                summary: importantSentences[0] || sentences[0] || text,
                source: 'compromise.js'
            };
        } catch (compromiseError) {
            console.log('Compromise.js also failed, using first sentence', compromiseError);
            const sentences = text.trim().split(/[.!?]+/).filter(s => s.length > 0);
            return {
                summary: sentences[0] || text,
                source: 'simple extraction'
            };
        }
    }
}

async function processPost(postElement) {
    // Double-check in case of race conditions
    if (postElement.querySelector('.tldr-summary')) {
        return;
    }

    // Try to find the post content and container
    const contentElement = postElement.querySelector('.feed-shared-update-v2__description-wrapper') ||
                          postElement.querySelector('.feed-shared-text') ||
                          postElement.querySelector('.update-components-text');

    // Find the best insertion point - look for the content wrapper or header
    const insertionPoint = postElement.querySelector('.feed-shared-update-v2__description') ||
                          postElement.querySelector('.feed-shared-text-view') ||
                          postElement.querySelector('.feed-shared-update-v2__content') ||
                          contentElement;

    if (!contentElement || !insertionPoint) {
        return;
    }

    const postText = contentElement.textContent.trim();
    if (postText.length < 50) {
        return;
    }

    const { summary, source } = await aiSummarize(postText);

    // Create TL;DR element
    const tldrElement = document.createElement('div');
    tldrElement.className = 'tldr-summary';
    tldrElement.style.padding = '12px 16px';
    tldrElement.style.backgroundColor = '#f3f6f8';
    tldrElement.style.borderRadius = '8px';
    tldrElement.style.margin = '0 0 12px 0';
    tldrElement.style.fontSize = '14px';
    tldrElement.style.lineHeight = '1.4';
    tldrElement.style.position = 'relative';
    tldrElement.style.zIndex = '1';

    // Create summary container with source attribution
    tldrElement.innerHTML = `
        <div style="position: relative;">
            <div><strong>TL;DR:</strong> ${summary}</div>
            <div style="text-align: right; font-size: 10px; color: #666; margin-top: 4px;">
                summarized by: ${source}
            </div>
        </div>
    `;

    // Create wrapper with adjusted styling
    const wrapper = document.createElement('div');
    wrapper.style.padding = '0 16px';
    wrapper.style.marginBottom = '16px';
    wrapper.style.borderBottom = '1px solid #e0e0e0';
    wrapper.style.paddingBottom = '16px';
    wrapper.appendChild(tldrElement);

    // Insert the wrapper before the insertion point
    insertionPoint.parentNode.insertBefore(wrapper, insertionPoint);
}

function checkForNewPosts() {
    const posts = document.querySelectorAll('.feed-shared-update-v2');
    const processPromises = [];

    posts.forEach(post => {
        // Check if post has already been processed or is being processed
        if (!post.querySelector('.tldr-summary') && !post.hasAttribute('data-processing')) {
            // Mark post as being processed
            post.setAttribute('data-processing', 'true');
            
            // Process post and store promise
            const processPromise = processPost(post).finally(() => {
                // Remove processing marker when done
                post.removeAttribute('data-processing');
            });
            
            processPromises.push(processPromise);
        }
    });

    return Promise.all(processPromises);
}

function initializeExtension() {
    // Process initial posts
    checkForNewPosts();
    
    // Set up observer for new posts with debouncing
    let timeout;
    const observer = new MutationObserver((mutations) => {
        // Clear previous timeout
        clearTimeout(timeout);
        // Set new timeout
        timeout = setTimeout(() => {
            checkForNewPosts();
        }, 500); // Wait 500ms before processing
    });
    
    // Find the feed container
    let feed = null;
    let successfulSelector = '';
    
    // Updated selectors for modern LinkedIn
    const feedSelectors = [
        '.core-rail',
        '.scaffold-layout__main',
        'div[role="main"]',
        '.feed-container',
        '.scaffold-finite-scroll__content',
        'main[role="main"]',
        '#main > .scaffold-layout__main',
        '.feed-shared-update-v2__content',
        '.full-height'
    ];

    // Try each selector
    for (const selector of feedSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            feed = element;
            successfulSelector = selector;
            break;
        }
    }
                
    if (feed) {
        observer.observe(feed, {
            childList: true,
            subtree: true
        });
    } else {
        setTimeout(initializeExtension, 2000);
    }
}

// Start the extension
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
    initializeExtension();
} 