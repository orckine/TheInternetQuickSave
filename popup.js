function showSaveFile(saveFileName){
	chrome.storage.sync.get(saveFileName).then((result) =>{
		var keys = Object.keys(result);

		var newDiv = document.createElement('div');
		newDiv.setAttribute("class", "savefile");
		newDiv.setAttribute("id",saveFileName);
		
		var newName = document.createElement('button');
		newName.setAttribute("class","buttonFile");
		newName.addEventListener("click", function(){
			chrome.tabs.query({active: true}, function(tabs) {
			    var tab = tabs[0];
			    chrome.tabs.update(tab.id, {url: result[saveFileName]});
			});
		})
		newName.innerHTML = saveFileName;

		var innerDiv = document.createElement('div');
		innerDiv.setAttribute("class", "innerDiv");

		var updateButton = document.createElement('button');
		updateButton.innerHTML = "Atualizar";
		updateButton.addEventListener("click", function(){
			chrome.tabs.query({active: true}, tabs => {
		    	var url = tabs[0].url;
				chrome.storage.sync.set({[saveFileName]:url}).then(() => {
					console.log("Link is set to " + url);
				}).then(reset());
			});
		});

		var deleteButton = document.createElement('button');
		deleteButton.innerHTML = "Finalizar";
		deleteButton.addEventListener("click", function(){
			chrome.storage.sync.remove(saveFileName).then(reset());
		});	

		newDiv.appendChild(newName);
		innerDiv.appendChild(deleteButton);
		innerDiv.appendChild(updateButton);
		newDiv.appendChild(innerDiv);
		document.getElementById('roll').appendChild(newDiv);
	});
}

function addNovo(){
	chrome.tabs.query({active: true}, tabs => {
		var text = document.getElementById('nome').value;
		if(text=="") return;
	    var url = tabs[0].url;
	    chrome.storage.sync.set({[text]:url}).then(() => {
		  console.log("Link is set to " + url);
		}).then(reset());
	});
}

document.getElementById('addNew').addEventListener("click", addNovo);

function reset(){
	chrome.storage.sync.get(null, function(items){
		var alk = Object.keys(items);
		document.getElementById('roll').innerHTML = "";
		if(alk.length == 0){
			var newDiv = document.createElement('div');
			newDiv.setAttribute("id","noSave");

			var newH2 = document.createElement('h2');
			newH2.innerHTML = "Você ainda não salvou nada, como o miranha não salvou a Gwen!";

			newDiv.appendChild(newH2);
			document.getElementById('roll').appendChild(newDiv);
		} else {
			for (key in alk){
				showSaveFile(alk[key]);
			}
		}
	});
}

document.body.onload = function(){
	chrome.tabs.query({active: true}, tabs => {
		document.getElementById('nome').value = tabs[0].title.slice(0, 32);
	});
	reset();
};

