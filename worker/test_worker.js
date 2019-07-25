// console.log(global_data)
function test(){

console.log('"global_data"')
console.log(self)
}

test()
postMessage('bonjour')

onmessage = function(e) {
  console.log('Message reçu depuis le script principal.');
  // var workerResult = 'Résultat : ' + (e.data[0] * e.data[1]);
  console.log('Envoi du message de retour au script principal');
  postMessage('e');
}