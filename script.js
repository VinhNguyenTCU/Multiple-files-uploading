const fileBrowseButton = document.querySelector(".file-browse-button");
const fileBrowseInput = document.querySelector(".file-browse-input");
const fileUploadBox = document.querySelector(".file-upload-box");

const createFileItemHTML = (file, index) => {
    // extracting file name, size, and extension
    const {name, size} = file;
    const extension = name.split(".").pop();

    console.log(name, extension, size);
}

// function to handle the selected files
const handleSelectedFiles = ([...files]) => {
    if(files.length === 0) return; // Check if no files are selected

    files.forEach((file, index) => {
        createFileItemHTML(file, index);
    })
}

// function to handle file drop event
fileUploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    handleSelectedFiles(e.dataTransfer.files);
    fileUploadBox.classList.remove("active");
    fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here or";
});


// function to handle drag over event
fileUploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileUploadBox.classList.add("active");
    fileUploadBox.querySelector(".file-instruction").innerText = "Release to upload or";
});

// function to handle drag leave event
fileUploadBox.addEventListener("dragleave", (e) => {
    e.preventDefault();
    fileUploadBox.classList.remove("active");
    fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here or";
});

fileBrowseInput.addEventListener("change", (e) => handleSelectedFiles(e.target.files));
fileBrowseButton.addEventListener("click", () => fileBrowseInput.click())