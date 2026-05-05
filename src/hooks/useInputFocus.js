import { useCallback } from 'react';

/**
 * Hook to handle label-to-input interaction.
 * @param {Function} setter - The state setter for the input value.
 * @param {React.RefObject} ref - Ref to the input element.
 * @param {Function} [onClear] - Optional callback for additional side effects (e.g., clearing results).
 */
export const useInputFocus = (setter, ref, onClear) => {
    return useCallback(() => {
        setter(null);
        if (onClear) onClear();
        setTimeout(() => {
            if (ref.current) {
                ref.current.focus();
                // Ensure text is selected for quick replacement
                if (ref.current.select) ref.current.select();
            }
        }, 0);
    }, [setter, ref, onClear]);
};
