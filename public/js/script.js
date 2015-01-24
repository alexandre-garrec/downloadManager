

function download(url){
//toastr.info("Download Start");
  $.ajax(
      {
        url : '/download/',
        type: "POST",
        data : "url='" + url + "'",

        success : function(data)
        {
            toastr.success(data.result);
            $( "#infos" ).text("Done");
        }
      }
  );
}