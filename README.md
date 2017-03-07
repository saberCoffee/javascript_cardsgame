# javascript_cardsgame : Pazaak (Bêta)
Reproduction en Javascript d'un mini-jeu tiré du jeu KOTOR (Bioware)

<a href="http://talesofgalaxy.fr/pazaak/">Tester le jeu</a>

# Règles du jeu
Les règles du jeu se rapprochent de celles du pazaak. Le but est d'atteindre un score supérieur à votre adversaire (l'ordinateur) sans jamais dépasser 20. 

Au début de la partie, vous recevez une main composée de 4 cartes dont la valeur est comprise entre 1 et 10 ou -1 et -10.
Au début de chaque tour, vous piochez et jouez automatiquement une carte verte dont la valeur est comprise entre 1 et 10. 

Vous devez utiliser les cartes de votre main intelligement pour changer votre score et faire mieux que l'ordinateur, tout en restant à 20 ou moins.

# Fin du tour
Si vous êtes satisfait de votre tour actuel (vous avez pioché, éventuellement joué) mais que vous n'êtes pas encore servi, déclarez la fin de votre tour. Ce sera alors au tour de l'ordinateur, qui jouera ses cartes.

# Servi
Si votre score actuel vous combien (par exemple, un score entre 17 et 20), vous pouvez vous déclarer servi. Ainsi, vous ne pouvez plus jouer de cartes de votre main et votre score se fige, ce qui vous permet de ne pas dépasser 20 par malchance en piochant une carte à la valeur trop élevée

# Fin de partie
Le jeu étant encore en bêta, la fin de la partie arrive un peu brusquement via une alert pop-up. Si vous voulez rejouer, vous devez rafraîchir la page (F5).

Amusez-vous bien !
