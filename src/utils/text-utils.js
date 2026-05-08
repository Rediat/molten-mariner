/**
 * Utility to convert numbers to English words
 * Specifically formatted for financial amounts (e.g., ETB)
 */

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TEENS = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

const convertSection = (num) => {
    let result = '';
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;

    if (hundreds > 0) {
        result += ONES[hundreds] + ' Hundred ';
    }

    if (remainder >= 10 && remainder < 20) {
        result += TEENS[remainder - 10] + ' ';
    } else {
        const tens = Math.floor(remainder / 10);
        const ones = remainder % 10;
        if (tens > 0) result += TENS[tens] + (ones > 0 ? '-' : ' ');
        if (ones > 0) result += ONES[ones] + ' ';
    }

    return result.trim();
};

export const amountToWords = (amount) => {
    if (amount === 0) return 'Zero Only';
    
    const absoluteAmount = Math.abs(amount);
    const integerPart = Math.floor(absoluteAmount);
    const decimalPart = Math.round((absoluteAmount - integerPart) * 100);

    let result = '';
    let tempAmount = integerPart;
    let scaleIndex = 0;

    if (integerPart === 0) {
        result = 'Zero';
    } else {
        const parts = [];
        while (tempAmount > 0) {
            const section = tempAmount % 1000;
            if (section > 0) {
                const sectionWords = convertSection(section);
                parts.push(sectionWords + (SCALES[scaleIndex] ? ' ' + SCALES[scaleIndex] : ''));
            }
            tempAmount = Math.floor(tempAmount / 1000);
            scaleIndex++;
        }
        result = parts.reverse().join(' ');
    }

    result = result.trim();

    if (decimalPart > 0) {
        result += ` and ${decimalPart.toString().padStart(2, '0')}/100`;
    }

    return (result + ' Only').replace(/\s+/g, ' ');
};
