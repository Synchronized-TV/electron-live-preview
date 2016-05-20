const ipcRenderer = require('electron').ipcRenderer;
const remote = require('remote');

// var state = {
//   devtools: false,
//   pin: true
// };

[].slice.call(document.querySelectorAll('.titlebar-button')).forEach(function(node) {
  node.addEventListener('click', function(event) {
    ipcRenderer.sendSync('action', node.id);
    event.preventDefault();
  }, false);
});

// ipcRenderer.on('action', function(event, state) {
//   for (var i in state) {
//     const node = document.querySelector('#' + i);
//     if (state[i] && !node.classList.contains('active')) {
//       node.classList.add(i);
//     }
//     else if (!state[i]) {
//       node.classList.remove(i);
//     }
//   }
// });