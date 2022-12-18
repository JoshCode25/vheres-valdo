
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function createTimer() {

        const timer = writable({
            initialTime: 30,
            score: 0,
            highScore: 10,
            remainingTime: 30,
            remainingPercent: 100,
            timerHasBeenSet: false,
            timerActive: false,
            updateRemainingPercent() {
                this.remainingPercent = Math.round(this.remainingTime/this.initialTime*100);
            },
            resetScore() {
                this.score = 0;
            },
            resetTime() {
                this.remainingTime = this.initialTime;
                this.updateRemainingPercent();
            }
        });

    	return {
            subscribe: timer.subscribe,
            setTimerActive: () => timer.update(o => {
                o.timerActive = true;
                return o;
            }),
            setTimerInactive: () => timer.update(o => {
                o.timerActive = false;
                return o;
            }),
            setInitialTime: (initialTime) => timer.update(o => {
                o.initialTime = initialTime;
                o.remainingTime = initialTime;
                return o;
            }),
    		incrementTime: (delta) => timer.update(o => {
                o.remainingTime = o.remainingTime + delta;
                o.updateRemainingPercent();
                return o;
            }),
            decrementTime: (delta) => timer.update(o => {
                o.remainingTime = o.remainingTime - delta;
                o.updateRemainingPercent();
                return o;
            }),
            resetGame: () => timer.update(o => {
                o.resetScore();
                o.resetTime();
                return o;
            }),
            increaseScore: (delta) => timer.update(o => {
                o.score = o.score + delta;
                return o;
            }),
            setHighscore: (score) => timer.update(o => {
                o.highScore = score;
                return o;
            })
    	};
    }

    const gameTimer = createTimer();

    /* src\TimerBar.svelte generated by Svelte v3.53.0 */
    const file$9 = "src\\TimerBar.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "timerBar svelte-1wamyou");
    			add_location(div0, file$9, 28, 2, 929);
    			attr_dev(div1, "class", "timerBarWrapper svelte-1wamyou");
    			attr_dev(div1, "style", /*timerBarStyle*/ ctx[0]);
    			add_location(div1, file$9, 27, 0, 874);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*timerBarStyle*/ 1) {
    				attr_dev(div1, "style", /*timerBarStyle*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let timerBarStyle;
    	let $gameTimer;
    	validate_store(gameTimer, 'gameTimer');
    	component_subscribe($$self, gameTimer, $$value => $$invalidate(2, $gameTimer = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TimerBar', slots, []);
    	let timerBarColorList = ['green', 'orange', 'red'];
    	let timerBarColor = timerBarColorList[0];
    	let greenPercentage = 50;
    	let orangePercentage = 10;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TimerBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameTimer,
    		timerBarColorList,
    		timerBarColor,
    		greenPercentage,
    		orangePercentage,
    		timerBarStyle,
    		$gameTimer
    	});

    	$$self.$inject_state = $$props => {
    		if ('timerBarColorList' in $$props) $$invalidate(3, timerBarColorList = $$props.timerBarColorList);
    		if ('timerBarColor' in $$props) $$invalidate(1, timerBarColor = $$props.timerBarColor);
    		if ('greenPercentage' in $$props) $$invalidate(4, greenPercentage = $$props.greenPercentage);
    		if ('orangePercentage' in $$props) $$invalidate(5, orangePercentage = $$props.orangePercentage);
    		if ('timerBarStyle' in $$props) $$invalidate(0, timerBarStyle = $$props.timerBarStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$gameTimer, timerBarColor*/ 6) {
    			if ($gameTimer.remainingPercent >= greenPercentage && timerBarColor !== timerBarColorList[0]) {
    				$$invalidate(1, timerBarColor = timerBarColorList[0]);
    			} else if ($gameTimer.remainingPercent < greenPercentage && timerBarColor !== timerBarColorList[1]) {
    				$$invalidate(1, timerBarColor = timerBarColorList[1]);
    			} else if ($gameTimer.remainingPercent < orangePercentage && timerBarColor !== timerBarColorList[2]) {
    				$$invalidate(1, timerBarColor = timerBarColorList[2]);
    			}
    		}

    		if ($$self.$$.dirty & /*$gameTimer, timerBarColor*/ 6) {
    			$$invalidate(0, timerBarStyle = `--width: ${$gameTimer.remainingPercent}%; --background-color: ${timerBarColor}`);
    		}
    	};

    	return [timerBarStyle, timerBarColor, $gameTimer];
    }

    class TimerBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TimerBar",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const skinPalette = [
      //from https://huebliss.com/skin-color-code/
      {
        name: 'Brown',
        hex: '8d5524',
        rgb: [141, 85, 36],
        cmyk: [0, 40, 74, 45],
        hsb: [28, 74, 55],
        hsl: [28, 59, 35],
        lab: [42, 19, 37],
      },
      {
        name: 'Bronze',
        hex: 'c68642',
        rgb: [198, 134, 66],
        cmyk: [0, 32, 67, 22],
        hsb: [31, 67, 78],
        hsl: [31, 54, 52],
        lab: [61, 18, 46],
      },
      {
        name: 'Earth Yellow',
        hex: 'e0ac69',
        rgb: [224, 172, 105],
        cmyk: [0, 23, 53, 12],
        hsb: [34, 53, 88],
        hsl: [34, 66, 65],
        lab: [74, 11, 42],
      },
      {
        name: 'Gold Crayola',
        hex: 'f1c27d',
        rgb: [241, 194, 125],
        cmyk: [0, 20, 48, 5],
        hsb: [36, 48, 95],
        hsl: [36, 81, 72],
        lab: [81, 8, 41],
      },
      {
        name: 'Deep Champagne',
        hex: 'ffdbac',
        rgb: [255, 219, 172],
        cmyk: [0, 14, 33, 0],
        hsb: [34, 33, 100],
        hsl: [34, 100, 84],
        lab: [89, 6, 28],
      },
    ];

    const femaleNames = [
      'Anibrev',
      'Bakinaw',
      'Calibrew',
      'Deknure',
      'Elimoore',
      'Farigraph',
      'Ge',
      'Hanifred',
      'Indigo',
      'Jerepass',
      'Kekanumatonadoe',
      'Lilu',
      'Mavito',
      'Neen',
      'Oi',
      'Prespinta',
      'Q',
      'Reshira',
      'Sariphone',
      'Tavisha',
      'Umpturmass',
      'Variphore',
      'Wiltmoore',
      'Xythe',
      'Yershig',
      'Zashima',
    ];

    const maleNames = [
      'Adrik',
      'Baboi',
      'Cra',
      'Dartrik',
      'Edgrene',
      'Ferdinhand',
      'Greaseinhamworth',
      'Hue',
      'Intison',
      'Jurst',
      'Kwekrish',
      'Limast',
      'Markwin',
      'Nerdinand',
      'Ogredin',
      'Petegrismik',
      'Questbrink',
      'Rhestoromor',
      'Stagrtire',
      'Tiv',
      'U',
      'Valdo',
      'Workwillmingtonham',
      'Xyther',
      'Yassy',
      'Zeriford',
    ];

    const lastNames = [
      'Acre',
      'Adathming',
      'Brinkbronk',
      'Bro',
      'Cascade',
      'Crustler',
      'Dynamrick',
      'Dustoshelf',
      'Elison',
      'Eghsk',
      'Fsark',
      'Fi',
      'Gershandermind',
      'Grint',
      'Hinkminghan',
      'Hunkertonmore',
      'I',
      'Ishmihash',
      'Jrush',
      'Jergo',
      'Klimpkly',
      'Ktuse',
      'Lalilome',
      'Lwaliluke',
      'Madders',
      'Mintma',
      'Naftorafti',
      'Nertmew',
      'Oithyou',
      'Ohgruq',
      'Pepp',
      'Poi',
      'Qwertikeytab',
      'Quibsta',
      'Rickruck',
      'Rhy',
      'Salvisious',
      'Slide',
      'Tumpterton',
      'To',
      'Udgee',
      'Uthergriv',
      'Valdo',
      'Vestiz',
      'Westoip',
      'Wringrij',
      'XL',
      'Xerximars',
      'Yashrima',
      'Yupe',
      'Zawkimoh',
      'Zcrievklmas',
    ];

    const greetings = [
      'Hey',
      'Heru',
      'Yersh',
      'Yupsle',
      'Ye-Yers',
      'Heha',
      'Yo',
      'Hi',
      'Sup',
      "So'up",
      'Wa-hey',
      'Ye bop',
      'Greetings',
      "Y'all",
      'Hio',
      'Wowa',
    ];

    const correctResponses = [
      'You got me!',
      'Here I am!',
      'What a find!',
      'I thought I was gonna get you on that one',
      "How'd you know it was me?",
      'No hiding the wool over your eyes',
      'That hiding spot usually works',
      'Good eye!',
      'Looks like you can still see the trees in the forest',
      "Are you sure I'm the one? ... Yeah it's me",
      'Do you have time to find another?',
      "I knew I should've picked a different spot!",
      'Aww Rat-paste! You win!',
      "I think I'll use my invisibility cloak next time",
      'Wait, you got me already?',
      'It takes two to tango but just you to find me',
      "Okay, I'm the one",
      "Yep, it's me!",
      'Uh-huh, pat yourself on the back',
      "Correct, but don't get too full of yourself",
      'The next one will be more difficult!',
    ];

    const incorrectResponses = [
      'Not today',
      "You best be tryin' again",
      "I don't look anything like them!",
      'Negative, nope, nada!',
      "I'm trying to read over here!",
      "I'd ask you to help find my phone, but I think I need someone a little bit more skilled in the finding arena",
      'Haha, nope!',
      'Try again friend!',
      'Was that your final answer?',
      'Maybe next time',
      "Don't quit your day job - or night if you've got that shift",
      "I'm flattered you confused me with the real Valdo",
      'You fell for my clever disguise! Try again!',
      "You're still it!",
      'Keep trying',
      'Pick another',
      'Have you seen my wallet?',
      'Are you the one who took my ice cream?',
      'The longer I look at the sun, the darker everything gets',
      'Sorry, I was day dreaming - try again',
      'I think they got it wrong, try me again!',
      'Ewww! When was the last time you washed your hands?',
      "Here's some more points - wait, nevermind",
      "The timer's gonna keep ticking!",
      'That tickled! No points for you!',
      'Nope',
      'Zilch',
      'Nada',
      'Nuh-uh',
      'No no no no',
      'Not me!',
      'Nopers',
      'Negatory',
      'Sorry, wrong one!',
      "I hate to disappoint you, but I'm not who you're looking for",
      'Noooooooope!',
      'Nah no Nah Nah!',
      'Um... no',
      'What day is it?',
      'Are you allergic to incorrect answers?',
      'Not a perfect score for you, but you can try again',
    ];

    function getRandomValdoList() {
      //loosely randomizes names, greetings, and responses
      let shuffledFemaleNames = femaleNames.slice().sort(() => Math.random() - 0.5);
      let shuffledMaleNames = maleNames.slice().sort(() => Math.random() - 0.5);
      let shuffledLastNames = lastNames.slice().sort(() => Math.random() - 0.5);
      let shuffledGreetings = greetings.slice().sort(() => Math.random() - 0.5);
      let shuffledCorrectResponses = correctResponses
        .slice()
        .sort(() => Math.random() - 0.5);
      let shuffledIncorrectResponses = incorrectResponses
        .slice()
        .sort(() => Math.random() - 0.5);

      let femaleList = shuffledFemaleNames.map((name, i) => {
        let femaleValdo = {
          firstName: name,
          lastName: shuffledLastNames[i],
          greeting: shuffledGreetings[i % shuffledGreetings.length],
          fullName: `${name} ${shuffledLastNames[i]}`,
          gender: 'female',
          correctResponse:
            shuffledCorrectResponses[i % shuffledCorrectResponses.length],
          incorrectResponse:
            shuffledIncorrectResponses[i % shuffledIncorrectResponses.length],
          skinTone: '#' + skinPalette[i % skinPalette.length].hex,
        };

        return femaleValdo;
      });

      let maleList = shuffledMaleNames.map((name, i) => {
        let maleValdo = {
          firstName: name,
          lastName: shuffledLastNames[i],
          greeting: shuffledGreetings[i % shuffledGreetings.length],
          fullName: `${name} ${shuffledLastNames[i]}`,
          gender: 'male',
          correctResponse:
            shuffledCorrectResponses[i % shuffledCorrectResponses.length],
          incorrectResponse:
            shuffledIncorrectResponses[i % shuffledIncorrectResponses.length],
          skinTone: '#' + skinPalette[i % skinPalette.length].hex,
        };

        return maleValdo;
      });

      let randomList = [...femaleList, ...maleList].sort(() => Math.random - 0.5);

      return randomList;
    }

    let valdoList = getRandomValdoList();

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function createValdoStore() {

        const valdoStore = writable({
            totalValdoList: valdoList,
            netValdoList: valdoList,
            activeValdo: {},
            displayedValdos: [],
            minDisplayedValdoNumber: 4,
            foundValdos: [],
            activatedGame: false,
            shuffleNetValdoList() {
                let shuffledNetValdoList = shuffleArray(this.netValdoList.slice());
                this.netValdoList = shuffledNetValdoList;
            },
            setActiveValdo() {
                //pick a random Valdo from the displayed to be the active/searched for Valdo
                this.activeValdo = this.displayedValdos[Math.floor(Math.random()*this.displayedValdos.length)];
            },
            setDisplayedValdos() {
                //shuffle netValdoList and reset the displayed and active Valdos
                this.shuffleNetValdoList();
                let newDisplayedValdos = this.netValdoList.slice(0, 2*this.foundValdos.length + this.minDisplayedValdoNumber);
                this.displayedValdos = newDisplayedValdos;
                this.setActiveValdo();
            },
            addFoundValdo() {
                //find and remove found Valdo from netList to prevent duplicates
                let activeIndex = this.netValdoList.findIndex(valdo => valdo.fullName === this.activeValdo.fullName);
                if (activeIndex !== -1) {
                    let foundValdo = this.netValdoList.splice(activeIndex, 1);
                    this.foundValdos = [...this.foundValdos, foundValdo];
                    this.setDisplayedValdos();
                    return
                }
                console.log(this.activeValdo, activeIndex);
            },
        });

        return {
            subscribe: valdoStore.subscribe,
            startNewGame: () => valdoStore.update(o => {
                o.activatedGame = true;
                o.foundValdos.length = 0;
                o.setDisplayedValdos();
                console.log(o);
                return o;
            }),
            startNewRound: () => valdoStore.update(o => {
                o.addFoundValdo();
                return o;
            }),
            finishGame: () => valdoStore.update(o => {
                o.activatedGame = false;
                o.totalValdoList = getRandomValdoList();
                o.netValdoList = o.totalValdoList;
                return o;
            })

        }
    }

    const valdoStore = createValdoStore();

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    function getPointDist(point1, point2) {
      return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
      );
    }

    //receives two points and returns the distances between them broken into x-y components
    function getPointDeltaAngle(startPoint, endPoint) {
      let {x:startX, y:startY} = startPoint;
      let {x:endX, y:endY} = endPoint;
      let deltaX = endX - startX;
      let deltaY = endY - startY;
      let angleToHoriz = Math.atan(deltaY / deltaX);
      let pointDeltas = {
        x: endX - startX,
        y: endY - startY,
        angleToHoriz: angleToHoriz
      };
      return pointDeltas;
    }

    let colorList = [
      {
        name: 'Vivid Sky Blue',
        hex: '5ad2f4',
        rgb: [90, 210, 244],
        cmyk: [63, 14, 0, 4],
        hsb: [193, 63, 96],
        hsl: [193, 88, 65],
        lab: [79, -24, -27],
      },
      {
        name: 'Rebecca Purple',
        hex: '6e2594',
        rgb: [110, 37, 148],
        cmyk: [26, 75, 0, 42],
        hsb: [279, 75, 58],
        hsl: [279, 60, 36],
        lab: [31, 50, -47],
      },
      {
        name: 'Minion Yellow',
        hex: 'ecd444',
        rgb: [236, 212, 68],
        cmyk: [0, 10, 71, 7],
        hsb: [51, 71, 93],
        hsl: [51, 82, 60],
        lab: [85, -7, 70],
      },
      {
        name: 'Blue Crayola',
        hex: '2176ff',
        rgb: [33, 118, 255],
        cmyk: [87, 54, 0, 0],
        hsb: [217, 87, 100],
        hsl: [217, 100, 56],
        lab: [52, 26, -75],
      },
      {
        name: 'Brick Red',
        hex: 'd1495b',
        rgb: [209, 73, 91],
        cmyk: [0, 65, 56, 18],
        hsb: [352, 65, 82],
        hsl: [352, 60, 55],
        lab: [51, 55, 19],
      },
      {
        name: 'Asparagus',
        hex: '87a878',
        rgb: [135, 168, 120],
        cmyk: [20, 0, 29, 34],
        hsb: [101, 29, 66],
        hsl: [101, 22, 56],
        lab: [65, -20, 21],
      },
      {
        name: 'Onyx',
        hex: '32373b',
        rgb: [50, 55, 59],
        cmyk: [15, 7, 0, 77],
        hsb: [207, 15, 23],
        hsl: [207, 8, 21],
        lab: [23, -1, -3],
      },
      {
        name: 'Tea Green',
        hex: 'dbf9b8',
        rgb: [219, 249, 184],
        cmyk: [12, 0, 26, 2],
        hsb: [88, 26, 98],
        hsl: [88, 84, 85],
        lab: [94, -21, 28],
      },
      {
        name: 'Vivid Tangerine',
        hex: 'eb9486',
        rgb: [235, 148, 134],
        cmyk: [0, 37, 43, 8],
        hsb: [8, 43, 92],
        hsl: [8, 72, 72],
        lab: [70, 31, 21],
      },
      {
        name: 'Khaki Web',
        hex: 'cab7a2',
        rgb: [202, 183, 162],
        cmyk: [0, 9, 20, 21],
        hsb: [32, 20, 79],
        hsl: [32, 27, 71],
        lab: [75, 3, 13],
      },
      {
        name: 'Magenta',
        hex: 'f038ff',
        rgb: [240, 56, 255],
        cmyk: [6, 78, 0, 0],
        hsb: [295, 78, 100],
        hsl: [295, 100, 61],
        lab: [60, 88, -61],
      },
      {
        name: 'Cyclamen',
        hex: 'ef709d',
        rgb: [239, 112, 157],
        cmyk: [0, 53, 34, 6],
        hsb: [339, 53, 94],
        hsl: [339, 80, 69],
        lab: [64, 53, -1],
      },
      {
        name: 'Granny Smith Apple',
        hex: 'c7f2a7',
        rgb: [199, 242, 167],
        cmyk: [18, 0, 31, 5],
        hsb: [94, 31, 95],
        hsl: [94, 74, 80],
        lab: [91, -27, 32],
      },
    ];
    function createValdoApparelColorList(colorList) {
      let doubledColorList = [...colorList, ...colorList];

      let alphabet = 'abcdefghijklmnopqrstuvwxyz';

      let shuffledAlphabet = alphabet.split('').sort(() => Math.random() - 0.5);

      let valdoApparelColors = doubledColorList.reduce(
        (compiledColorObject, colorData, i) => {
          compiledColorObject[shuffledAlphabet[i]] = `#${colorData.hex}`;
          return compiledColorObject;
        },
        {}
      );

      return valdoApparelColors;
    }

    let valdoApparelColorList = createValdoApparelColorList(colorList);
    console.log(valdoApparelColorList);

    const valdoApparelColorStore = readable(
      {
        apparelColorList: valdoApparelColorList,
        apparelLengths: [3, 10],
        sleevePantLength: 0.85,
        apparelThickness: 4,
      },
      (set) => {
        return () => {};
      }
    );

    console.log(valdoApparelColorStore);

    /* src\Valdo\ValdoArm.svelte generated by Svelte v3.53.0 */

    const { console: console_1$1 } = globals;
    const file$8 = "src\\Valdo\\ValdoArm.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (117:0) {#if isSleeve}
    function create_if_block_1$3(ctx) {
    	let path;
    	let path_id_value;
    	let path_stroke_width_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "id", path_id_value = `${/*fullName*/ ctx[3]}${/*armType*/ ctx[4]}sleeve`);
    			attr_dev(path, "d", /*sleevePath*/ ctx[6]);
    			attr_dev(path, "stroke", /*sleeveColor*/ ctx[12]);
    			attr_dev(path, "stroke-width", path_stroke_width_value = /*$valdoApparelColorStore*/ ctx[7].apparelThickness * /*limbThickness*/ ctx[1]);
    			attr_dev(path, "class", "svelte-1k8lj6w");
    			add_location(path, file$8, 117, 2, 4187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fullName, armType*/ 24 && path_id_value !== (path_id_value = `${/*fullName*/ ctx[3]}${/*armType*/ ctx[4]}sleeve`)) {
    				attr_dev(path, "id", path_id_value);
    			}

    			if (dirty & /*sleevePath*/ 64) {
    				attr_dev(path, "d", /*sleevePath*/ ctx[6]);
    			}

    			if (dirty & /*$valdoApparelColorStore, limbThickness*/ 130 && path_stroke_width_value !== (path_stroke_width_value = /*$valdoApparelColorStore*/ ctx[7].apparelThickness * /*limbThickness*/ ctx[1])) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(117:0) {#if isSleeve}",
    		ctx
    	});

    	return block;
    }

    // (125:0) {#if displayDots}
    function create_if_block$5(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*pointList*/ ctx[8];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*point*/ ctx[25].x;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pointNames, pointList, armType, headDiameter*/ 785) {
    				each_value = /*pointList*/ ctx[8];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(125:0) {#if displayDots}",
    		ctx
    	});

    	return block;
    }

    // (126:2) {#each pointList as point, i (point.x)}
    function create_each_block$2(key_1, ctx) {
    	let circle;
    	let circle_id_value;
    	let circle_r_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "id", circle_id_value = /*pointNames*/ ctx[9][/*i*/ ctx[27]] + /*armType*/ ctx[4]);
    			attr_dev(circle, "cx", /*point*/ ctx[25].x);
    			attr_dev(circle, "cy", /*point*/ ctx[25].y);
    			attr_dev(circle, "r", circle_r_value = /*headDiameter*/ ctx[0] / 4);
    			add_location(circle, file$8, 126, 4, 4435);
    			this.first = circle;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*armType*/ 16 && circle_id_value !== (circle_id_value = /*pointNames*/ ctx[9][/*i*/ ctx[27]] + /*armType*/ ctx[4])) {
    				attr_dev(circle, "id", circle_id_value);
    			}

    			if (dirty & /*headDiameter*/ 1 && circle_r_value !== (circle_r_value = /*headDiameter*/ ctx[0] / 4)) {
    				attr_dev(circle, "r", circle_r_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(126:2) {#each pointList as point, i (point.x)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let path;
    	let path_id_value;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let if_block0 = /*isSleeve*/ ctx[11] && create_if_block_1$3(ctx);
    	let if_block1 = /*displayDots*/ ctx[5] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(path, "id", path_id_value = `${/*fullName*/ ctx[3]}${/*armType*/ ctx[4]}arm`);
    			attr_dev(path, "d", /*armPath*/ ctx[10]);
    			attr_dev(path, "stroke", /*skinTone*/ ctx[2]);
    			attr_dev(path, "stroke-width", /*limbThickness*/ ctx[1]);
    			attr_dev(path, "class", "svelte-1k8lj6w");
    			add_location(path, file$8, 110, 0, 4055);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fullName, armType*/ 24 && path_id_value !== (path_id_value = `${/*fullName*/ ctx[3]}${/*armType*/ ctx[4]}arm`)) {
    				attr_dev(path, "id", path_id_value);
    			}

    			if (dirty & /*skinTone*/ 4) {
    				attr_dev(path, "stroke", /*skinTone*/ ctx[2]);
    			}

    			if (dirty & /*limbThickness*/ 2) {
    				attr_dev(path, "stroke-width", /*limbThickness*/ ctx[1]);
    			}

    			if (/*isSleeve*/ ctx[11]) if_block0.p(ctx, dirty);

    			if (/*displayDots*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $valdoApparelColorStore;
    	validate_store(valdoApparelColorStore, 'valdoApparelColorStore');
    	component_subscribe($$self, valdoApparelColorStore, $$value => $$invalidate(7, $valdoApparelColorStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValdoArm', slots, []);
    	let { shoulderPoint = { x: 10, y: 10 } } = $$props;
    	let { handPoint = { x: 15, y: 15 } } = $$props;
    	let { headDiameter = 5 } = $$props;
    	let { maxArmLength = 3 * headDiameter } = $$props;
    	let { limbThickness = 4 } = $$props;
    	let { skinTone = 'black' } = $$props;
    	let { fullName = 'Jimberly Hanifred' } = $$props;
    	let { armType = 'none' } = $$props;
    	let { displayDots = true } = $$props;
    	let troubleshooting = false;
    	let firstName = fullName.split(' ')[0];
    	let elbowDeltas = {};
    	let handDeltas = {};

    	//determine elbow and hand locations
    	let shoulderHandDist = getPointDist(shoulderPoint, handPoint);

    	let shoulderElbowDist = maxArmLength / 2;
    	let { angleToHoriz } = getPointDeltaAngle(shoulderPoint, handPoint);
    	if (armType === 'left') angleToHoriz = angleToHoriz + Math.PI;

    	if (shoulderHandDist >= maxArmLength) {
    		handDeltas = {
    			x: maxArmLength * Math.cos(angleToHoriz),
    			y: maxArmLength * Math.sin(angleToHoriz)
    		};

    		elbowDeltas = {
    			x: maxArmLength * Math.cos(angleToHoriz) / 2,
    			y: maxArmLength * Math.sin(angleToHoriz) / 2
    		};
    	} else if (shoulderHandDist < maxArmLength) {
    		let isoscelesAngleInner = Math.acos(shoulderHandDist / (2 * shoulderElbowDist));
    		let isoscelesAngleToHoriz = angleToHoriz - isoscelesAngleInner;

    		elbowDeltas = {
    			x: shoulderElbowDist * Math.cos(isoscelesAngleToHoriz),
    			y: shoulderElbowDist * Math.sin(isoscelesAngleToHoriz)
    		};
    	}

    	let elbowPoint = {
    		x: shoulderPoint.x + elbowDeltas.x,
    		y: shoulderPoint.y + elbowDeltas.y
    	};

    	let pointList = [shoulderPoint, elbowPoint, handPoint];
    	let pointNames = ['shoulder', 'elbow', 'hand'];
    	let elbowHandDeltas = getPointDeltaAngle(elbowPoint, handPoint);

    	let armPath = `M ${shoulderPoint.x} ${shoulderPoint.y} 
    l ${elbowDeltas.x} ${elbowDeltas.y} 
    l ${elbowHandDeltas.x} ${elbowHandDeltas.y}`;

    	if (troubleshooting) {
    		console.log(armType, armPath);
    		console.log(angleToHoriz, Math.cos(angleToHoriz), Math.sin(angleToHoriz));

    		console.log(`${fullName + armType}Points- 
        shoulder: x${shoulderPoint.x} y${shoulderPoint.y} 
        elbow: x${elbowPoint.x} y${elbowPoint.y} 
        hand: x${handPoint.x} y${handPoint.y}`);

    		console.log(`${fullName + armType}Deltas- 
        elbow: x${elbowDeltas.x} y${elbowDeltas.y} 
        hand: x${handDeltas.x} y${handDeltas.y}
        elbowHand: x${elbowHandDeltas.x} y${elbowHandDeltas.y} `);
    	}

    	//determine sleeve length and color
    	let isSleeve = firstName.length > $valdoApparelColorStore.apparelLengths[0]
    	? true
    	: false;

    	let sleevePath = '';

    	//determine sleeve color based on first letter of first name
    	let sleeveColor = $valdoApparelColorStore.apparelColorList[firstName[0].toLowerCase()];

    	//if there is a sleeve, determine if it's short or long based on first name length
    	if (isSleeve) {
    		let sleeveLength = firstName.length > $valdoApparelColorStore.apparelLengths[1]
    		? 'long'
    		: 'short';

    		let sleeveElbowDeltas;
    		let sleeveHandDeltas;

    		if (sleeveLength === 'long') {
    			sleeveElbowDeltas = elbowDeltas;

    			sleeveHandDeltas = {
    				x: elbowHandDeltas.x * $valdoApparelColorStore.sleevePantLength,
    				y: elbowHandDeltas.y * $valdoApparelColorStore.sleevePantLength
    			};

    			sleevePath = `M ${shoulderPoint.x} ${shoulderPoint.y} 
        l ${sleeveElbowDeltas.x} ${sleeveElbowDeltas.y} 
        l ${sleeveHandDeltas.x} ${sleeveHandDeltas.y}`;
    		} else if (sleeveLength === 'short') {
    			sleeveElbowDeltas = {
    				x: elbowDeltas.x * $valdoApparelColorStore.sleevePantLength,
    				y: elbowDeltas.y * $valdoApparelColorStore.sleevePantLength
    			};

    			sleevePath = `M ${shoulderPoint.x} ${shoulderPoint.y} 
        l ${sleeveElbowDeltas.x} ${sleeveElbowDeltas.y}`;
    		}
    	}

    	const writable_props = [
    		'shoulderPoint',
    		'handPoint',
    		'headDiameter',
    		'maxArmLength',
    		'limbThickness',
    		'skinTone',
    		'fullName',
    		'armType',
    		'displayDots'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<ValdoArm> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('shoulderPoint' in $$props) $$invalidate(13, shoulderPoint = $$props.shoulderPoint);
    		if ('handPoint' in $$props) $$invalidate(14, handPoint = $$props.handPoint);
    		if ('headDiameter' in $$props) $$invalidate(0, headDiameter = $$props.headDiameter);
    		if ('maxArmLength' in $$props) $$invalidate(15, maxArmLength = $$props.maxArmLength);
    		if ('limbThickness' in $$props) $$invalidate(1, limbThickness = $$props.limbThickness);
    		if ('skinTone' in $$props) $$invalidate(2, skinTone = $$props.skinTone);
    		if ('fullName' in $$props) $$invalidate(3, fullName = $$props.fullName);
    		if ('armType' in $$props) $$invalidate(4, armType = $$props.armType);
    		if ('displayDots' in $$props) $$invalidate(5, displayDots = $$props.displayDots);
    	};

    	$$self.$capture_state = () => ({
    		getPointDist,
    		getPointDeltaAngle,
    		valdoApparelColorStore,
    		shoulderPoint,
    		handPoint,
    		headDiameter,
    		maxArmLength,
    		limbThickness,
    		skinTone,
    		fullName,
    		armType,
    		displayDots,
    		troubleshooting,
    		firstName,
    		elbowDeltas,
    		handDeltas,
    		shoulderHandDist,
    		shoulderElbowDist,
    		angleToHoriz,
    		elbowPoint,
    		pointList,
    		pointNames,
    		elbowHandDeltas,
    		armPath,
    		isSleeve,
    		sleevePath,
    		sleeveColor,
    		$valdoApparelColorStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('shoulderPoint' in $$props) $$invalidate(13, shoulderPoint = $$props.shoulderPoint);
    		if ('handPoint' in $$props) $$invalidate(14, handPoint = $$props.handPoint);
    		if ('headDiameter' in $$props) $$invalidate(0, headDiameter = $$props.headDiameter);
    		if ('maxArmLength' in $$props) $$invalidate(15, maxArmLength = $$props.maxArmLength);
    		if ('limbThickness' in $$props) $$invalidate(1, limbThickness = $$props.limbThickness);
    		if ('skinTone' in $$props) $$invalidate(2, skinTone = $$props.skinTone);
    		if ('fullName' in $$props) $$invalidate(3, fullName = $$props.fullName);
    		if ('armType' in $$props) $$invalidate(4, armType = $$props.armType);
    		if ('displayDots' in $$props) $$invalidate(5, displayDots = $$props.displayDots);
    		if ('troubleshooting' in $$props) troubleshooting = $$props.troubleshooting;
    		if ('firstName' in $$props) firstName = $$props.firstName;
    		if ('elbowDeltas' in $$props) elbowDeltas = $$props.elbowDeltas;
    		if ('handDeltas' in $$props) handDeltas = $$props.handDeltas;
    		if ('shoulderHandDist' in $$props) shoulderHandDist = $$props.shoulderHandDist;
    		if ('shoulderElbowDist' in $$props) shoulderElbowDist = $$props.shoulderElbowDist;
    		if ('angleToHoriz' in $$props) angleToHoriz = $$props.angleToHoriz;
    		if ('elbowPoint' in $$props) elbowPoint = $$props.elbowPoint;
    		if ('pointList' in $$props) $$invalidate(8, pointList = $$props.pointList);
    		if ('pointNames' in $$props) $$invalidate(9, pointNames = $$props.pointNames);
    		if ('elbowHandDeltas' in $$props) elbowHandDeltas = $$props.elbowHandDeltas;
    		if ('armPath' in $$props) $$invalidate(10, armPath = $$props.armPath);
    		if ('isSleeve' in $$props) $$invalidate(11, isSleeve = $$props.isSleeve);
    		if ('sleevePath' in $$props) $$invalidate(6, sleevePath = $$props.sleevePath);
    		if ('sleeveColor' in $$props) $$invalidate(12, sleeveColor = $$props.sleeveColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		headDiameter,
    		limbThickness,
    		skinTone,
    		fullName,
    		armType,
    		displayDots,
    		sleevePath,
    		$valdoApparelColorStore,
    		pointList,
    		pointNames,
    		armPath,
    		isSleeve,
    		sleeveColor,
    		shoulderPoint,
    		handPoint,
    		maxArmLength
    	];
    }

    class ValdoArm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			shoulderPoint: 13,
    			handPoint: 14,
    			headDiameter: 0,
    			maxArmLength: 15,
    			limbThickness: 1,
    			skinTone: 2,
    			fullName: 3,
    			armType: 4,
    			displayDots: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValdoArm",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get shoulderPoint() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shoulderPoint(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handPoint() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handPoint(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headDiameter() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headDiameter(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxArmLength() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxArmLength(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limbThickness() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limbThickness(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skinTone() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skinTone(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullName() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullName(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get armType() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set armType(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayDots() {
    		throw new Error("<ValdoArm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayDots(value) {
    		throw new Error("<ValdoArm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Valdo\ValdoHead.svelte generated by Svelte v3.53.0 */

    const file$7 = "src\\Valdo\\ValdoHead.svelte";

    function create_fragment$8(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", circle_cx_value = /*headPoint*/ ctx[0].x);
    			attr_dev(circle, "cy", circle_cy_value = /*headPoint*/ ctx[0].y);
    			attr_dev(circle, "r", circle_r_value = /*headDiameter*/ ctx[1] / 2);
    			attr_dev(circle, "stroke", /*skinTone*/ ctx[3]);
    			attr_dev(circle, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(circle, "fill", /*skinTone*/ ctx[3]);
    			add_location(circle, file$7, 7, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*headPoint*/ 1 && circle_cx_value !== (circle_cx_value = /*headPoint*/ ctx[0].x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*headPoint*/ 1 && circle_cy_value !== (circle_cy_value = /*headPoint*/ ctx[0].y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*headDiameter*/ 2 && circle_r_value !== (circle_r_value = /*headDiameter*/ ctx[1] / 2)) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty & /*skinTone*/ 8) {
    				attr_dev(circle, "stroke", /*skinTone*/ ctx[3]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(circle, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*skinTone*/ 8) {
    				attr_dev(circle, "fill", /*skinTone*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValdoHead', slots, []);
    	let { headPoint = {} } = $$props;
    	let { headDiameter = 15 } = $$props;
    	let { strokeWidth = 4 } = $$props;
    	let { skinTone = 'black' } = $$props;
    	const writable_props = ['headPoint', 'headDiameter', 'strokeWidth', 'skinTone'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValdoHead> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('headPoint' in $$props) $$invalidate(0, headPoint = $$props.headPoint);
    		if ('headDiameter' in $$props) $$invalidate(1, headDiameter = $$props.headDiameter);
    		if ('strokeWidth' in $$props) $$invalidate(2, strokeWidth = $$props.strokeWidth);
    		if ('skinTone' in $$props) $$invalidate(3, skinTone = $$props.skinTone);
    	};

    	$$self.$capture_state = () => ({
    		headPoint,
    		headDiameter,
    		strokeWidth,
    		skinTone
    	});

    	$$self.$inject_state = $$props => {
    		if ('headPoint' in $$props) $$invalidate(0, headPoint = $$props.headPoint);
    		if ('headDiameter' in $$props) $$invalidate(1, headDiameter = $$props.headDiameter);
    		if ('strokeWidth' in $$props) $$invalidate(2, strokeWidth = $$props.strokeWidth);
    		if ('skinTone' in $$props) $$invalidate(3, skinTone = $$props.skinTone);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [headPoint, headDiameter, strokeWidth, skinTone];
    }

    class ValdoHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			headPoint: 0,
    			headDiameter: 1,
    			strokeWidth: 2,
    			skinTone: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValdoHead",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get headPoint() {
    		throw new Error("<ValdoHead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headPoint(value) {
    		throw new Error("<ValdoHead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headDiameter() {
    		throw new Error("<ValdoHead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headDiameter(value) {
    		throw new Error("<ValdoHead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<ValdoHead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<ValdoHead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skinTone() {
    		throw new Error("<ValdoHead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skinTone(value) {
    		throw new Error("<ValdoHead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Valdo\ValdoLegs.svelte generated by Svelte v3.53.0 */
    const file$6 = "src\\Valdo\\ValdoLegs.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[37] = i;
    	return child_ctx;
    }

    // (143:0) {#if isPant}
    function create_if_block_1$2(ctx) {
    	let path;
    	let path_id_value;
    	let path_stroke_width_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "id", path_id_value = `${/*fullName*/ ctx[3]}${legType}pant`);
    			attr_dev(path, "d", /*pantPath*/ ctx[5]);
    			attr_dev(path, "stroke", /*pantColor*/ ctx[9]);
    			attr_dev(path, "stroke-width", path_stroke_width_value = /*$valdoApparelColorStore*/ ctx[6].apparelThickness * /*limbThickness*/ ctx[1]);
    			attr_dev(path, "class", "svelte-1k8lj6w");
    			add_location(path, file$6, 143, 2, 5392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*fullName*/ 8 && path_id_value !== (path_id_value = `${/*fullName*/ ctx[3]}${legType}pant`)) {
    				attr_dev(path, "id", path_id_value);
    			}

    			if (dirty[0] & /*pantPath*/ 32) {
    				attr_dev(path, "d", /*pantPath*/ ctx[5]);
    			}

    			if (dirty[0] & /*$valdoApparelColorStore, limbThickness*/ 66 && path_stroke_width_value !== (path_stroke_width_value = /*$valdoApparelColorStore*/ ctx[6].apparelThickness * /*limbThickness*/ ctx[1])) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(143:0) {#if isPant}",
    		ctx
    	});

    	return block;
    }

    // (151:0) {#if displayDots}
    function create_if_block$4(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = pointList;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*point*/ ctx[35].x;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pointNames, headDiameter*/ 129) {
    				each_value = pointList;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(151:0) {#if displayDots}",
    		ctx
    	});

    	return block;
    }

    // (152:2) {#each pointList as point, i (point.x)}
    function create_each_block$1(key_1, ctx) {
    	let circle;
    	let circle_r_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "id", /*pointNames*/ ctx[7][/*i*/ ctx[37]] + legType);
    			attr_dev(circle, "cx", /*point*/ ctx[35].x);
    			attr_dev(circle, "cy", /*point*/ ctx[35].y);
    			attr_dev(circle, "r", circle_r_value = /*headDiameter*/ ctx[0] / 4);
    			add_location(circle, file$6, 152, 4, 5634);
    			this.first = circle;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*headDiameter*/ 1 && circle_r_value !== (circle_r_value = /*headDiameter*/ ctx[0] / 4)) {
    				attr_dev(circle, "r", circle_r_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(152:2) {#each pointList as point, i (point.x)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let path;
    	let path_id_value;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let if_block0 = /*isPant*/ ctx[8] && create_if_block_1$2(ctx);
    	let if_block1 = /*displayDots*/ ctx[4] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(path, "id", path_id_value = `${/*fullName*/ ctx[3]}${legType}arm`);
    			attr_dev(path, "d", legPath);
    			attr_dev(path, "stroke", /*skinTone*/ ctx[2]);
    			attr_dev(path, "stroke-width", /*limbThickness*/ ctx[1]);
    			attr_dev(path, "class", "svelte-1k8lj6w");
    			add_location(path, file$6, 136, 0, 5262);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*fullName*/ 8 && path_id_value !== (path_id_value = `${/*fullName*/ ctx[3]}${legType}arm`)) {
    				attr_dev(path, "id", path_id_value);
    			}

    			if (dirty[0] & /*skinTone*/ 4) {
    				attr_dev(path, "stroke", /*skinTone*/ ctx[2]);
    			}

    			if (dirty[0] & /*limbThickness*/ 2) {
    				attr_dev(path, "stroke-width", /*limbThickness*/ ctx[1]);
    			}

    			if (/*isPant*/ ctx[8]) if_block0.p(ctx, dirty);

    			if (/*displayDots*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $valdoApparelColorStore;
    	validate_store(valdoApparelColorStore, 'valdoApparelColorStore');
    	component_subscribe($$self, valdoApparelColorStore, $$value => $$invalidate(6, $valdoApparelColorStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValdoLegs', slots, []);
    	let { hipPoint = { x: 10, y: 10 } } = $$props;
    	let { leftFootPoint = { x: 15, y: 15 } } = $$props;
    	let { rightFootPoint = { x: 15, y: 15 } } = $$props;
    	let { headDiameter = 5 } = $$props;
    	let { maxLegLength = 3 * headDiameter } = $$props;
    	let { limbThickness = 4 } = $$props;
    	let { skinTone = 'black' } = $$props;
    	let { fullName = 'Jimberly Hanifred' } = $$props;
    	let { displayDots = true } = $$props;
    	let { gender = 'none' } = $$props;
    	let troubleshooting = false;
    	let lastName = fullName.split(' ')[1];

    	//establish left and right deltas
    	let leftKneeDeltas = {};

    	let leftFootDeltas = {};
    	let rightKneeDeltas = {};
    	let rightFootDeltas = {};

    	//establish left and right hip and foot distances
    	let leftHipFootDist = getPointDist(hipPoint, leftFootPoint);

    	let leftHipKneeDist = maxLegLength / 2;
    	let { angleToHoriz: leftAngleToHoriz } = getPointDeltaAngle(hipPoint, leftFootPoint);
    	leftAngleToHoriz = leftAngleToHoriz + Math.PI;
    	let rightHipFootDist = getPointDist(hipPoint, rightFootPoint);
    	let rightHipKneeDist = maxLegLength / 2;
    	let { angleToHoriz: rightAngleToHoriz } = getPointDeltaAngle(hipPoint, rightFootPoint);

    	//adjust left and right foot position to not exceed max leg length
    	if (leftHipFootDist >= maxLegLength) {
    		leftFootDeltas = {
    			x: maxLegLength * Math.cos(leftAngleToHoriz),
    			y: maxLegLength * Math.sin(leftAngleToHoriz)
    		};

    		leftKneeDeltas = {
    			x: maxLegLength * Math.cos(leftAngleToHoriz) / 2,
    			y: maxLegLength * Math.sin(leftAngleToHoriz) / 2
    		};
    	} else if (leftHipFootDist < maxLegLength) {
    		let leftIsoscelesAngleInner = Math.acos(leftHipFootDist / (2 * leftHipKneeDist));
    		let leftIsoscelesAngleToHoriz = leftAngleToHoriz - leftIsoscelesAngleInner;

    		leftKneeDeltas = {
    			x: leftHipKneeDist * Math.cos(leftIsoscelesAngleToHoriz),
    			y: leftHipKneeDist * Math.sin(leftIsoscelesAngleToHoriz)
    		};
    	}

    	if (rightHipFootDist >= maxLegLength) {
    		rightFootDeltas = {
    			x: maxLegLength * Math.cos(rightAngleToHoriz),
    			y: maxLegLength * Math.sin(rightAngleToHoriz)
    		};

    		rightKneeDeltas = {
    			x: maxLegLength * Math.cos(rightAngleToHoriz) / 2,
    			y: maxLegLength * Math.sin(rightAngleToHoriz) / 2
    		};
    	} else if (rightHipFootDist < maxLegLength) {
    		let rightIsoscelesAngleInner = Math.acos(rightHipFootDist / (2 * rightHipKneeDist));
    		let rightIsoscelesAngleToHoriz = rightAngleToHoriz - rightIsoscelesAngleInner;

    		rightKneeDeltas = {
    			x: rightHipKneeDist * Math.cos(rightIsoscelesAngleToHoriz),
    			y: rightHipKneeDist * Math.sin(rightIsoscelesAngleToHoriz)
    		};
    	}

    	//establish adjusted left and right knee points
    	let leftKneePoint = {
    		x: hipPoint.x + leftKneeDeltas.x,
    		y: hipPoint.y + leftKneeDeltas.y
    	};

    	let rightKneePoint = {
    		x: hipPoint.x + rightKneeDeltas.x,
    		y: hipPoint.y + rightKneeDeltas.y
    	};

    	//establish left and right dot points
    	let pointNames = ['hip', 'knee', 'foot'];

    	let leftPointList = [hipPoint, leftKneePoint, leftFootPoint];
    	let leftKneeFootDeltas = getPointDeltaAngle(leftKneePoint, leftFootPoint);
    	let rightPointList = [hipPoint, rightKneePoint, rightFootPoint];
    	let rightKneeFootDeltas = getPointDeltaAngle(rightKneePoint, rightFootPoint);

    	//establish left and right leg paths
    	let leftLegPath = `M ${hipPoint.x} ${hipPoint.y} 
    l ${leftKneeDeltas.x} ${leftKneeDeltas.y} 
    l ${leftKneeFootDeltas.x} ${leftKneeFootDeltas.y}`;

    	let rightLegPath = `M ${hipPoint.x} ${hipPoint.y} 
    l ${rightKneeDeltas.x} ${rightKneeDeltas.y} 
    l ${rightKneeFootDeltas.x} ${rightKneeFootDeltas.y}`;

    	//define pant path if male
    	let pantPath = '';

    	//determine sleeve length and color
    	let isPant = lastName.length > $valdoApparelColorStore.apparelLengths[0]
    	? true
    	: false;

    	//determine sleeve color based on first letter of first name
    	let pantColor = $valdoApparelColorStore.apparelColorList[lastName[0].toLowerCase()];

    	//if there is a sleeve, determine if it's short or long based on first name length
    	if (isPant) {
    		let pantLength = lastName.length > $valdoApparelColorStore.apparelLengths[1]
    		? 'long'
    		: 'short';

    		let pantleftKneeDeltas;
    		let pantleftFootDeltas;

    		if (pantLength === 'long') {
    			pantleftKneeDeltas = leftKneeDeltas;

    			pantleftFootDeltas = {
    				x: leftKneeFootDeltas.x * $valdoApparelColorStore.sleevePantLength,
    				y: leftKneeFootDeltas.y * $valdoApparelColorStore.sleevePantLength
    			};

    			pantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantleftKneeDeltas.x} ${pantleftKneeDeltas.y} 
        l ${pantleftFootDeltas.x} ${pantleftFootDeltas.y}`;
    		} else if (pantLength === 'short') {
    			pantleftKneeDeltas = {
    				x: leftKneeDeltas.x * $valdoApparelColorStore.sleevePantLength,
    				y: leftKneeDeltas.y * $valdoApparelColorStore.sleevePantLength
    			};

    			pantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantleftKneeDeltas.x} ${pantleftKneeDeltas.y}`;
    		}
    	}

    	const writable_props = [
    		'hipPoint',
    		'leftFootPoint',
    		'rightFootPoint',
    		'headDiameter',
    		'maxLegLength',
    		'limbThickness',
    		'skinTone',
    		'fullName',
    		'displayDots',
    		'gender'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValdoLegs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hipPoint' in $$props) $$invalidate(10, hipPoint = $$props.hipPoint);
    		if ('leftFootPoint' in $$props) $$invalidate(11, leftFootPoint = $$props.leftFootPoint);
    		if ('rightFootPoint' in $$props) $$invalidate(12, rightFootPoint = $$props.rightFootPoint);
    		if ('headDiameter' in $$props) $$invalidate(0, headDiameter = $$props.headDiameter);
    		if ('maxLegLength' in $$props) $$invalidate(13, maxLegLength = $$props.maxLegLength);
    		if ('limbThickness' in $$props) $$invalidate(1, limbThickness = $$props.limbThickness);
    		if ('skinTone' in $$props) $$invalidate(2, skinTone = $$props.skinTone);
    		if ('fullName' in $$props) $$invalidate(3, fullName = $$props.fullName);
    		if ('displayDots' in $$props) $$invalidate(4, displayDots = $$props.displayDots);
    		if ('gender' in $$props) $$invalidate(14, gender = $$props.gender);
    	};

    	$$self.$capture_state = () => ({
    		getPointDist,
    		getPointDeltaAngle,
    		valdoApparelColorStore,
    		hipPoint,
    		leftFootPoint,
    		rightFootPoint,
    		headDiameter,
    		maxLegLength,
    		limbThickness,
    		skinTone,
    		fullName,
    		displayDots,
    		gender,
    		troubleshooting,
    		lastName,
    		leftKneeDeltas,
    		leftFootDeltas,
    		rightKneeDeltas,
    		rightFootDeltas,
    		leftHipFootDist,
    		leftHipKneeDist,
    		leftAngleToHoriz,
    		rightHipFootDist,
    		rightHipKneeDist,
    		rightAngleToHoriz,
    		leftKneePoint,
    		rightKneePoint,
    		pointNames,
    		leftPointList,
    		leftKneeFootDeltas,
    		rightPointList,
    		rightKneeFootDeltas,
    		leftLegPath,
    		rightLegPath,
    		pantPath,
    		isPant,
    		pantColor,
    		$valdoApparelColorStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('hipPoint' in $$props) $$invalidate(10, hipPoint = $$props.hipPoint);
    		if ('leftFootPoint' in $$props) $$invalidate(11, leftFootPoint = $$props.leftFootPoint);
    		if ('rightFootPoint' in $$props) $$invalidate(12, rightFootPoint = $$props.rightFootPoint);
    		if ('headDiameter' in $$props) $$invalidate(0, headDiameter = $$props.headDiameter);
    		if ('maxLegLength' in $$props) $$invalidate(13, maxLegLength = $$props.maxLegLength);
    		if ('limbThickness' in $$props) $$invalidate(1, limbThickness = $$props.limbThickness);
    		if ('skinTone' in $$props) $$invalidate(2, skinTone = $$props.skinTone);
    		if ('fullName' in $$props) $$invalidate(3, fullName = $$props.fullName);
    		if ('displayDots' in $$props) $$invalidate(4, displayDots = $$props.displayDots);
    		if ('gender' in $$props) $$invalidate(14, gender = $$props.gender);
    		if ('troubleshooting' in $$props) troubleshooting = $$props.troubleshooting;
    		if ('lastName' in $$props) lastName = $$props.lastName;
    		if ('leftKneeDeltas' in $$props) leftKneeDeltas = $$props.leftKneeDeltas;
    		if ('leftFootDeltas' in $$props) leftFootDeltas = $$props.leftFootDeltas;
    		if ('rightKneeDeltas' in $$props) rightKneeDeltas = $$props.rightKneeDeltas;
    		if ('rightFootDeltas' in $$props) rightFootDeltas = $$props.rightFootDeltas;
    		if ('leftHipFootDist' in $$props) leftHipFootDist = $$props.leftHipFootDist;
    		if ('leftHipKneeDist' in $$props) leftHipKneeDist = $$props.leftHipKneeDist;
    		if ('leftAngleToHoriz' in $$props) leftAngleToHoriz = $$props.leftAngleToHoriz;
    		if ('rightHipFootDist' in $$props) rightHipFootDist = $$props.rightHipFootDist;
    		if ('rightHipKneeDist' in $$props) rightHipKneeDist = $$props.rightHipKneeDist;
    		if ('rightAngleToHoriz' in $$props) rightAngleToHoriz = $$props.rightAngleToHoriz;
    		if ('leftKneePoint' in $$props) leftKneePoint = $$props.leftKneePoint;
    		if ('rightKneePoint' in $$props) rightKneePoint = $$props.rightKneePoint;
    		if ('pointNames' in $$props) $$invalidate(7, pointNames = $$props.pointNames);
    		if ('leftPointList' in $$props) leftPointList = $$props.leftPointList;
    		if ('leftKneeFootDeltas' in $$props) leftKneeFootDeltas = $$props.leftKneeFootDeltas;
    		if ('rightPointList' in $$props) rightPointList = $$props.rightPointList;
    		if ('rightKneeFootDeltas' in $$props) rightKneeFootDeltas = $$props.rightKneeFootDeltas;
    		if ('leftLegPath' in $$props) leftLegPath = $$props.leftLegPath;
    		if ('rightLegPath' in $$props) rightLegPath = $$props.rightLegPath;
    		if ('pantPath' in $$props) $$invalidate(5, pantPath = $$props.pantPath);
    		if ('isPant' in $$props) $$invalidate(8, isPant = $$props.isPant);
    		if ('pantColor' in $$props) $$invalidate(9, pantColor = $$props.pantColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		headDiameter,
    		limbThickness,
    		skinTone,
    		fullName,
    		displayDots,
    		pantPath,
    		$valdoApparelColorStore,
    		pointNames,
    		isPant,
    		pantColor,
    		hipPoint,
    		leftFootPoint,
    		rightFootPoint,
    		maxLegLength,
    		gender
    	];
    }

    class ValdoLegs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				hipPoint: 10,
    				leftFootPoint: 11,
    				rightFootPoint: 12,
    				headDiameter: 0,
    				maxLegLength: 13,
    				limbThickness: 1,
    				skinTone: 2,
    				fullName: 3,
    				displayDots: 4,
    				gender: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValdoLegs",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get hipPoint() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hipPoint(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get leftFootPoint() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leftFootPoint(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rightFootPoint() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rightFootPoint(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headDiameter() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headDiameter(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxLegLength() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxLegLength(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limbThickness() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limbThickness(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skinTone() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skinTone(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullName() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullName(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayDots() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayDots(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gender() {
    		throw new Error("<ValdoLegs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gender(value) {
    		throw new Error("<ValdoLegs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Valdo\ValdoNeck.svelte generated by Svelte v3.53.0 */

    const file$5 = "src\\Valdo\\ValdoNeck.svelte";

    function create_fragment$6(ctx) {
    	let line;
    	let line_x__value;
    	let line_y__value;
    	let line_x__value_1;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = /*neckPoint*/ ctx[0].x);
    			attr_dev(line, "y1", line_y__value = /*neckPoint*/ ctx[0].y);
    			attr_dev(line, "x2", line_x__value_1 = /*shoulderPoint*/ ctx[1].x);
    			attr_dev(line, "y2", line_y__value_1 = /*shoulderPoint*/ ctx[1].y);
    			attr_dev(line, "stroke", /*skinTone*/ ctx[3]);
    			attr_dev(line, "stroke-width", /*limbThickness*/ ctx[2]);
    			add_location(line, file$5, 7, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*neckPoint*/ 1 && line_x__value !== (line_x__value = /*neckPoint*/ ctx[0].x)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*neckPoint*/ 1 && line_y__value !== (line_y__value = /*neckPoint*/ ctx[0].y)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*shoulderPoint*/ 2 && line_x__value_1 !== (line_x__value_1 = /*shoulderPoint*/ ctx[1].x)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*shoulderPoint*/ 2 && line_y__value_1 !== (line_y__value_1 = /*shoulderPoint*/ ctx[1].y)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*skinTone*/ 8) {
    				attr_dev(line, "stroke", /*skinTone*/ ctx[3]);
    			}

    			if (dirty & /*limbThickness*/ 4) {
    				attr_dev(line, "stroke-width", /*limbThickness*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValdoNeck', slots, []);
    	let { neckPoint = {} } = $$props;
    	let { shoulderPoint = {} } = $$props;
    	let { limbThickness = 4 } = $$props;
    	let { skinTone = 'black' } = $$props;
    	const writable_props = ['neckPoint', 'shoulderPoint', 'limbThickness', 'skinTone'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValdoNeck> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('neckPoint' in $$props) $$invalidate(0, neckPoint = $$props.neckPoint);
    		if ('shoulderPoint' in $$props) $$invalidate(1, shoulderPoint = $$props.shoulderPoint);
    		if ('limbThickness' in $$props) $$invalidate(2, limbThickness = $$props.limbThickness);
    		if ('skinTone' in $$props) $$invalidate(3, skinTone = $$props.skinTone);
    	};

    	$$self.$capture_state = () => ({
    		neckPoint,
    		shoulderPoint,
    		limbThickness,
    		skinTone
    	});

    	$$self.$inject_state = $$props => {
    		if ('neckPoint' in $$props) $$invalidate(0, neckPoint = $$props.neckPoint);
    		if ('shoulderPoint' in $$props) $$invalidate(1, shoulderPoint = $$props.shoulderPoint);
    		if ('limbThickness' in $$props) $$invalidate(2, limbThickness = $$props.limbThickness);
    		if ('skinTone' in $$props) $$invalidate(3, skinTone = $$props.skinTone);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [neckPoint, shoulderPoint, limbThickness, skinTone];
    }

    class ValdoNeck extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			neckPoint: 0,
    			shoulderPoint: 1,
    			limbThickness: 2,
    			skinTone: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValdoNeck",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get neckPoint() {
    		throw new Error("<ValdoNeck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set neckPoint(value) {
    		throw new Error("<ValdoNeck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shoulderPoint() {
    		throw new Error("<ValdoNeck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shoulderPoint(value) {
    		throw new Error("<ValdoNeck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limbThickness() {
    		throw new Error("<ValdoNeck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limbThickness(value) {
    		throw new Error("<ValdoNeck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skinTone() {
    		throw new Error("<ValdoNeck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skinTone(value) {
    		throw new Error("<ValdoNeck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Valdo\ValdoTorso.svelte generated by Svelte v3.53.0 */
    const file$4 = "src\\Valdo\\ValdoTorso.svelte";

    function create_fragment$5(ctx) {
    	let line0;
    	let line0_x__value;
    	let line0_y__value;
    	let line0_x__value_1;
    	let line0_y__value_1;
    	let t;
    	let line1;
    	let line1_x__value;
    	let line1_y__value;
    	let line1_x__value_1;
    	let line1_y__value_1;
    	let line1_stroke_value;
    	let line1_stroke_width_value;

    	const block = {
    		c: function create() {
    			line0 = svg_element("line");
    			t = space();
    			line1 = svg_element("line");
    			attr_dev(line0, "x1", line0_x__value = /*shoulderPoint*/ ctx[0].x);
    			attr_dev(line0, "y1", line0_y__value = /*shoulderPoint*/ ctx[0].y);
    			attr_dev(line0, "x2", line0_x__value_1 = /*hipPoint*/ ctx[1].x);
    			attr_dev(line0, "y2", line0_y__value_1 = /*hipPoint*/ ctx[1].y);
    			attr_dev(line0, "stroke", /*skinTone*/ ctx[3]);
    			attr_dev(line0, "stroke-width", /*torsoThickness*/ ctx[2]);
    			add_location(line0, file$4, 12, 0, 320);
    			attr_dev(line1, "x1", line1_x__value = /*shoulderPoint*/ ctx[0].x);
    			attr_dev(line1, "y1", line1_y__value = /*shoulderPoint*/ ctx[0].y);
    			attr_dev(line1, "x2", line1_x__value_1 = /*hipPoint*/ ctx[1].x);
    			attr_dev(line1, "y2", line1_y__value_1 = /*hipPoint*/ ctx[1].y);
    			attr_dev(line1, "stroke", line1_stroke_value = /*$valdoApparelColorStore*/ ctx[4].apparelColorList[/*firstName*/ ctx[5][0]]);
    			attr_dev(line1, "stroke-width", line1_stroke_width_value = /*torsoThickness*/ ctx[2] * /*$valdoApparelColorStore*/ ctx[4].apparelThickness * 2);
    			add_location(line1, file$4, 20, 0, 471);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, line1, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shoulderPoint*/ 1 && line0_x__value !== (line0_x__value = /*shoulderPoint*/ ctx[0].x)) {
    				attr_dev(line0, "x1", line0_x__value);
    			}

    			if (dirty & /*shoulderPoint*/ 1 && line0_y__value !== (line0_y__value = /*shoulderPoint*/ ctx[0].y)) {
    				attr_dev(line0, "y1", line0_y__value);
    			}

    			if (dirty & /*hipPoint*/ 2 && line0_x__value_1 !== (line0_x__value_1 = /*hipPoint*/ ctx[1].x)) {
    				attr_dev(line0, "x2", line0_x__value_1);
    			}

    			if (dirty & /*hipPoint*/ 2 && line0_y__value_1 !== (line0_y__value_1 = /*hipPoint*/ ctx[1].y)) {
    				attr_dev(line0, "y2", line0_y__value_1);
    			}

    			if (dirty & /*skinTone*/ 8) {
    				attr_dev(line0, "stroke", /*skinTone*/ ctx[3]);
    			}

    			if (dirty & /*torsoThickness*/ 4) {
    				attr_dev(line0, "stroke-width", /*torsoThickness*/ ctx[2]);
    			}

    			if (dirty & /*shoulderPoint*/ 1 && line1_x__value !== (line1_x__value = /*shoulderPoint*/ ctx[0].x)) {
    				attr_dev(line1, "x1", line1_x__value);
    			}

    			if (dirty & /*shoulderPoint*/ 1 && line1_y__value !== (line1_y__value = /*shoulderPoint*/ ctx[0].y)) {
    				attr_dev(line1, "y1", line1_y__value);
    			}

    			if (dirty & /*hipPoint*/ 2 && line1_x__value_1 !== (line1_x__value_1 = /*hipPoint*/ ctx[1].x)) {
    				attr_dev(line1, "x2", line1_x__value_1);
    			}

    			if (dirty & /*hipPoint*/ 2 && line1_y__value_1 !== (line1_y__value_1 = /*hipPoint*/ ctx[1].y)) {
    				attr_dev(line1, "y2", line1_y__value_1);
    			}

    			if (dirty & /*$valdoApparelColorStore*/ 16 && line1_stroke_value !== (line1_stroke_value = /*$valdoApparelColorStore*/ ctx[4].apparelColorList[/*firstName*/ ctx[5][0]])) {
    				attr_dev(line1, "stroke", line1_stroke_value);
    			}

    			if (dirty & /*torsoThickness, $valdoApparelColorStore*/ 20 && line1_stroke_width_value !== (line1_stroke_width_value = /*torsoThickness*/ ctx[2] * /*$valdoApparelColorStore*/ ctx[4].apparelThickness * 2)) {
    				attr_dev(line1, "stroke-width", line1_stroke_width_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(line1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $valdoApparelColorStore;
    	validate_store(valdoApparelColorStore, 'valdoApparelColorStore');
    	component_subscribe($$self, valdoApparelColorStore, $$value => $$invalidate(4, $valdoApparelColorStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValdoTorso', slots, []);
    	let { shoulderPoint = {} } = $$props;
    	let { hipPoint = {} } = $$props;
    	let { torsoThickness = 4 } = $$props;
    	let { fullName = 'Jack Gerifor' } = $$props;
    	let { skinTone = 'black' } = $$props;
    	let firstName = fullName[0].toLowerCase();
    	const writable_props = ['shoulderPoint', 'hipPoint', 'torsoThickness', 'fullName', 'skinTone'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValdoTorso> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('shoulderPoint' in $$props) $$invalidate(0, shoulderPoint = $$props.shoulderPoint);
    		if ('hipPoint' in $$props) $$invalidate(1, hipPoint = $$props.hipPoint);
    		if ('torsoThickness' in $$props) $$invalidate(2, torsoThickness = $$props.torsoThickness);
    		if ('fullName' in $$props) $$invalidate(6, fullName = $$props.fullName);
    		if ('skinTone' in $$props) $$invalidate(3, skinTone = $$props.skinTone);
    	};

    	$$self.$capture_state = () => ({
    		valdoApparelColorStore,
    		shoulderPoint,
    		hipPoint,
    		torsoThickness,
    		fullName,
    		skinTone,
    		firstName,
    		$valdoApparelColorStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('shoulderPoint' in $$props) $$invalidate(0, shoulderPoint = $$props.shoulderPoint);
    		if ('hipPoint' in $$props) $$invalidate(1, hipPoint = $$props.hipPoint);
    		if ('torsoThickness' in $$props) $$invalidate(2, torsoThickness = $$props.torsoThickness);
    		if ('fullName' in $$props) $$invalidate(6, fullName = $$props.fullName);
    		if ('skinTone' in $$props) $$invalidate(3, skinTone = $$props.skinTone);
    		if ('firstName' in $$props) $$invalidate(5, firstName = $$props.firstName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		shoulderPoint,
    		hipPoint,
    		torsoThickness,
    		skinTone,
    		$valdoApparelColorStore,
    		firstName,
    		fullName
    	];
    }

    class ValdoTorso extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			shoulderPoint: 0,
    			hipPoint: 1,
    			torsoThickness: 2,
    			fullName: 6,
    			skinTone: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValdoTorso",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get shoulderPoint() {
    		throw new Error("<ValdoTorso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shoulderPoint(value) {
    		throw new Error("<ValdoTorso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hipPoint() {
    		throw new Error("<ValdoTorso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hipPoint(value) {
    		throw new Error("<ValdoTorso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get torsoThickness() {
    		throw new Error("<ValdoTorso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set torsoThickness(value) {
    		throw new Error("<ValdoTorso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullName() {
    		throw new Error("<ValdoTorso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullName(value) {
    		throw new Error("<ValdoTorso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skinTone() {
    		throw new Error("<ValdoTorso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skinTone(value) {
    		throw new Error("<ValdoTorso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Valdo\Valdo.svelte generated by Svelte v3.53.0 */
    const file$3 = "src\\Valdo\\Valdo.svelte";

    // (110:2) {:else}
    function create_else_block$1(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = `${/*fullName*/ ctx[5]}`;
    			attr_dev(h3, "class", "svelte-1utlztj");
    			add_location(h3, file$3, 110, 4, 3238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(110:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#if displaySVG}
    function create_if_block$3(ctx) {
    	let svg;
    	let valdohead;
    	let valdoneck;
    	let valdotorso;
    	let valdoarm0;
    	let valdoarm1;
    	let valdolegs;
    	let t;
    	let if_block_anchor;
    	let current;

    	valdohead = new ValdoHead({
    			props: {
    				headPoint: /*headPoint*/ ctx[11],
    				headDiameter: /*headDiameter*/ ctx[10],
    				strokeWidth: /*strokeWidth*/ ctx[9],
    				skinTone: /*skinTone*/ ctx[6]
    			},
    			$$inline: true
    		});

    	valdoneck = new ValdoNeck({
    			props: {
    				neckPoint: /*neckPoint*/ ctx[12],
    				shoulderPoint: /*shoulderPoint*/ ctx[13],
    				limbThickness: /*limbThickness*/ ctx[19],
    				skinTone: /*skinTone*/ ctx[6]
    			},
    			$$inline: true
    		});

    	valdotorso = new ValdoTorso({
    			props: {
    				shoulderPoint: /*shoulderPoint*/ ctx[13],
    				hipPoint: /*hipPoint*/ ctx[14],
    				torsoThickness: /*torsoThickness*/ ctx[20],
    				skinTone: /*skinTone*/ ctx[6],
    				fullName: /*fullName*/ ctx[5]
    			},
    			$$inline: true
    		});

    	valdoarm0 = new ValdoArm({
    			props: {
    				displayDots: /*displayDots*/ ctx[4],
    				fullName: /*fullName*/ ctx[5],
    				armType: 'right',
    				shoulderPoint: /*shoulderPoint*/ ctx[13],
    				headDiameter: /*headDiameter*/ ctx[10],
    				handPoint: /*rightHandPoint*/ ctx[15],
    				limbThickness: /*limbThickness*/ ctx[19],
    				skinTone: /*skinTone*/ ctx[6]
    			},
    			$$inline: true
    		});

    	valdoarm1 = new ValdoArm({
    			props: {
    				displayDots: /*displayDots*/ ctx[4],
    				fullName: /*fullName*/ ctx[5],
    				armType: 'left',
    				shoulderPoint: /*shoulderPoint*/ ctx[13],
    				headDiameter: /*headDiameter*/ ctx[10],
    				handPoint: /*leftHandPoint*/ ctx[16],
    				limbThickness: /*limbThickness*/ ctx[19],
    				skinTone: /*skinTone*/ ctx[6]
    			},
    			$$inline: true
    		});

    	valdolegs = new ValdoLegs({
    			props: {
    				displayDots: /*displayDots*/ ctx[4],
    				fullName: /*fullName*/ ctx[5],
    				hipPoint: /*hipPoint*/ ctx[14],
    				headDiameter: /*headDiameter*/ ctx[10],
    				limbThickness: /*limbThickness*/ ctx[19],
    				skinTone: /*skinTone*/ ctx[6],
    				rightFootPoint: /*rightFootPoint*/ ctx[17],
    				leftFootPoint: /*leftFootPoint*/ ctx[18],
    				gender: /*gender*/ ctx[7]
    			},
    			$$inline: true
    		});

    	let if_block = /*showFullName*/ ctx[3] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			create_component(valdohead.$$.fragment);
    			create_component(valdoneck.$$.fragment);
    			create_component(valdotorso.$$.fragment);
    			create_component(valdoarm0.$$.fragment);
    			create_component(valdoarm1.$$.fragment);
    			create_component(valdolegs.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(svg, "width", /*width*/ ctx[8]);
    			attr_dev(svg, "height", /*totalHeight*/ ctx[1]);
    			add_location(svg, file$3, 64, 4, 2061);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			mount_component(valdohead, svg, null);
    			mount_component(valdoneck, svg, null);
    			mount_component(valdotorso, svg, null);
    			mount_component(valdoarm0, svg, null);
    			mount_component(valdoarm1, svg, null);
    			mount_component(valdolegs, svg, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const valdoarm0_changes = {};
    			if (dirty & /*displayDots*/ 16) valdoarm0_changes.displayDots = /*displayDots*/ ctx[4];
    			valdoarm0.$set(valdoarm0_changes);
    			const valdoarm1_changes = {};
    			if (dirty & /*displayDots*/ 16) valdoarm1_changes.displayDots = /*displayDots*/ ctx[4];
    			valdoarm1.$set(valdoarm1_changes);
    			const valdolegs_changes = {};
    			if (dirty & /*displayDots*/ 16) valdolegs_changes.displayDots = /*displayDots*/ ctx[4];
    			valdolegs.$set(valdolegs_changes);

    			if (!current || dirty & /*totalHeight*/ 2) {
    				attr_dev(svg, "height", /*totalHeight*/ ctx[1]);
    			}

    			if (/*showFullName*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(valdohead.$$.fragment, local);
    			transition_in(valdoneck.$$.fragment, local);
    			transition_in(valdotorso.$$.fragment, local);
    			transition_in(valdoarm0.$$.fragment, local);
    			transition_in(valdoarm1.$$.fragment, local);
    			transition_in(valdolegs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(valdohead.$$.fragment, local);
    			transition_out(valdoneck.$$.fragment, local);
    			transition_out(valdotorso.$$.fragment, local);
    			transition_out(valdoarm0.$$.fragment, local);
    			transition_out(valdoarm1.$$.fragment, local);
    			transition_out(valdolegs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_component(valdohead);
    			destroy_component(valdoneck);
    			destroy_component(valdotorso);
    			destroy_component(valdoarm0);
    			destroy_component(valdoarm1);
    			destroy_component(valdolegs);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(64:2) {#if displaySVG}",
    		ctx
    	});

    	return block;
    }

    // (107:4) {#if showFullName}
    function create_if_block_1$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${/*fullName*/ ctx[5]}`;
    			attr_dev(p, "class", "svelte-1utlztj");
    			add_location(p, file$3, 107, 6, 3193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(107:4) {#if showFullName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*displaySVG*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "svelte-1utlztj");
    			toggle_class(div, "hoverPointer", /*hoverPointer*/ ctx[2]);
    			add_location(div, file$3, 62, 0, 1972);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*handleclick*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*hoverPointer*/ 4) {
    				toggle_class(div, "hoverPointer", /*hoverPointer*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Valdo', slots, []);
    	let { valdoData = {} } = $$props;
    	let { displaySVG = true } = $$props;
    	let { totalHeight = 100 } = $$props;
    	let { hoverPointer = true } = $$props;
    	let { showFullName = false } = $$props;
    	let { displayDots = true } = $$props;

    	let { firstName = 'Jeshua', lastName = 'Granstand', fullName = `${firstName} ${lastName}`, skinTone = 'black', greeting = 'hello', gender = 'none', correctResponse = 'yes', incorrectResponse = 'no', height = totalHeight * 0.95, width = height * 5 / 6, strokeWidth = 2, midPoint = { x: width / 2, y: height / 2 }, headDiameter = height / 7, headPoint = {
    		x: midPoint.x,
    		y: strokeWidth + headDiameter / 2
    	}, neckPoint = { x: midPoint.x, y: 2 + headDiameter }, shoulderPoint = { x: midPoint.x, y: 2 + 1.5 * headDiameter }, hipPoint = { x: midPoint.x, y: 4 * headDiameter }, rightHandPoint = {
    		x: midPoint.x + 2 * headDiameter,
    		y: hipPoint.y * 0.75
    	}, leftHandPoint = {
    		x: midPoint.x - 2 * headDiameter,
    		y: headPoint.y
    	}, rightFootPoint = {
    		x: midPoint.x + 2 * headDiameter,
    		y: hipPoint.y * 1.25
    	}, leftFootPoint = {
    		x: midPoint.x - 2 * headDiameter,
    		y: height
    	}, limbThickness = height / 50, torsoThickness = limbThickness } = valdoData;

    	const dispatch = createEventDispatcher();

    	function handleclick() {
    		dispatch('tag', {
    			fullName,
    			greeting,
    			correctResponse,
    			incorrectResponse
    		});
    	}

    	const writable_props = [
    		'valdoData',
    		'displaySVG',
    		'totalHeight',
    		'hoverPointer',
    		'showFullName',
    		'displayDots'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Valdo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('valdoData' in $$props) $$invalidate(22, valdoData = $$props.valdoData);
    		if ('displaySVG' in $$props) $$invalidate(0, displaySVG = $$props.displaySVG);
    		if ('totalHeight' in $$props) $$invalidate(1, totalHeight = $$props.totalHeight);
    		if ('hoverPointer' in $$props) $$invalidate(2, hoverPointer = $$props.hoverPointer);
    		if ('showFullName' in $$props) $$invalidate(3, showFullName = $$props.showFullName);
    		if ('displayDots' in $$props) $$invalidate(4, displayDots = $$props.displayDots);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		fade,
    		ValdoArm,
    		ValdoHead,
    		ValdoLegs,
    		ValdoNeck,
    		ValdoTorso,
    		valdoData,
    		displaySVG,
    		totalHeight,
    		hoverPointer,
    		showFullName,
    		displayDots,
    		firstName,
    		lastName,
    		fullName,
    		skinTone,
    		greeting,
    		gender,
    		correctResponse,
    		incorrectResponse,
    		height,
    		width,
    		strokeWidth,
    		midPoint,
    		headDiameter,
    		headPoint,
    		neckPoint,
    		shoulderPoint,
    		hipPoint,
    		rightHandPoint,
    		leftHandPoint,
    		rightFootPoint,
    		leftFootPoint,
    		limbThickness,
    		torsoThickness,
    		dispatch,
    		handleclick
    	});

    	$$self.$inject_state = $$props => {
    		if ('valdoData' in $$props) $$invalidate(22, valdoData = $$props.valdoData);
    		if ('displaySVG' in $$props) $$invalidate(0, displaySVG = $$props.displaySVG);
    		if ('totalHeight' in $$props) $$invalidate(1, totalHeight = $$props.totalHeight);
    		if ('hoverPointer' in $$props) $$invalidate(2, hoverPointer = $$props.hoverPointer);
    		if ('showFullName' in $$props) $$invalidate(3, showFullName = $$props.showFullName);
    		if ('displayDots' in $$props) $$invalidate(4, displayDots = $$props.displayDots);
    		if ('firstName' in $$props) firstName = $$props.firstName;
    		if ('lastName' in $$props) lastName = $$props.lastName;
    		if ('fullName' in $$props) $$invalidate(5, fullName = $$props.fullName);
    		if ('skinTone' in $$props) $$invalidate(6, skinTone = $$props.skinTone);
    		if ('greeting' in $$props) greeting = $$props.greeting;
    		if ('gender' in $$props) $$invalidate(7, gender = $$props.gender);
    		if ('correctResponse' in $$props) correctResponse = $$props.correctResponse;
    		if ('incorrectResponse' in $$props) incorrectResponse = $$props.incorrectResponse;
    		if ('height' in $$props) height = $$props.height;
    		if ('width' in $$props) $$invalidate(8, width = $$props.width);
    		if ('strokeWidth' in $$props) $$invalidate(9, strokeWidth = $$props.strokeWidth);
    		if ('midPoint' in $$props) midPoint = $$props.midPoint;
    		if ('headDiameter' in $$props) $$invalidate(10, headDiameter = $$props.headDiameter);
    		if ('headPoint' in $$props) $$invalidate(11, headPoint = $$props.headPoint);
    		if ('neckPoint' in $$props) $$invalidate(12, neckPoint = $$props.neckPoint);
    		if ('shoulderPoint' in $$props) $$invalidate(13, shoulderPoint = $$props.shoulderPoint);
    		if ('hipPoint' in $$props) $$invalidate(14, hipPoint = $$props.hipPoint);
    		if ('rightHandPoint' in $$props) $$invalidate(15, rightHandPoint = $$props.rightHandPoint);
    		if ('leftHandPoint' in $$props) $$invalidate(16, leftHandPoint = $$props.leftHandPoint);
    		if ('rightFootPoint' in $$props) $$invalidate(17, rightFootPoint = $$props.rightFootPoint);
    		if ('leftFootPoint' in $$props) $$invalidate(18, leftFootPoint = $$props.leftFootPoint);
    		if ('limbThickness' in $$props) $$invalidate(19, limbThickness = $$props.limbThickness);
    		if ('torsoThickness' in $$props) $$invalidate(20, torsoThickness = $$props.torsoThickness);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		displaySVG,
    		totalHeight,
    		hoverPointer,
    		showFullName,
    		displayDots,
    		fullName,
    		skinTone,
    		gender,
    		width,
    		strokeWidth,
    		headDiameter,
    		headPoint,
    		neckPoint,
    		shoulderPoint,
    		hipPoint,
    		rightHandPoint,
    		leftHandPoint,
    		rightFootPoint,
    		leftFootPoint,
    		limbThickness,
    		torsoThickness,
    		handleclick,
    		valdoData
    	];
    }

    class Valdo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			valdoData: 22,
    			displaySVG: 0,
    			totalHeight: 1,
    			hoverPointer: 2,
    			showFullName: 3,
    			displayDots: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Valdo",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get valdoData() {
    		throw new Error("<Valdo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valdoData(value) {
    		throw new Error("<Valdo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displaySVG() {
    		throw new Error("<Valdo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displaySVG(value) {
    		throw new Error("<Valdo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalHeight() {
    		throw new Error("<Valdo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalHeight(value) {
    		throw new Error("<Valdo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverPointer() {
    		throw new Error("<Valdo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverPointer(value) {
    		throw new Error("<Valdo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showFullName() {
    		throw new Error("<Valdo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showFullName(value) {
    		throw new Error("<Valdo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayDots() {
    		throw new Error("<Valdo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayDots(value) {
    		throw new Error("<Valdo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Header.svelte generated by Svelte v3.53.0 */

    const { console: console_1 } = globals;
    const file$2 = "src\\Header.svelte";

    // (57:28) 
    function create_if_block_3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Play Again?";
    			attr_dev(button, "class", "hoverPointer svelte-3yivzb");
    			add_location(button, file$2, 57, 6, 1695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*startTimer*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(57:28) ",
    		ctx
    	});

    	return block;
    }

    // (55:40) 
    function create_if_block_2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Current Valdo:";
    			attr_dev(h2, "class", "svelte-3yivzb");
    			add_location(h2, file$2, 55, 6, 1634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(55:40) ",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if !$valdoStore.activatedGame && !completedGame}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Click to Start";
    			attr_dev(button, "class", "hoverPointer svelte-3yivzb");
    			add_location(button, file$2, 53, 6, 1510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*startTimer*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(53:4) {#if !$valdoStore.activatedGame && !completedGame}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {:else}
    function create_else_block(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "New Valdo Pending...";
    			add_location(h4, file$2, 72, 6, 2125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(72:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#if $valdoStore.activatedGame}
    function create_if_block$2(ctx) {
    	let previous_key = /*$valdoStore*/ ctx[1].activeValdo;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$valdoStore*/ 2 && safe_not_equal(previous_key, previous_key = /*$valdoStore*/ ctx[1].activeValdo)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(62:4) {#if $valdoStore.activatedGame}",
    		ctx
    	});

    	return block;
    }

    // (63:6) {#key $valdoStore.activeValdo}
    function create_key_block(ctx) {
    	let valdo;
    	let current;

    	valdo = new Valdo({
    			props: {
    				displayDots: false,
    				totalHeight: 100,
    				valdoData: /*$valdoStore*/ ctx[1].activeValdo,
    				displaySVG: /*displaySVG*/ ctx[0],
    				hoverPointer: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(valdo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(valdo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const valdo_changes = {};
    			if (dirty & /*$valdoStore*/ 2) valdo_changes.valdoData = /*$valdoStore*/ ctx[1].activeValdo;
    			if (dirty & /*displaySVG*/ 1) valdo_changes.displaySVG = /*displaySVG*/ ctx[0];
    			valdo.$set(valdo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(valdo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(valdo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(valdo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(63:6) {#key $valdoStore.activeValdo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let header;
    	let div0;
    	let h30;
    	let t0;
    	let t1_value = /*$gameTimer*/ ctx[3].score + "";
    	let t1;
    	let t2;
    	let h31;
    	let t3;
    	let t4_value = /*$gameTimer*/ ctx[3].highScore + "";
    	let t4;
    	let t5;
    	let h32;
    	let t6;
    	let t7_value = /*$gameTimer*/ ctx[3].remainingTime + "";
    	let t7;
    	let t8;
    	let t9;
    	let div1;
    	let t10;
    	let div2;
    	let current_block_type_index;
    	let if_block1;
    	let t11;
    	let timerbar;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (!/*$valdoStore*/ ctx[1].activatedGame && !/*completedGame*/ ctx[2]) return create_if_block_1;
    		if (/*$valdoStore*/ ctx[1].activatedGame) return create_if_block_2;
    		if (/*completedGame*/ ctx[2]) return create_if_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$valdoStore*/ ctx[1].activatedGame) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	timerbar = new TimerBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			h30 = element("h3");
    			t0 = text("Current Score: ");
    			t1 = text(t1_value);
    			t2 = space();
    			h31 = element("h3");
    			t3 = text("High Score: ");
    			t4 = text(t4_value);
    			t5 = space();
    			h32 = element("h3");
    			t6 = text("Remaining Time: ");
    			t7 = text(t7_value);
    			t8 = text("s");
    			t9 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t10 = space();
    			div2 = element("div");
    			if_block1.c();
    			t11 = space();
    			create_component(timerbar.$$.fragment);
    			attr_dev(h30, "class", "svelte-3yivzb");
    			add_location(h30, file$2, 45, 4, 1264);
    			attr_dev(h31, "class", "svelte-3yivzb");
    			add_location(h31, file$2, 46, 4, 1312);
    			attr_dev(h32, "class", "svelte-3yivzb");
    			add_location(h32, file$2, 47, 4, 1361);
    			attr_dev(div0, "class", "gameInfoWrapper svelte-3yivzb");
    			add_location(div0, file$2, 44, 2, 1229);
    			attr_dev(div1, "class", "svelte-3yivzb");
    			add_location(div1, file$2, 51, 2, 1441);
    			attr_dev(div2, "class", "currentValdoWrapper svelte-3yivzb");
    			add_location(div2, file$2, 60, 2, 1791);
    			attr_dev(header, "class", "svelte-3yivzb");
    			add_location(header, file$2, 43, 0, 1217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			append_dev(div0, h30);
    			append_dev(h30, t0);
    			append_dev(h30, t1);
    			append_dev(div0, t2);
    			append_dev(div0, h31);
    			append_dev(h31, t3);
    			append_dev(h31, t4);
    			append_dev(div0, t5);
    			append_dev(div0, h32);
    			append_dev(h32, t6);
    			append_dev(h32, t7);
    			append_dev(h32, t8);
    			append_dev(header, t9);
    			append_dev(header, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(header, t10);
    			append_dev(header, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			insert_dev(target, t11, anchor);
    			mount_component(timerbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$gameTimer*/ 8) && t1_value !== (t1_value = /*$gameTimer*/ ctx[3].score + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$gameTimer*/ 8) && t4_value !== (t4_value = /*$gameTimer*/ ctx[3].highScore + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*$gameTimer*/ 8) && t7_value !== (t7_value = /*$gameTimer*/ ctx[3].remainingTime + "")) set_data_dev(t7, t7_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div2, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(timerbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(timerbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t11);
    			destroy_component(timerbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $valdoStore;
    	let $gameTimer;
    	validate_store(valdoStore, 'valdoStore');
    	component_subscribe($$self, valdoStore, $$value => $$invalidate(1, $valdoStore = $$value));
    	validate_store(gameTimer, 'gameTimer');
    	component_subscribe($$self, gameTimer, $$value => $$invalidate(3, $gameTimer = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { displaySVG = true } = $$props;
    	let timerId;
    	let completedGame = false;

    	function startTimer() {
    		if (!$valdoStore.activatedGame) {
    			valdoStore.startNewGame();
    		}

    		gameTimer.setTimerActive();
    		timerId = setInterval(() => checkTimer(timerId), 1000);
    		console.log($gameTimer);
    	}

    	function checkTimer(id) {
    		if ($gameTimer.remainingTime > 0) {
    			gameTimer.decrementTime(1);
    		} else if ($gameTimer.remainingTime <= 0) {
    			console.log('finished game:', completedGame, $valdoStore, $gameTimer);
    			stopTimer(id);
    		}
    	}

    	function stopTimer(id) {
    		clearInterval(id);
    		gameTimer.setTimerInactive();

    		if ($gameTimer.score > $gameTimer.highScore) {
    			gameTimer.setHighscore($gameTimer.score);
    		}

    		$$invalidate(2, completedGame = true);
    		gameTimer.resetGame();
    		valdoStore.finishGame();
    		console.log('finished game:', completedGame, $valdoStore, $gameTimer);
    	}

    	const writable_props = ['displaySVG'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('displaySVG' in $$props) $$invalidate(0, displaySVG = $$props.displaySVG);
    	};

    	$$self.$capture_state = () => ({
    		TimerBar,
    		gameTimer,
    		valdoStore,
    		Valdo,
    		displaySVG,
    		timerId,
    		completedGame,
    		startTimer,
    		checkTimer,
    		stopTimer,
    		$valdoStore,
    		$gameTimer
    	});

    	$$self.$inject_state = $$props => {
    		if ('displaySVG' in $$props) $$invalidate(0, displaySVG = $$props.displaySVG);
    		if ('timerId' in $$props) timerId = $$props.timerId;
    		if ('completedGame' in $$props) $$invalidate(2, completedGame = $$props.completedGame);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$valdoStore*/ 2) {
    			console.log($valdoStore.activeValdo);
    		}
    	};

    	return [displaySVG, $valdoStore, completedGame, $gameTimer, startTimer];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { displaySVG: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get displaySVG() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displaySVG(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ValdoDisplay.svelte generated by Svelte v3.53.0 */

    const file$1 = "src\\ValdoDisplay.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-w77ngl");
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValdoDisplay', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValdoDisplay> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ValdoDisplay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValdoDisplay",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Modal.svelte generated by Svelte v3.53.0 */
    const file = "src\\Modal.svelte";

    // (11:0) {#if isModalOpen}
    function create_if_block$1(ctx) {
    	let div0;
    	let button;
    	let t1;
    	let div0_transition;
    	let t2;
    	let div1;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Close";
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			div1 = element("div");
    			attr_dev(button, "aria-label", "Close Modal Box");
    			add_location(button, file, 12, 4, 264);
    			attr_dev(div0, "class", "modal-wrapper svelte-1a13z2p");
    			add_location(div0, file, 11, 2, 191);
    			attr_dev(div1, "class", "background svelte-1a13z2p");
    			add_location(div1, file, 16, 2, 425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button);
    			append_dev(div0, t1);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*closeModal*/ ctx[1], false, false, false),
    					listen_dev(div1, "click", /*closeModal*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { opacity: 0, y: 100 }, true);
    				div0_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { opacity: 0, y: 100 }, false);
    			div0_transition.run(0);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(11:0) {#if isModalOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isModalOpen*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isModalOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isModalOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { isModalOpen = false } = $$props;

    	function closeModal() {
    		$$invalidate(0, isModalOpen = false);
    	}

    	const writable_props = ['isModalOpen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isModalOpen' in $$props) $$invalidate(0, isModalOpen = $$props.isModalOpen);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fly, fade, isModalOpen, closeModal });

    	$$self.$inject_state = $$props => {
    		if ('isModalOpen' in $$props) $$invalidate(0, isModalOpen = $$props.isModalOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isModalOpen, closeModal, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { isModalOpen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get isModalOpen() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isModalOpen(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.53.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (43:2) {#if $valdoStore.activatedGame}
    function create_if_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*$valdoStore*/ ctx[0].displayedValdos;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*valdoData*/ ctx[10].firstName;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$valdoStore, displaySVG, showFullName, displayDots, handleTag*/ 15) {
    				each_value = /*$valdoStore*/ ctx[0].displayedValdos;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(43:2) {#if $valdoStore.activatedGame}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#each $valdoStore.displayedValdos as valdoData (valdoData.firstName)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let valdo;
    	let current;

    	valdo = new Valdo({
    			props: {
    				valdoData: /*valdoData*/ ctx[10],
    				displaySVG,
    				showFullName: /*showFullName*/ ctx[1],
    				displayDots: /*displayDots*/ ctx[2]
    			},
    			$$inline: true
    		});

    	valdo.$on("tag", /*handleTag*/ ctx[3]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(valdo.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(valdo, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const valdo_changes = {};
    			if (dirty & /*$valdoStore*/ 1) valdo_changes.valdoData = /*valdoData*/ ctx[10];
    			valdo.$set(valdo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(valdo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(valdo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(valdo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(44:4) {#each $valdoStore.displayedValdos as valdoData (valdoData.firstName)}",
    		ctx
    	});

    	return block;
    }

    // (42:0) <ValdoDisplay>
    function create_default_slot(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$valdoStore*/ ctx[0].activatedGame && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$valdoStore*/ ctx[0].activatedGame) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$valdoStore*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(42:0) <ValdoDisplay>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t;
    	let valdodisplay;
    	let current;
    	header = new Header({ $$inline: true });

    	valdodisplay = new ValdoDisplay({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(valdodisplay.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(valdodisplay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const valdodisplay_changes = {};

    			if (dirty & /*$$scope, $valdoStore*/ 8193) {
    				valdodisplay_changes.$$scope = { dirty, ctx };
    			}

    			valdodisplay.$set(valdodisplay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(valdodisplay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(valdodisplay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(valdodisplay, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const displaySVG = true;

    function instance($$self, $$props, $$invalidate) {
    	let $valdoStore;
    	let $gameTimer;
    	validate_store(valdoStore, 'valdoStore');
    	component_subscribe($$self, valdoStore, $$value => $$invalidate(0, $valdoStore = $$value));
    	validate_store(gameTimer, 'gameTimer');
    	component_subscribe($$self, gameTimer, $$value => $$invalidate(4, $gameTimer = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let correctTagReward = 2;
    	let incorrectTagPenalty = 5;
    	let valdoTagBonus = 5;
    	let tagPointReward = 1;
    	let isModalOpen = true;
    	let showFullName = false;
    	let displayDots = false;

    	function handleTag(event) {
    		if ($gameTimer.timerActive) {
    			if (event.detail.fullName === $valdoStore.activeValdo.fullName) {
    				gameTimer.increaseScore(tagPointReward);

    				if ((/valdo/i).test(event.detail.fullName)) {
    					//give extra time for valdos with 'Valdo' as a first or last name
    					gameTimer.incrementTime(valdoTagBonus);
    				} else {
    					gameTimer.incrementTime(correctTagReward);
    				}

    				valdoStore.startNewRound();
    			} else {
    				gameTimer.decrementTime(incorrectTagPenalty);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Valdo,
    		ValdoDisplay,
    		valdoStore,
    		gameTimer,
    		Modal,
    		displaySVG,
    		correctTagReward,
    		incorrectTagPenalty,
    		valdoTagBonus,
    		tagPointReward,
    		isModalOpen,
    		showFullName,
    		displayDots,
    		handleTag,
    		$valdoStore,
    		$gameTimer
    	});

    	$$self.$inject_state = $$props => {
    		if ('correctTagReward' in $$props) correctTagReward = $$props.correctTagReward;
    		if ('incorrectTagPenalty' in $$props) incorrectTagPenalty = $$props.incorrectTagPenalty;
    		if ('valdoTagBonus' in $$props) valdoTagBonus = $$props.valdoTagBonus;
    		if ('tagPointReward' in $$props) tagPointReward = $$props.tagPointReward;
    		if ('isModalOpen' in $$props) isModalOpen = $$props.isModalOpen;
    		if ('showFullName' in $$props) $$invalidate(1, showFullName = $$props.showFullName);
    		if ('displayDots' in $$props) $$invalidate(2, displayDots = $$props.displayDots);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$valdoStore, showFullName, displayDots, handleTag];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
