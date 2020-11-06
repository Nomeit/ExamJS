const ul1 = document.querySelector(".ul1");
const ul2 = document.querySelector(".ul2"); 
const ul3 = document.querySelector(".ul3");
const inputTime = document.querySelector(".time");
const inputSubmit = document.querySelector(".submit");
const inputReset = document.querySelector(".reset");
let rList = ``;
const ourRouts = store.routs;
const ourStations = store.stations;
const objKeys = Object.keys(ourRouts);

let routNow = {}

for (let i = 0; i < objKeys.length; i++){
	rList += `<li id="elem${i+1}">
		<a href="#" data-id="${objKeys[i]}">${objKeys[i]} : ${ourRouts[objKeys[i]].name}</a>
	</li>`;
}

ul1.innerHTML = rList;

let elem = {};

for (let i = 0; i < objKeys.length; i++){
	elem[objKeys[i]] = document.querySelector(`#elem${i+1}`);
}

let elemTime = {};

function findTime(event, time){
	const newTime = time.split(":");
	const id = event.target.dataset.id;
	let times = {}
	for(let i = 0; i < ourRouts[id].startTime.length; i++)
	{
		times[i] = ourRouts[id].startTime[i].split(":");
	}
	for(let i = 0; i < ourRouts[id].startTime.length; i++)
	{
		if (newTime[0] == times[i][0] && newTime[1] == times[i][1])
			return time;
		else
		{
			let h1 = parseInt(newTime[0]);
			let m1 = parseInt(newTime[1]);
			let h2 = parseInt(times[i][0]);
			let m2 = parseInt(times[i][1]);
			if (h1 == h2)
				if (m2 > m1)
					return `${h2}:${m2}`;
			if (h1 < h2)
				return `${h2}:${m2}`;
		}
	}
}

function timeClick(event, text){
	routClick(event, findTime(event, text));
}

function routClick(event, time = ""){
	routNow = event;
	const arr = time.split(':')
	let date = new Date();
	const cls = document.querySelector(".routs")
	
	if (cls)
		cls.classList.remove("routs");

	const id = event.target.dataset.id;
	elem[id].classList.add("routs");
	let stations = ``;
	
	if (arr)
	{
		date.setHours(arr[0]);
		date.setMinutes(arr[1]);
	}
	
	for (let i = 0; i < ourRouts[id].waybill.length; i++)
	{
		let minutes = date.getMinutes() + ourRouts[id].waybill[i][1];
		let hours = date.getHours();
		if (minutes >= 60){
			minutes -= 60;
			hours++;
		}
		if (minutes < 10)
			minutes = "0" + `${minutes}`;
		let text = ( isNaN(date.getHours()) ? `${ourRouts[id].waybill[i][1]}'` : `${hours} : ${minutes}`)
		stations += `<li>
		<a href="#">${ourStations[ourRouts[id].waybill[i][0]].name} :  ${text}</a>
		</li>`;
	}
	
	ul2.innerHTML = stations;
	
	let endTime = ``;
	
	for (let i = 0; i < ourRouts[id].startTime.length; i++)
	{
		endTime += `<li id="elemTime${i+1}">
		<a href="#" data-timeId="${i}">${ourRouts[id].startTime[i]}</a>
		</li>`;
	}

	ul3.innerHTML = endTime;

	for (let i = 0; i < ourRouts[id].startTime.length; i++){
		elemTime[objKeys[i]] = document.querySelector(`#elemTime${i+1}`);
		elemTime[objKeys[i]].addEventListener("click",function(event){timeClick(routNow, event.path[0].innerText);});
	}
	inputReset.addEventListener("click", function(event){inputTime.value = "06:00"})
	inputSubmit.addEventListener("click", function(event){timeClick(routNow, inputTime.value);})
}



for(let i = 0; i < objKeys.length; i++){
	elem[objKeys[i]].addEventListener("click", routClick);
}


