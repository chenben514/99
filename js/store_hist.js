let scoreHist = document.querySelector(".score_hist");
const category = document.querySelector("#category").value;
const level = document.querySelector("#level");
scoreHist.innerText = "";
for (i = 0; i < level.length; i++) {
    // scoreHist.innerText = scoreHist.innerText + category + "_" + level[i].innerText + ": 00\n"
    scoreHist.innerText = scoreHist.innerText + level[i].innerText + ":"
    var myStorageScore = localStorage.getItem(category + "_" + level[i].value);
    scoreHist.innerText = scoreHist.innerText + myStorageScore + "\n"
}

