
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
