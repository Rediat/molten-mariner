import jsPDF from 'jspdf';

/**
 * Creates a new jsPDF instance with standardized header and summary formatting.
 * 
 * @param {string} title - The main title of the document.
 * @param {string[]} summaryLines - An array of strings to be displayed as summary lines below the title.
 * @param {object} options - Configuration options such as orientation ('portrait' | 'landscape').
 * @returns {jsPDF} The initialized jsPDF document instance.
 */
export const createStandardPDF = (title, summaryLines = [], options = {}) => {
    const { orientation = 'portrait' } = options;
    const doc = new jsPDF(orientation === 'landscape' ? 'l' : 'p', 'mm', 'a4');
    
    // Title
    doc.setTextColor(40);
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Summary Lines (Standardized at 11pt with 7-unit spacing)
    if (summaryLines.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(100);
        summaryLines.forEach((line, index) => {
            doc.text(line, 14, 30 + (index * 7));
        });
    }
    
    return doc;
};

/**
 * Adds standardized footers (Date on Left, Page x of X on Right) to all pages of the document.
 * This should be called AFTER all content (tables, etc.) has been added to the document.
 * 
 * @param {jsPDF} doc - The jsPDF document instance.
 */
export const addStandardFooter = (doc) => {
    const totalPages = doc.internal.getNumberOfPages();
    const dateStr = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        
        doc.setFontSize(8);
        doc.setTextColor(150);

        // Footer Date (Left)
        doc.text(dateStr, 14, pageHeight - 10);

        // Page Number (Right)
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    }
};

/**
 * Standard styles for jsPDF-AutoTable to ensure consistent look across the app.
 */
export const STANDARD_TABLE_STYLES = {
    theme: 'grid',
    headStyles: { 
        fillColor: [66, 66, 66], 
        textColor: 255, 
        fontStyle: 'bold', 
        halign: 'right' 
    },
    alternateRowStyles: { 
        fillColor: [245, 245, 245] 
    },
    // Default margin top to leave space for title + 2 summary lines
    // Increase if more summary lines are used.
    startY: 44 
};
