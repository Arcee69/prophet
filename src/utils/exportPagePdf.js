import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Captures a live section of the app, exactly as it is on screen, into an A4 PDF.
//
// Unlike exportReportPdf (which renders a purpose-built document), this takes the
// dashboard itself: every chart, card and figure in its current state. The capture
// is one tall image, so it is split across pages at gaps between blocks rather than
// at fixed intervals, which would cut charts and cards in half.

const A4 = { width: 210, height: 297 };
const MARGIN = 8; // mm on every side
const HEADER = 34; // mm taken by the title block on the first page
const FOOTER = 7; // mm kept clear at the foot of every page for the page number

const INK = [31, 41, 55];
const MUTED = [107, 114, 128];
const ACCENT = [244, 138, 31];

// Keeps the canvas inside what every browser will allocate (Safari caps a canvas at
// roughly 16.7M pixels and draws nothing past it).
const MAX_CANVAS_PIXELS = 16_000_000;

// Elements with this attribute keep their space in the layout but are not drawn,
// so the page measured here and the page captured stay identical.
const HIDE_ATTR = 'data-export-hide';

const waitForFonts = async () => {
    if (typeof document === 'undefined' || !document.fonts) return;
    try {
        await document.fonts.ready;
    } catch {
        // Capture still works; a late face may fall back.
    }
};

const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

// The first opaque background behind the node, so the PDF matches the app rather
// than turning transparent areas black in the JPEG.
const backgroundBehind = (node) => {
    for (let el = node; el && el.nodeType === 1; el = el.parentElement) {
        const color = getComputedStyle(el).backgroundColor;
        if (color && color !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(color)) return color;
    }
    return '#FFFFFF';
};

// jsPDF takes numeric channels, not CSS color strings.
const toRgb = (color) => {
    const [r = 255, g = 255, b = 255] = (color.match(/\d+(\.\d+)?/g) || []).map(Number);
    return color.startsWith('#') ? [255, 255, 255] : [r, g, b];
};

// Blocks that must not be split across a page, as [top, bottom] in CSS px relative to
// the root. A child taller than a page is opened up and its own children used instead,
// down to elements that fit (or have nothing left to open).
const collectBlocks = (root, pageHeightPx) => {
    const rootTop = root.getBoundingClientRect().top;
    const blocks = [];

    const visit = (node) => {
        [...node.children].forEach((child) => {
            const rect = child.getBoundingClientRect();
            if (rect.height === 0 || rect.width === 0) return;
            if (rect.height > pageHeightPx && child.children.length > 0) {
                visit(child);
                return;
            }
            blocks.push([rect.top - rootTop, rect.bottom - rootTop]);
        });
    };

    visit(root);
    return blocks;
};

// Blocks shorter than this, sitting within the gap above a break, count as headings.
const HEADING_MAX_PX = 48;
const HEADING_GAP_PX = 40;

// Page boundaries in CSS px. Each page ends at the lowest point that sits between
// blocks (no block straddles it) and still fits; when no such point exists, the
// page is cut at its full height.
const planPages = (blocks, totalHeight, pageHeightFor, startAt = 0) => {
    const straddles = (y) => blocks.some(([top, bottom]) => top < y - 0.5 && bottom > y + 0.5);
    // A short block just above the break is a section heading ("Keywords", "Top Words"):
    // breaking there would leave it alone at the foot of a page, apart from its content.
    const orphansHeading = (y) => blocks.some(([top, bottom]) =>
        bottom - top < HEADING_MAX_PX && bottom <= y + 0.5 && bottom >= y - HEADING_GAP_PX);
    const candidates = [...new Set(blocks.flat().map((y) => Math.round(y)))]
        .filter((y) => y > 0 && y < totalHeight && !straddles(y) && !orphansHeading(y))
        .sort((a, b) => a - b);

    const pages = [];
    let start = startAt;
    while (start < totalHeight - 1) {
        const pageHeightPx = pageHeightFor(pages.length);
        const limit = start + pageHeightPx;
        if (limit >= totalHeight) {
            pages.push([start, totalHeight]);
            break;
        }
        // Avoid near-empty pages: a break must leave at least a third of a page used.
        const fit = candidates.filter((y) => y > start + pageHeightPx / 3 && y <= limit);
        const end = fit.length ? fit[fit.length - 1] : limit;
        pages.push([start, end]);
        start = end;
    }
    return pages;
};

// html2canvas finds each font's baseline by setting a 1x1 GIF beside sample text in the
// live document and measuring the gap. Tailwind's preflight makes every <img> a block,
// which drops that GIF onto its own line: the baseline comes out a full line too low
// and every piece of text is drawn shifted down and clipped at the bottom of its box.
// This rule puts only that probe image back inline while a capture runs.
const BASELINE_PROBE_FIX =
    'img[width="1"][height="1"][src^="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP"]' +
    '{display:inline !important;vertical-align:baseline}';

const withBaselineFix = async (task) => {
    const style = document.createElement('style');
    style.textContent = BASELINE_PROBE_FIX;
    document.head.appendChild(style);
    try {
        return await task();
    } finally {
        style.remove();
    }
};

// The page as one canvas, drawn the way it looks on screen.
export const capturePage = (rootNode, { scale = 2, background = backgroundBehind(rootNode) } = {}) =>
    withBaselineFix(() => html2canvas(rootNode, {
        scale,
        useCORS: true,
        backgroundColor: background,
        logging: false,
        imageTimeout: 15000,
        onclone: (doc) => {
            doc.querySelectorAll(`[${HIDE_ATTR}]`).forEach((el) => {
                el.style.visibility = 'hidden';
            });
        },
    }));

const formatDate = (date) =>
    date instanceof Date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

// The logo as a loaded image (jsPDF needs it decoded), or null if it cannot load.
const loadImage = (src) => new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
});

// Title block on the first page: logo and generated date, then the report title,
// what it covers, and the period the figures span.
const drawHeader = (pdf, { title, subtitle, period, logo, generatedAt }) => {
    const right = A4.width - MARGIN;
    let top = MARGIN;

    if (logo) {
        const height = 9;
        const width = Math.min(40, (logo.naturalWidth / logo.naturalHeight) * height);
        pdf.addImage(logo, 'PNG', MARGIN, top, width, height);
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...MUTED);
    pdf.text(`Generated ${formatDate(generatedAt)}`, right, top + 5.5, { align: 'right' });

    top += 18;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(...INK);
    pdf.text(title, MARGIN, top);

    const start = formatDate(period?.startDate);
    const end = formatDate(period?.endDate);
    const details = [subtitle, start && end ? `${start} to ${end}` : null].filter(Boolean).join('   |   ');
    if (details) {
        top += 6.5;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...MUTED);
        pdf.text(pdf.splitTextToSize(details, A4.width - MARGIN * 2)[0], MARGIN, top);
    }

    pdf.setDrawColor(...ACCENT);
    pdf.setLineWidth(0.6);
    pdf.line(MARGIN, MARGIN + HEADER - 3, right, MARGIN + HEADER - 3);
};

const drawFooter = (pdf, { label, page, total }) => {
    const y = A4.height - MARGIN + 2;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    if (label) pdf.text(pdf.splitTextToSize(label, 140)[0], MARGIN, y);
    pdf.text(`Page ${page} of ${total}`, A4.width - MARGIN, y, { align: 'right' });
};

// `title`, `subtitle` and `period` ({ startDate, endDate }) fill the title block on the
// first page; `logo` is an image URL shown beside it.
export const exportPagePdf = async (rootNode, {
    fileName = 'analysis.pdf',
    title = 'Analysis',
    subtitle,
    period,
    logo,
    onProgress,
} = {}) => {
    if (!rootNode) throw new Error('exportPagePdf: no page node to capture');

    await waitForFonts();
    await nextFrame();

    const { width: cssWidth, height: cssHeight } = rootNode.getBoundingClientRect();
    if (cssWidth === 0 || cssHeight === 0) throw new Error('exportPagePdf: the page has no size');

    const contentWidthMm = A4.width - MARGIN * 2;
    const contentHeightMm = A4.height - MARGIN * 2 - FOOTER;
    const mmPerPx = contentWidthMm / cssWidth;
    // The first page gives up room for the title block.
    const contentTopMm = (index) => MARGIN + (index === 0 ? HEADER : 0);
    const pageHeightFor = (index) => (contentHeightMm - (index === 0 ? HEADER : 0)) / mmPerPx;

    // Hidden rows at the very top (like the Back button) would only leave a blank strip
    // under the title block, so the first page starts below them.
    const leading = [...rootNode.children];
    const firstShown = leading.find((child) => !child.hasAttribute(HIDE_ATTR));
    const startAt = firstShown && firstShown !== leading[0]
        ? firstShown.getBoundingClientRect().top - rootNode.getBoundingClientRect().top
        : 0;

    const pages = planPages(collectBlocks(rootNode, pageHeightFor(0)), cssHeight, pageHeightFor, startAt);
    const logoImage = await loadImage(logo);
    const generatedAt = new Date();
    const background = backgroundBehind(rootNode);
    const scale = Math.max(1, Math.min(2, Math.sqrt(MAX_CANVAS_PIXELS / (cssWidth * cssHeight))));

    onProgress?.({ step: 'capture' });

    const canvas = await capturePage(rootNode, { scale, background });

    // The canvas may be a few pixels off the measured size after rounding.
    const pxToCanvas = canvas.height / cssHeight;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

    pages.forEach(([top, bottom], index) => {
        onProgress?.({ page: index + 1, total: pages.length });

        const sliceTop = Math.round(top * pxToCanvas);
        const sliceHeight = Math.max(1, Math.round(bottom * pxToCanvas) - sliceTop);

        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = sliceHeight;
        const ctx = slice.getContext('2d');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(canvas, 0, sliceTop, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        if (index > 0) pdf.addPage('a4', 'portrait');
        pdf.setFillColor(...toRgb(background));
        pdf.rect(0, 0, A4.width, A4.height, 'F');
        if (index === 0) drawHeader(pdf, { title, subtitle, period, logo: logoImage, generatedAt });
        drawFooter(pdf, { label: [title, subtitle].filter(Boolean).join('  |  '), page: index + 1, total: pages.length });
        pdf.addImage(
            slice.toDataURL('image/jpeg', 0.92),
            'JPEG',
            MARGIN,
            contentTopMm(index),
            contentWidthMm,
            (sliceHeight / pxToCanvas) * mmPerPx,
            undefined,
            'FAST'
        );
    });

    pdf.save(fileName);
    return { pages: pages.length };
};

export default exportPagePdf;
