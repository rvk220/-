const elid = id => document.getElementById(id);
const satt = (el, attr, val) => el.setAttribute(attr, val);
const sattid = (id, attr, val) => satt(elid(id), attr, val);
const gattid = (id, attr) => elid(id).getAttribute(attr);

function Prod (name, price, unit, approx, quantity, cost){
	this.name = name.trim();
	this.price = price ? price : "";
	this.cost = cost;
	this.unit = unit.trim();
	this.quantity = (!quantity && price) ? "1" : quantity;
	this.approx = approx;
}
var products = [];
var sum = 0;

function onBodyLoad() {
	const raw = localStorage.getItem('data');
	if (raw) {
		const data = JSON.parse(raw);
		products = data.products;
		sum = data.sum;
		products.forEach(prod => addToText(prod, false));
		elid("sumSpan").innerHTML = sum;
		elid("sumP").style.display = "block";
		elid("copyListButton").style.display = "block";
		elid("removeListButton").style.display = "block";
		elid("copyListButton").style.width = "30%";
		elid("removeListButton").style.width = "29%";
	}
	window.onstorage = () => window.location.reload();
}

function updateLocalStorage() {
	if(products.length) {
		localStorage.setItem('data', JSON.stringify({ products, sum }));
	} else {
		localStorage.removeItem('data');
	}
}

function deleteAll() {
	if (confirm('Ви справді бажаєте видалити весь збережений список?')) {
		changeStateOfMainDiv(false);
		localStorage.removeItem('data');
		products = [];
		sum = 0;
		elid('prodList').classList.add("liAnimRemove");
		setTimeout(() => {
			elid('prodList').innerHTML = "";
			changeStateOfMainDiv(false);
			elid('prodList').classList.remove("liAnimRemove");
		}, 1000);
		elid("sumP").style.display = "none";
		changeDisplayOfCopyAndDeleteListButton();
	}
}

function formatNum(num){
	const strNum = num.toFixed(2);
	return !strNum.match(/\.00/) ? strNum : num.toString(10);
}

function elOfList(num) {
	return document.querySelector(`#prodList > li:nth-child(${num})`);
}

function getElOfListNum(clickedLi) {
	for (let i = products.length; i > 0; i--){
		if(clickedLi === elOfList(i)) {
			return i;
		}
	}
	console.error('could not get elOfList number!');
}

const getArrayItemFromInput = () => {
    const unit = gattid("radioContainer1", "data-unit");
    const name = elid("nameInput").value;
    const price = trimNumericInput(elid("priceInput").value, 'price');
    const approx = elid("approx").value;
    const quantity = trimNumericInput(elid("quantityInput").value, 'quantity');
    const cost = trimNumericInput(elid("costInput").value, 'cost');
	return new Prod(name, price, unit, approx, quantity, cost);
}

function addToArray(){
	products.push(getArrayItemFromInput());
}

function editInArray(index) {
	products[index] = getArrayItemFromInput();
}

function addToText(item = null, animateOnAdd = true) {
	let li = document.createElement("li");
	if(!item) { item = products[products.length-1]; }
	li.innerHTML = getLiInnerHtml(item);
	if(animateOnAdd) {
		li.setAttribute("class", "liAnimAdd");
	}
	elid("prodList").appendChild(li);
	li.ontouchstart = () => mouseDown(li);
	li.onmousedown = () => mouseDown(li);
	li.ontouchend = () => mouseUp(li);
	li.onmouseup = () => mouseUp(li);
}

function getLiInnerHtml({ name, price, unit, cost, quantity, approx }) {
	name = name ? name : "Неназваний продукт";
	return `${name}${(() => {
		if (price === '0' || (quantity === '1' && unit === 'шт')) {
			return '';
		} else if (quantity === '0') {
			return ` (${price} грн/${unit})`;
		} else {
			return ` (${price} грн/${unit}, ${approx}${quantity} ${unit})`;
		}
	})()} – ${cost} грн`;
}

let timeOut;
function mouseDown(li) {
	timeOut = setTimeout(() => showEditRemovePopUp(getElOfListNum(li)), 500);
	li.style.backgroundColor='lightsteelblue';
}
function mouseUp(li){
	clearTimeout(timeOut);
	satt(li, "class", "liAnimTouchEnd");
	li.style.backgroundColor='';
	setTimeout(() => li.removeAttribute("class"), 300);
}

function showEditRemovePopUp(numberInList){
	elOfList(numberInList).style.backgroundColor='';
	let temp = `«${elOfList(numberInList).textContent}»?`;
	elid("addRemoveTextVariable").innerHTML = temp;
	elid("addRemoveNumVar").innerHTML = numberInList; 	
	clickCloseOrOpenEditRemovePopUp(false);
}

function clickConfirmButton(){
	if(elid("addRemoveNumVar").innerHTML. match(/add/)) {
		confirmAdd();
	} else {
		confirmEdit(elid("addRemoveNumVar").innerHTML);
	}
	updateLocalStorage();
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
		if(!sum) {
			elid("sumP").style.display = "block";
			changeDisplayOfCopyAndDeleteListButton();
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

function clickEditButton() {
	const numberOfItemInList = elid('addRemoveNumVar').innerHTML;
	elid("h2").innerHTML="Ред. прод. №" + numberOfItemInList;
	const {name, price, unit, approx, quantity, cost} = products[1*numberOfItemInList-1];
	clickCloseOrOpenAddPopup();
	clickCloseOrOpenEditRemovePopUp(false);
	elid((unit.match(/шт/) || approx) ?  'byCost' : 'byQuantity').click();
	clickSetUnit(unit);
	if (unit.match(/кг/)){
		elid("kg").checked = "true";
	} else if (unit.match(/шт/)){
		elid("pcs").checked = "true";
	} else {
		elid("otherUnit").checked = "true";
	}
	elid("quantityInput").value = quantity; 
	elid("nameInput").value = name;
    elid("priceInput").value = price;
    elid("costInput").value = cost;
	setPlaceholdersAndApprox();
}

function editListEntry(numberOfItemInList){
	const li = elOfList(numberOfItemInList);
	const item = products[numberOfItemInList*1 - 1];
    elOfList(numberOfItemInList).innerHTML =  getLiInnerHtml(item);
	li.removeAttribute("class");
	setTimeout(() => li.setAttribute("class", "liAnimEdit"), 4);
}

function clickRemoveButton(){
	const numberInList = elid('addRemoveNumVar').innerHTML;
	const warning = "Ви впевнені, що бажаєте вилучити зі списку продукт " +
	elid("addRemoveTextVariable").innerHTML + "?"
	if(confirm(warning)){
		const index = (1*numberInList)-1;
		elid("sumSpan").innerHTML = formatNum(sum -= 1*products[index].cost);
		removeFromArray(index);
		removeFromText(numberInList);
		if (!sum) {
			elid("sumP").style.display = "none";
			changeDisplayOfCopyAndDeleteListButton();
		}
		clickCloseOrOpenEditRemovePopUp(true);
		updateLocalStorage();
	} else {
		clickCloseOrOpenEditRemovePopUp(false);
	}
}

function clickCopyItemButton(){
	copyToClipboard(elOfList(elid('addRemoveNumVar').innerHTML).textContent);
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

function copyToClipboard(str) {
	var copyText = document.createElement("textarea");
	copyText.value = str;
	document.body.appendChild(copyText);
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(copyText);
	alert("Скопійовано до буферу обміну: " + '\n"' + copyText.value + '".');
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
	setTimeout(() => li.setAttribute("class", "liAnimRemove"), 4);
	setTimeout(() => elid("prodList").removeChild(li), 1000);
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
			setTimeout(() => elid("mainDiv").removeAttribute("class"), 1000);
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

function processKeypress(keyCode, nameInput) {
	if (keyCode !== 13) {
		if (nameInput === undefined) {
			getMissingValuesOnInput();
		} else {
			if (keyCode === undefined) {
				elid("nameInput").blur();
			} else {
				appendProdDataList(nameInput);
			}
		}
	} else {
		clickConfirmButton();
	}
}

function appendProdDataList(inputValue) {
	const prodDataListContent = ["Абрикоси", "Апельсини", "Банани", "Бараболя", "Борошно", "Буряки", "Вермішель", "Виноград", "Вишні", "Вода", "Гречка", "Грушки", "Диня", "Зелень", "Ізюм", "Кабачки", "Кавун", "Капуста", "Капуста цвітна", "Капуста броколі", "Кефір", "Капуста брюссельська", "Корінь селери", "Корінь петрушки", "Корольок", "Кріп", "Кріп і петрушка", "Курятина", "Мандарини", "Масло", "Молоко", "Морква", "Морозиво", "М'ясо", "Насіння соняшнику", "Огірки", "Олія", "Оцет", "Пакети", "Пакети для сміття", "Перець", "Персики", "Петрушка", "Печиво", "Пластівці", "Полуниці", "Помідори", "Приправи", "Пшоно", "Редиска", "Редька", "Риба", "Рукав для запікання", "Ряжанка", "Салат", "Свинина", "Сир", "Сир-творог", "Сир плавлений", "Сік", "Сіль", "Сирки плавлені", "Сливки", "Сметана", "Сода", "Туалетний папір", "Фініки", "Халва", "Хліб", "Хурма", "Цибуля", "Цукерки", "Цукор", "Черешні", "Часник", "Шоколад", "Яблука", "Яйця", "Яловичина"];
	if (inputValue) {
		try {
			const regex = new RegExp(`^${inputValue}`, "i");
			const temp = [];
			for (const el of prodDataListContent) {
				if (el.match(regex)) {
					temp.push(`<option value="${el}"></option>`);
				} else if (temp.length) {
					break;
				}
			}
			elid("prodDataList").innerHTML = temp.join('\n');
		} catch(e) {
			elid("prodDataList").innerHTML = "";
			console.warn(e.message);
		}
	} else {
		elid("prodDataList").innerHTML = "";
	}	
}

function getMissingValuesOnInput(){
    const price = elid("priceInput");
    const cost = elid("costInput");
    const quant = elid("quantityInput");
	if (cost.disabled) {
		cost.value = !price.value ? '' : (quant.value ? 1 * (price.value * quant.value).toFixed(2) : 1*price.value);
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

function isInputCorrect() {
	return (elid('costInput').value < 0.01 ||  elid('priceInput').value < 0) ? (() => {
		alert("Помилка: введені дані є хибними та/або недостатніми, щоб отримати вартість!");
		return false;
	})() : true;
}

function copyListToClipboard(){
	if (products.length > 0) {
		let index = 0;
		const arr = [...elid('prodList').children].map(li => `${++index}) ${li.textContent}`);
		copyToClipboard(arr.join(';\n') + '.' + '\n' + elid('sumP').textContent.toUpperCase());
	} else {
		alert('Помилка: неможливо скопіювати у буфер обміну порожній список!');
	}
}

function changeDisplayOfCopyAndDeleteListButton(){
	if(elid("copyListButton").style.display !== "none") {
		elid("copyListButton").style.width = "0%";
		elid("removeListButton").style.width = "0%";
		elid("copyListButton").style.transform = "none";
		elid("removeListButton").style.transform = "none";
		setTimeout(() => {
			elid("copyListButton").style.display = "none";
			elid("removeListButton").style.display = "none";
		}, 1000);
	} else {
		elid("copyListButton").style.display = "block";
		elid("removeListButton").style.display = "block";
		setTimeout(() => {
			elid("copyListButton").style.width = "30%";
			elid("removeListButton").style.width = "29%";
			elid("copyListButton").style.transform = "rotate(1turn)";
			elid("removeListButton").style.transform = "rotate(1turn)";
		}, 4);
	}
}
