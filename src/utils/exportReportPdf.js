import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Turns an off-screen, A4-sized report document into a PDF, one DOM page per PDF page.
//
// The previous export captured the live dashboard as a single tall image and then
// sliced it at fixed page intervals, which cut charts and headings in half and
// reprinted the header on top of the content. Here each [data-report-page] node is
// already exactly one page, so it is captured and placed whole.

const A4 = { width: 210, height: 297 };

// html2canvas rasterises the SVG charts by serialising them, and a webfont that has
// not finished loading falls back to a system face mid-capture.
const waitForFonts = async () => {
    if (typeof document === 'undefined' || !document.fonts) return;
    try {
        await document.fonts.ready;
    } catch {
        // Font loading API unavailable or rejected: the capture still works, it just
        // may fall back for a face that has not landed yet.
    }
};

// Two animation frames: one for React to commit the off-screen tree, one for the
// browser to lay it out and resolve the image and font work it kicked off.
const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

// A logo that is still decoding captures as a blank box, and html2canvas will not
// wait for it, so every <img> in the document is settled before the first capture.
const waitForImages = async (node) => {
    const images = [...node.querySelectorAll('img')].filter((img) => !img.complete);
    await Promise.all(images.map((img) => new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
    })));
};

export const exportReportPdf = async (rootNode, { fileName = 'report.pdf', scale = 2, onProgress } = {}) => {
    if (!rootNode) throw new Error('exportReportPdf: no report node to capture');

    const pages = [...rootNode.querySelectorAll('[data-report-page="true"]')];
    if (pages.length === 0) throw new Error('exportReportPdf: the report document rendered no pages');

    await waitForFonts();
    await waitForImages(rootNode);
    await nextFrame();

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

    for (let index = 0; index < pages.length; index += 1) {
        onProgress?.({ page: index + 1, total: pages.length });

        const canvas = await html2canvas(pages[index], {
            scale,
            useCORS: true,
            backgroundColor: '#FFFFFF',
            logging: false,
            imageTimeout: 15000,
        });

        // JPEG at high quality keeps a multi-page deck emailable; PNG pushed the same
        // report past 20MB, which several mail clients reject outright.
        const image = canvas.toDataURL('image/jpeg', 0.94);

        if (index > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(image, 'JPEG', 0, 0, A4.width, A4.height, undefined, 'FAST');
    }

    pdf.save(fileName);
    return { pages: pages.length };
};

export default exportReportPdf;
