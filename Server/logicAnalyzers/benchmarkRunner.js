const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runBenchmark(benchmarkCode) {
  return new Promise((resolve) => {
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      try {
        fs.mkdirSync(tempDir, { recursive: true });
      } catch (err) {
        return resolve({ success: false, error: 'Could not create temp directory' });
      }
    }

    const timestamp = Date.now();
    const tempFile = path.join(tempDir, `temp_bench_${timestamp}.cpp`);
    const isWindows = process.platform === 'win32';
    const exeFile = path.join(tempDir, `temp_bench_${timestamp}${isWindows ? '.exe' : ''}`);

    fs.writeFile(tempFile, benchmarkCode, 'utf8', (writeErr) => {
      if (writeErr) {
        return resolve({ success: false, error: 'Could not write benchmark source' });
      }

      // 1. Compile with optimizations enabled (-O3)
      exec(`g++ -O3 "${tempFile}" -o "${exeFile}"`, (compileErr, compileStdout, compileStderr) => {
        // Cleanup C++ source file immediately after compilation attempt
        fs.unlink(tempFile, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temp bench cpp:', unlinkErr.message);
        });

        if (compileErr) {
          console.error('Benchmark compilation failed:', compileStderr || compileErr.message);
          return resolve({ success: false, error: 'Compilation failed: ' + (compileStderr || compileErr.message) });
        }

        // 2. Run the generated executable
        const runCmd = `"${exeFile}"`;
        exec(runCmd, { cwd: tempDir, timeout: 10000 }, (runErr, runStdout, runStderr) => {
          // Cleanup compiled binary file
          fs.unlink(exeFile, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp bench exe:', unlinkErr.message);
          });

          if (runErr) {
            console.error('Benchmark execution failed:', runStderr || runErr.message);
            return resolve({ success: false, error: 'Execution failed: ' + (runStderr || runErr.message) });
          }

          // 3. Parse stdout for execution times and speedups
          const lines = runStdout.split('\n');
          let bruteTime = 'N/A';
          let optimizedTime = 'N/A';
          let speedup = 'N/A';
          let benchmarkName = 'DSA Benchmark';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.includes('BENCHMARK:')) {
              benchmarkName = trimmed.replace('BENCHMARK:', '').trim();
            }
            if (trimmed.includes('Brute Force') || trimmed.includes('Linear') || trimmed.includes('Bubble')) {
              const match = trimmed.match(/(?:Time:|\bTime\b)\s*([\d.]+)\s*(ms|microseconds)/i);
              if (match) {
                bruteTime = match[1] + ' ' + match[2];
              }
            }
            if (trimmed.includes('Prefix Sum') || trimmed.includes('Two Pointer') || trimmed.includes('Sliding Window') || trimmed.includes('Hash Set') || trimmed.includes('Binary') || trimmed.includes('std::sort')) {
              const match = trimmed.match(/(?:Time:|\bTime\b)\s*([\d.]+)\s*(ms|microseconds)/i);
              if (match) {
                optimizedTime = match[1] + ' ' + match[2];
              }
            }
            if (trimmed.includes('SPEEDUP FACTOR:')) {
              const match = trimmed.match(/SPEEDUP FACTOR:\s*(.*)$/i);
              if (match) {
                speedup = match[1].trim();
              }
            }
          }

          resolve({
            success: true,
            benchmarkName,
            bruteTime,
            optimizedTime,
            speedup,
            rawOutput: runStdout
          });
        });
      });
    });
  });
}

module.exports = { runBenchmark };
