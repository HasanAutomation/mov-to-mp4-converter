const { dialog } = require('electron').remote; // eslint-disable-line import/no-extraneous-dependencies
const ffmpeg = require('./ffmpeg');

document.addEventListener('DOMContentLoaded', () => {
  const inputFile = document.getElementById('input-file');
  const outputFile = document.getElementById('output-file');
  const progress = document.getElementById('progress');
  const success = document.getElementById('success');
  const errors = document.getElementById('errors');

  const hideAll = () => [progress, success, errors].forEach(el =>
    (el.style.display = 'none')); // eslint-disable-line no-param-reassign

  document.getElementById('select-input').addEventListener('click', () => {
    hideAll();
    dialog.showOpenDialog({
      filters: [{ name: 'mov', extensions: ['mov'] }],
      properties: ['openFile', 'createDirectory']
    }, (fileNames) => {
      if (fileNames && fileNames.length === 1) {
        inputFile.value = fileNames[0];
        outputFile.value = fileNames[0].replace(/\.mov$/, '.mp4');
      }
    });
  });

  document.getElementById('select-output').addEventListener('click', () => {
    hideAll();
    dialog.showSaveDialog({
      filters: [{ name: 'mp4', extensions: ['mp4'] }]
    }, fileName => fileName && (outputFile.value = fileName));
  });

  document.getElementById('convert').addEventListener('click', () => {
    hideAll();
    progress.style.display = 'block';
    ffmpeg.convert(inputFile.value, outputFile.value)
      .then(() => {
        hideAll();
        success.innerText = 'Conversion complete';
        success.style.display = 'block';
      })
      .catch((err) => {
        console.error('FFMPEG ERROR:', err);
        hideAll();
        errors.innerText = 'Failed to convert file';
        errors.style.display = 'block';
      });
  });
});
