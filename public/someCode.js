if (document.readyState !== "loading") {
    console.log("Here!1")
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Here!2")
      initializeCode();
    });
  }
  
  function initializeCode() {
    fetchRecipe();
  }

  let ingr = [];
  let instr = [];

  async function fetchRecipe() {
    await fetch("/recipe/pizza")
    .then((res) => res.json())
    .then((result) => {
      const cont = document.getElementById("rec");
      var title = document.createElement("H1");
      title.innerText = result.name;
      title.id = "ti";
      cont.appendChild(title);
      var ingTitle = document.createElement("H2");
      ingTitle.innerText = "Ingredients";
      ingTitle.id = "ingr-ti";
      cont.appendChild(ingTitle);
      for(el in result.ingredients) {
        var ulist = document.createElement("UL");
        ulist.innerText = result.ingredients[el];
        cont.appendChild(ulist);
      }
      var instTitle = document.createElement("H2");
      instTitle.innerText = "Instructions"
      instTitle.id = "inst-ti";
      cont.appendChild(instTitle);
      for(el in result.instructions) {
        var ulistIns = document.createElement("UL");
        ulistIns.innerText = result.instructions[el];
        cont.appendChild(ulistIns);
      }
    })
  }

  const addIngr = document.getElementById("add-ingredient");
  const addInstr = document.getElementById("add-instruction");
  const sub = document.getElementById("submit")

  addIngr.addEventListener("click", function(){
    const newIngr = document.getElementById("ingredients-text");
    ingr.push(newIngr.value);
  })

  addInstr.addEventListener("click", function(){
    const newInst = document.getElementById("instructions-text");
    instr.push(newInst.value);
  })

  const nameDish = document.getElementById("name-text");
  const imgIn = document.getElementById("image-input");
  let save = [];

  sub.addEventListener("click", function() {
    let reqToSend = {
      name: nameDish.value, 
      instructions: instr,
      ingredients: ingr
    }
    fetch("http://localhost:3000/recipe/", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(reqToSend)
        })
        // .then((res) => {
        //   res.json;
        //   instr = [];
        //   ingr = [];
        // })
    const formData = new FormData();
    formData.append("images",save[0]);
    save = [];
    console.log("Here");
    fetch("http://localhost:3000/images", {
            method: "post",
            body: formData
        })
        .then((res) => {
          console.log(res)
        })
  })

  imgIn.addEventListener("change", event => {
    save = [];
    const files = event.target.files;
    save.push(files[0])
  })
