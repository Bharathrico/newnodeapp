function search() {
    var searched = document.getElementById("search").value;
    if (searched === '') {

    }
    else {
        window.location.href = "/search/" + searched;
    }
}