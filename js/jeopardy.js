function flip (event)
{
	let element = event.currentTarget;
	/* Toggle the setting of the classList attribute */
	/* this will flip the card the other direction */
	element.classList.toggle('flipped')
}

var		bad = 1, oldKey = "", attempts = {}, teams = {};

function completeCard(ele) 
{
	var	answerKey = ele.id.slice(0,-1);
	let team      = ele.id.slice(5,6);
	let card = JSON.parse(localStorage.getItem(answerKey));
	if (card === null) return;
	
	var	frontFace = document.getElementById("front" + answerKey);
	var	backFace  = document.getElementById("back"  + answerKey);

	if (oldKey !== answerKey) bad = 1;
	oldKey = answerKey
	switch (team * 1)
	{
		case	0:	bad *= -1;	document.getElementById(ele.id).src = (bad === -1) ? "images/minus.png" : "images/Team0.png"; return;
		case	1:	
		case	2:	
		case	3:	
		case	4:	teams["Team"+team] += (bad * card.amount);		break;
		case	5:	backFace.innerHTML = card.question; return;
	}
	
	if (bad === 1)
	{
		frontFace.innerHTML  =  "Team " + team;
		frontFace.classList.add("Color"  + team);
		localStorage.removeItem(answerKey);
		document.getElementById(ele.id).src = "images/Yay.png";
	}
	else
	{
		attempts[answerKey]++;
		if (attempts[answerKey] === 4)
		{
			localStorage.removeItem(answerKey);
			frontFace.innerHTML = "Oops!";
			frontFace.classList.add( "Team0" );
			frontFace.classList.remove( "value" + answerKey.slice(1,2) );
		}
		document.getElementById(ele.id).src = "images/wrong.png";
	}
	document.getElementById("Team" + team  ).innerHTML = "Team " + team + "<p>$" + teams["Team" + team];
	bad = 1;
	//document.getElementById(answerKey + "0").src = "images/Team0.png";
}

function buildTable(response) 
{
	localStorage.clear();
	let jeopardy = JSON.parse(response);
	let out;

	out =	"<table id=JeoparyBoard><th>Team #</th>";
	for(i = 0; i < jeopardy.categories.length; i++) 	
		out += "<th>" + jeopardy.categories[i].category + "</th>";

	for(row = 0; row < jeopardy.answerCount*1; row++) 
	{
		out += "<tr>";
		teams["Team" + (row+1)] = 0;
		out += "<td id='Team" + (row+1) + "' class= 'Team" + (row+1) + "'>Team " + (row+1) + "<p> $" + teams["Team" + (row+1)] + "</td>";
		for(cat = 0; cat < jeopardy.categories.length; cat++) 
		{
			if (row >= jeopardy.counter) 
				break;
			let category = jeopardy.categories[cat];
			out += "<td>";
			out += "<div class='flip-container' >";
			out += "<div id='card' class='card' onclick='flip(event)'>";
			out += 		"<div id='frontR" + row + "-C" + cat + "' class='front face value" + row + "' ></div>";
			out += 		"<div id='backR"  + row + "-C" + cat + "'  class='back face'><p>" + category.answers[row].answer + "<br>";
			for (let team = 0; team < jeopardy.teamCount; team++)
				out +=	 	"<img alt='' id='R"  + row + "-C" + cat + team + "' src='images/Team" + team + ".png' onclick='completeCard(this)'/>";
			out += 			"<img alt='' id='R"  + row + "-C" + cat + "5' src='images/Answer.png' onclick='completeCard(this)'/>";
			out += 			"</p></div>";
			out += "</div></div>";
			out += "</td>";
						
			if(typeof(Storage) !== "undefined") 
			{
				let key = "R" + row + "-C" + cat;
				attempts[key] = 0;
				localStorage.setItem(key , JSON.stringify(category.answers[row]));
			}

		}
		out += "</tr>";
	}
	out += "</table>";
	
	document.getElementById("gameBoard").innerHTML = out;
}

function getJSON()
{
	let xmlhttp = new XMLHttpRequest();
	let url = "js/jeopardy.json";
	
	xmlhttp.onreadystatechange=function()	
	{
		if (xmlhttp.readyState === 4)		//	 && xmlhttp.status == 200
			buildTable(xmlhttp.responseText);
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

getJSON();
