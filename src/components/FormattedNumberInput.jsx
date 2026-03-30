import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const FormattedNumberInput = forwardRef(({
    value,
    onChange,
    className,
    placeholder,
    decimals = 2,
    useGrouping = true,
    forceFixedOnFocus = false,
    ...props
}, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Expose the input element through the ref
    useImperativeHandle(ref, () => inputRef.current);

    const formatNumber = (num) => {
        // If the number is null/empty, we format it as 0 for display when blurred
        const effectiveNum = (num === null || num === undefined || num === '' || isNaN(num)) ? 0 : num;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping
        }).format(effectiveNum);
    };

    useEffect(() => {
        if (!isFocused) setDisplayValue(formatNumber(value));
    }, [value, isFocused, decimals]);

    const handleFocus = (e) => {
        setIsFocused(true);
        if (value !== null && value !== undefined && !isNaN(value) && value !== '') {
            setDisplayValue(forceFixedOnFocus ? parseFloat(value).toFixed(decimals) : value.toString());
        } else {
            // Show empty string when focused if value is null
            setDisplayValue('');
        }
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        // On blur, if the value is null, formatNumber will show "0.00" (or 0)
        setDisplayValue(formatNumber(value));
        props.onBlur?.(e);
    };

    return (
        <input
            {...props}
            ref={inputRef}
            type={isFocused ? "number" : "text"}
            value={displayValue}
            onChange={(e) => { setDisplayValue(e.target.value); onChange(e); }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
        />
    );
});

FormattedNumberInput.displayName = 'FormattedNumberInput';

export default FormattedNumberInput;
