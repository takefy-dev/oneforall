function required() {
    var empt = document.box.username.value;
    console.log(empt)
    if (empt === "") {
        console.log("dd")
        alert("Please input a Value");
        return false;
    }
    else {
        alert('Code has accepted : you can try another');
        return true;
    }
}