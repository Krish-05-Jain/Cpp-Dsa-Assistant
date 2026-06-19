const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkSyntax(code) {
  return new Promise((resolve) => {
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      try {
        fs.mkdirSync(tempDir, { recursive: true });
      } catch (err) {
        return resolve({ success: false, error: 'Could not create temp directory' });
      }
    }
    
    const tempFile = path.join(tempDir, `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}.cpp`);
    
    fs.writeFile(tempFile, code, 'utf8', (writeErr) => {
      if (writeErr) {
        return resolve({ success: false, error: 'Could not create temp file for compile check' });
      }

      // Execute g++ -fsyntax-only
      exec(`g++ -fsyntax-only "${tempFile}"`, (execErr, stdout, stderr) => {
        // Cleanup temp file
        fs.unlink(tempFile, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr.message);
        });

        // If g++ is not installed/recognized
        if (execErr && (execErr.message.includes('not recognized') || execErr.message.includes('not found') || execErr.code === 'ENOENT')) {
          return resolve({
            success: false,
            compilerMissing: true,
            message: 'g++ compiler is not installed or not in system PATH.',
            errors: []
          });
        }

        if (!stderr || stderr.trim() === '') {
          return resolve({ success: true, errors: [] });
        }

        const lines = stderr.split('\n');
        const errors = [];
        // Regex to parse g++ error format: filename:line:col: error/warning: message
        const regex = /^.*?:(\d+):(\d+):\s+(error|warning):\s+(.*)$/;

        for (const line of lines) {
          const match = line.trim().match(regex);
          if (match) {
            errors.push({
              line: parseInt(match[1], 10),
              column: parseInt(match[2], 10),
              severity: match[3],
              message: match[4]
            });
          }
        }

        const hasErrors = errors.some(e => e.severity === 'error');

        resolve({
          success: !hasErrors,
          errors
        });
      });
    });
  });
}

module.exports = { checkSyntax };
