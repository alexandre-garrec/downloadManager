

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

var socket = io.connect('http://localhost:4876');


socket.on('bonjour', function (data) {
    toastr.success(data.hello);
});

var total = 0;
socket.on('download', function (data) {
    if (data.total) {
        total = data.total;
    }else{
        if (data.count != total) {
            $( "#infos" ).text( Math.round(100*data.count /total) + " % " );
        }
        else{
            $( "#infos" ).text("Finalisation ...");
        }
    }
});