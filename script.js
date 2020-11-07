function Prod (name, price, unit, approx, quantity, cost){
	this.name = name.trim();
	this.price = (price == 0) ? "" : price;
	this.cost = cost;
	this.unit = unit.trim();
	this.quantity = (!quantity && !!price) ? "1" : quantity;
	this.approx = approx;
}

var products = [];
var sum = 0;

function formatNum(num){
	const strNum = num.toFixed(2);
	return !strNum.match(/\.00/) ? strNum : num.toString(10);
}

function elOfList(numberOfItemInList){
	const selector = "#prodList > li:nth-child(" + numberOfItemInList.toString(10)  + ")";
	return document.querySelector(selector);
}

function getElOfListNum(obj){
	for (let i = products.length; i>0; i--){
		if(obj === elOfList(i)) {
			return i;
		}
	}
	throw 'could not get elOfList number!';
}

function elid(id){
	return document.getElementById(id);
}

function satt(el, attr, val){
	el.setAttribute(attr, val);
}

function sattid(id, attr, val){
	satt(elid(id), attr, val);
}

function gattid(id, attr){
	return elid(id).getAttribute(attr);
}

function addToArray(){
    const unit = gattid("radioContainer1", "data-unit");
    const name = elid("nameInput").value;
    const price = trimNumericInput(elid("priceInput").value, 'price');
    const approx = elid("approx").value;
    const quantity = trimNumericInput(elid("quantityInput").value, 'quantity');
    const cost = trimNumericInput(elid("costInput").value, 'cost');
	products.push(new Prod(name, price, unit, approx, quantity, cost));
}

function editInArray(index){ 
	products[index].name = elid("nameInput").value;
    products[index].price = trimNumericInput(elid("priceInput").value, 'price');
	products[index].unit = gattid("radioContainer1", "data-unit");
	products[index].approx = elid("approx").value;
	products[index].quantity = trimNumericInput(elid("quantityInput").value, 'quantity');
    products[index].cost = trimNumericInput(elid("costInput").value, 'cost');
}

function addToText(){
    let num = products.length.toString(10);
    let li = document.createElement("li");
	let item = products[products.length-1];
	li.innerHTML = getLiInnerHtml(item);
	li.setAttribute("class", "liAnimAdd");
	elid("prodList").appendChild(li);
	satt(li, "ontouchstart", "mouseDown(getElOfListNum(this))");
	satt(li, "onmousedown", "mouseDown(getElOfListNum(this))");
	satt(li, "ontouchend", "mouseUp(getElOfListNum(this))");
	satt(li, "onmouseup", "mouseUp(getElOfListNum(this))");
}

function getLiInnerHtml(arrObj){
	const name = !!arrObj.name ? arrObj.name : "Неназваний продукт";
	let middle;
	if (!arrObj.price || (arrObj.quantity === '1' && arrObj.unit === 'шт')) {
		middle = '';
	} else if (arrObj.quantity === '0') {
		middle = (' (').concat(arrObj.price).concat(' грн/').concat(arrObj.unit).concat(')');
	} else {
		middle = (' (').concat(arrObj.price).concat(' грн/').concat(arrObj.unit).concat(', ') +
		(arrObj.approx).concat(arrObj.quantity).concat(' ').concat(arrObj.unit).concat(')');
	}
	return name.concat(middle).concat (' – ').concat(arrObj.cost).concat(' грн');
}

let timeOut;
function mouseDown(numberInList){
    timeOut = setTimeout(showEditRemovePopUp, 500, numberInList);
    elOfList(numberInList).style.backgroundColor='lightsteelblue';
}
function mouseUp(numberInList){
    clearTimeout(timeOut);
	satt(elOfList(numberInList), "class", "liAnimTouchEnd");
    elOfList(numberInList).style.backgroundColor='';
	setTimeout(()=> {elOfList(numberInList).removeAttribute("class")}, 300);
}

function showEditRemovePopUp(numberInList){
	elOfList(numberInList).style.backgroundColor='';
    let temp = "«" + elOfList(numberInList).textContent + "?»";
	elid("addRemoveTextVariable").innerHTML = temp;
	elid("addRemoveNumVar").innerHTML = numberInList; 	
	clickCloseOrOpenEditRemovePopUp(false);
	sattid("copyItemButton", "onclick", "clickCopyItemButton(elOfList(elid('addRemoveNumVar').innerHTML).textContent)");
	sattid("removeButton", "onclick", "clickRemoveButton(elid('addRemoveNumVar').innerHTML)");
	sattid("editButton", "onclick", "clickEditButton(elid('addRemoveNumVar').innerHTML)");
}

function clickConfirmButton(){
	if(elid("addRemoveNumVar").innerHTML. match(/add/)) {
		confirmAdd();
	} else {
		confirmEdit(elid("addRemoveNumVar").innerHTML);
	}
}

function confirmEdit(numberOfItemInList){ 
	if(isInputCorrect()){
		const index = numberOfItemInList*1-1;
		elid("sumSpan").innerHTML = formatNum(sum -= (products[index].cost - elid("costInput").value));
		editInArray(index);
		editListEntry(numberOfItemInList);
		clickCloseOrOpenAddPopup();
	}
}

function confirmAdd(){
	if(isInputCorrect()){
		if(sum === 0){
				elid("sumP").style.display = "block";
				changeDisplayOfCopyListButton();
		}
     clickCloseOrOpenAddPopup();
     addToArray();
     addToText();
     elid("sumSpan").innerHTML = formatNum(sum += 1*products[products.length-1].cost);
	}
}

function trimNumericInput(strNum, inputType) {
	if(strNum.match(/^[1-9]\d*$/)){
		return strNum;
	} else {
		const num = parseFloat(strNum);
		if(isNaN(num)){
			return "";
		} else if (num === 0) {
			return '0';
		} else {
			const strNum2 = num.toString(10);
			if (inputType === 'quantity') {
				return strNum2;
			} else if (strNum2.match(/\.[1-9]$/)) {
				return num.toFixed(2);
			} else if (inputType === 'price') {
				return strNum2;
			} else {
				const temp = num.toFixed(2);
				return !temp.match(/\.00([0-4]d*)?$/) ? temp : Math.round(num).toString(10);
			}
		}			
	}
}

function clickEditButton(numberOfItemInList) {
	const index = 1*numberOfItemInList - 1;
	elid("h2").innerHTML="Ред. прод. №" + numberOfItemInList;
	const unit = products[index].unit;
	clickCloseOrOpenAddPopup();
	clickCloseOrOpenEditRemovePopUp(false);
	elid((!!unit.match(/шт/) || !!products[index].approx) ?  'byCost' : 'byQuantity').click();
	clickSetUnit(unit);
	if (unit.match(/кг/)){
		elid("kg").checked = "true";
	} else if (unit.match(/шт/)){
		elid("pcs").checked = "true";
	} else {
		elid("otherUnit").checked = "true";
	}
	elid("quantityInput").value = products[index].quantity; 
	elid("nameInput").value = products[index].name;
    elid("priceInput").value = products[index].price;
    elid("costInput").value = products[index].cost;
	setPlaceholdersAndApprox();
}

function editListEntry(numberOfItemInList){
	const li = elOfList(numberOfItemInList);
	const item = products[numberOfItemInList*1 - 1];
    elOfList(numberOfItemInList).innerHTML =  getLiInnerHtml(item);
	li.removeAttribute("class");
	setTimeout(function(){li.setAttribute("class", "liAnimEdit")}, 4);
}

function clickRemoveButton(numberInList){
	const warning = "Ви впевнені, що бажаєте вилучити зі списку продукт " +
	elid("addRemoveTextVariable").innerHTML + "?"
	if(confirm(warning)){
		const index = (1*numberInList)-1;
		elid("sumSpan").innerHTML = formatNum(sum -= 1*products[index].cost);
		removeFromArray(index);
		removeFromText(numberInList);
		if (sum === 0){
			elid("sumP").style.display = "none";
			changeDisplayOfCopyListButton();
		}
		clickCloseOrOpenEditRemovePopUp(true);
	} else {
		clickCloseOrOpenEditRemovePopUp(false);
	}
}

function clickCopyItemButton(str){
	copyToClipboard(str);
	clickCloseOrOpenEditRemovePopUp(false);
}

function clickCloseOrOpenEditRemovePopUp(isDelayed){
	changeDisplayOfEditRemovePopUp();
	changeStateOfMainDiv(isDelayed);
}

function changeDisplayOfEditRemovePopUp(){
	const cl = gattid("editRemovePopUp", "class") === "smallerPopUp" ?  "smallerPopUp enabledPopUp" : "smallerPopUp";
	sattid("editRemovePopUp", "class", cl);
}

function copyToClipboard(str){
  var copyText = document.createElement("textarea");
  copyText.value = str;
  document.body.appendChild(copyText);
  copyText.select();
  copyText.setSelectionRange(0, 99999); 
  document.execCommand("copy");
  document.body.removeChild(copyText);
	alert("Скопійовано до буферу обміну: " +  '\n"' + copyText.value  + '".');
}

function clickSetUnit(unit){
	if(!unit){
		unit = prompt("Введіть назву одиниці кількості:");
		if(!unit){
			unit = "шт";
			elid("pcs").checked = true;
			alert('Помилкове введення! Використовується одиниця "шт".');		
		}
	} 
	sattid("radioContainer1", "data-unit", unit);
	elid("smallUnitSpan").innerHTML =  gattid("radioContainer1", "data-unit");
	elid("smallUnitSpan2").innerHTML =  gattid("radioContainer1", "data-unit");
}

function clickNewAdd(){
	eraseInput();
	setPlaceholdersAndApprox();
	elid("addRemoveNumVar").innerHTML = "add";
	elid("h2").innerHTML="Додати продукт";
    clickCloseOrOpenAddPopup();
}

function removeFromArray(index){
	 products.splice(index, 1);
}

function removeFromText(numberInList){
	const li = elOfList(numberInList);
	li.removeAttribute("class");
	setTimeout(function() { li.setAttribute("class", "liAnimRemove") }, 4);
	setTimeout(function() { elid("prodList").removeChild(li) }, 1000);
}

function clickCloseOrOpenAddPopup(){
    changeDisplayOfAddDiv();
	changeStateOfMainDiv(false);
}

function changeDisplayOfAddDiv(){
	const cl = gattid("addDiv", "class") === "bigPopUp" ?  "bigPopUp enabledPopUp" : "bigPopUp";
	sattid("addDiv", "class", cl);
}

function changeStateOfMainDiv(isDelayed){
	if (gattid("mainDiv", "class") !== "unclickable"){
		sattid("mainDiv", "class", "unclickable");
		elid("background1").style.opacity = "0.6";
	} else {
		elid("background1").style.opacity = "1";
		if (!isDelayed) {
			elid("mainDiv").removeAttribute("class");
		} else {
			setTimeout(() => {elid("mainDiv").removeAttribute("class")}, 1000);
		}
	}
}

function clickCostOrQuantity(value){
    if(value === 'byCost'){
        elid("costInput").disabled=false;
        elid("quantityInput").disabled=true;
        elid("quantityDiv").style.opacity="0.5";
        elid("costDiv").style.opacity="1";
    } else {
		elid("costInput").disabled=true;
        elid("quantityInput").disabled=false;
        elid("quantityDiv").style.opacity="1";
        elid("costDiv").style.opacity="0.5";
    }
	getMissingValuesOnInput();
}

function eraseInput(){
    elid("nameInput").value = "";
    elid("priceInput").value = "";
    elid("costInput").value = "";
    elid("quantityInput").value = "";
}

function processKeypress(keyUpEvent){
	if(!isEnterPressed(keyUpEvent)){
		getMissingValuesOnInput();
	}
}

function processNameInput(inputValue, keyUpEvent) {
	isEnterPressed(keyUpEvent);
	appendProdDataList(inputValue);
}


function isEnterPressed(keyUpEvent){
	if(keyUpEvent.keyCode === 13) {
		clickConfirmButton();
		return true;
	} else {
		return false;
	}
}

function appendProdDataList(inputValue) {
	const prodDataListContent = ["Абрикоси", Апельсини", "Банани", "Бараболя", "Борошно", "Буряки", "Виноград", "Вода", "Гречка", "Грушки", "Зелень", "Кабачки", "Кавун", "Капуста", "Капуста цвітна", "Капуста броколі", "Кефір", "Капуста брюссельська", "Корінь селери", "Корінь петрушки", "Корольок", "Кріп", "Кріп і петрушка", "Курятина", "Мандарини", "Масло", "Молоко", "Морква", "Насіння соняшнику", "Огірки", "Олія","Оцет", "Пакети", "Пакети для сміття", "Персики", "Петрушка", "Печиво", "Пластівці", "Полуниці", "Помідори", "Приправи", "Пшоно", "Редиска", "Редька", "Риба", "Рукав для запікання", "Ряжанка", "Салат", "Свинина", "Сир", "Сир-творог", "Сир плавлений", "Сік", "Сіль", "Сирки плавлені", "Сливки", "Сметана", "Сода", "Туалетний папір", "Фініки", "Халва", "Хліб", "Хурма", "Цибуля", "Цукерки", "Цукор", "Часник", "Шоколад", "Яблука", "Яловичина"];
	elid("prodDataList").innerHTML = "";
	if(!!inputValue) {
		const regex = new RegExp("(^| )".concat(inputValue), "i");
		for (const el of prodDataListContent) {
			if(el.match(regex)) {
				elid("prodDataList").innerHTML += ('<option value="' + el + '">' + '</option/>');
			}
		}
	}	
}

function getMissingValuesOnInput(){
    const price = elid("priceInput");
    const cost = elid("costInput");
    const quant = elid("quantityInput");
	if (cost.disabled) {
		cost.value = price.value == 0 ? '' : (!!quant.value ? 1 * (price.value * quant.value).toFixed(2) : 1*price.value);
	} else {
		quant.value = !cost.value ? '' : (price.value == 0 ? '' :  1 * (cost.value / price.value).toFixed(2));
	}
	setPlaceholdersAndApprox();
}

function setPlaceholdersAndApprox() {
	const price = elid("priceInput");
    const cost = elid("costInput");
    const quant = elid("quantityInput");
	elid('approx').value = (quant.disabled  && gattid('radioContainer1', 'data-unit') !== 'шт') ? 'прибл. ' : '';
	if(cost.disabled){
		price.placeholder = '';
		quant.placeholder = !cost.value ? '' : '1';
		elid('approx').value = '';
	} else {
		quant.placeholder = '';
		price.placeholder = "не обов'язково";
		elid('approx').value = (gattid('radioContainer1', 'data-unit') !== 'шт') ? 'прибл. ' : '';
	}
}

function isInputCorrect(){
	if(elid("costInput").value < 0.01 ||  elid("priceInput").value < 0) {
		 alert("Помилка: введені дані є хибними та/або недостатніми, щоб отримати вартість!");
		 return false;
	} else {
		return true;
	}
}

function copyListToClipboard(){
	if (products.length > 0) {
		let arr = new Array(products.length);
		for(let i = 0;  i < arr.length; i++){
			arr[i] = (i+1).toString() + ') ' + elOfList(i+1).textContent;
		}
		copyToClipboard(arr.join(';\n') + '.' + '\n' + elid('sumP').textContent.toUpperCase());
	} else {
		alert('Помилка: неможливо скопіювати у буфер обміну порожній список!');
	}
}

function changeDisplayOfCopyListButton(){
	if(elid("copyListButton").style.display !== "none") {
		elid("copyListButton").style.width = "0%";
		elid("copyListButton").style.transform = "none";
		setTimeout(function() {elid("copyListButton").style.display = "none"}, 1000);
	} else {
		elid("copyListButton").style.display = "block";
		setTimeout(function() {elid("copyListButton").style.width = "30%";
		elid("copyListButton").style.transform = "rotate(1turn)"}, 4);
	}
}
