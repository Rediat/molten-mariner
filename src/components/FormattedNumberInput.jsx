import React, { useState, useEffect, useRef } from 'react';

const FormattedNumberInput = ({ value, onChange, className, placeholder, decimals = 2, ...props }) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Format number with commas
    const formatNumber = (num) => {
        if (num === null || num === undefined || num === '') return '';
        if (isNaN(num)) return '';
        // Use Intl.NumberFormat for locale-aware formatting
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    };

    useEffect(() => {
        // Update display value when value prop changes and not focused
        if (!isFocused) {
            setDisplayValue(formatNumber(value));
        }
    }, [value, isFocused]);

    const handleFocus = (e) => {
        setIsFocused(true);
        // Show raw value for editing
        if (value !== null && value !== undefined && !isNaN(value)) {
            setDisplayValue(value.toString());
        } else {
            setDisplayValue('');
        }
        props.onFocus && props.onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        // Format on blur
        setDisplayValue(formatNumber(value));
        props.onBlur && props.onBlur(e);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setDisplayValue(val);
        // Pass the event up. The parent will likely handle parsing.
        // We ensure the structure mimics a standard event
        onChange(e);
    };

    return (
        <input
            {...props}
            ref={inputRef}
            type={isFocused ? "number" : "text"}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
        />
    );
};

export default FormattedNumberInput;
