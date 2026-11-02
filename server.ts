import express from 'express';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = util.promisify(exec);
const REPO_URL = 'https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app.git';
const TOKEN_FILE = path.resolve('.git/github_token.txt');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Get saved GitHub token
  const getStoredToken = (): string => {
    try {
      if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
      if (fs.existsSync(TOKEN_FILE)) {
        return fs.readFileSync(TOKEN_FILE, 'utf-8').trim();
      }
    } catch {
      // ignore
    }
    return '';
  };

  // Helper to run git command in workspace
  const runGit = async (cmd: string) => {
    const { stdout, stderr } = await execAsync(cmd, { cwd: process.cwd() });
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  };

  // 1. GET /api/git/status
  app.get('/api/git/status', async (req, res) => {
    try {
      const storedToken = getStoredToken();
      let branch = 'main';
      let lastCommit = '';
      let statusText = '';
      let remoteUrl = REPO_URL;

      try {
        const bRes = await runGit('git rev-parse --abbrev-ref HEAD');
        branch = bRes.stdout || 'main';
      } catch {}

      try {
        const cRes = await runGit('git log -1 --format="%h - %s (%cd)" --date=relative');
        lastCommit = cRes.stdout;
      } catch {}

      try {
        const sRes = await runGit('git status --short');
        statusText = sRes.stdout;
      } catch {}

      try {
        const rRes = await runGit('git remote get-url origin');
        remoteUrl = rRes.stdout || REPO_URL;
      } catch {}

      res.json({
        success: true,
        repoUrl: REPO_URL,
        branch,
        lastCommit,
        hasUncommittedChanges: statusText.length > 0,
        statusText,
        hasToken: storedToken.length > 0,
        maskedToken: storedToken ? `${storedToken.substring(0, 4)}...${storedToken.substring(storedToken.length - 4)}` : null,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. POST /api/git/token
  app.post('/api/git/token', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ success: false, error: 'Token is required' });
      }
      fs.writeFileSync(TOKEN_FILE, token.trim(), 'utf-8');
      res.json({ success: true, message: 'GitHub token saved successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. POST /api/git/pull
  app.post('/api/git/pull', async (req, res) => {
    try {
      const token = req.body.token?.trim() || getStoredToken();
      let pullCmd = 'git pull origin main';
      if (token) {
        pullCmd = `git pull https://${token}@github.com/ma-comm-ac-net/LKB-PUB-KAC-app.git main`;
      }
      const output = await runGit(pullCmd);
      res.json({
        success: true,
        message: 'Pull dari GitHub berhasil.',
        output: output.stdout || output.stderr,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Gagal melakukan pull dari GitHub.',
      });
    }
  });

  // 4. POST /api/git/push
  app.post('/api/git/push', async (req, res) => {
    try {
      const token = req.body.token?.trim() || getStoredToken();
      const commitMessage =
        req.body.message ||
        `feat: update data LKB PUB KAC - ${new Date().toLocaleString('id-ID')}`;

      if (!token) {
        return res.status(400).json({
          success: false,
          error:
            'GitHub Personal Access Token (PAT) diperlukan untuk push. Masukkan token Anda pada menu GitHub Sync.',
        });
      }

      // Stage all changes
      await runGit('git add -A');

      // Check if there are changes to commit
      try {
        await runGit(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
      } catch (commitErr: any) {
        // Nothing to commit is fine
        if (!commitErr.message?.includes('nothing to commit')) {
          console.warn('Commit notice:', commitErr.message);
        }
      }

      // Push to GitHub using token authenticated URL
      const pushUrl = `https://${token}@github.com/ma-comm-ac-net/LKB-PUB-KAC-app.git`;
      const pushRes = await runGit(`git push ${pushUrl} main`);

      res.json({
        success: true,
        message: 'Push ke GitHub berhasil.',
        output: pushRes.stdout || pushRes.stderr,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Gagal melakukan push ke GitHub.',
      });
    }
  });

  // Vite middleware in dev or static in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LKB Application Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
