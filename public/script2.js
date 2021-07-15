var noofslots = document.querySelectorAll(".slots").length;

// document.querySelector("#addform").add

//
$(document).ready(function() {

  $("#anchoradd").on('click', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    console.log(url);
    $.ajax({
             url: url
          })
          .done(function( data ) {
             console.log( "Sample of data:", data );

        });
    // $.get(url, function(data) {
    //     // success
    //     console.log("success");
    //     console.log(data);
    //     // console.log(response);
    // });
  });

  for (var i = 0; i < noofslots; i++) {

    document.querySelectorAll(".slots")[i].addEventListener("click", function() {

      // this.preventDefault();
      const id = this.id.split("/");
      const action = id[1];
      console.log(id);
      const value = this.name.split("/");
      console.log(value);
      console.log(action);
      console.log(this.id);
    });
  }
});
