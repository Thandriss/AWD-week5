
if (document.readyState !== "loading") {
    console.log("Here!1");
    initCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Here!2");
      initCode();
    });
  }

  const place = document.getElementById("categ");
  const listOptions = [];
  let ind = 0;

  async function initCode() {
    let result = await fetch("http://localhost:3000/categories")
    let rest = await result.json()
    console.log("cat");
    console.log(result);
    rest.forEach(el => {
      const par = document.createElement("P");
      const line = document.createElement("LABEL");
      var check = document.createElement("INPUT");
      check.setAttribute("type", "checkbox");
      check.id = "check" + ind.toString();
      // check.innerText = el.name;
      var x = document.createElement("SPAN");
      x.id = ind.toString();
      listOptions.push(el._id);
      x.innerText = el.name;
      ind++;
      line.appendChild(check);
      line.appendChild(x);
      par.appendChild(line);
      place.appendChild(par);
      // check.appendChild(x)
      // place.appendChild(check);
      // place.appendChild(x);
    })
  }

  let ingr = [];
  let instr = [];
  const input = document.getElementById("search");
  const cont = document.getElementById("rec");

  input.addEventListener('keydown', async function(event){
    let id = [];
    if (event.key === "Enter") {
      event.preventDefault();
      await fetch("http://localhost:3000/recipe/" + input.value)
        .then(res => res.json())
        .then((result) => {
          cont.innerHTML = ""
          let img_div = document.createElement("DIV");
          img_div.id = "images"; 
          cont.appendChild(img_div);
          id = result.images;
          console.log("heeeeeeeeeeeeeeeere");
          console.log(id);
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
        });
      console.log("sdfgsjdgfks")
      console.log(id);
      console.log("sdfgsjdgfks")
      for (let i=0; i<id.length; i++) {
        let answer  = await fetch("http://localhost:3000/images/" + id[i]);
        let img = await answer.blob();
        let img_save = document.getElementById("images")
        let img_cont = document.createElement("IMG");
        console.log(img);
        let link = URL.createObjectURL(img).toString();
        console.log(link);
        img_cont.src = link;
        img_save.appendChild(img_cont);
      }
    }
  })

  function toBase64(arr) {
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
 }

  const addIngr = document.getElementById("add-ingredient");
  const addInstr = document.getElementById("add-instruction");
  const sub = document.getElementById("submit");

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

  sub.addEventListener("click", async function() {
    const formData = new FormData();
    formData.append("name", "smth");
    formData.append("images", save[0]);
    let img_id = [];
    let response = await fetch("http://localhost:3000/images", {
            method: "post",
            body: formData,
            header: {
              "Content-Type": "multipart/form-data",
            }
        });
      let data = response.json();
      await data.then((value) => {
        img_id.push(value.id);
      });
        // .then((result) => {
        //   // console.log(result);
        //   console.log(result);
        //   result.json();
        // })
        // .then((resJs) => {
        //   console.log(resJs);
        //   // img_id.push(resJs.id);
        // })
    let ids = [];
    for(let i = 0; i<ind; i++) {
      const listOfCheck = document.getElementById("check" + i.toString());
      if (listOfCheck.checked == true) {
        ids.push(listOptions[i]);
      }
    }
    let reqToSend = {
      name: nameDish.value, 
      instructions: instr,
      ingredients: ingr,
      categories: ids,
      images: img_id 
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
    instr = [];
    ingr = [];
  })

  imgIn.addEventListener("change", event => {
    save = [];
    const files = event.target.files;
    // console.log(files[0]);
    // let imgToSend = {
    //   name: files[0].name,
    //   buffer: files[0].buffer,
    //   mimetype: files[0].type,
    //   encoding: encoding
    // }
    save.push(files[0]);
  })
