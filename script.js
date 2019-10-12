var userId;

auth.onAuthStateChanged(user => {
  if (user) {
    $("#login-btn").css("display", "none");
    $("#logout-btn").css("display", "block");
    $(".login-display").css("display", "block");
    console.log("user logged in");
    userId = user.uid;
    console.log(user.uid);
  } else {
    document.querySelector("#login-btn").style.display = "inline";
    document.querySelector("#logout-btn").style.display = "none";
    document.querySelector(".login-display").style.display = "none";
  }
});

//---------------------login---------------------------
const loginform = document.querySelector("#modal-login");
const login_modal = document.querySelector(".modal");
loginform.addEventListener("click", e => {
  e.preventDefault();

  //get user info
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  //signin
  auth.signInWithEmailAndPassword(email, password).then(user => {
    console.log(user);
  });
});

db.collection("users").onSnapshot(doc => {
  let changes = doc.docChanges();

  changes.forEach(ch => {
    if (ch.type == "added") {
      let data = ch.doc.data();
      let data_id = ch.doc.id;

      //console.log(data);
      render(data, data_id);
    }
  });
});

function render(data, id) {
  let html = `<tr><td> ${data.Name} </td>  <td>${data.rfid}</td> <td>${data.uid}</td> <td>${data.time}</td> <td>${data.cost}</td><td>${data.nwater}</td><td>${data.cwater}</td> <td>${data.date}</td> <td><button class="btn btn-info update-btn" id="${id}"  data-toggle="modal" data-target="#myModal" >update</button></td> </tr> `;
  $(".table").append(html);
}

const form = document.querySelector(".form");
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#name").val();
  const rfid = $("#rfid").val();
  const uid = $("#uid").val();
  const time = $("#time").val();
  const cost = $("#cost").val();
  const cwater = $("#cwater").val();
  const nwater = $("#nwater").val();
  const date = $("#date").val();

  db.collection("users").add({
    Name: name,
    rfid: rfid,
    uid: uid,
    time: time,
    cost: cost,
    nwater: nwater,
    cwater: cwater,
    date: date
  });
  alert("success");
  form.reset();
});

$(document).ready(function() {
  $(document).on("click", "button.update-btn", function() {
    var id = $(this).attr("id");
    db.collection("users")
      .doc(id)
      .get()
      .then(doc => {
        $("#u-uid").val(id);
        $("#u-cost").val(doc.data().cost);
        $("#u-cwater").val(doc.data().cwater);
        $("#u-nwater").val(doc.data().nwater);
      });
  });
});

//update

$("#update").on("click", function(e) {
  e.preventDefault();

  var uid = $("#u-uid").val();
  var cost = $("#u-cost").val();
  var cwater = $("#u-cwater").val();
  var nwater = $("#u-nwater").val();
  console.log(uid);

  db.collection("users")
    .doc(uid)
    .update({
      cost: cost,
      cwater: cwater,
      nwater: nwater
    })
    .then(e => {
      console.log("successfully updated");
      window.location.reload();
    });
});

// ---------------logout----------------------
const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", e => {
  e.preventDefault();

  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("logged out");
    })
    .catch(function(error) {});
});
/*db.collection('users').add({
    Name: 'navi',
    rfid: 'rf0003',
    uid: 'wp0003',
    time: '5:00',
    cost: '600',
    nwater: '10',
    cwater: '5',
    date: '05-10-2018'

})*/
