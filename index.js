#!/usr/bin/env node
'use strict';

const readline = require('readline');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const SERVERS = require('./servers.json');

// ── Terminal helpers ──────────────────────────────────────────────────────────

const dim    = (s) => `\x1b[2m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const cyan   = (s) => `\x1b[36m${s}\x1b[0m`;

const IS_WINDOWS = process.platform === 'win32';
const MCPB_SRC   = path.join(__dirname, 'ext', 'mercury-platform', 'mercury-platform.mcpb');

// ── Prompt helpers ────────────────────────────────────────────────────────────

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function promptSecret(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    let muting = false;
    const origWrite = rl.output.write.bind(rl.output);
    rl.output.write = (string, encoding, callback) => {
      if (muting) {
        if (typeof encoding === 'function') encoding();
        else if (typeof callback === 'function') callback();
        return true;
      }
      return origWrite(string, encoding, callback);
    };

    process.stdout.write(question);
    muting = true;

    rl.once('line', (answer) => {
      muting = false;
      rl.output.write = origWrite;
      rl.close();
      process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
}

// ── Claude Code CLI helpers ───────────────────────────────────────────────────

function serverExists(name) {
  const result = spawnSync('claude', ['mcp', 'get', name], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  return result.status === 0;
}

function removeServer(name) {
  for (const scope of ['project', 'user', 'local']) {
    spawnSync('claude', ['mcp', 'remove', '-s', scope, name], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  }
}

function installServer(server, scope, apiKey) {
  const result = spawnSync(
    'claude',
    [
      'mcp', 'add',
      '-s', scope,
      '--transport', server.transport,
      server.name,
      server.url,
      '--header', `X-API-Key: ${apiKey}`,
    ],
    { encoding: 'utf8', stdio: 'pipe' }
  );
  return result.status === 0
    ? { ok: true }
    : { ok: false, error: (result.stderr || result.stdout || '').trim() };
}

// ── Desktop Extension installer (Windows / Claude Desktop) ────────────────────

async function installDesktopExtension() {
  console.log();
  console.log(bold('  Mercury Platform — Claude Desktop Extension'));
  console.log(dim('  ─────────────────────────────────────────────'));
  console.log();
  console.log(dim('  All four Mercury MCP servers are bundled into a single'));
  console.log(dim('  .mcpb extension. Claude Desktop will prompt for your API'));
  console.log(dim('  key and store it securely in the Windows keychain.'));
  console.log();

  if (!fs.existsSync(MCPB_SRC)) {
    console.log(red('  Error: mercury-platform.mcpb not found at expected path.'));
    console.log(dim('  ' + MCPB_SRC));
    process.exit(1);
  }

  const dest = path.join(os.homedir(), 'Desktop', 'mercury-platform.mcpb');

  try {
    fs.copyFileSync(MCPB_SRC, dest);
    console.log(green('  ✓ Copied mercury-platform.mcpb to your Desktop'));
  } catch (err) {
    console.log(yellow('  Could not copy to Desktop: ' + err.message));
    console.log(dim('  File is at: ' + MCPB_SRC));
    console.log(dim('  Copy it manually and double-click to install.'));
    console.log();
    process.exit(0);
  }

  // Attempt to open — triggers Claude Desktop install dialog
  spawnSync('cmd', ['/c', 'start', '', dest], { stdio: 'pipe' });

  console.log();
  console.log(bold('  Next steps:'));
  console.log();
  console.log(`    ${cyan('1')}  Claude Desktop should open the install dialog automatically.`);
  console.log(`       If it doesn't, double-click ${bold('mercury-platform.mcpb')} on your Desktop.`);
  console.log();
  console.log(`    ${cyan('2')}  Enter your ${bold('Mercury API Key')} when prompted.`);
  console.log();
  console.log(`    ${cyan('3')}  Click ${bold('Install')} — all four Mercury servers will be available.`);
  console.log();
}

// ── Claude Code installer ─────────────────────────────────────────────────────

async function installClaudeCode() {
  // ── Step 1: Select servers ───────────────────────────────────────────────────
  console.log(bold('  Available servers:'));
  console.log();
  SERVERS.forEach((s, i) => {
    console.log(`    ${cyan(String(i + 1))}) ${bold(s.label)}`);
    console.log(`       ${dim(s.description)}`);
    console.log(`       ${dim(s.url)}`);
    console.log();
  });

  const selInput = await prompt(
    `  Install which? ${dim('(e.g. "1 3", "all")')} [all]: `
  );

  let selected;
  if (!selInput || selInput.toLowerCase() === 'all') {
    selected = SERVERS;
  } else {
    const indices = selInput.split(/[\s,]+/).map((n) => parseInt(n, 10) - 1);
    selected = indices
      .filter((i) => i >= 0 && i < SERVERS.length)
      .map((i) => SERVERS[i]);

    if (selected.length === 0) {
      console.log(red('\n  No valid selection. Exiting.'));
      process.exit(1);
    }
  }

  // ── Step 2: Scope ────────────────────────────────────────────────────────────
  console.log();
  console.log(bold('  Install scope:'));
  console.log();
  console.log(`    ${cyan('1')}  user    ${dim('— all Claude sessions  (~/.claude.json)')}`);
  console.log(`    ${cyan('2')}  project ${dim('— this repo only       (.mcp.json)')}`);
  console.log();

  const scopeInput = await prompt(`  Choose [1]: `);
  const scope = scopeInput === '2' ? 'project' : 'user';
  console.log(`  ${dim('Scope:')} ${scope}`);

  // ── Step 3: Check for existing installations ─────────────────────────────────
  const alreadyInstalled = selected.filter((s) => serverExists(s.name));

  if (alreadyInstalled.length > 0) {
    console.log();
    console.log(yellow('  Already installed:'));
    alreadyInstalled.forEach((s) => console.log(`    ${yellow('!')} ${s.name}`));
    console.log();

    const overwrite = await prompt('  Remove and reinstall? [y/N]: ');
    if (overwrite.toLowerCase() === 'y') {
      alreadyInstalled.forEach((s) => removeServer(s.name));
    } else {
      selected = selected.filter((s) => !alreadyInstalled.includes(s));
      if (selected.length === 0) {
        console.log(dim('\n  Nothing to install. Exiting.'));
        process.exit(0);
      }
    }
  }

  // ── Step 4: API key ──────────────────────────────────────────────────────────
  console.log();
  const apiKey = await promptSecret('  Mercury API Key: ');

  if (!apiKey) {
    console.log(red('\n  API key cannot be empty.'));
    process.exit(1);
  }

  // ── Step 5: Install ──────────────────────────────────────────────────────────
  console.log();
  console.log(bold('  Installing...'));
  console.log();

  const results = [];
  for (const server of selected) {
    const { ok, error } = installServer(server, scope, apiKey);
    results.push({ server, ok, error });
    if (ok) {
      console.log(`    ${green('✓')} ${server.name}`);
    } else {
      console.log(`    ${red('✗')} ${server.name}  ${dim(error || 'unknown error')}`);
    }
  }

  // ── Step 6: Summary ──────────────────────────────────────────────────────────
  const failed = results.filter((r) => !r.ok);
  console.log();

  if (failed.length === 0) {
    console.log(green('  All done.'));
    console.log();
    console.log(dim('  Verify with: claude mcp list'));
  } else {
    console.log(yellow(`  Done with ${failed.length} error(s). Check output above.`));
  }
  console.log();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log();
  console.log(bold('  Mercury MCP Installer'));
  console.log(dim('  ─────────────────────────────────────────────'));
  console.log();

  if (IS_WINDOWS) {
    console.log(bold('  Install for:'));
    console.log();
    console.log(`    ${cyan('1')}  Claude Desktop  ${dim('— .mcpb extension, one-click install (recommended)')}`);
    console.log(`    ${cyan('2')}  Claude Code     ${dim('— claude mcp add via CLI')}`);
    console.log();

    const targetInput = await prompt(`  Choose [1]: `);
    console.log();

    if (targetInput !== '2') {
      await installDesktopExtension();
      return;
    }
  }

  await installClaudeCode();
}

main().catch((err) => {
  console.error(red(`\n  Error: ${err.message}`));
  process.exit(1);
});
