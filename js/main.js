$(document).ready(function() {
	/*
		======================================
		START : Fonctions
		======================================
	*/

	// Cette fonction permet de générer un nombre aléatoire compris entre min (inclus) et max (inclus)
	function randomNumber(min, max) {
		/*
			Si on veut générer un nombre aléatoire compris entre 0 et x, on doit bidouiller un peu :
			Je vais ajouter +1 à min et max et, après avoir généré mon nombre aléatoire, je vais enlever -1 au résultat.
			Pourquoi s'embêter à faire ça ? Car notre fonction de génération aléatoire ne fonctionne pas avec un minimum fixé à 0. C'est malheureux mais c'est comme ça !
		*/
		if (min === 0) {
			min++;
			max++;

			minIsZero = true;
		} else {
			minIsZero = false;
		}

		random = min + Math.floor(Math.random() * max); // Ici, on génère notre nombre aléatoire

		if (minIsZero === true) {
			random--;
		}

		return random;
	}

	function generateHand(idPlayer) {
		// idPlayer correspond à 0 (joueur 1) ou 1 (joueur 2). On va s'en servir pour sélectionner la section correspondante au joueur via son index, grâce à eq(idPlayer).

		var hand = []; // On initialise l'array où on stocke les cartes qui composent la main d'un joueur

		for (var i = 0 ; i < 4 ; i++) { // Comme on sait qu'une main dipose de 4 cartes, on fait une boucle qui aura 4 itérations
			// A chaque itération, on ajoute à la main une carte choisie aléatoirement. On détermine son type (positif ou négatif) puis sa valeur

			var cardType  = cardTypes[randomNumber(0,1)];
			var cardValue = randomNumber(1,10);

			/*
				Là, on créé la carte : c'est une image dans un div.
				Le div n'est qu'un conteneur pour aider dans la mise en page ; la carte est en fait l'image, dont les attributs data-* stockent les informations

				data-type     : le type de la carte (+ ou -)
				data-value    : la valeur de la carte (de 1 à 10)
				data-position : la position de la carte dans la main (pour savoir quelle carte choisit l'ordinateur)
			*/

			hand.push('<div><img src="img/cards/' + cardType + '_card.png" data-type="' + cardType + '" data-value="' + cardValue + '" data-position="' + i + '" /><span>' + cardType + ' ' + cardValue + '</span></div>'); 
		}

		$('section#hands').children().eq(idPlayer).append(hand); // Et on va afficher ces cartes dans la section "Main" du joueur concerné
	}

	function generateBoard(idPlayer) {
		// A nouveau, idPlayer correspond à 0 (joueur 1) ou 1 (joueur 2).

		for (var i = 0 ; i < 9 ; i++) { // Comme on sait qu'un board dispose de 9 emplacements, on fait une boucle qui aura 9 itérations
			/*
				Contrairement à la fonction generateHand, nous n'avons pas besoin de nous compliquer la vie avec un array où on stocke nos différents éléments :
				On va directement append() un div vide, qu'on remplacera plus tard par les cartes jouées (qui passeront donc de la main au plateau) ou piochées.
			*/

			$('section#boards').children().eq(idPlayer).append('<div class="emptySlot">');
		}
	}

	function draw(playerData) {
		// Vous connaissez la chanson : idPlayer correspond à 0 (joueur 1) ou 1 (joueur 2).

		// Comme piocher revient à démarrer son tour, on joue le son qui va bien
		var audio = new Audio('sounds/sfx/startTurn.wav');
		audio.volume = 0.1;
		audio.play();
		
		var cardValue = randomNumber(1,10); // On génère une carte aléatoire
		var card      = '<div class="neutralCard"><img src="img/cards/neutral_card.png" data-value="' + cardValue + '" /><span>' + cardValue + '</span></div>';

		// Maintenant, on va remplacer l'un des div vides du plateau par notre carte. On se sert du _lastUsedSlot pour connaître l'index du div à remplacer.
		$('section#boards').children().eq(playerData['idPlayer']).children().eq(playerData['lastUsedSlot']).replaceWith(card);	

		playerData['score'] += cardValue; // On met à jour le score du joueur en lui additionnant la valeur de la carte piochée
		playerData['lastUsedSlot']++; // Et on met à jour le dernier slot utilisé

		$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score']); // Enfin, on met à jour le contenu de la div qui contient le score
	}

	// Cette fonction permet de calculer tous les mouvements possibles à partir de la main d'un joueur	
	function calculCombinaisons(array) {
		newArray = [];

		// Pour chaque carte dans la main...
		for (var i = 0 ; i < array.length ; i++) {
			newArray.push(array[i]['type'] + array[i]['value'] + '_position_' + array[i]['position']);

			// ... On va faire des opérations avec toutes les autres
			for (var j = (i + 1) ; j < array.length ; j++) {
				newArray.push(array[i]['type'] + array[i]['value'] + array[j]['type'] + array[j]['value'] + '_position_' + array[i]['position'] + '/' + array[j]['position']);

				for (var k = (j + 1) ; k < array.length ; k++) {
					newArray.push(array[i]['type'] + array[i]['value'] + array[j]['type'] + array[j]['value'] + array[k]['type'] + array[k]['value'] + '_position_' + array[i]['position'] + '/' + array[j]['position'] + '/' + array[k]['position']);

					for (var l = (k + 1) ; l < array.length ; l++) {
						newArray.push(array[i]['type'] + array[i]['value'] + array[j]['type'] + array[j]['value'] + array[k]['type'] + array[k]['value'] + array[l]['type'] + array[l]['value'] + '_position_' + array[i]['position'] + '/' + array[j]['position'] + '/' + array[k]['position'] + '/' + array[l]['position']);
					}
				}
			}
		}

		return newArray;
	}		

	function computerTurn(playerData) {
		setTimeout(function () {
			console.log('========== Tour ' + playerData['turn'] + ' ==========');

			if (playersData['player_1']['isServed'] === true) {
				console.log('PC : Le joueur est servi');
			} else {
				console.log('PC : Le joueur n\'est pas encore servi')
			}

			console.log('PC : Mon score est ' + playerData['score']);


			if (playerData['lastUsedSlot'] === 9 || (goodMove === false && playerData['score'] > 20)) { // Si l'ordinateur a rempli son plateau, il ne peut plus jouer
				console.log("playerData['lastUsedSlot'] = " + playerData['lastUsedSlot']);
				console.log('PC : J\'ai rempli mon plateau, je ne peux plus jouer');
				results(playersData);	
				return;
			}			

			// Pour commencer, l'ordinateur va piocher une carte
			draw(playerData);

			console.log('PC : Je pioche ' + $('section#boards').children('section').eq(playerData['idPlayer']).children().eq(playerData['lastUsedSlot'] - 1).children('img').data('value'));

			if (playerData['score'] === 20) {
				playerData['isServed'] = true;				
				$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + '(Servi)'); // Enfin, on met à jour le contenu de la div qui contient le score

				if (playersData['player_1']['isServed'] === false) { // Si le joueur n'est pas servi, on va appeler son tour
					playerTurn(playersData['player_1']);
					console.log('PC : J\'ai pioché, mon score est ' + playerData['score'] + ', je suis servi, j\'appelle le tour du joueur');
				} else { // Si tout le monde est servi, on passe à la résolution de la manche
					results(playersData);
					console.log('PC : J\'ai pioché, mon score est ' + playerData['score'] + ', je suis servi, le joueur aussi, on passe à la résolution');

					return;
				}		
			}

			// On récupère la valeur de la main de l'ordinateur via les attributs data-* des img de sa section#hand
			var cardsArray = $('section#hands').children().eq(playerData['idPlayer']).children().children('img').map(function(){
				cardData = {
					'type'     : $(this).data('type'),
					'value'    : $(this).data('value'),
					'position' : $(this).data('position')
				}

			    return cardData;
			});
			
			// On créer des variables temporaires pour le stockage du score afin de faire des simulations dessus sans affecter le véritable score
			var bestScore = 0;	

			// On créé un array dans lequel on stocke toutes les combinaisons possibles de cartes
			var combinaisonsArray = calculCombinaisons(cardsArray);
			// On initialise une variable dans lequel on va stocker au fur et à mesure les résultats possibles à partir de score + la valeur de la combinaison
			var resultat;

			// console.log('==================');

			for (var i = 0 ; i < combinaisonsArray.length ; i++) {
				var combinaison = combinaisonsArray[i].split('_position_',2);
				var combo       = eval(playerData['score'] + combinaison[0]);

				/*
					Si la combinaison envisagée est meilleure que la dernière meilleure combinaison enregistrée jusqu'à présent ET si la combinaison envisagée est supérieure au score ET si la combinaison envisagée ne dépasse pas 20
					OU si le score est supérieur à 20 ET que la combinaison envisagée la ramene en-dessous ou à 20

					Alors j'envisage de jouer mon move
				*/
				if ((combo > bestScore && combo > playerData['score'] && combo <= 20) || (playerData['score'] > 20 && combo <= 20)) {
					/*
						Si la différence entre la combinaison envisagée et le score est supérieure à 4 
						OU si la combinaison est supérieure ou égale à 15
						OU si le score est supérieur à 20
					*/
					if ((combo - playerData['score']) > 4 || combo >= 15 || playerData['score'] > 20) {
						bestScore = eval(playerData['score'] + combinaison[0]);

						var goodMove   = true;
						var finalMoves = combinaison[1];

						// Variables de test
						// var bestMove   = combinaison[0];
						var bestMove     = 'Je joue (' + playerData['score'] + ') '+ combinaison[0];						
						console.log('----');
						console.log('PC : combinaison = ' + combinaison);

						// resultat = 'PC : Mon score est ' + playerData['score'] + ' et je joue ' + combinaison[0];
					} else if (typeof(goodMove) === 'undefined') {
						var goodMove = false;

						// resultat = 'PC :  Mon score est ' + playerData['score'] + ' et je ne joue pas, mais j\'aurais pu';
					}
				} else if (typeof(goodMove) === 'undefined'){				
					var goodMove = false;

					// resultat = 'PC : Mon score est ' + playerData['score'] + ' et je ne joue pas du tout';
				}
			}

			if (goodMove === false && playerData['score'] > 20) { // Si l'ordinateur n'a plus aucun mouvement possible ET a un score supérieur à 20, il a perdu		
				console.log("playerData['lastUsedSlot'] = " + playerData['lastUsedSlot']);
				console.log('PC : Je ne peux plus jouer, j\'ai forcément perdu');
				results(playersData);	
				return;
			} else if (goodMove === true) { // Si l'ordinateur a calculé un mouvement intéressant...
				console.log('PC : ' + bestMove);
				var cardsPosition = finalMoves.split('/');
				console.log('PC : cardsPosition = ' + cardsPosition);

				// Ceci est une boucle récursive qui se relance à chaque fois qu'elle termine, avec un délai de 1s entre chaque itération pour simuler le "temps de réflexion" de l'adversaire (qui, sans ça, jouerait tout son tour instantanément)
				function theLoop(i) {
					setTimeout(function () {
						console.log('----');

						if (i < cardsPosition.length) { // Tant que l'ordinateur joue ses cartes...
							// On sélectionner le futur conteneur de la carte sur le palteau
							var cardContainer = $('section#hands').children().eq(playerData['idPlayer']).children('div').eq(cardsPosition[i]);
							// On va créer un div vide avant le div qui contient notre carte. De cette façon, il restera une trace de la carte une fois celle-ci transférée sur le plateau
							cardContainer.before('<div class="emptySlot">'); 

							// Ici, on va récupérer la carte elle-même
							var selectedCard = cardContainer.children('img');

							// Maintenant, on va remplacer l'un des div vides du plateau par notre carte. On se sert du _lastUsedSlot pour connaître l'index du div à remplacer.
							$('section#boards').children().eq(playerData['idPlayer']).children().eq(playerData['lastUsedSlot']).replaceWith(cardContainer);

							// Et là, on va pouvoir mettre à jour le score de l'ordinateur				
							$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + eval(selectedCard.data('type') + selectedCard.data('value'))); // Enfin, on met à jour le contenu de la div qui contient le score
							console.log('PC : Je réalise cette opération : Mon score (' + playerData['score'] + ') ' + selectedCard.data('type') + selectedCard.data('value'));
							playerData['score'] += eval(selectedCard.data('type') + selectedCard.data('value'));

							playerData['lastUsedSlot']++; // Forcément, on met à jour le dernier slot utilisé en prévision de la prochaine action du joueur

							// Et comme il a cliqué sur une carte, on joue le petit son qui va bien
							var audio = new Audio('sounds/sfx/click-onCard.wav');
							audio.volume = 0.1;
							audio.play();	

							i++;

						  	theLoop(i); // On relance la boucle, et on lui passe la nouvelle valeur de i			      
						} else { // ... Et une fois qu'il a terminé son tour
							// Si le premier joueur est servi...
							if (playersData['player_1']['isServed'] === true) {
								/*
									Si le score de l'ordinateur est supérieur ou égal à celui du premier joueur ET si le score de l'ordinateur est inférieur ou égal à 20
								*/	
								if (playerData['score'] >= playersData['player_1']['score'] && playerData['score'] <= 20) {
									playerData['isServed'] = true;
									$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + '(Servi)'); // Enfin, on met à jour le contenu de la div qui contient le score
									console.log('PC : Je me déclare servi');

									results(playersData);			
									console.log('PC : J\'ai pioché, j\'ai joué, mon score est ' + playerData['score'] + ', je suis servi, le joueur est servi, on passe à la résolution');
									return;				
								} else {
									computerTurn(playerData);
									console.log('PC : J\'ai pioché, j\'ai joué, mon score est ' + playerData['score'] + ', le joueur est servi, je ne l\'ai pas encore battu ou égalisé donc je rejoue');
								}
							} else {
								/*
									Si le score de l'ordinateur est supérieur ou égal à 18, il ne prend plus de risques
								*/
								if (playerData['score'] >= 18) {
									playerData['isServed'] = true;
									$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + '(Servi)'); // Enfin, on met à jour le contenu de la div qui contient le score
									console.log('PC : Je me déclare servi');

									playerTurn(playersData['player_1']);						
									console.log('PC : J\'ai pioché, j\'ai joué, mon score est ' + playerData['score'] + ', je suis servi, et j\'appelle le tour du joueur');							
								} else {
									playerTurn(playersData['player_1']);
									console.log('PC : J\'ai pioché, j\'ai joué, mon score est ' + playerData['score'] + ', et j\'appelle le tour du joueur');							
								}
							}			
						}
					}, 750);
				}

				theLoop(0);
			} else { // ... L'ordinateur n'avait pas de bon move :-()
				/*
					Si le score de l'ordinateur est supérieur ou égal à 18 ET si le score de l'ordinateur est supérieur ou égal au score du joueur ET si le joueur est servi ET si le score de l'ordinateur est inférieur ou égal à 20
				*/
				if (playerData['score'] >= 18 && playerData['score'] >= playersData['player_1']['score'] && playersData['player_1']['isServed'] === true && playerData['score'] <= 20) {
					playerData['isServed'] = true;
					$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + '(Servi)'); // Enfin, on met à jour le contenu de la div qui contient le score

					console.log('PC : Je me déclare servi');
					console.log('PC : J\'ai pioché, je n\'ai pas joué, mon score est ' + playerData['score'] + ', je suis servi, et le joueur est servi, on passe à la résolution');

					results(playersData);

					return;
				}
				/* 
					Si le score de l'ordinateur est supérieur ou égal à 17 ET si le score de l'ordinateur est supérieur ou égal au score du joueur ET si le score de l'ordinateur est inférieur ou égal à 20
				*/
				else if (playerData['score'] >= 17 && playerData['score'] >= playersData['player_1']['score'] && playerData['score'] <= 20) {
					// Pour l'instant, on va quand même déclarer le PC servi, mais plus tard on dira que si le joueur a encore au moins 3 cartes et 4 slots sur son board ET si le PC a des cartes négatives, il ne se déclarera pas servi tout de suite.

					playerData['isServed'] = true;
					$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + '(Servi)'); // Enfin, on met à jour le contenu de la div qui contient le score

					console.log('PC : Je me déclare servi');
					console.log('PC : J\'ai pioché, je n\'ai pas joué, mon score est ' + playerData['score'] + ', je suis servi, et j\'appelle le tour du joueur');

					playerTurn(playersData['player_1']);			
				}
				/*
					Si le score de l'ordinateur est encore trop faible
				*/
				else {
					if (playersData['player_1']['isServed'] === false) { // Si le joueur n'est pas servi, on va appeler son tour
						playerTurn(playersData['player_1']);
						console.log('PC : Je n\'ai joué aucune carte, mon score est ' + playerData['score'] + ', et j\'appelle le tour du joueur');
					} else if (playerData['isServed'] === false) { // S'il est servi mais que l'ordinateur ne l'est pas, l'ordinateur peut rejouer
						computerTurn(playerData);
						console.log('PC : Je n\'ai joué aucune carte, mon score est ' + playerData['score'] + ', et le joueur est servi, je rejoue');
					} 
				}
			}

			playerData['turn']++;

		// console.log('==================');
		// console.log('Score à la fin du tour : ' + bestScore);
		}, 750);
	}

	function playerTurn (playerData) {
		// On peut déjà mettre son tour en évidence
		$('header').next('div').attr('class','playerTurn').html('C\'est à vous de jouer !');
		$('section#hands').addClass('active');

		// Maintenant, il va automatiquement piocher une carte (c'est le début de son tour)
		draw(playerData);
		console.log("playerData['lastUsedSlot'] = " + playerData['lastUsedSlot']);		

		if (playerData['score'] === 20 || playerData['lastUsedSlot'] === 9) {
			playerData['isServed'] = true;
			$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + '(Servi)'); // Enfin, on met à jour le contenu de la div qui contient le score

			if (playersData['player_2']['isServed'] === false) { // Si l'ordi n'est pas servi, on va appeler son tour
				computerTurn(playersData['player_2']);
			} else { // Et enfin si tout le monde est servi, on passe à la résolution de la manche
				results(playersData);
			}	
			
			return;
		} else {
			// On récupère la valeur de la main de lu joueur via les attributs data-* des img de sa section#hand
			var cardsArray = $('section#hands').children().eq(playerData['idPlayer']).children().children('img').map(function(){
				cardData = {
					'type'     : $(this).data('type'),
					'value'    : $(this).data('value'),
					'position' : $(this).data('position')
				}

			    return cardData;
			});
			
			// On créer des variables temporaires pour le stockage du score afin de faire des simulations dessus sans affecter le véritable score
			var bestScore = 0;	

			// On créé un array dans lequel on stocke toutes les combinaisons possibles de cartes
			var combinaisonsArray = calculCombinaisons(cardsArray);
			// On initialise une variable dans lequel on va stocker au fur et à mesure les résultats possibles à partir de score + la valeur de la combinaison
			var resultat;

			for (var i = 0 ; i < combinaisonsArray.length ; i++) {
				var combinaison = combinaisonsArray[i].split('_position_',2);
				var combo       = eval(playerData['score'] + combinaison[0]);

				/*
					Si la combinaison envisagée est meilleure que la dernière meilleure combinaison enregistrée jusqu'à présent ET si la combinaison envisagée est supérieure au score ET si la combinaison envisagée ne dépasse pas 20
					OU si le score est supérieur à 20 ET que la combinaison envisagée la ramene en-dessous ou à 20

					Alors j'envisage de jouer mon move
				*/
				if ((combo > bestScore && combo > playerData['score'] && combo <= 20) || (playerData['score'] > 20 && combo <= 20)) {
					/*
						Si la différence entre la combinaison envisagée et le score est supérieure à 4 
						OU si la combinaison est supérieure ou égale à 15
						OU si le score est supérieur à 20
					*/
					if ((combo - playerData['score']) > 4 || combo >= 15 || playerData['score'] > 20) {
						bestScore = eval(playerData['score'] + combinaison[0]);

						var goodMove   = true;
						var finalMoves = combinaison[1];	

					} else if (typeof(goodMove) === 'undefined') {
						var goodMove = false;
					}
				} else if (typeof(goodMove) === 'undefined'){				
					var goodMove = false;
				}
			}

			if (goodMove === false && playerData['score'] > 20) { // Si le joueur n'a plus aucun mouvement possible ET a un score supérieur à 20, il a perdu
				$('section#hands section:first-of-type div').off();
				$('section#hands section:last-of-type a').off();
				$('section#hands').removeClass('active');
				
				results(playersData);	
				return;
			}			
		}

		// On met un écouteur d'évènement sur nos cartes jouables, c'est à dire les images qu'on a intégrées à la section#hands
		$('section#hands section:first-of-type div').dblclick(function() { // Notez l'utilisation de "dblclick" plutôt que "click", comme dans une application ou un vrai jeu vidéo
			// Comme il a cliqué sur une carte, on joue le petit son qui va bien
			var audio = new Audio('sounds/sfx/click-onCard.wav');
			audio.volume = 0.1;
			audio.play();

			// On va créé vide avant le div qui contient notre carte. De cette façon, il restera une trace de la carte une fois celle-ci transférée sur le plateau.
			$(this).before('<div class="emptySlot">'); 

			// On pense à retirer l'écouteur d'évènement sur le div, sinon il y aurait encore des interactions en cliquant sur la carte depuis le plateau...
			$(this).off();

			// Ici, on va récupérer la carte elle-même
			var selectedCard = $(this).children('img');

			// Maintenant, on va remplacer l'un des div vides du plateau par notre carte. On se sert du lastUsedSlot pour connaître l'index du div à remplacer.
			$('section#boards').children().eq(playerData['idPlayer']).children().eq(playerData['lastUsedSlot']).replaceWith($(this));

			// Et là, on va pouvoir mettre à jour le score du joueur en utilisant les attributs data-* de l'élement
			if (selectedCard.data('type') == '+') { // Si c'était une carte de type +, on additionne sa valeur au score...
				playerData['score'] += selectedCard.data('value');
			} else { // ... Sinon, on la soustrait au score
				playerData['score'] -= selectedCard.data('value');
			}
			$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score']); // Enfin, on met à jour le contenu de la div qui contient le score

			playerData['lastUsedSlot']++; // Forcément, on met à jour le dernier slot utilisé en prévision de la prochaine action du joueur
			console.log("playerData['lastUsedSlot'] = " + playerData['lastUsedSlot']);

			if (playerData['score'] === 20) { // Si le joueur atteint 20, on est sympa on le déclare Servi sans qu'il ai besoin de le faire
				// On met à jour le message du tour actuel
				$('header').next('div').attr('class','computerTurn').html('C\'est à votre adversaire de jouer !');

				// Comme le joueur ne peut plus jouer, on retire l'écouteur d'évènement des cartes et des boutons et on et retire la classe "active" sur la section Mains
				$('section#hands section:first-of-type div').off();
				$('section#hands section:last-of-type a').off();
				$('section#hands').removeClass('active');

				// On déclare que le joueur est servi, il ne pourra plus jouer
				playerData['isServed'] = true;

				if (playersData['player_2']['isServed'] === false) { // Si l'ordinateur n'est pas servi, on va appeler son tour
					computerTurn(playersData['player_2']);
				} else { // Et enfin si tout le monde est servi, on passe à la résolution de la manche
					results(playersData);

					return;
				}	
			} else if (playerData['score'] <= 20 && playerData['score'] > playersData['player_2']['score'] && playersData['player_2']['isServed']) { // Si le joueur reste en dessous de 20 mais dépasse l'ordinateur, il gagne forcément
				// On met à jour le message du tour actuel
				$('header').next('div').attr('class','computerTurn').html('C\'est à votre adversaire de jouer !');

				// Comme le joueur ne peut plus jouer, on retire l'écouteur d'évènement des cartes et des boutons et on et retire la classe "active" sur la section Mains
				$('section#hands section:first-of-type div').off();
				$('section#hands section:last-of-type a').off();
				$('section#hands').removeClass('active');

				// On déclare que le joueur est servi, il ne pourra plus jouer
				playerData['isServed'] = true;

				 // Puisque tout le monde est servi, on passe à la résolution de la manche
				results(playersData);

				return;
			}
		});	

		// On met un écouteur d'évènement sur notre bouton Fin de tour
		$('#turnEnd').click(function(event) { 
			playerData['turn']++;

			event.preventDefault();

			// On met à jour le message du tour actuel
			$('header').next('div').attr('class','computerTurn').html('C\'est à votre adversaire de jouer !');

			// Comme le joueur ne peut plus jouer, on retire l'écouteur d'évènement des cartes et des boutons et on et retire la classe "active" sur la section Mains
			$('section#hands section:first-of-type div').off();
			$('section#hands section:last-of-type a').off();
			$('section#hands').removeClass('active');

			if (playersData['player_2']['isServed'] === false) { // Si l'ordinateur n'est pas servi, on va appeler son tour
				computerTurn(playersData['player_2']);
			} else { // S'il est servi mais que le joueur ne l'est pas, le joueur peut rejouer
				playerTurn(playerData);
			}
		});		

		// Et un autre sur le bouton Servi	
		$('#servi').click(function(event) { 
			playerData['turn']++;	

			event.preventDefault();

			// On met à jour le message du tour actuel
			$('header').next('div').attr('class','computerTurn').html('C\'est à votre adversaire de jouer !');

			// Comme le joueur ne peut plus jouer, on retire l'écouteur d'évènement des cartes et des boutons et on et retire la classe "active" sur la section Mains
			$('section#hands section:first-of-type div').off();
			$('section#hands section:last-of-type a').off();
			$('section#hands').removeClass('active');

			// On déclare que le joueur est servi, il ne pourra plus jouer
			playerData['isServed'] = true;			
			$('header section').eq(playerData['idPlayer']).children('div').html(playerData['score'] + '(Servi)'); // Enfin, on met à jour le contenu de la div qui contient le score

			if (playersData['player_2']['isServed'] === false) { // Si l'ordinateur n'est pas servi, on va appeler son tour
				computerTurn(playersData['player_2']);
			} else { // Et enfin si tout le monde est servi, on passe à la résolution de la manche
				results(playersData);

				return;
			}					
		});		
	}		

	function results(playersData) {
		// Si le score du joueur est supérieur à 20, il a perdu
		if (playersData['player_1']['score'] > 20) {
			var audio = new Audio('sounds/sfx/defeatGame.wav');
			audio.volume = 0.1;
			audio.play();	

			alert('Perdu !');
		
		} else {
			if (playersData['player_1']['score'] === playersData['player_2']['score']) {
				var audio = new Audio('sounds/aliens/wookie.wav');
				audio.volume = 0.1;
				audio.play();	

				alert('Egalité !')
			}
			else if (playersData['player_1']['score'] > playersData['player_2']['score']) {
				var audio = new Audio('sounds/sfx/win.wav');
				audio.volume = 0.1;
				audio.play();	

				alert('Gagné !');
			} 
			else if (playersData['player_2']['score'] > 20) {
				var audio = new Audio('sounds/sfx/win.wav');
				audio.volume = 0.1;
				audio.play();	

				alert('Gagné !');
			} 
			else {
				var audio = new Audio('sounds/sfx/defeatGame.wav');
				audio.volume = 0.1;
				audio.play();	

				alert('Perdu !');
			}
		}
	}
	/*
		======================================
		END : Fonctions
		======================================
	*/




	/*
		======================================
		START : Variables globales
		======================================
	*/	

	// Les différents types de cartes possibles
	var cardTypes = ['+','-'];


	/* ======================================
	*	Ici, "joueur" fait référence aux deux joueurs de la partie, l'humain ET l'ordinateur.
	*
	*	"idPlayer" correspond à la position du joueur sur le plateau
	*
	*	"score" correspond au score du joueur
	*
	*	"lastUsedSlot" corredpond au dernier emplacement de carte utilisé sur le plateau du joueur
	*
	*	"hasPlayed" correspond à l'état du tour du joueur : 	
	*		false, il n'a pas encore joué et c'est donc son tour 
	*		true, il vient de jouer et ce n'est plus son tour
	*
	*	"isServed" correspond à l'état servi du joueur :
	*		false, il n'est pas satisfait de son jeu et souhaite continuer à piocher
	*		true, il est satisfait et ne souhaite plus piocher
	*
	*	"turn" correspond au dernier tour du joueur
	*
	*	======================================
	*/	
	var playersData = {
		// Le joueur humain
		player_1 : {
			'idPlayer'     : 0,
			'score'        : 0,
			'lastUsedSlot' : 0,
			'hasPlayed'    : false,
			'isServed'     : false,
			'turn'         : 1,
		},
		// Son adversaire, l'ordinateur
		player_2 : {
			'idPlayer'     : 1,
			'score'        : 0,
			'lastUsedSlot' : 0,
			'hasPlayed'    : true, // On considère que par défaut, l'ordinateur a "déjà joué" car il faut bien laisser quelqu'un commencer...
			'isServed'     : false,
			'turn'         : 1,
		}
	};	

	// On génère les mains de départ de nos joueurs
	generateHand(playersData['player_1']['idPlayer']);
	generateHand(playersData['player_2']['idPlayer']);

	// On génère les plateaux de jeu respectifs des joueurs
	generateBoard(playersData['player_1']['idPlayer']);
	generateBoard(playersData['player_2']['idPlayer']);

	/*
		======================================
		END : Variables
		======================================
	*/	

	/* Tout est en place, il n'y a plus qu'à initialiser la partie !*/

	// On considère que le joueur humain joue en premier.
	playerTurn(playersData['player_1']);
});