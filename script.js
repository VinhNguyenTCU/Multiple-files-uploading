const fileBrowseButton = document.querySelector(".file-browse-button");
const fileBrowseInput = document.querySelector(".file-browse-input");
const fileUploadBox = document.querySelector(".file-upload-box");
const fileList = document.querySelector(".file-list");
const fileCompletedStatus = document.querySelector(".file-completed-status");
let totalFiles = 0;
let completedFiles = 0;

const createFileItemHTML = (file, uniqueIdentifier) => {
    // extracting file name, size, and extension
    const {name, size} = file;
    const extension = name.split(".").pop();

    // generating HTML for file item
    return `<li class="file-item" id="file-item-${uniqueIdentifier}">
            <div class="file-extension">${extension}</div>
            <div class="file-content-wrapper">
                <div class="file-content">
                    <div class="file-detials">
                        <h5 class="file-name">${name}</h5>
                        <div class="file-info">
                            <small class="file-size">4 MB / ${size}</small>
                            <small class="file-divider">&bullet;</small>
                            <small class="file-status">Uploading...</small>
                        </div>
                    </div>
                    <button class="cancel-button">
                        <i class="bx bx-x"></i>
                    </button>
                </div>
                <div class="file-progress-bar">
                    <div class="file-progress"></div>
                </div>
            </div>
        </li>`;
}

const handleFileUploading = (file, uniqueIdentifier) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
        // Updating progress bar and file size element
        const fileProgress = document.querySelector(`#file-item-${uniqueIdentifier} .file-progress`);
        const fileSize = document.querySelector(`#file-item-${uniqueIdentifier} .file-size`);

        // formatting the uploading or total file size into KB or MB accordingly
        const formattedFileSize = file.size >= 1024 * 1024 ?   
        `${(e.loaded / (1024 * 1024)).toFixed(2)} MB / ${(e.total / (1024 * 1024)).toFixed(2)} MB` 
        : `${(e.loaded / 1024).toFixed(2)} KB/ ${(e.total / 1024).toFixed(2)} KB`;

        const progress = Math.round((e.loaded / e.total) * 100);
        fileProgress.style.width = `${progress}%`;
        fileSize.innerText = formattedFileSize;
    });

    xhr.open("POST", "api.php", true);
    xhr.send(formData);

    return xhr;
}

// function to handle the selected files
const handleSelectedFiles = ([...files]) => {
    if(files.length === 0) return; // Check if no files are selected
    totalFiles += files.length;

    files.forEach((file, index) => {
        const uniqueIdentifier = Date.now() + index;
        const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
        // inserting each file item into file list
        fileList.insertAdjacentHTML("afterbegin", fileItemHTML);
        const currentFileItem = document.querySelector(`#file-item-${uniqueIdentifier}`);
        const cancelFileUploadButton = currentFileItem.querySelector(".cancel-button");

        const xhr = handleFileUploading(file,uniqueIdentifier);

        xhr.addEventListener("readystatechange", () => {
            // handling completion of file upload
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
                completedFiles++;
                cancelFileUploadButton.remove();
                currentFileItem.querySelector(".file-status").innerText = "Completed";
                currentFileItem.querySelector(".file-status").style.color = "#00B125";
                fileCompletedStatus.innerHTML = `${completedFiles} / ${totalFiles} files completed`;
            }
        });

        cancelFileUploadButton.addEventListener("click", () => {
            xhr.abort(); // cancel file upload
            currentFileItem.querySelector(".file-status").innerHTML = "Cancelled";
            currentFileItem.querySelector(".file-status").style.color = "#E3413F";
            cancelFileUploadButton.remove();
        });

        xhr.addEventListener("error", () => {
            alert("An error occured during the file upload!");
        });
    });
    fileCompletedStatus.innerHTML = `${completedFiles + 1} / ${totalFiles} files completed`;
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