
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
        "text": ["text", "word counter", "case converter", "word count"],
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
