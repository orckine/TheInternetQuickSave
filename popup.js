function showSaveFile(saveFileName){	//mostra o save selecionado.
	chrome.storage.sync.get(saveFileName).then((result) =>{	//Recebe o conteudo para a chave nos parametros.
		var keys = Object.keys(result);	//salva o par.

		var newDiv = document.createElement('div'); //cria uma div.
		newDiv.setAttribute("class", "savefile"); //classe da div
		newDiv.setAttribute("id",saveFileName); //id da div é a própria chave.
		
		var newName = document.createElement('button'); //cada save é um botao.
		newName.setAttribute("class","buttonFile");	//esse botao serve para abrir o link na aba atual
		newName.addEventListener("click", function(){ //ao clicar
			chrome.tabs.query({active: true}, function(tabs) { //pega tab ativa
			    var tab = tabs[0]; //salva
			    chrome.tabs.update(tab.id, {url: result[saveFileName]}); //atualiza com o link do save atual, (não ta mt bonito, mas funciona)
			});
		})
		newName.innerHTML = saveFileName; //o nome do botao vai ser o 'nome' salvo.

		var innerDiv = document.createElement('div');	//nova div
		innerDiv.setAttribute("class", "innerDiv");

		var updateButton = document.createElement('button'); //cria um botao para atualizar o link atual.
		updateButton.innerHTML = "Atualizar";	//nome do botao
		updateButton.addEventListener("click", function(){ //ao clicar
			chrome.tabs.query({active: true}, tabs => { //recupera a tab atual
		    	var url = tabs[0].url; //pega o link da tab atual
				chrome.storage.sync.set({[saveFileName]:url}).then(() => { //realiza um save com o novo link, mesmo save.
					console.log("Link is set to " + url); //mostra no console
				}).then(reset()); //reseta para que o novo link já esteja ativo no nome do save.
			});
		});

		var deleteButton = document.createElement('button'); //botao de remover save.
		deleteButton.innerHTML = "Finalizar";
		deleteButton.addEventListener("click", function(){
			chrome.storage.sync.remove(saveFileName).then(reset()); //remove o save atual.
		});	

		newDiv.appendChild(newName); //adiciona o nome na div para mostrar
		innerDiv.appendChild(deleteButton); //adiciona o delete na div secundária
		innerDiv.appendChild(updateButton); //adiciona o update na div secundária
		newDiv.appendChild(innerDiv); //adiciona a div secundária na div do save
		document.getElementById('roll').appendChild(newDiv); //adiciona a div do save no roll
	});
}

function addNovo(){
	chrome.tabs.query({active: true}, tabs => {	//recupera a aba atual.
		var text = document.getElementById('nome').value; //pega o nome salvo no campo 'nome' da extensao
		if(text=="") return; //se estiver vazio, nao salva nada.
	    var url = tabs[0].url; //pega a url da aba aberta
	    chrome.storage.sync.set({[text]:url}).then(() => { //tenta salvar o arquivo como [nome]:[url] pares de chaves simples.
		  console.log("Link is set to " + url); //mostra no console para teste.
		}).then(reset()); //reseta a extensao para mostrar o novo save adicionado.
	});
}

document.getElementById('addNew').addEventListener("click", addNovo);	//adiciona a função addNovo no botao 'Salvar'.

function reset(){
	chrome.storage.sync.get(null, function(items){	//pega os dados sincronizados da extensão pro usuario.
		var alk = Object.keys(items);				//todas as keys salvas.
		document.getElementById('roll').innerHTML = ""; //limpa os dados que estao no popup
		if(alk.length == 0){	//se nao houver nada nas keys da extensao
			var newDiv = document.createElement('div'); //cria uma div
			newDiv.setAttribute("id","noSave"); //id de nao salvo

			var newH2 = document.createElement('h2');	//da um soft roast no usuário pq é engraçado.
			newH2.innerHTML = "Você ainda não salvou nada, como o miranha não salvou a Gwen!";

			newDiv.appendChild(newH2);	//salva o roast na div, salva a div no roll.
			document.getElementById('roll').appendChild(newDiv);
		} else {
			for (key in alk){ //para cada key encontrada, da um mostra aquele link e os botoes..
				showSaveFile(alk[key]);
			}
		}
	});
}

document.body.onload = function(){	//funcão chamada ao carregar a extensao
	chrome.tabs.query({active: true}, tabs => { //verifica a aba em que a extensao ta aberta
		document.getElementById('nome').value = tabs[0].title.slice(0, 32); //pega os 32 primeiros caracteres do nome da aba, e coloca no campo 'nome' da extensao.
	});
	reset();	//reset para mostrar o conteudo dos saves.
};

