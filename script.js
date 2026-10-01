const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        // Check image type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            imageInput.value = "";
            return;
        }

        // Show image preview
        const reader = new FileReader();

        reader.onload = function (event) {
            preview.src = event.target.result;
            preview.style.display = "block";
        };

        reader.readAsDataURL(file);

        result.innerHTML = "Image selected successfully.";
    }
});

function analyzeImage() {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please upload an E-Waste image first.");
        return;
    }

    result.innerHTML = `
        ✅ Image uploaded successfully!<br>
        🔍 Ready for E-Waste analysis.
    `;
}
