
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
    const level = document.getElementById("compressionLevel").value;
    const message = document.getElementById("compressMessage");
    const download = document.getElementById("compressDownload");

    download.style.display = "none";

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    let scale = 1.2;
let quality = 0.45;

if (level === "low") {
    scale = 1.2;
    quality = 0.75;
} else if (level === "medium") {
    scale = 0.9;
    quality = 0.45;
} else if (level === "high") {
    scale = 0.65;
    quality = 0.25;
}
    try {
        message.textContent = "Compressing PDF... Please wait.";

        const bytes = new Uint8Array(await file.arrayBuffer());

        const sourcePDF = await pdfjsLib.getDocument({
            data: bytes
        }).promise;

        const newPDF = await PDFLib.PDFDocument.create();

        for (let i = 1; i <= sourcePDF.numPages; i++) {
            message.textContent =
                "Compressing page " + i + " of " + sourcePDF.numPages + "...";

            const page = await sourcePDF.getPage(i);
            const originalViewport = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const imageData = canvas.toDataURL("image/jpeg", quality);
            const imageBytes = Uint8Array.from(
                atob(imageData.split(",")[1]),
                character => character.charCodeAt(0)
            );

            const image = await newPDF.embedJpg(imageBytes);

            const newPage = newPDF.addPage([
                originalViewport.width,
                originalViewport.height
            ]);

            newPage.drawImage(image, {
                x: 0,
                y: 0,
                width: originalViewport.width,
                height: originalViewport.height
            });

            canvas.width = 0;
            canvas.height = 0;
        }

        const result = await newPDF.save();
        const blob = new Blob([result], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        download.href = url;
        download.style.display = "inline-block";

        const originalSize = (file.size / 1024).toFixed(2);
        const newSize = (blob.size / 1024).toFixed(2);

        message.textContent =
            "Compression complete! Original: " +
            originalSize + " KB | New: " + newSize + " KB";

    } catch (error) {
        message.textContent = "Error: " + error.message;
    }
}
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
function convertImage() {
    const file = document.getElementById("convertImageFile").files[0];
    const format = document.getElementById("imageFormat").value;
    const message = document.getElementById("convertMessage");
    const download = document.getElementById("convertDownload");

    download.style.display = "none";

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const image = new Image();
    const reader = new FileReader();

    message.textContent = "Converting image...";

    reader.onload = function (event) {
        image.onload = function () {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = image.width;
            canvas.height = image.height;

            if (format === "image/jpeg") {
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height);
            }

            context.drawImage(image, 0, 0);

            canvas.toBlob(function (blob) {
                if (!blob) {
                    message.textContent = "Conversion failed.";
                    return;
                }

                const url = URL.createObjectURL(blob);
                const extension = format.split("/")[1].replace("jpeg", "jpg");

                download.href = url;
                download.download = "smartkit-converted." + extension;
                download.style.display = "inline-block";

                message.textContent = "Image converted successfully!";
            }, format);
        };

        image.onerror = function () {
            message.textContent = "Unable to read this image.";
        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
}
async function convertImagesToPDF() {
    const files = document.getElementById("imagesToPdf").files;
    const message = document.getElementById("imagesPdfMessage");
    const download = document.getElementById("imagesPdfDownload");

    download.style.display = "none";

    if (!files.length) {
        alert("Please select at least one image.");
        return;
    }

    try {
        message.textContent = "Creating PDF...";

        const pdf = await PDFLib.PDFDocument.create();

        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            const bytes = await file.arrayBuffer();
            let image;

            if (file.type === "image/jpeg") {
                image = await pdf.embedJpg(bytes);
            } else if (file.type === "image/png") {
                image = await pdf.embedPng(bytes);
            } else {
                const bitmap = await createImageBitmap(file);
                const canvas = document.createElement("canvas");

                canvas.width = bitmap.width;
                canvas.height = bitmap.height;

                canvas.getContext("2d").drawImage(bitmap, 0, 0);

                const blob = await new Promise(resolve =>
                    canvas.toBlob(resolve, "image/png")
                );

                if (!blob) throw new Error("Image conversion failed.");

                image = await pdf.embedPng(
                    await blob.arrayBuffer()
                );

                bitmap.close();
            }

            const page = pdf.addPage([
                image.width,
                image.height
            ]);

            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            });
        }

        if (pdf.getPageCount() === 0) {
            throw new Error("No supported images found.");
        }

        const result = await pdf.save();
        const blob = new Blob([result], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        download.href = url;
        download.style.display = "inline-block";

        message.textContent = "PDF created successfully!";

    } catch (error) {
        message.textContent = "Error: " + error.message;
    }
}
async function convertPDFToImages() {
    const file = document.getElementById("pdfToImageFile").files[0];
    const format = document.getElementById("pdfImageFormat").value;
    const message = document.getElementById("pdfImageMessage");
    const downloads = document.getElementById("pdfImageDownloads");

    downloads.innerHTML = "";

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    try {
        message.textContent = "Loading PDF...";

        const bytes = new Uint8Array(await file.arrayBuffer());

        const pdf = await pdfjsLib.getDocument({
            data: bytes
        }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            message.textContent =
                "Converting page " + i + " of " + pdf.numPages + "...";

            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, format, 0.9);
            });

            if (!blob) {
                throw new Error("Could not convert page " + i);
            }

            const url = URL.createObjectURL(blob);
            const extension = format === "image/jpeg" ? "jpg" : "png";

            const link = document.createElement("a");
            link.href = url;
            link.download = "smartkit-page-" + i + "." + extension;
            link.textContent = "Download Page " + i;
            link.style.display = "block";
            link.style.margin = "10px 0";

            downloads.appendChild(link);

            canvas.width = 0;
            canvas.height = 0;
        }

        message.textContent = "PDF converted successfully!";

    } catch (error) {
        message.textContent = "Error: " + error.message;
    }
}
function repeatText() {
    const text = document.getElementById("repeatText").value;
    const count = Number(document.getElementById("repeatCount").value);
    const result = document.getElementById("repeatResult");
    const message = document.getElementById("repeatMessage");

    if (!text.trim()) {
        message.textContent = "Please enter some text.";
        return;
    }

    if (!Number.isInteger(count) || count < 1 || count > 10000) {
        message.textContent = "Enter a number between 1 and 10000.";
        return;
    }

    result.value = Array(count).fill(text).join("\n");
    message.textContent = "Text repeated " + count + " times!";
}

async function copyRepeatedText() {
    const result = document.getElementById("repeatResult");
    const message = document.getElementById("repeatMessage");

    if (!result.value) {
        message.textContent = "Please generate repeated text first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(result.value);
        message.textContent = "Copied successfully!";
    } catch (error) {
        result.select();
        document.execCommand("copy");
        message.textContent = "Copy attempted. Please check your clipboard.";
    }
}
function calculatePercentage() {
    const number = Number(document.getElementById("percentValue").value);
    const rate = Number(document.getElementById("percentRate").value);
    const result = document.getElementById("percentResult");

    if (
        document.getElementById("percentValue").value === "" ||
        document.getElementById("percentRate").value === ""
    ) {
        result.textContent = "Please enter both values.";
        return;
    }

    result.textContent = (number * rate / 100).toFixed(2);
}

function calculateChange() {
    const oldValue = Number(document.getElementById("oldValue").value);
    const newValue = Number(document.getElementById("newValue").value);
    const result = document.getElementById("changeResult");

    if (
        document.getElementById("oldValue").value === "" ||
        document.getElementById("newValue").value === ""
    ) {
        result.textContent = "Please enter both values.";
        return;
    }

    if (oldValue === 0) {
        result.textContent = "Original value cannot be zero.";
        return;
    }

    const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100;

    if (change > 0) {
        result.textContent = "Increase: " + change.toFixed(2) + "%";
    } else if (change < 0) {
        result.textContent = "Decrease: " + Math.abs(change).toFixed(2) + "%";
    } else {
        result.textContent = "No change: 0%";
    }
}

function calculateWhatPercent() {
    const part = Number(document.getElementById("partValue").value);
    const total = Number(document.getElementById("totalValue").value);
    const result = document.getElementById("whatPercentResult");

    if (
        document.getElementById("partValue").value === "" ||
        document.getElementById("totalValue").value === ""
    ) {
        result.textContent = "Please enter both values.";
        return;
    }

    if (total === 0) {
        result.textContent = "Total cannot be zero.";
        return;
    }

    result.textContent = ((part / total) * 100).toFixed(2) + "%";
}
function calculateAge() {
    const birthInput = document.getElementById("birthDate").value;
    const result = document.getElementById("ageResult");

    if (!birthInput) {
        result.textContent = "Please enter your date of birth.";
        return;
    }

    const birth = new Date(birthInput + "T00:00:00");
    const today = new Date();

    if (birth > today) {
        result.textContent = "Birth date cannot be in the future.";
        return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        const previousMonthDays = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        ).getDate();
        days += previousMonthDays;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    let nextBirthday = new Date(
        today.getFullYear(),
        birth.getMonth(),
        birth.getDate()
    );

    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const daysUntil = Math.round(
        (nextBirthday - todayDate) / (1000 * 60 * 60 * 24)
    );

    result.textContent =
        "Your age: " + years + " years, " +
        months + " months, and " + days + " days. " +
        "Days until next birthday: " + daysUntil + ".";
}
