function pageLogin(){

	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			pageListar();
		}
	});

	$(".divPage").hide();
	$("#txtTitulo").html("Login");
	$("#login").show();

}


function criarUsuario(){

	var email = $("#email_login").val();
	var senha = $("#senha_login").val();

	firebase

	.auth()
	.createUserWithEmailAndPassword(email, senha)
	.then(function(user){

		alert("Usuário Criado. Faça o Login");
		$("#formLogin").trigger("reset");
		console.log(user);

	})

	.catch(function(error){

		alert("Erro ao cadastrar. Tente outro E-Mail");
		console.log(error.message);
	});
}


function login(){

	var email = $("#email_login").val();
	var senha = $("#senha_login").val();

	firebase

	.auth()
	.signInWithEmailAndPassword(email, senha)
	.then(function(user){

		$("#formLogin").trigger("reset");
		console.log(user);

		pageListar();

	})

	.catch(function(error){

		alert("Erro ao fazer Login. Tente novamente!");
		console.log(error.message);
	});
}


function sair(){

	firebase
	.auth()
	.signOut();
	
	pageLogin();

}


function logarComGitHub(){

	var provedor = new firebase.auth.GithubAuthProvider();

	logarComProvedor(provedor);
}

function logarComGoogle(){

	var provedor = new firebase.auth.GoogleAuthProvider();

	logarComProvedor(provedor);
}


function logarComProvedor(provedor){

		firebase
			.auth()
			.signInWithPopup(provedor)
			.then(function(user){

			$("#formLogin").trigger("reset");
			console.log(user);

			pageListar();

		})

	.catch(function(error){

		alert("Erro ao fazer Login. Tente novamente!");
		console.log(error.message);

	});
}
	