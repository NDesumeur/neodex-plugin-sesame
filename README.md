# Sésame

Un jeu de logique en pixel art : invente un mot de passe qui respecte des règles de plus en plus tordues.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Tape** ton mot de passe dans la case au-dessus des règles.
- **Entrée** : valider quand toutes les règles sont vertes, puis rejouer.
- Pour l'émoji d'animal : **Windows + point** ouvre le choix des émojis.

## Comment ça marche

- Au départ, une seule règle. Dès que toutes les règles affichées sont respectées, une nouvelle apparaît. Il y en a **seize**.
- Les anciennes règles doivent **rester vraies**, et elles se marchent dessus : les chiffres doivent faire **20 en tout**, mais il faut aussi le résultat d'un calcul et **l'heure qu'il est** ; un fromage français, mais **pas plus de trois E**…
- Chaque partie tire une **capitale** et une **devinette** au hasard.
- En **rouge** en haut, ce qui ne va pas ; en **vert**, ce qui est bon. Les compteurs (somme des chiffres, longueur, nombre de E) se mettent à jour pendant que tu tapes.
- Le chronomètre part à la première lettre et s'arrête quand le mot de passe est accepté.

## Statistiques

Le panneau Records garde ton **meilleur temps**, la **règle la plus loin** atteinte et le nombre de **mots de passe acceptés**.

## Données et synchronisation

Tes records sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée. Le mot de passe que tu tapes n'est jamais enregistré.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Sésame → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
