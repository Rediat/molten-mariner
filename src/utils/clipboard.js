/**
 * Global Clipboard Utility
 * Adds double-click and long-press copy functionality to input and result fields.
 */

const showCopyFeedback = (element) => {
    // Create feedback badge
    const badge = document.createElement('div');
    badge.innerText = 'Copied!';
    badge.style.position = 'fixed';
    badge.style.zIndex = '10000';
    badge.style.background = 'rgba(6, 78, 59, 0.95)'; // emerald-900 with high opacity
    badge.style.backdropFilter = 'blur(12px)';
    badge.style.color = '#ecfdf5'; // emerald-50 (almost white) for max contrast
    badge.style.padding = '6px 12px';
    badge.style.borderRadius = '10px';
    badge.style.fontSize = '10px';
    badge.style.fontWeight = '900';
    badge.style.textTransform = 'uppercase';
    badge.style.letterSpacing = '1px';
    badge.style.pointerEvents = 'none';
    badge.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    badge.style.boxShadow = '0 0 0 1px rgba(16, 185, 129, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.4)';
    badge.style.opacity = '0';
    badge.style.transform = 'translateX(-50%) translateY(15px) scale(0.8)';

    // Position near the element
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const topY = rect.top - 35;
    
    badge.style.left = `${centerX}px`;
    badge.style.top = `${topY}px`;

    document.body.appendChild(badge);

    // Subtle highlight on the element itself
    const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
    const originalTransition = element.style.transition;
    const originalFilter = element.style.filter;
    
    if (!isInput) {
        element.style.transition = 'all 0.2s ease';
        element.style.filter = 'brightness(1.5) contrast(1.1)';
    }

    // Animate in
    requestAnimationFrame(() => {
        badge.style.opacity = '1';
        badge.style.transform = 'translateX(-50%) translateY(0) scale(1)';
    });

    // Remove after delay
    setTimeout(() => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateX(-50%) translateY(-15px) scale(0.8)';
        
        if (!isInput) {
            element.style.filter = originalFilter;
            setTimeout(() => {
                element.style.transition = originalTransition;
            }, 200);
        }

        setTimeout(() => {
            if (badge.parentNode) {
                document.body.removeChild(badge);
            }
        }, 400);
    }, 1500);
};

const handleCopy = (e) => {
    const target = e.target;
    
    // 1. Exclude non-data elements
    const excludedTags = ['BUTTON', 'A', 'SELECT', 'OPTION', 'LABEL', 'NAV', 'HEADER', 'FOOTER', 'SVG', 'PATH'];
    if (excludedTags.includes(target.tagName) || target.closest('button') || target.closest('a')) return;
    
    // 2. Check for manual opt-out
    if (target.dataset.copyable === 'false' || target.closest('[data-copyable="false"]')) return;

    // 3. Get text to copy
    let textToCopy = '';
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    
    if (isInput) {
        textToCopy = target.value;
    } else {
        // For result fields, we check if it has text and is not a container
        // Result fields in this app are usually span or p with font-mono or font-black
        // but we'll allow any reasonably short text.
        textToCopy = target.innerText;
    }

    if (!textToCopy || textToCopy.trim() === '' || textToCopy.trim().length > 150) return;

    // Clean up
    let cleanText = textToCopy.trim();
    
    // Strip trailing units like /mo, /yr, mo, yr (case-insensitive, optionally with spaces/slashes)
    cleanText = cleanText.replace(/\s*\/?\bmo\b/gi, '');
    cleanText = cleanText.replace(/\s*\/?\byr\b/gi, '');
    cleanText = cleanText.trim();

    // Use a single function for copying across the app
    copyToClipboard(cleanText, target);
};

export const copyToClipboard = (text, elementForFeedback) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        if (elementForFeedback) {
            showCopyFeedback(elementForFeedback);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

export const initGlobalClipboard = () => {
    // Double click listener
    document.addEventListener('dblclick', handleCopy);

    // Long press logic
    let touchTimer;
    let longPressTriggered = false;

    document.addEventListener('touchstart', (e) => {
        longPressTriggered = false;
        touchTimer = setTimeout(() => {
            handleCopy(e);
            longPressTriggered = true;
        }, 700); // 700ms for long press
    }, { passive: true });

    document.addEventListener('touchend', () => {
        clearTimeout(touchTimer);
    }, { passive: true });

    document.addEventListener('touchmove', () => {
        clearTimeout(touchTimer);
    }, { passive: true });
};
