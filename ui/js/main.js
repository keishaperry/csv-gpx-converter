// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    console.log("we good");
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }



  function ajaxCall() {
    return $.ajax({
        type: "POST",
        url: "test",
        data: {
            "action": "cmw_check_applicant_active"
        },
        success: function (response) {
            console.log(response);
            if (response === "true") {
                console.info("Applicant is active");
                return true;
            } else {
                console.warn("Applicant is not active");
                return false;
            }
        },
        error: function (errorThrown) {
            console.warn(errorThrown);
        }
    });
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      var Reader = new FileReader();
          var Ext = files[i].name.split(".").pop();
          Reader.readAsText(files[i]);
          // IMP! We must read the file into memory before we can pass to server side
          Reader.onloadend = function () {
              var FileData = encodeURIComponent(window.btoa(Reader.result));
              console.log(Reader.result);
              //ajaxUploadDocs(type, FileData, Ext);
          };
     
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }
  

  document.getElementById('upload').addEventListener('change', handleFileSelect, false);

   /*  function handleFileSelect(evt) {
      var files = evt.target.files; // FileList object
  
      // files is a FileList of File objects. List some properties.
      var output = [];
      for (var i = 0, f; f = files[i]; i++) {
        var Reader = new FileReader();
            var Ext = files[i].name.split(".").pop();
            Reader.readAsText(files[i]);
            // IMP! We must read the file into memory before we can pass to server side
            Reader.onloadend = function () {
                var FileData = encodeURIComponent(window.btoa(Reader.result));
                console.log(Reader.result);
                //ajaxUploadDocs(type, FileData, Ext);
            };
       
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</li>');
      }
      document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    }
    
  
    document.getElementById('files').addEventListener('change', handleFileSelect, false); */