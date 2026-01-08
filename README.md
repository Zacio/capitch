# capitch action event

| Action | Nom de l'evenement | Moment |
| ------ | ------------------ | ------ |
| Scan du QR code et création du QR code student (trainer) | trainer-scan | Au scan du QR code |
| Scan du QR code (student) | student-scan | Au scan du QR code |
| Creation de la partie et du QR code trainer (laptop) | create-game  | a l'appuie du bouton "créer une partie" |
| Met en pause la partie (trainer) | pause-game | a l'appuie du bouton "pause" |
| Enlever le mode pause (trainer) | resume-game | a l'appuie du boutton "continuer" |
| Terminer le quizz avant la dernière question (trainer) | end-game | a l'appuie du bouton "terminer" |
| Passez la question (trainer) | skip-question | a l'appuie du bouton "passer la question" |
| Met a jour la liste des participant (serveur) | participent-update | aprés qu'un participants ai scanner le QR code et aprés l'ajout d'un utilisateur a la session | 
| Met a jour les point des participant (serveur) | score-update | aprés qu'un participant ai répondu a une question et aprés la mise a jours des point de participants de la session |
| Bloque la capaciter a répondre a la question et affiche le score (serveur) | question-end | Aprés que le timer de la question en cours arrive a 0 |
| Passe a la prochaine question (trainer) | next-question | a l'appuie du boutton "prochaine question" |
| Commence une partie avec le quizz sélectioner (trainer) | start-quizz | a l'appuie de un des quizz disponible sur l'interface de selection des quizz |
| enlève une seconde au timer | time-update | toutes les seconde tanqu'une question est afficher et que les participant peuvent répondre |
