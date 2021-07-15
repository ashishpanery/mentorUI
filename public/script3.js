var noofslots = document.querySelectorAll(".slots").length;

$(document).ready(function() {
  console.log(noofslots);

  for (var i = 0; i < noofslots; i++) {
    document.querySelectorAll(".slots")[i].addEventListener("click", function() {
      // this.preventDefault();
      console.log("the day is:");
      console.log(myVar);
      console.log("*****");
      console.log(allslotsjs[0].display);
      console.log("*****");
      allslotsjs[0].display = "none";
      console.log(allslotsjs[0].display);
      console.log("*****");
      const id = "#" + this.id;
      console.log(typeof(this.id));
      const splitid = this.id.split("/");
      const action = splitid[1];
      const name = this.name;
      const namesplit = this.name.split("/");
      console.log(name);
      console.log(namesplit);
      console.log(typeof(id));
      console.log(id);
      if (namesplit[0] == "addslot") {
        var counterId = 100 + parseInt(this.id);
        counterId = "#" + counterId.toString();
        console.log(counterId);
        namesplit.shift();
        const newName = "removeslot/"+namesplit.join();
        console.log(newName);
        // document.getElementById(id).setAttribute("name", newName);
        $(id).css("display","none");
        // $(id).attr("name", newName);
        $(counterId).css("display","inline-block");
      } else if(namesplit[0] == "removeslot"){
        var counterId = parseInt(this.id)-100;
        counterId = "#" + counterId.toString();
        console.log(counterId);
        $(id).css("display","none");
        $(counterId).css("display","inline-block");
      }

      // console.log(id);
      // const value = this.name.split("/");
      // console.log(this.class);
      // console.log(action);
      // console.log(this.id);
    });
  }
});
