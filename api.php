<?php

// specify the folder where files will be uploaded
$folder = "uploads/";

// move the upload file to the specified folder
// $_FILES['file']['tmp_name'] is the temporary file name
// $_FILEs['file']['name'] is the original file name
move_uploaded_file($_FILES['file']['tmp_name'], $folder . time() . '_' . $_FILES['file']['name']);
