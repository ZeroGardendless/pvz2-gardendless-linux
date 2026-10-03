import { initializeLauncherContext } from './platform/Launcher.js';
try {
  await initializeLauncherContext();
  await import('./Main.js');
} catch (error) {
  console.error('[GPNext] Startup failed:', error);
  const message = document.createElement('pre');
  message.style.cssText = 'position:fixed;inset:24px;z-index:999999;white-space:pre-wrap;padding:24px;background:#172019;color:#eef3e8;font:15px/1.6 system-ui;overflow:auto';
  message.textContent = `Gardendless could not start.\n\n${error?.message || error}\n\nClose the game and check the launcher’s session log.`;
  document.body.append(message);
}
