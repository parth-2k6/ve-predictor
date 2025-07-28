const { spawn } = require('child_process');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const inputData = JSON.parse(body);

    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../python/predictor.py'),
      JSON.stringify(inputData)
    ]);

    let output = '';
    pythonProcess.stdout.on('data', data => { output += data.toString(); });
    pythonProcess.stderr.on('data', err => console.error('Python error:', err.toString()));

    pythonProcess.on('close', code => {
      if (code === 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(output);
      } else {
        res.status(500).send('Prediction failed.');
      }
    });
  });
};