const elid = id => document.getElementById(id);
const satt = (el, attr, val) => el.setAttribute(attr, val);
const sattid = (id, attr, val) => satt(elid(id), attr, val);
const gattid = (id, attr) => elid(id).getAttribute(attr);

var products = JSON.parse(localStorage.getItem('prodExpArr') || "[]");
const sum = {
	set value(num) {
		const isInt = Number.isInteger(num);
		elid("sumSpan").innerHTML = isInt ? num : num.toFixed(2);
	},
	get value() { return +elid("sumSpan").innerHTML; },
}

function onBodyLoad() {
	if (products.length) {
		sum.value = products.reduce((tempSum, prod) => {
			addToText(prod, false);
			return tempSum + +prod.cost;
		}, 0);
		changeDisplayOfSumAndBottomButtons(false);
	}
	window.onstorage = () => window.location.reload();
}

function getArrayItemFromInput() {
	const unit = gattid("radioContainer1", "data-unit");
	const name = elid("nameInput").value.trim();
	const price = trimNumericInput(elid("priceInput").value, 'price');
	const approx = elid("approx").value;
	let quantity = trimNumericInput(elid("quantityInput").value, 'quantity');
	const cost = trimNumericInput(elid("costInput").value, 'cost');
	if (!quantity && price) { quantity = 1; }
	return { name, price, unit, approx, quantity, cost };
}

function deleteAll() {
	if (confirm('Ви справді бажаєте видалити весь збережений список?')) {
		changeStateOfMainDiv(false);
		localStorage.removeItem('prodExpArr');
		products = [];
		sum.value = 0;
		elid('prodList').classList.add("liAnimRemove");
		setTimeout(() => {
			elid('prodList').innerHTML = "";
			changeStateOfMainDiv(false);
			elid('prodList').classList.remove("liAnimRemove");
		}, 1000);
		changeDisplayOfSumAndBottomButtons();
	}
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

function addToArray() {
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
		satt(li, "class", "liAnimAdd");
	}
	elid("prodList").appendChild(li);
	li.ontouchstart = () => onTouchStart(li);
	li.onmousedown = () => onTouchStart(li);
	li.ontouchend = () => onTouchEnd(li);
	li.onmouseup = () => onTouchEnd(li);
}

function getLiInnerHtml({ name, price, unit, cost, quantity, approx }) {
	if (!name) { name = "Неназваний продукт"; }
	return `${name}${(() => {
		if (price == 0 || (quantity === '1' && unit === 'шт')) {
			return '';
		} else if (quantity == 0) {
			return ` (${price} грн/${unit})`;
		} else {
			return ` (${price} грн/${unit}, ${approx}${quantity} ${unit})`;
		}
	})()} – ${cost} грн`;
}

let timeOut;
function onTouchStart(li) {
	timeOut = setTimeout(() => showEditRemovePopUp(li), 500);
	li.style.backgroundColor='lightsteelblue';
}
function onTouchEnd(li){
	clearTimeout(timeOut);
	satt(li, "class", "liAnimTouchEnd");
	li.style.backgroundColor='';
	setTimeout(() => li.removeAttribute("class"), 300);
}

function showEditRemovePopUp(li){
	li.style.backgroundColor='';
	elid("addRemoveTextVariable").innerHTML = `«${li.textContent}»?`;
	elid("addRemoveNumVar").innerHTML = getElOfListNum(li);	
	clickCloseOrOpenEditRemovePopUp(false);
}

function clickConfirmButton(){
	if(elid("addRemoveNumVar").innerHTML. match(/add/)) {
		confirmAdd();
	} else {
		confirmEdit(+elid("addRemoveNumVar").innerHTML);
	}
	localStorage.setItem('prodExpArr', JSON.stringify(products));
}

function confirmEdit(numberOfItemInList) { 
	if(isInputCorrect()){
		const index = numberOfItemInList-1;
		sum.value -= products[index].cost - elid("costInput").value;
		editInArray(index);
		editListEntry(numberOfItemInList);
		clickCloseOrOpenAddPopup();
	}
}

function confirmAdd() {
	if (isInputCorrect()) {
		if (!products.length) {
			changeDisplayOfSumAndBottomButtons();
		}
		clickCloseOrOpenAddPopup();
		addToArray();
		addToText();
		sum.value += +products[products.length-1].cost;
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
	const numberOfItemInList = +elid('addRemoveNumVar').innerHTML;
	elid("h2").innerHTML = `Ред. прод. №${numberOfItemInList}`;
	const {name, price, unit, approx, quantity, cost} = products[numberOfItemInList - 1];
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
	const item = products[numberOfItemInList - 1];
    elOfList(numberOfItemInList).innerHTML =  getLiInnerHtml(item);
	li.removeAttribute("class");
	setTimeout(() => satt(li, "class", "liAnimEdit"), 4);
}

function clickRemoveButton(){
	const numberInList = +elid('addRemoveNumVar').innerHTML;
	const warning = "Ви впевнені, що бажаєте вилучити зі списку продукт " +
	elid("addRemoveTextVariable").innerHTML + "?"
	if(confirm(warning)) {
		const index = numberInList-1;
		sum.value -= +products[index].cost;
		removeFromArray(index);
		removeFromText(numberInList);
		if (!products.length) {
			changeDisplayOfSumAndBottomButtons();
		}
		clickCloseOrOpenEditRemovePopUp(true);
		localStorage.setItem('prodExpArr', JSON.stringify(products));
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
	elid('editRemovePopUp').classList.toggle('enabledPopUp');
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
	setTimeout(() => satt(li, "class", "liAnimRemove"), 4);
	setTimeout(() => elid("prodList").removeChild(li), 1000);
}

function clickCloseOrOpenAddPopup(){
    changeDisplayOfAddDiv();
	changeStateOfMainDiv(false);
}

function changeDisplayOfAddDiv() {
	elid('addDiv').classList.toggle('enabledPopUp');
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

function clickCostOrQuantity(value) {
	const setValues = ([ci, qi, cd, qd]) => {
		elid('costInput').disabled = ci;
		elid('quantityInput').disabled = qi;
		elid('costDiv').style.opacity = cd;
		elid('quantityDiv').style.opacity = qd;
	}
	setValues(value === 'byCost' ? [false, true, 1, 0.5] : [true, false, 0.5, 1]);
	getMissingValuesOnInput();
}

function eraseInput() {
	elid("nameInput").value = "";
	elid("priceInput").value = "";
	elid("costInput").value = "";
	elid("quantityInput").value = "";
}

function processKeypress({ keyCode, target }) {
	if (keyCode === 13) {
		clickConfirmButton();
	} else if (target !== elid('nameInput')) {
		getMissingValuesOnInput();
	} else if (keyCode) {
		appendProdDataList(target.value);
	} else { // if a datalist option is selected
		target.blur();
	}
}

const optionsRaw = () => ["Абрикоси", "Апельсини", "Банани", "Бараболя", "Борошно", "Буряки", "Вермішель", "Виноград", "Вишні", "Вода", "Гречка", "Грушки", "Диня", "Зелень", "Ізюм", "Кабачки", "Кавун", "Капуста", "Капуста цвітна", "Капуста броколі", "Капуста брюссельська", "Капуста пекінська", "Кефір", "Ківі", "Корінь селери", "Корінь петрушки", "Корольок", "Кріп", "Кріп і петрушка", "Курятина", "Мандарини", "Масло", "Молоко", "Морква", "Морозиво", "М'ясо", "Насіння соняшнику", "Огірки", "Олія", "Оцет", "Пакети", "Пакети для сміття", "Перець", "Персики", "Петрушка", "Печиво", "Пластівці", "Полуниці", "Помідори", "Приправи", "Пшоно", "Редиска", "Редька", "Риба", "Рукав для запікання", "Ряжанка", "Салат", "Свинина", "Сир", "Сир-творог", "Сир плавлений", "Сік", "Сіль", "Сирки плавлені", "Сливки", "Сметана", "Сода", "Туалетний папір", "Фініки", "Халва", "Хліб", "Хурма", "Цибуля", "Цукерки", "Цукор", "Черешні", "Часник", "Шоколад", "Яблука", "Яйця", "Яловичина"];
const options = optionsRaw().map(str => [str.toLowerCase(), `<option value="${str}"></option>`]);

function appendProdDataList(inputValue) {
	elid('prodDataList').innerHTML = inputValue ? (() => {
		let result = '';
		inputValue = inputValue.toLowerCase();
		for (const [optionValue, html] of options) {
			if (!optionValue.indexOf(inputValue)) {
				result += html;
			} else if (result) {
				break;
			}
		}
		return result;
	})() : '';
}

function getMissingValuesOnInput() {
	const price = elid("priceInput");
	const cost = elid("costInput");
	const quant = elid("quantityInput");
	const [pv, cv, qv] = [price.value, cost.value, quant.value];
	if (cost.disabled) {
		cost.value = !pv ? '' : (qv ? +(pv * qv).toFixed(2) : +pv);
	} else {
		quant.value = !cv ? '' : (pv == 0 ? '' :  +(cv / pv).toFixed(2));
	}
	setPlaceholdersAndApprox();
}
const calcOnPaste = () => setTimeout(getMissingValuesOnInput, 20);

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

function copyListToClipboard() {
	if (products.length) {
		const reduce = fn => [].reduce.call(elid('prodList').children, fn, '');
		copyToClipboard(reduce((acc, { textContent: t }, i, { length }) => {
			return acc += `${i + 1}) ${t}${i < length - 1 ? ';' : '.'}${'\n'}`;
		}) + elid('sumP').textContent.toUpperCase());
	} else {
		alert('Помилка: неможливо скопіювати у буфер обміну порожній список!');
	}
}

function changeDisplayOfSumAndBottomButtons(animateOnUnhide = true) {
	const setStyleProp = (prop, val, val2 = null) => {
		elid('copyListButton').style[prop] = val;
		elid('removeListButton').style[prop] = val2 ? val2 : val;
	}
	if (elid('copyListButton').style.display !== 'none') {
		elid("sumP").style.display = "none";
		setStyleProp('width', '0%')
		setStyleProp('transform', 'none');
		setTimeout(() => setStyleProp('display', 'none'), 1000);
	} else {
		elid("sumP").style.display = "block";
		setStyleProp('display', 'block');
		const doNext = () => {
			setStyleProp('width', '30%', '29%');
			setStyleProp('transform', 'rotate(1turn)');
		}
		animateOnUnhide ? setTimeout(doNext, 4) : doNext();
	}
}
