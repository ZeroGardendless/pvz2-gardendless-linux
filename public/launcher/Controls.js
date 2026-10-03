/** The native select remains the form's source of truth; its menu is enhanced locally. */
export function installControls(root = document) {
    let sequence = 0, open = null, search = '', searchTimer;
    const controls = new Map();
    const close = (focus = false) => {
        if (!open) return;
        const { button, menu } = open;
        button.setAttribute('aria-expanded', 'false');
        button.removeAttribute('aria-activedescendant');
        menu.remove(); open = null;
        if (focus && button.isConnected) button.focus();
    };
    function sync() {
        for (const [select, button] of controls) {
            if (!select.isConnected) { if (open?.select === select) close(); controls.delete(select); continue; }
            if (button.disabled !== select.disabled) button.disabled = select.disabled;
            const label = select.selectedOptions[0]?.textContent || 'Choose…';
            if (button.firstChild.textContent !== label) button.firstChild.textContent = label;
        }
        for (const select of root.querySelectorAll('select:not([data-enhanced])')) {
            select.dataset.enhanced = 'true';
            const button = document.createElement('button');
            button.type = 'button'; button.className = 'select-control';
            button.setAttribute('role', 'combobox');
            button.setAttribute('aria-haspopup', 'listbox');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `select-menu-${++sequence}`);
            const label = select.closest('label');
            button.setAttribute('aria-label', select.getAttribute('aria-label') ||
                [...(label?.childNodes || [])].filter(node => node !== select).map(node => node.textContent).join(' ').trim() || select.name || 'Choose an option');
            button.append(document.createElement('span'));
            const arrow = document.createElement('span'); arrow.className = 'select-arrow'; arrow.setAttribute('aria-hidden', 'true'); button.append(arrow);
            select.after(button); select.hidden = true; select.tabIndex = -1;
            controls.set(select, button);
            button.firstChild.textContent = select.selectedOptions[0]?.textContent || 'Choose…'; if (button.disabled !== select.disabled) button.disabled = select.disabled;
            button.addEventListener('click', () => open?.select === select ? close(true) : show(select, button));
            button.addEventListener('keydown', event => key(event, select, button));
        }
    }
    function highlight(index) {
        if (!open) return;
        const options = [...open.menu.children];
        if (!options.length) return;
        open.index = (index + options.length) % options.length;
        options.forEach((item, i) => item.classList.toggle('focused', i === open.index));
        open.button.setAttribute('aria-activedescendant', options[open.index].id);
        const item = options[open.index];
        if (item.offsetTop < open.menu.scrollTop) open.menu.scrollTop = item.offsetTop;
        else if (item.offsetTop + item.offsetHeight > open.menu.scrollTop + open.menu.clientHeight) open.menu.scrollTop = item.offsetTop + item.offsetHeight - open.menu.clientHeight;
    }
    function choose(index) {
        if (!open) return;
        const { select, button, options } = open;
        select.value = options[index].value;
        close(true);
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        if (button.isConnected) sync();
    }
    function show(select, button) {
        close(); search = '';
        const options = [...select.options].filter(option => !option.disabled && !option.hidden);
        if (select.disabled || !options.length) return;
        const menu = document.createElement('div'); menu.className = 'select-menu'; menu.id = button.getAttribute('aria-controls');
        menu.setAttribute('role', 'listbox'); menu.setAttribute('aria-label', button.getAttribute('aria-label'));
        options.forEach((option, index) => {
            const item = document.createElement('div'); item.className = 'select-option'; item.id = `${menu.id}-${index}`;
            item.setAttribute('role', 'option'); item.setAttribute('aria-selected', String(option.selected)); item.textContent = option.textContent;
            item.addEventListener('pointerdown', event => event.preventDefault());
            item.addEventListener('click', () => choose(index)); menu.append(item);
        });
        // A modal dialog has its own top layer; keep its menu in that layer too.
        (button.closest('dialog') || document.body).append(menu);
        const rect = button.getBoundingClientRect();
        const height = Math.min(320, Math.max(120, innerHeight - 24));
        const below = innerHeight - rect.bottom - 12;
        menu.style.width = `${Math.min(Math.max(rect.width, 220), innerWidth - 24)}px`;
        menu.style.left = `${Math.max(12, Math.min(rect.left, innerWidth - parseFloat(menu.style.width) - 12))}px`;
        const down = below >= Math.min(height, 180);
        menu.style.maxHeight = `${Math.max(80, Math.min(height, down ? below : rect.top - 12))}px`;
        if (down) menu.style.top = `${rect.bottom + 6}px`;
        else menu.style.bottom = `${innerHeight - rect.top + 6}px`;
        open = { select, button, menu, options, index: Math.max(0, options.findIndex(option => option.selected)) };
        button.setAttribute('aria-expanded', 'true'); highlight(open.index);
    }
    function key(event, select, button) {
        if (event.key === 'Escape') { if (open) { event.preventDefault(); event.stopPropagation(); close(true); } return; }
        if (event.key === 'Tab') { close(); return; }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
            event.preventDefault(); event.stopPropagation();
            if (open?.select !== select) { show(select, button); return; }
            if (event.key === 'Enter' || event.key === ' ') choose(open.index);
            else highlight(event.key === 'Home' ? 0 : event.key === 'End' ? open.options.length - 1 : open.index + (event.key === 'ArrowUp' ? -1 : 1));
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            if (open?.select !== select) show(select, button);
            if (!open) return;
            search += event.key.toLowerCase(); clearTimeout(searchTimer); searchTimer = setTimeout(() => { search = ''; }, 600);
            const index = open.options.findIndex(option => option.textContent.trim().toLowerCase().startsWith(search));
            if (index >= 0) highlight(index);
        }
    }
    root.addEventListener('pointerdown', event => {
        if (open && !open.menu.contains(event.target) && !open.button.contains(event.target)) close();
        const button = event.target.closest('button:not(:disabled), a.button');
        if (!button || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = button.getBoundingClientRect(), ripple = document.createElement('span');
        ripple.className = 'press-ripple'; ripple.setAttribute('aria-hidden', 'true');
        const size = Math.max(rect.width, rect.height) * 2;
        Object.assign(ripple.style, { width: `${size}px`, height: `${size}px`, left: `${event.clientX - rect.left - size / 2}px`, top: `${event.clientY - rect.top - size / 2}px` });
        button.append(ripple); ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        setTimeout(() => ripple.remove(), 700);
    }, true);
    root.addEventListener('change', sync);
    root.addEventListener('scroll', event => { if (open && !open.menu.contains(event.target)) close(); }, true);
    window.addEventListener('resize', () => close());
    const observer = new MutationObserver(sync);
    observer.observe(root.body || root, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
    sync();
}
