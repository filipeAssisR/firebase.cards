function pageCadastrar(){

	$(".divPage").hide();
	$("#txtTitulo").html("Cadastrar Card");
	$("#cadastrar").show();

}


function pageListar(){

	$(".divPage").hide();
	$("#txtTitulo").html("Listar Cards");
	$("#listar").show();


	firebase.database().ref("cards").on("value", function(snapshot){

		var cards = "";
		
		snapshot.forEach(function(child){

				console.log(child);

			    cards +=
			    		'<div class="card" style="width: 20rem;" id="camada_card'+child.key+'">' +
  							'<img class="card-img-top" src="'+ child.val().foto +'" alt="">' +
  							'<div class="card-body">' +
    							'<p class="card-text">'+child.val().descricao+'</p>' +
    							'<a href="#" class="btn btn-danger" onclick="apagar(\''+child.key+'\')" id="excluir">Excluir</a>' +
								'<a href="#" class="btn btn-primary" id="curtir'+child.key+'" onclick="likeCard(\''+child.key+'\')" >Curtir ('+child.val().likes+')</a>' +
  							'</div>' +
						'</div>';	 
		});	

		$("#divCards").html(cards);

	});
}



function likeCard(key){

	firebase
		.database()
		.ref("cards/"+key)
		.once('value')
		.then(function(child){

			var data = {

					likes: parseInt(child.val().likes) + 1			
						
			};

			console.log(data);
			console.log(child);


			firebase
				.database()
				.ref("cards/"+key)
				.update(data) 
				.then(function(result){

					console.log(result);
				})
				.catch(function(error){

					alert("Error ao Editar!");
					console.log(error.message);
				}); 
		})			
}



function cadastrar(){
	
	$("button").attr("disabled", "true");

	var file = $("#foto")[0].files[0]; // busca o arquivo

	var task = firebase
			.storage()
			.ref("cards/"+file.name)
			.put(file); //envio do arquivo

		task.on('state_changed',  // escuta o envio
			
			function progress(snapshot){

				var parcial = snapshot.bytesTransferred;
				var total = snapshot.totalBytes;

				var porcentagem = (parcial / total) * 100;

				$("#upload_foto").val(porcentagem);
			},

			function error(error){

				alert("Erro ao fazer upload!");
				console.log(error.message);

			},

			function complete(){

				firebase
					.storage()
					.ref("cards/"+file.name)
					.getDownloadURL()
				.then(function(url){

					var data = {

						foto: url,
						descricao: $("#descricao").val(),
						likes: $("#likes").val(),
						nome_foto : file.name				
						
					};	

					firebase.database().ref("cards").push(data) //ref -> coleação que vai trabalhar
					.then(function(result){

						alert("Cadastrado com Sucesso!");
						console.log(result);
						$("button").removeAttr("disabled");
						$("#formCadastrar").trigger("reset");

						pageListar();
					})
					.catch(function(error){

						alert("Error ao Cadastrar!");
						console.log(error.message);
					}); 

				})

				.catch(function(){

					alert("Erro ao obter URL!");
					console.log(error.message);


				})			
			});	
}


function apagar(key){

	var retorno = confirm("Deseja Realmente Apagar?");


	if(retorno){

		firebase
		.database()
		.ref("cards/"+key)
		.once("value")
		.then(function(child){

		   name = child.val().nome_foto;

		   	firebase
			.storage()
			.ref("cards/"+name)
			.delete()

			.then(function(result){

				firebase
				.database()
				.ref("cards/"+key)
				.remove() 
				.then(function(result){


					alert("Deletado com Sucesso!");
					console.log(result);
			
				})
				.catch(function(error){

					alert("Error ao Deletar!");
					console.log(error.message);

				});
			})	

		})
	}	
}
