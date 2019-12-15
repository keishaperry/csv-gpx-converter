/*jshint sub:true*/
/* global cmw_ajax_object*/
/* global UIkit*/
/* global jQuery*/
(function ($) {
    "use strict";
    /* es6 const widely supported in evergreen browsers, ignore in jslint */
    function getCookieValue(a) {
        var b = document.cookie.match("(^|;)\\s*" + a + "\\s*=\\s*([^;]+)");
        return b ? b.pop() : "";
    }

    function setCookieValue(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }
    function showLoadingSpinner() {
        $("#cmwLoading").removeClass("uk-hidden");
    }

    function hideLoadingSpinner() {
        $("#cmwLoading").addClass("uk-hidden");
    }
 

// utility function for pretty printing file sizes
function formatBytes(a, b) {
    if (0 === a) {
        return "0 Bytes";
    } else {
        var c = 1024;
        var d = b || 2;
        var e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        var f = Math.floor(Math.log(a) / Math.log(c));
        var g = a / Math.pow(c, f);
        var h = (g).toFixed(d);
        return parseFloat(h) + " " + e[f];
    }
}


    function resetUploadsForm() {
        $("#js-progressbar").replaceWith("<progress id='js-progressbar' class='uk-progress uk-hidden' value='0' max='100' ></progress>");
    }
 
   
    function throwRegErrMsg(msg){
        hideLoadingSpinner();
        UIkit.modal.alert(msg);
    }
   

    function ajaxUploadDocs(type, FileData, Ext, filename ){
        var ajax_data = {
            'action':'gpx_uploads',
            "FileData":FileData,
            "FileExtension":"."+Ext,
        };
            
        UIkit.util.ready(function () {
            var bar = document.getElementById('js-progressbar');
            bar.value = 1;
            var animate = setInterval(function () {
                if (bar.value <= (bar.max - 10) ) {
                    bar.value += 2;
                }
                if (bar.value >= bar.max) {
                    clearInterval(animate);
                }

            }, 300);

        });
        jQuery.ajax({
            type: "POST",
            url: window.location+"test",
            data: ajax_data,
            success:function(response) {
                
                if (response){
                    console.log("File uploaded");
                    console.log(response);
                    download(filename+"_converted.gpx", response) ;
                    $("#js-progressbar").attr("value","99");
                    
                    UIkit.modal.alert('<p>Upload complete.</p>');
                    
                    resetUploadsForm();

                   
                } else {
                    console.warn("Document update response was not true.");
                }
            },
            error: function(errorThrown){
                console.warn(errorThrown);
            }

        });
    }

   
    
    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function testFileReaderSupport(){
        var applicant_urls = ["dashboard","register","login"];
        for (var i = 0; i < applicant_urls.length; i++) {
            if(window.location.href.indexOf(applicant_urls[i]) > -1) {
                if (!FileReader.prototype.readAsBinaryString) {
                    var intro = "<p>We've detected that you're using an outdated browser which is missing features required to complete the application process. Before continuing please switch to a modern browser like:</p>";
                    var browsers = "<div class=\"uk-grid uk-grid-medium uk-flex uk-flex-center\">";
                    browsers += "<a class=\"uk-text-center\" href=\"https://www.google.com/chrome/\" target=\"_blank\">";
                    browsers += "<img src=\"https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.0.0/archive/chrome_12-48/chrome_12-48_64x64.png\" ><p>Google Chrome</p>";
                    browsers += "</a>";
                    browsers += "<a class=\"uk-text-center\" href=\"https://www.mozilla.org/en-US/firefox/new/\" target=\"_blank\">";
                    browsers += "<img src=\"https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.0.0/archive/firefox_3.5-22/firefox_3.5-22_64x64.png\" ><p>Mozilla Firefox</p>";
                    browsers += "</a>";
                    browsers += "<a class=\"uk-text-center\" href=\"https://www.microsoft.com/en-us/windows/microsoft-edge\" target=\"_blank\">";
                    browsers += "<img src=\"https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.0.0/edge/edge_64x64.png\" ><p>Microsoft Edge</p>";
                    browsers += "</a>";
                    browsers += "</div>";
                    UIkit.modal.alert(intro+browsers);
                }
            }
        }
    }
    function getFileConfirmHTML(header, file) {
        var html = "<b>" + header + "</b>";
        html += "<div uk-grid class=\"uk-grid uk-child-width-1-2 uk-margin-large-top\">";
        html += "<div class=\"uk-width-1-3@l\"><span class=\"uk-position-center uk-position-relative uk-icon\" uk-icon=\"icon:file-edit;ratio:3\"></span></div>";
        html += "<div class=\"uk-meta uk-width-2-3@l\">";
        html += "<p class=\"uk-margin-small\">Filename: " + file.name + "</p>";
        html += "<p class=\"uk-margin-small\">Type: " + file.type + "</p>";
        html += "<p class=\"uk-margin-small\">File size: " + formatBytes(file.size) + "</p>";
        html += "</div></div>";
        return html;
    }

    function getFileFailHTML(message) {
        var html = "<b>Upload failed</b>";
        html += "<div uk-grid class=\"uk-grid uk-child-width-1-2 uk-margin-large-top\">";
        html += "<div class=\"uk-width-1-3@l\"><span class=\"uk-position-center uk-position-relative uk-icon\" uk-icon=\"icon:warning;ratio:3\"></span></div>";
        html += "<div class=\"uk-meta uk-width-2-3@l\">";
        html += "<p class=\"uk-margin-small\">" + message + "</p>";
        html += "</div></div>";
        return html;
    }

    function validateFileExt(ext) {
        //if file is wrong extention = fail
        var valid_ext = ["csv", "xlxs", "ods"];
        if (valid_ext.indexOf(ext) > -1) {
            return true;
        } else {
            return false;
        }
    }

    function validateFileSize(size) {
        if (size <= 2097152) {
            return true;
        } else {
            return false;
        }
    }

    function confirmFileUpload(file, type) {
        hideLoadingSpinner();

        var fileconf_html = getFileConfirmHTML("Confirm " + type + " upload:", file);

        UIkit.modal.confirm(fileconf_html).then(function () {
            console.log("User confirmed upload.");
           
            var Reader = new FileReader();
            var Ext = file.name.split(".").pop();
            var filename = file.name.split(".")[0];
            Reader.readAsText(file);
            // IMP! We must read the file into memory before we can pass to server side
            Reader.onloadend = function () {
                var FileData = Reader.result;
                ajaxUploadDocs(type, FileData, Ext, filename);
            };
        }, function () {
            console.log("User canceled upload.");
            resetUploadsForm();
        });
    }

    function failFileValidation(reason) {
        var modal_html;
        switch (reason) {
            case "extension":
                modal_html = getFileFailHTML("File extension not allowed. Allowed filetypes include: .doc, .pdf, .docx, .txt, or .rtf");
                hideLoadingSpinner();
                break;
            case "size":
                modal_html = getFileFailHTML("File size too large. Uploaded files must be no bigger than 2MB.");
                hideLoadingSpinner();
                break;
        }

        UIkit.modal.alert(modal_html).then(function () {
            resetUploadsForm();
        });
    }

    function handleFileUpload() {
        //showLoadingSpinner();
        var TheFile = document.getElementById("upload").files[0];
        var validExtension = validateFileExt(TheFile.name.split(".").pop());
        var validSize = validateFileSize(TheFile.size);
        if (validExtension && validSize) {
            confirmFileUpload(TheFile, "resume");
        } else if (!validExtension) {
            failFileValidation("extension");
        } else if (!validSize) {
            failFileValidation("size");
        } //todo: generic error alert
    }




    function remove_value_from_cookie(cookie,value){
        var cookieval = getCookieValue(cookie); 
        var cookie_arr = cookieval.split("|");
        var index = cookie_arr.indexOf(value);	
        if ( index > -1 ){
            cookie_arr.splice(index,1);
        }
        var new_val = cookie_arr.join(";");	
        setCookieValue(cookie,new_val,30);
    }

    

    jQuery(document).ready(function ($) {
        window.UIkit = UIkit;
        testFileReaderSupport();
        //console.log(window.location)

        // resume upload handler
        $("#upload").on("change", function () {
            //showLoadingSpinner();
            handleFileUpload();
            $("#js-progressbar").removeClass("uk-hidden");
          
        });


    });
}(jQuery));