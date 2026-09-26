import { n as e, r as t, t as n } from "./Bridge.js";
import { n as r } from "./Opener.js";
import { a as i, i as a, n as o, r as s, t as c } from "./Events.js";
var l = class {
  constructor(...e3) {
    this.type = `Logical`, e3.length === 1 ? `Logical` in e3[0] ? (this.width = e3[0].Logical.width, this.height = e3[0].Logical.height) : (this.width = e3[0].width, this.height = e3[0].height) : (this.width = e3[0], this.height = e3[1]);
  }
  toPhysical(e3) {
    return new u(this.width * e3, this.height * e3);
  }
  [e]() {
    return { width: this.width, height: this.height };
  }
  toJSON() {
    return this[e]();
  }
}, u = class {
  constructor(...e3) {
    this.type = `Physical`, e3.length === 1 ? `Physical` in e3[0] ? (this.width = e3[0].Physical.width, this.height = e3[0].Physical.height) : (this.width = e3[0].width, this.height = e3[0].height) : (this.width = e3[0], this.height = e3[1]);
  }
  toLogical(e3) {
    return new l(this.width / e3, this.height / e3);
  }
  [e]() {
    return { width: this.width, height: this.height };
  }
  toJSON() {
    return this[e]();
  }
}, d = class {
  constructor(e3) {
    this.size = e3;
  }
  toLogical(e3) {
    return this.size instanceof l ? this.size : this.size.toLogical(e3);
  }
  toPhysical(e3) {
    return this.size instanceof u ? this.size : this.size.toPhysical(e3);
  }
  [e]() {
    return { [`${this.size.type}`]: { width: this.size.width, height: this.size.height } };
  }
  toJSON() {
    return this[e]();
  }
}, f = class {
  constructor(...e3) {
    this.type = `Logical`, e3.length === 1 ? `Logical` in e3[0] ? (this.x = e3[0].Logical.x, this.y = e3[0].Logical.y) : (this.x = e3[0].x, this.y = e3[0].y) : (this.x = e3[0], this.y = e3[1]);
  }
  toPhysical(e3) {
    return new p(this.x * e3, this.y * e3);
  }
  [e]() {
    return { x: this.x, y: this.y };
  }
  toJSON() {
    return this[e]();
  }
}, p = class {
  constructor(...e3) {
    this.type = `Physical`, e3.length === 1 ? `Physical` in e3[0] ? (this.x = e3[0].Physical.x, this.y = e3[0].Physical.y) : (this.x = e3[0].x, this.y = e3[0].y) : (this.x = e3[0], this.y = e3[1]);
  }
  toLogical(e3) {
    return new f(this.x / e3, this.y / e3);
  }
  [e]() {
    return { x: this.x, y: this.y };
  }
  toJSON() {
    return this[e]();
  }
}, m = class {
  constructor(e3) {
    this.position = e3;
  }
  toLogical(e3) {
    return this.position instanceof f ? this.position : this.position.toLogical(e3);
  }
  toPhysical(e3) {
    return this.position instanceof p ? this.position : this.position.toPhysical(e3);
  }
  [e]() {
    return { [`${this.position.type}`]: { x: this.position.x, y: this.position.y } };
  }
  toJSON() {
    return this[e]();
  }
}, h = class e2 extends n {
  constructor(e3) {
    super(e3);
  }
  static async new(n2, r2, i2) {
    return t(`plugin:image|new`, { rgba: g(n2), width: r2, height: i2 }).then((t2) => new e2(t2));
  }
  static async fromBytes(n2) {
    return t(`plugin:image|from_bytes`, { bytes: g(n2) }).then((t2) => new e2(t2));
  }
  static async fromPath(n2) {
    return t(`plugin:image|from_path`, { path: n2 }).then((t2) => new e2(t2));
  }
  async rgba() {
    return t(`plugin:image|rgba`, { rid: this.rid }).then((e3) => new Uint8Array(e3));
  }
  async size() {
    return t(`plugin:image|size`, { rid: this.rid });
  }
};
function g(e3) {
  return e3 == null ? null : typeof e3 == `string` ? e3 : e3 instanceof h ? e3.rid : e3;
}
var _;
(function(e3) {
  e3[e3.Critical = 1] = `Critical`, e3[e3.Informational = 2] = `Informational`;
})(_ ||= {});
var v = class {
  constructor(e3) {
    this._preventDefault = false, this.event = e3.event, this.id = e3.id;
  }
  preventDefault() {
    this._preventDefault = true;
  }
  isPreventDefault() {
    return this._preventDefault;
  }
}, y;
(function(e3) {
  e3.None = `none`, e3.Normal = `normal`, e3.Indeterminate = `indeterminate`, e3.Paused = `paused`, e3.Error = `error`;
})(y ||= {});
function b() {
  return new C(window.__TAURI_INTERNALS__.metadata.currentWindow.label, { skip: true });
}
async function x() {
  return t(`plugin:window|get_all_windows`).then((e3) => e3.map((e4) => new C(e4, { skip: true })));
}
var S = [`tauri://created`, `tauri://error`], C = class {
  constructor(e3, n2 = {}) {
    this.label = e3, this.listeners = /* @__PURE__ */ Object.create(null), n2?.skip || t(`plugin:window|create`, { options: { ...n2, parent: typeof n2.parent == `string` ? n2.parent : n2.parent?.label, label: e3 } }).then(async () => this.emit(`tauri://created`)).catch(async (e4) => this.emit(`tauri://error`, e4));
  }
  static async getByLabel(e3) {
    return (await x()).find((t2) => t2.label === e3) ?? null;
  }
  static getCurrent() {
    return b();
  }
  static async getAll() {
    return x();
  }
  static async getFocusedWindow() {
    for (let e3 of await x()) if (await e3.isFocused()) return e3;
    return null;
  }
  async listen(e3, t2) {
    return this._handleTauriEvent(e3, t2) ? () => {
      let n2 = this.listeners[e3];
      n2.splice(n2.indexOf(t2), 1);
    } : a(e3, t2, { target: { kind: `Window`, label: this.label } });
  }
  async once(e3, t2) {
    return this._handleTauriEvent(e3, t2) ? () => {
      let n2 = this.listeners[e3];
      n2.splice(n2.indexOf(t2), 1);
    } : i(e3, t2, { target: { kind: `Window`, label: this.label } });
  }
  async emit(e3, t2) {
    if (S.includes(e3)) {
      for (let n2 of this.listeners[e3] || []) n2({ event: e3, id: -1, payload: t2 });
      return;
    }
    return o(e3, t2);
  }
  async emitTo(e3, t2, n2) {
    if (S.includes(t2)) {
      for (let e4 of this.listeners[t2] || []) e4({ event: t2, id: -1, payload: n2 });
      return;
    }
    return s(e3, t2, n2);
  }
  _handleTauriEvent(e3, t2) {
    return S.includes(e3) ? (e3 in this.listeners ? this.listeners[e3].push(t2) : this.listeners[e3] = [t2], true) : false;
  }
  async scaleFactor() {
    return t(`plugin:window|scale_factor`, { label: this.label });
  }
  async innerPosition() {
    return t(`plugin:window|inner_position`, { label: this.label }).then((e3) => new p(e3));
  }
  async outerPosition() {
    return t(`plugin:window|outer_position`, { label: this.label }).then((e3) => new p(e3));
  }
  async innerSize() {
    return t(`plugin:window|inner_size`, { label: this.label }).then((e3) => new u(e3));
  }
  async outerSize() {
    return t(`plugin:window|outer_size`, { label: this.label }).then((e3) => new u(e3));
  }
  async isFullscreen() {
    return t(`plugin:window|is_fullscreen`, { label: this.label });
  }
  async isMinimized() {
    return t(`plugin:window|is_minimized`, { label: this.label });
  }
  async isMaximized() {
    return t(`plugin:window|is_maximized`, { label: this.label });
  }
  async isFocused() {
    return t(`plugin:window|is_focused`, { label: this.label });
  }
  async isDecorated() {
    return t(`plugin:window|is_decorated`, { label: this.label });
  }
  async isResizable() {
    return t(`plugin:window|is_resizable`, { label: this.label });
  }
  async isMaximizable() {
    return t(`plugin:window|is_maximizable`, { label: this.label });
  }
  async isMinimizable() {
    return t(`plugin:window|is_minimizable`, { label: this.label });
  }
  async isClosable() {
    return t(`plugin:window|is_closable`, { label: this.label });
  }
  async isVisible() {
    return t(`plugin:window|is_visible`, { label: this.label });
  }
  async title() {
    return t(`plugin:window|title`, { label: this.label });
  }
  async theme() {
    return t(`plugin:window|theme`, { label: this.label });
  }
  async isAlwaysOnTop() {
    return t(`plugin:window|is_always_on_top`, { label: this.label });
  }
  async activityName() {
    return t(`plugin:window|activity_name`, { label: this.label });
  }
  async sceneIdentifier() {
    return t(`plugin:window|scene_identifier`, { label: this.label });
  }
  async center() {
    return t(`plugin:window|center`, { label: this.label });
  }
  async requestUserAttention(e3) {
    let n2 = null;
    return e3 && (n2 = e3 === _.Critical ? { type: `Critical` } : { type: `Informational` }), t(`plugin:window|request_user_attention`, { label: this.label, value: n2 });
  }
  async setResizable(e3) {
    return t(`plugin:window|set_resizable`, { label: this.label, value: e3 });
  }
  async setEnabled(e3) {
    return t(`plugin:window|set_enabled`, { label: this.label, value: e3 });
  }
  async isEnabled() {
    return t(`plugin:window|is_enabled`, { label: this.label });
  }
  async setMaximizable(e3) {
    return t(`plugin:window|set_maximizable`, { label: this.label, value: e3 });
  }
  async setMinimizable(e3) {
    return t(`plugin:window|set_minimizable`, { label: this.label, value: e3 });
  }
  async setClosable(e3) {
    return t(`plugin:window|set_closable`, { label: this.label, value: e3 });
  }
  async setTitle(e3) {
    return t(`plugin:window|set_title`, { label: this.label, value: e3 });
  }
  async maximize() {
    return t(`plugin:window|maximize`, { label: this.label });
  }
  async unmaximize() {
    return t(`plugin:window|unmaximize`, { label: this.label });
  }
  async toggleMaximize() {
    return t(`plugin:window|toggle_maximize`, { label: this.label });
  }
  async minimize() {
    return t(`plugin:window|minimize`, { label: this.label });
  }
  async unminimize() {
    return t(`plugin:window|unminimize`, { label: this.label });
  }
  async show() {
    return t(`plugin:window|show`, { label: this.label });
  }
  async hide() {
    return t(`plugin:window|hide`, { label: this.label });
  }
  async close() {
    return t(`plugin:window|close`, { label: this.label });
  }
  async destroy() {
    return t(`plugin:window|destroy`, { label: this.label });
  }
  async setDecorations(e3) {
    return t(`plugin:window|set_decorations`, { label: this.label, value: e3 });
  }
  async setShadow(e3) {
    return t(`plugin:window|set_shadow`, { label: this.label, value: e3 });
  }
  async setEffects(e3) {
    return t(`plugin:window|set_effects`, { label: this.label, value: e3 });
  }
  async clearEffects() {
    return t(`plugin:window|set_effects`, { label: this.label, value: null });
  }
  async setAlwaysOnTop(e3) {
    return t(`plugin:window|set_always_on_top`, { label: this.label, value: e3 });
  }
  async setAlwaysOnBottom(e3) {
    return t(`plugin:window|set_always_on_bottom`, { label: this.label, value: e3 });
  }
  async setContentProtected(e3) {
    return t(`plugin:window|set_content_protected`, { label: this.label, value: e3 });
  }
  async setSize(e3) {
    return t(`plugin:window|set_size`, { label: this.label, value: e3 instanceof d ? e3 : new d(e3) });
  }
  async setMinSize(e3) {
    return t(`plugin:window|set_min_size`, { label: this.label, value: e3 instanceof d ? e3 : e3 ? new d(e3) : null });
  }
  async setMaxSize(e3) {
    return t(`plugin:window|set_max_size`, { label: this.label, value: e3 instanceof d ? e3 : e3 ? new d(e3) : null });
  }
  async setSizeConstraints(e3) {
    function n2(e4) {
      return e4 ? { Logical: e4 } : null;
    }
    return t(`plugin:window|set_size_constraints`, { label: this.label, value: { minWidth: n2(e3?.minWidth), minHeight: n2(e3?.minHeight), maxWidth: n2(e3?.maxWidth), maxHeight: n2(e3?.maxHeight) } });
  }
  async setPosition(e3) {
    return t(`plugin:window|set_position`, { label: this.label, value: e3 instanceof m ? e3 : new m(e3) });
  }
  async setFullscreen(e3) {
    return t(`plugin:window|set_fullscreen`, { label: this.label, value: e3 });
  }
  async setSimpleFullscreen(e3) {
    return t(`plugin:window|set_simple_fullscreen`, { label: this.label, value: e3 });
  }
  async setFocus() {
    return t(`plugin:window|set_focus`, { label: this.label });
  }
  async setFocusable(e3) {
    return t(`plugin:window|set_focusable`, { label: this.label, value: e3 });
  }
  async setIcon(e3) {
    return t(`plugin:window|set_icon`, { label: this.label, value: g(e3) });
  }
  async setSkipTaskbar(e3) {
    return t(`plugin:window|set_skip_taskbar`, { label: this.label, value: e3 });
  }
  async setCursorGrab(e3) {
    return t(`plugin:window|set_cursor_grab`, { label: this.label, value: e3 });
  }
  async setCursorVisible(e3) {
    return t(`plugin:window|set_cursor_visible`, { label: this.label, value: e3 });
  }
  async setCursorIcon(e3) {
    return t(`plugin:window|set_cursor_icon`, { label: this.label, value: e3 });
  }
  async setBackgroundColor(e3) {
    return t(`plugin:window|set_background_color`, { color: e3 });
  }
  async setCursorPosition(e3) {
    return t(`plugin:window|set_cursor_position`, { label: this.label, value: e3 instanceof m ? e3 : new m(e3) });
  }
  async setIgnoreCursorEvents(e3) {
    return t(`plugin:window|set_ignore_cursor_events`, { label: this.label, value: e3 });
  }
  async startDragging() {
    return t(`plugin:window|start_dragging`, { label: this.label });
  }
  async startResizeDragging(e3) {
    return t(`plugin:window|start_resize_dragging`, { label: this.label, value: e3 });
  }
  async setBadgeCount(e3) {
    return t(`plugin:window|set_badge_count`, { label: this.label, value: e3 });
  }
  async setBadgeLabel(e3) {
    return t(`plugin:window|set_badge_label`, { label: this.label, value: e3 });
  }
  async setOverlayIcon(e3) {
    return t(`plugin:window|set_overlay_icon`, { label: this.label, value: e3 ? g(e3) : void 0 });
  }
  async setProgressBar(e3) {
    return t(`plugin:window|set_progress_bar`, { label: this.label, value: e3 });
  }
  async setVisibleOnAllWorkspaces(e3) {
    return t(`plugin:window|set_visible_on_all_workspaces`, { label: this.label, value: e3 });
  }
  async setTitleBarStyle(e3) {
    return t(`plugin:window|set_title_bar_style`, { label: this.label, value: e3 });
  }
  async setTheme(e3) {
    return t(`plugin:window|set_theme`, { label: this.label, value: e3 });
  }
  async onResized(e3) {
    return this.listen(c.WINDOW_RESIZED, (t2) => {
      t2.payload = new u(t2.payload), e3(t2);
    });
  }
  async onMoved(e3) {
    return this.listen(c.WINDOW_MOVED, (t2) => {
      t2.payload = new p(t2.payload), e3(t2);
    });
  }
  async onCloseRequested(e3) {
    return this.listen(c.WINDOW_CLOSE_REQUESTED, async (t2) => {
      let n2 = new v(t2);
      await e3(n2), n2.isPreventDefault() || await this.destroy();
    });
  }
  async onDragDropEvent(e3) {
    let t2 = await this.listen(c.DRAG_ENTER, (t3) => {
      e3({ ...t3, payload: { type: `enter`, paths: t3.payload.paths, position: new p(t3.payload.position) } });
    }), n2 = await this.listen(c.DRAG_OVER, (t3) => {
      e3({ ...t3, payload: { type: `over`, position: new p(t3.payload.position) } });
    }), r2 = await this.listen(c.DRAG_DROP, (t3) => {
      e3({ ...t3, payload: { type: `drop`, paths: t3.payload.paths, position: new p(t3.payload.position) } });
    }), i2 = await this.listen(c.DRAG_LEAVE, (t3) => {
      e3({ ...t3, payload: { type: `leave` } });
    });
    return () => {
      t2(), r2(), n2(), i2();
    };
  }
  async onFocusChanged(e3) {
    let t2 = await this.listen(c.WINDOW_FOCUS, (t3) => {
      e3({ ...t3, payload: true });
    }), n2 = await this.listen(c.WINDOW_BLUR, (t3) => {
      e3({ ...t3, payload: false });
    });
    return () => {
      t2(), n2();
    };
  }
  async onScaleChanged(e3) {
    return this.listen(c.WINDOW_SCALE_FACTOR_CHANGED, e3);
  }
  async onThemeChanged(e3) {
    return this.listen(c.WINDOW_THEME_CHANGED, e3);
  }
}, w;
(function(e3) {
  e3.Disabled = `disabled`, e3.Throttle = `throttle`, e3.Suspend = `suspend`;
})(w ||= {});
var T;
(function(e3) {
  e3.Default = `default`, e3.FluentOverlay = `fluentOverlay`;
})(T ||= {});
var E;
(function(e3) {
  e3.AppearanceBased = `appearanceBased`, e3.Light = `light`, e3.Dark = `dark`, e3.MediumLight = `mediumLight`, e3.UltraDark = `ultraDark`, e3.Titlebar = `titlebar`, e3.Selection = `selection`, e3.Menu = `menu`, e3.Popover = `popover`, e3.Sidebar = `sidebar`, e3.HeaderView = `headerView`, e3.Sheet = `sheet`, e3.WindowBackground = `windowBackground`, e3.HudWindow = `hudWindow`, e3.FullScreenUI = `fullScreenUI`, e3.Tooltip = `tooltip`, e3.ContentBackground = `contentBackground`, e3.UnderWindowBackground = `underWindowBackground`, e3.UnderPageBackground = `underPageBackground`, e3.Mica = `mica`, e3.Blur = `blur`, e3.Acrylic = `acrylic`, e3.Tabbed = `tabbed`, e3.TabbedDark = `tabbedDark`, e3.TabbedLight = `tabbedLight`;
})(E ||= {});
var D;
(function(e3) {
  e3.FollowsWindowActiveState = `followsWindowActiveState`, e3.Active = `active`, e3.Inactive = `inactive`;
})(D ||= {});
async function O(e3) {
  await t(`plugin:drpc|spawn_thread`, { id: e3 });
}
async function k() {
  await t(`plugin:drpc|destroy_thread`);
}
async function A() {
  return await t(`plugin:drpc|is_running`);
}
async function j(e3) {
  await M(), await O(e3);
}
async function M() {
  await A() && await k();
}
async function N(e3) {
  await t(`plugin:drpc|set_activity`, { activityJson: e3.toString() });
}
var P = class {
  start;
  end;
  constructor(e3, t2) {
    this.start = e3, this.end = t2;
  }
}, F = class {
  large_image;
  large_text;
  small_image;
  small_text;
  setLargeImage(e3) {
    return this.large_image = e3, this;
  }
  setLargeText(e3) {
    return this.large_text = e3, this;
  }
  setSmallImage(e3) {
    return this.small_image = e3, this;
  }
  setSmallText(e3) {
    return this.small_text = e3, this;
  }
}, I = class {
  label;
  url;
  constructor(e3, t2) {
    this.label = e3, this.url = t2;
  }
}, L = class {
  state;
  details;
  timestamps;
  party;
  assets;
  secrets;
  buttons;
  activity_type;
  setState(e3) {
    return this.state = e3, this;
  }
  setDetails(e3) {
    return this.details = e3, this;
  }
  setTimestamps(e3) {
    return this.timestamps = e3, this;
  }
  setParty(e3) {
    return this.party = e3, this;
  }
  setAssets(e3) {
    return this.assets = e3, this;
  }
  setSecrets(e3) {
    return this.secrets = e3, this;
  }
  setButton(e3) {
    return this.buttons = e3, this;
  }
  setActivity(e3) {
    return this.activity_type = e3, this;
  }
  toString() {
    return JSON.stringify(this);
  }
}, R = b(), z = { fullScreenStatus: false, fullScreen: async () => await z.isFullscreen() ? z.exitFullscreen() : z.enterFullscreen(), isFullscreen: () => z.fullScreenStatus, enterFullscreen: async () => (z.fullScreenStatus = true, R.setFullscreen(true)), exitFullscreen: async () => (z.fullScreenStatus = false, R.setFullscreen(false)), center: async () => R.center(), setSize: async (e3, t2) => await R.isMaximized() || await z.isFullscreen() ? false : R.setSize(new l(Number(e3), Number(t2))), openDevTools: async () => t(`open_devtools`), ipcRenderer: { send: async function(e3, ...t2) {
  switch (e3) {
    case `e_isFullScreen`:
      return z.isFullscreen();
    case `e_fullScreen`:
      return z.fullScreen();
    case `e_window`:
      return z.exitFullscreen();
    case `e_quit`:
      return R.close();
    case `e_center`:
      return z.center();
    case `e_setSize`:
      return z.setSize(t2[0], t2[1]);
    case `e_openDevTools`:
      return z.openDevTools();
    case `e_openURL`:
      return z.shell.openExternal(t2[0]);
  }
}, sendSync: function(e3, t2) {
  switch (e3) {
    case `e_isFullScreen`:
      return z.isFullscreen();
  }
}, on: function(e3, t2) {
} }, shell: { openExternal: async function(e3) {
  return r(e3);
} } }, B = new F().setLargeImage(`pvzge_logo`).setLargeText(`PvZ2 Gardendless`).setSmallImage(`pvzge_logo`).setSmallText(`PvZ2 Gardendless`), V = new L().setButton([new I(`Download`, `https://pvzge.com`), new I(`Join Server`, `https://discord.gg/ZEfb2tBQFW`)]).setDetails(`Playing version 0.14.0`).setAssets(B).setTimestamps(new P(Date.now())), updateActivity = async (e3, t2 = ``) => {
  V.setState(e3), t2 && V.setDetails(t2), await N(V);
};
await j(`1354392876724785243`), await N(V), window.electron = z;
export {
  updateActivity
};
