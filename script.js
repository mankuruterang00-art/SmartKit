
const searchInput = document.getElementById("searchInput");

function searchTools() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        alert("Please enter a tool name.");
        return;
    }

    const categories = {
        "pdf": ["pdf", "merge pdf", "split pdf", "compress pdf"],
        "image": ["image", "photo", "compress image", "resize image", "convert image"],
        "qr": ["qr", "qr code", "qr generator"],
        "text": ["text", "case converter"],
"word-counter": ["word counter", "word count"],
        "calculators": ["calculator", "percentage", "age calculator", "unit converter"]
    };

    let found = false;

    for (const [section, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => keyword.includes(query) || query.includes(keyword))) {
            const element = document.getElementById(section);

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                found = true;
                break;
            }
        }
    }

    if (!found) {
        alert("No matching tool category found. Please try another search.");
    }
}

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchTools();
    }
});

console.log("SmartKit search is ready!");
const wordText = document.getElementById("wordText");

if (wordText) {
    wordText.addEventListener("input", function () {
        const text = wordText.value;

        const words = text.trim()
            ? text.trim().split(/\s+/).length
            : 0;

        const characters = text.length;

        const sentences = text.trim()
            ? (text.match(/[.!?]+(?=\s|$)/g) || []).length
            : 0;

        const paragraphs = text.trim()
            ? text.trim().split(/\n\s*\n/).filter(p => p.trim()).length
            : 0;

        document.getElementById("wordCount").textContent = words;
        document.getElementById("charCount").textContent = characters;
        document.getElementById("sentenceCount").textContent = sentences;
        document.getElementById("paragraphCount").textContent = paragraphs;
    });
}
function convertCase(type) {
    const text = document.getElementById("caseText").value;
    let result = "";

    if (type === "upper") {
        result = text.toUpperCase();
    } 
    else if (type === "lower") {
        result = text.toLowerCase();
    } 
    else if (type === "title") {
        result = text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    } 
    else if (type === "sentence") {
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());
    }

    document.getElementById("caseResult").value = result;
}
function generateQR() {
    const text = document.getElementById("qrText").value.trim();
    const qrBox = document.getElementById("qrcode");

    qrBox.innerHTML = "";

    if (!text) {
        alert("Please enter text or a website link.");
        return;
    }

    new QRCode(qrBox, {
        text: text,
        width: 200,
        height: 200
    });
}
function compressImage() {
    const file = document.getElementById("imageInput").files[0];
    const quality = document.getElementById("imageQuality").value / 100;
    const info = document.getElementById("imageInfo");
    const download = document.getElementById("downloadImage");

    if (!file) {
        alert("Please select an image first.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();

        img.onload = function() {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);

                download.href = url;
                download.style.display = "inline-block";

                const originalSize = (file.size / 1024).toFixed(2);
                const compressedSize = (blob.size / 1024).toFixed(2);

                info.textContent =
                    "Original: " + originalSize + " KB | Compressed: " +
                    compressedSize + " KB";
            }, "image/jpeg", quality);
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}
function resizeImage() {
    const file = document.getElementById("resizeInput").files[0];
    const width = parseInt(document.getElementById("resizeWidth").value);
    const height = parseInt(document.getElementById("resizeHeight").value);
    const info = document.getElementById("resizeInfo");
    const download = document.getElementById("resizeDownload");

    if (!file || !width || !height || width <= 0 || height <= 0) {
        alert("Select an image and enter valid width and height.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();

        img.onload = function() {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);

                download.href = url;
                download.style.display = "inline-block";

                info.textContent = "New image size: " + width + " × " + height + " pixels.";
            }, "image/png");
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}
async function mergePDFs() {
    alert("PDF Merger function started!");
    const files = document.getElementById("pdfFiles").files;
    const message = document.getElementById("pdfMessage");
    const download = document.getElementById("pdfDownload");

    download.style.display = "none";

    if (files.length < 2) {
        alert("Please select at least 2 PDF files.");
        return;
    }

    try {
        message.textContent = "Merging PDFs...";

        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(bytes);

            const pages = await mergedPdf.copyPages(
                pdf,
                pdf.getPageIndices()
            );

            pages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedBytes = await mergedPdf.save();

        const blob = new Blob([mergedBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        download.href = url;
        download.style.display = "inline-block";

        message.textContent = "PDFs merged successfully!";
    } catch (error) {
        message.textContent = "Unable to merge PDFs. Please check your files.";
    }
}
async function splitPDF() {
    const file = document.getElementById("splitPdfFile").files[0];
    const pagesInput = document.getElementById("splitPages").value;
    const message = document.getElementById("splitMessage");
    const download = document.getElementById("splitDownload");

    download.style.display = "none";

    if (!file || !pagesInput.trim()) {
        alert("Select a PDF and enter page numbers.");
        return;
    }

    try {
        message.textContent = "Splitting PDF...";

        const bytes = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(bytes);
        const newPdf = await PDFLib.PDFDocument.create();

        const selectedPages = [];

        pagesInput.split(",").forEach(part => {
            part = part.trim();

            if (part.includes("-")) {
                const [start, end] = part.split("-").map(Number);

                for (let i = start; i <= end; i++) {
                    selectedPages.push(i - 1);
                }
            } else {
                selectedPages.push(Number(part) - 1);
            }
        });

        const validPages = selectedPages.filter(
            p => Number.isInteger(p) && p >= 0 && p < pdf.getPageCount()
        );

        if (validPages.length === 0) {
            throw new Error("No valid pages selected.");
        }

        const copiedPages = await newPdf.copyPages(pdf, validPages);
        copiedPages.forEach(page => newPdf.addPage(page));

        const result = await newPdf.save();
        const blob = new Blob([result], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        download.href = url;
        download.style.display = "inline-block";

        message.textContent = "PDF split successfully!";
    } catch (error) {
        message.textContent = "Error: " + error.message;
    }
}
async function compressPDF() {
    const file = document.getElementById("compressPdfFile").files[0];
    const message = document.getElementById("compressMessage");
    const download = document.getElementById("compressDownload");

    download.style.display = "none";

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    try {
        message.textContent = "Processing PDF...";

        const bytes = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(bytes);

        const compressedBytes = await pdf.save({
            useObjectStreams: true
        });

        const blob = new Blob([compressedBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        download.href = url;
        download.style.display = "inline-block";

        const originalSize = (file.size / 1024).toFixed(2);
        const newSize = (blob.size / 1024).toFixed(2);

        message.textContent =
            "Processing complete! Original: " +
            originalSize + " KB | New: " + newSize + " KB";

    } catch (error) {
        message.textContent = "Error: " + error.message;
    }
}
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
