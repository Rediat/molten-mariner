import React, { useState, useEffect, useRef } from 'react';

const FormattedNumberInput = ({
    value,
    onChange,
    className,
    placeholder,
    decimals = 2,
    useGrouping = true,
    forceFixedOnFocus = false,
    ...props
}) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const formatNumber = (num) => {
        if (num === null || num === undefined || num === '' || isNaN(num)) return '';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping
        }).format(num);
    };

    useEffect(() => {
        if (!isFocused) setDisplayValue(formatNumber(value));
    }, [value, isFocused, decimals]);

    const handleFocus = (e) => {
        setIsFocused(true);
        if (value !== null && value !== undefined && !isNaN(value)) {
            setDisplayValue(forceFixedOnFocus ? parseFloat(value).toFixed(decimals) : value.toString());
        } else {
            setDisplayValue('');
        }
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
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
};

export default FormattedNumberInput;
