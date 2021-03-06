var num = 1;
var capper = 0;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function addRow(){
  $(".btn").mouseup(function(){
    $(this).blur();
  })
    var table = document.getElementById("stonks")
    var newRow = document.createElement("tr")
    newRow.setAttribute("id", "row" + num)
    var col1 = document.createElement("td")
    var textField1 = document.createElement("input")
    textField1.type = "text"
    textField1.setAttribute("id", "symbol" + num) 
    col1.appendChild(textField1)
    var col2 = document.createElement("td")
    var textField2 = document.createElement("input")
    textField2.type = "text"
    textField2.setAttribute("id","alloc" + num)
    col2.appendChild(textField2)
    newRow.appendChild(col1)
    newRow.appendChild(col2)
    var pps = newRow.appendChild(document.createElement("td"))
    pps.setAttribute("id", "pps" + num)
    var quant = newRow.appendChild(document.createElement("td"))
    quant.setAttribute("id", "quant" + num)
    var eq = newRow.appendChild(document.createElement("td"))
    eq.setAttribute("id", "eq" + num)
    newRow.appendChild(pps)
    newRow.appendChild(quant)
    newRow.appendChild(eq)
    table.appendChild(newRow)
    num += 1
}
function delRow(){
  $(".btn").mouseup(function(){
    $(this).blur();
  })
    var table = document.getElementById("stonks")
    if (table.hasChildNodes()) {
      var rows = table.childElementCount
        table.removeChild(table.childNodes[rows+1]);
      }
}
function getQuote(symbol, i, availCap){
  var settings = {
    "url": "https://finnhub.io/api/v1/quote?token=bs1moqvrh5rbe4rkr830&symbol=" + symbol,
    "method": "GET",
    "timeout": 0,
    "headers": {
      //"Cookie": "__cfduid=d404aa8f0146ae8a0c5ecc746e85c294d1597517827"
    },
  };
  $.ajax(settings).done(async function (response) {
    if(capper%30 == 0 && capper!= 0){
      await sleep(60000)
    }
    //console.log("Sent Request: " + settings.url)
    var alloc = document.getElementById("alloc" + (i)).value / 100 * availCap
    var quan = Math.floor(alloc / response.pc)
    var eq = quan * response.pc
    //console.log(symbol + ": " + response.pc)
    document.getElementById("quant"+(i)).innerText = quan
    document.getElementById("pps"+(i)).innerText = response.pc
    document.getElementById("eq"+(i)).innerText = eq
    availCap = availCap - eq
  });
}
async function autoBalance(){
  $(".btn").mouseup(function(){
    $(this).blur();
  })
  if(document.getElementById("availCapital").value == ""){
    document.getElementById("availCapital").value = "WHY IS THIS BLANK?!?!"
    return
  }
    var table = document.getElementById("stonks")
    var rows = table.childElementCount
    var availCap = document.getElementById("availCapital").value
    for(var i = 0; i < rows; i++){
        capper += 1
        if(capper%30 == 0 && capper!= 0){
          await sleep(60000)
        }
        var symbol = document.getElementById("symbol"+i).value.toUpperCase()
        //console.log(symbol)
        getQuote(symbol, i, availCap)
        await sleep(40)
    }
}
function getMarketCap(symbol, i, rows, marketCaps){
  //console.log(i)
  var settings = {
    "url": "https://finnhub.io/api/v1/stock/profile2?token=bs1moqvrh5rbe4rkr830&symbol=" + symbol,
    "method": "GET",
    "timeout": 0,
    "headers": {
      //"Cookie": "__cfduid=d404aa8f0146ae8a0c5ecc746e85c294d1597517827"
    },
  };
  $.ajax(settings).done(async function (response) {
    //console.log("Sent Request: " + settings.url)
    marketCaps[i].cap = response.marketCapitalization
    //console.log(symbol + ": " + response.marketCapitalization)
    if (marketCaps.length == rows){
      await sleep(40)
      if(capper%30 == 0 && capper!= 0){
        await sleep(60000)
      }
      calcWeights(marketCaps)
    }
  });
}
async function marketBalance(){
  $(".btn").mouseup(function(){
    $(this).blur();
  })
  if(document.getElementById("availCapital").value == ""){
    document.getElementById("availCapital").value = "WHY IS THIS BLANK?!?!"
    return
  }
  var table = document.getElementById("stonks")
  var rows = table.childElementCount
  var marketCaps = []
  for (let i = 0; i < rows; i++) {
    capper += 1
    marketCaps.push({i:i,cap:0})
    var symbol = document.getElementById("symbol"+i).value.toUpperCase()
    getMarketCap(symbol, i, rows, marketCaps);
    await sleep(40)
  }
}
async function calcWeights(marketCaps){
  var table = document.getElementById("stonks")
  var rows = table.childElementCount
  var totalCap = 0
  for(i = 0; i < rows; i++){
    totalCap += marketCaps[i].cap
  }
  for(i = 0; i < rows; i++){
    document.getElementById("alloc" + i).value = (marketCaps[i].cap/totalCap)*100
  }
  
  for(i = 0; i < rows; i++){
    var symbol = document.getElementById("symbol"+i).value.toUpperCase()
    var table = document.getElementById("stonks")
    var availCap = document.getElementById("availCapital").value
    getQuote(symbol, i, availCap, table)
    await sleep(40)
  }
}
