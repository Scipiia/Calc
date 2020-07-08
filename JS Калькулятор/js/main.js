	//generateId генератор случайных id для массива с объектами
const generateId = () => `Hello${Math.round(Math.random() * 1e8).toString(16)}`

const 
totalBalance = document.querySelector(".total__balance"),
totalMoneyIncome = document.querySelector(".total__money-income"),
totalMoneyExpenses = document.querySelector(".total__money-expenses"),
historyList = document.querySelector(".history__list"),
form = document.querySelector("#form"),
operationName = document.querySelector(".operation__name"),
operationAmount = document.querySelector(".operation__amount");

	//очистили массив, что бы создать локальную историю
let dbOperation = [];

	//чистит localStorage(фигня в браузере)
//localStorage.clear();

	//перед её созданием очистили массив
	//это объект в браузере
if(localStorage.getItem("calc")) {
	dbOperation = JSON.parse(localStorage.getItem("calc"));
}

	//стрелочная функция
const renderOperation = (operation) => {

	//console.log(operation) //передает объект массива
	//тернарный оператор условие в скобках(operation.amount) ? "да" : "нет"
	const className = operation.amount < 0 ? 
			"history__item-minus" :
			"history__item-plus";

	const listItem = document.createElement("li");
	listItem.classList.add(className);

	listItem.classList.add("history__item");

	//интерполяция внутри строки используем какой то js код

	listItem.innerHTML = `${operation.description}  
			<span class="history__money">${operation.amount}  ₽</span>
      <button class="history_delete" data-id ="${operation.id}">x</button>
	`;

	historyList.append(listItem);
};

	//обновление баланса
	//c помощью метода фильтр будем проверять 
	//reduce метод суммирует значения массива
const updateBalance = () => {
	const resultIncome = dbOperation
			.filter((item) => item.amount > 0)
			.reduce((result, item) => result + item.amount, 0);

	//console.log(resultIncome);

	//стрелочная функция сама возвращает(без return) выражение справа 
	const resultExpenses = dbOperation
			.filter((item) => item.amount < 0)
			.reduce((result, item) => result + item.amount, 0);

	//console.log(resultExpenses);

	totalMoneyIncome.textContent = resultIncome;
	totalMoneyExpenses.textContent = resultExpenses;
	totalBalance.textContent = (resultIncome + resultExpenses) + "P";
};

	//addOperation вызов снизу
const addOperation = (event) => {
	event.preventDefault();		//запрещает переходить на ссылку, перезагружать страницу

	const operationNameValue = operationName.value,
				operationAmountValue = operationAmount.value;

	//что бы изначально стили были как по верстке
	operationName.style.borderColor = "";
	operationAmount.style.borderColor = "";

	if (operationNameValue !== "" && operationAmountValue !== ""){
		//console.log(operationNameValue);
		//console.log(operationAmountValue);
		
		const operation = {
			id: generateId(), //функция вверху будет
			description: operationNameValue,
			amount: +operationAmountValue,
		};

		dbOperation.push(operation);
		init()
		console.log(dbOperation);
		
		
	} else {
			if(!operationNameValue) operationName.style.borderColor = "red";	//добавили красную рамку, если поля не заполнены и нажимается добавить
			if (!operationAmountValue) operationAmount.style.borderColor = "red";
		}
	//очищает, после того как вбили данные и добавили
	operationName.value = "";
	operationAmount.value = "";
};

	//функция удаления объектов с помощью делегирования(что бы определял что удалять)
const deleteOperation = (event) => {
	const target = event.target;  //просто что бы сократить

	if(target.classList.contains("history_delete")) {
			//console.log(event.target.dataset.id); //показывает id элемента
			dbOperation = dbOperation
					.filter(operation => operation.id !== target.dataset.id);

			init();
	}
};

	//функция которая чистит историю расходов
const init = () => {
	historyList.textContent = ""; 
	
	//метод forEach
	//dbOperation.forEach((renderOperation) => {
		//console.log(item)
		//renderOperation(item); //это можно написать в скобочки в качестве аргумента
	//});

	//поэтому можно вот так написать forEach колл бэк функцию
	dbOperation.forEach(renderOperation)
	updateBalance();

	//положим объект или массив
	localStorage.setItem("calc", JSON.stringify(dbOperation));

	//обычный цикл
	//for(let i = 0; i < dbOperation.length; i++){
	//	renderOperation(dbOperation[i]);
	//}
};

form.addEventListener("submit", addOperation);

historyList.addEventListener("click", deleteOperation);

init();