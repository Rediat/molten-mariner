import jsPDF from 'jspdf';
import { amountToWords } from '../../utils/text-utils';
import { LOGOS } from './logos';

/**
 * Generates the CSD Competitive Treasury Bill Application Form PDF.
 * 
 * @param {Object} data - The data to fill in the form.
 * @param {number} data.faceValue - The face value amount.
 * @param {number} data.tenure - The tenure in days.
 * @param {string} data.issueDate - The issue date (YYYY-MM-DD).
 * @param {number} data.yieldRate - The yield rate percentage.
 * @param {Object} [clientDetails] - Optional client details (defaults to image values).
 */
/**
 * Calculates the auction number based on a reference date.
 * Reference: April 01, 2026 = 1000th/2026.
 * Interval: 14 days.
 */
const calculateTenderNo = (dateStr) => {
    const refDate = new Date('2026-04-01');
    const targetDate = new Date(dateStr);
    const diffDays = Math.floor((targetDate - refDate) / (1000 * 60 * 60 * 24));
    const intervals = Math.floor(diffDays / 14);
    const auctionNo = 1000 + intervals;

    const getSuffix = (n) => {
        const v = n % 100;
        if (v >= 11 && v <= 13) return 'th';
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const formattedIssueDate = new Date(dateStr).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });

    return `${auctionNo}${getSuffix(auctionNo)}/2026, to be held on ${formattedIssueDate}`;
};

/**
 * Calculates the ESX Symbol and ISO 6166 ISIN for a T-Bill.
 */
const calculateSecurityInfo = (tenure, maturityDate) => {
    const [y, m, d] = maturityDate.split('-');
    const datePart = `${y.slice(2)}${m}${d}`;
    const symbol = `TBL${tenure}D${datePart}`;
    
    // ISIN Logic (ISO 6166)
    const base = `ETTBL${datePart}`;
    const charToDigits = (c) => {
        const code = c.charCodeAt(0);
        return (code >= 48 && code <= 57) ? c : (code - 55).toString();
    };
    const digitsStr = base.split('').map(charToDigits).join('');
    let sum = 0;
    for (let i = 0; i < digitsStr.length; i++) {
        let v = parseInt(digitsStr[digitsStr.length - 1 - i]);
        if (i % 2 === 0) {
            v *= 2;
            if (v > 9) v = Math.floor(v / 10) + (v % 10);
        }
        sum += v;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return { symbol, isin: base + checkDigit };
};

export const generateTBillApplicationPDF = (data, clientDetails = {}) => {
    const doc = new jsPDF();
    const { faceValue, tenure, issueDate, yieldRate } = data;
    
    // Default Client Details from image
    const defaults = {
        fullName: 'REDIAT BEKELE ASFAW',
        accountNo: 'ET81WEGC00141021',
        bankName: '',
        tenderNo: calculateTenderNo(issueDate)
    };
    
    const client = { ...defaults, ...clientDetails };
    const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    // --- Header ---
    // NBE Logo (Left)
    if (LOGOS.nbe_logo) {
        // Aspect ratio: 1046x423 (2.47). Height 25mm -> Width 61.75mm
        doc.addImage(LOGOS.nbe_logo, 'PNG', 25, 10, 62, 25);
    }
    
    // CSD Logo (Right)
    if (LOGOS.csd_logo) {
        // Aspect ratio: 381x226 (1.68). Height 25mm -> Width 42.15mm
        // Positioned at the right margin (185 - 42 = 143)
        doc.addImage(LOGOS.csd_logo, 'PNG', 143, 10, 42, 25);
    }

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`Date ${formattedDate}`, 25, 50);
    doc.text('NBE-MSOD', 185, 50, { align: 'right' });

    // Title
    doc.setFontSize(12);
    doc.text('CSD COMPETITIVE TREASURY BILL APPLICATION FORM', 105, 65, { align: 'center' });

    // --- Section A: Treasury Bill Details ---
    doc.setFontSize(11);
    doc.text('A. Treasury Bill Details', 25, 75);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let y = 85;
    const lineSpacing = 10;
    const labelX = 25;
    const valueX = 82; // Reduced gap between label and value

    const addField = (label, value, showLine = true) => {
        doc.setFont('helvetica', 'normal');
        doc.text(`${label}:`, labelX, y);
        doc.setFont('helvetica', 'bold');
        
        if (label === 'Tender No') {
            // Regex to find ordinal pattern: digits + (st|nd|rd|th) + rest
            const match = value.match(/^(\d+)(st|nd|rd|th)(\/.*)$/);
            if (match) {
                const [_, num, suffix, rest] = match;
                let currentX = valueX;
                
                // 1. Draw number
                doc.text(num, currentX, y);
                currentX += doc.getTextWidth(num);
                
                // 2. Draw suffix as superscript
                const originalSize = doc.getFontSize();
                const superSize = originalSize * 0.65; // Slightly smaller for better aesthetic
                doc.setFontSize(superSize);
                doc.text(suffix, currentX, y - 1.2);
                
                // 3. Draw rest of the string
                const suffixWidth = doc.getTextWidth(suffix);
                doc.setFontSize(originalSize);
                currentX += suffixWidth;
                doc.text(rest, currentX, y);
            } else {
                doc.text(value, valueX, y);
            }
        } else {
            doc.text(value, valueX, y);
        }

        // Draw dotted line
        if (showLine) {
            doc.setLineDash([0.5, 0.5]);
            doc.line(valueX, y + 1, 185, y + 1);
            doc.setLineDash([]);
        }
        y += lineSpacing;
    };

    addField('Tender No', client.tenderNo);
    addField('Treasury Bill Tenor', `${tenure} Days`);
    const maturityStr = data.maturityDate || (() => {
        const d = new Date(data.issueDate);
        // Maturity is calculated from the settlement date (Auction Date + 1)
        d.setDate(d.getDate() + tenure + 1);
        return d.toISOString().split('T')[0];
    })();
    const { isin } = calculateSecurityInfo(tenure, maturityStr);
    addField('ISIN', isin);
    
    const faceValueWords = amountToWords(faceValue);
    addField('Face Value', `${faceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${faceValueWords})`);
    addField('Yield Rate', `${yieldRate}%`);

    // --- Section B: Client Details ---
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('B. Client Details', 25, y);
    y += 10;
    doc.setFontSize(10);

    addField('Client Full Name', client.fullName);
    addField('CSD Client Securities Account No', client.accountNo);
    addField('Clients CSD Custodian/Bank', client.bankName);
    
    // Add extra spacing to prevent signature headroom from covering the bank field
    y += 5; 
    
    addField('Client 1 Signature', '', false);
    const sigY = y - lineSpacing; // Capture current y before next field
    addField('Client 2 Signature', '', false);
    
    // Signature Overlay
    if (LOGOS.signature) {
        // Latest high-res signature (1523x1032px): y1=344, y2=596 (diff=252px).
        // PDF line spacing is 10mm. Height = 10 * 1032 / 252 ≈ 40.95mm.
        // Width = 40.95 * 1523 / 1032 ≈ 60.44mm.
        // Y-Offset: Top line in image is at 344/1032 * 40.95 ≈ 13.65mm from top.
        // PDF line is at sigY + 1. So image Y = sigY + 1 - 13.65 = sigY - 12.65.
        doc.addImage(LOGOS.signature, 'PNG', 82, sigY - 12.65, 60.44, 40.95);
    }

    // --- Section C: OFFICIAL USE ---
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('C. OFFICIAL USE', 25, y);
    y += 5;

    // Table for Official Use
    doc.setLineWidth(0.2);
    doc.rect(25, y, 160, 30);
    doc.line(25, y + 10, 185, y + 10);
    doc.line(25, y + 20, 185, y + 20);
    doc.line(70, y, 70, y + 30);

    doc.setFont('helvetica', 'normal');
    doc.text('Processed by', 27, y + 7);
    doc.text('Checked by', 27, y + 17);
    doc.text('Approved by', 27, y + 27);

    // Save PDF
    doc.save(`T-Bill_Application_${issueDate}.pdf`);
};
