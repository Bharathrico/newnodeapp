"use strict";
var dropzone = document.getElementById("dropzone");
var screenshot = document.getElementById("screenshot");
var photovar = 1;

dropzone.ondrop = function (ev) {
    ev.preventDefault();
    let complete = '';
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                var nameval = file.name;
                if (((ev.dataTransfer.items.length) == 1) && nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.obj|.gltf)$/i)) {
                    complete += file.name + ".";
                    $('#dropzone').css("font-size", "1.5vmin");
                    $('#dropzone').css("color", "white");
                }
                else if ((i == (ev.dataTransfer.items.length) - 1) && nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.obj|.gltf)$/i)) {
                    complete += "& " + file.name + ".";
                    $('#dropzone').css("font-size", "1.5vmin");
                    $('#dropzone').css("color", "white");
                }
                else if ((i == (ev.dataTransfer.items.length) - 2) && nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.obj|.gltf)$/i)) {
                    complete += file.name + " ";
                    $('#dropzone').css("font-size", "1.5vmin");
                    $('#dropzone').css("color", "white");
                }
                else if (nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.obj|.gltf)$/i)) {
                    complete += file.name + ", ";
                    $('#dropzone').css("font-size", "1.5vmin");
                    $('#dropzone').css("color", "white");
                }
                else {
                    $('#dropzone').css("font-size", "1.5vmin");
                    $('#dropzone').css("color", "red");
                    complete = "Drop a valid filetype(.obj,.gltf)";
                }
            }
        }
        this.innerHTML = complete;

    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }

    this.className = 'dragoff';
    complete = "";
};
var preview = document.getElementById("photoholder");
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) { continue }
        const smalldiv = document.createElement("div");
        const img = document.createElement("img");
        img.file = file;
        preview.appendChild(smalldiv);
        smalldiv.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

        const reader = new FileReader();
        reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
    }
}
screenshot.ondrop = function (ev) {
    ev.preventDefault();
    let complete = '';
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)

        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                var nameval = file.name;

                if (((ev.dataTransfer.items.length) == 1) && (nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.jpg|.jpeg|.png)$/i))) {
                    if (photovar <= 3) {
                        $('#screenshot').css("font-size", "1.5vmin");
                        $('#screenshot').css("color", "white");
                        complete += file.name + ".";

                        const dt = ev.dataTransfer;
                        const files = dt.files;

                        handleFiles(files);
                        photovar++;
                    }
                    else {
                        alert("Only 3 photos can be uploaded");
                    }
                }
                else if ((i == (ev.dataTransfer.items.length) - 1) && (nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.jpg|.jpeg|.png)$/i))) {
                    $('#screenshot').css("font-size", "1.5vmin");
                    $('#screenshot').css("color", "white");
                    complete += "& " + file.name + ".";
                }
                else if ((i == (ev.dataTransfer.items.length) - 2) && (nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.jpg|.jpeg|.png)$/i))) {
                    $('#screenshot').css("font-size", "1.5vmin");
                    $('#screenshot').css("color", "white");
                    complete += file.name + " ";
                }
                else if ((nameval.match(/([a-zA-Z0-9\s_\\\-\(\):])+(.jpg|.jpeg|.png)$/i))) {
                    $('#screenshot').css("font-size", "1.5vmin");
                    $('#screenshot').css("color", "white");
                    complete += file.name + ", ";
                }
                else {
                    $('#screenshot').css("font-size", "1.5vmin");
                    $('#screenshot').css("color", "red");
                    complete = "Drop a valid filetype(.jpg,.jpeg,.png)";
                }
            }
        }
        this.innerHTML = complete;

    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }

    this.className = 'dragoff';
    complete = "";
};
dropzone.ondragover = function () {
    this.className = 'dragover';
    return false;
};
screenshot.ondragover = function () {
    this.className = 'dragover';
    return false;
};

dropzone.ondragleave = function () {
    this.className = 'dragoff';
    return false;
};
screenshot.ondragleave = function () {
    this.className = 'dragoff';
    return false;
};
document.getElementById('model').addEventListener('click', function () {
    document.getElementById('modelfile').click();

});
document.getElementById('photos').addEventListener('click', function () {
    document.getElementById('imagefile').click();
});
var modelval = document.getElementById('modelfile');
var imageval = document.getElementById("imagefile");
var completemod = "";
var completepic = "";
modelval.addEventListener('change', function () {



});

imageval.addEventListener('change', function () {

    if (photovar <= 3) {
        handleFiles(this.files);
        photovar++;
        let filename = this.value.replace(/.*[\/\\]/, '');
        screenshot.innerHTML = filename;
    }
    else {
        alert("Only 3 photos can be uploaded");
    }
});

