(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;

    /* =========================================================
       Command Engine — natural language parser
       ========================================================= */

    var MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
                  'july', 'august', 'september', 'october', 'november', 'december'];

    var DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    var EVENTS = [
        'customer visit', 'site visit', 'site inspection', 'inspection',
        'follow up', 'followup', 'kick off', 'kickoff',
        'quotation review', 'design review', 'review',
        'invoice', 'quotation', 'purchase order', 'delivery', 'dispatch',
        'installation', 'commissioning', 'handover', 'training',
        'meeting', 'call', 'demo', 'audit', 'payment'
    ];

    function pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function formatDate(d) {
        return pad(d.getDate()) + ' ' +
               MONTHS[d.getMonth()].slice(0, 3).replace(/^./, function (c) { return c.toUpperCase(); }) +
               ' ' + d.getFullYear();
    }

    function parseProject(text) {
        var m = text.match(/\bproject\s*#?\s*(\d{1,6})\b/i);
        if (m) { return m[1]; }
        m = text.match(/\bp\s*[-#]?\s*(\d{2,6})\b/i);
        if (m) { return m[1]; }
        m = text.match(/\bprj\s*[-#]?\s*(\d{1,6})\b/i);
        return m ? m[1] : null;
    }

    function parseEvent(text) {
        var lower = text.toLowerCase();
        var found = null;
        for (var i = 0; i < EVENTS.length; i++) {
            if (lower.indexOf(EVENTS[i]) !== -1) {
                if (!found || EVENTS[i].length > found.length) {
                    found = EVENTS[i];
                }
            }
        }
        if (!found) { return null; }
        return found.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    function parseDate(text) {
        var lower = text.toLowerCase();
        var now = new Date();
        var i;

        var m = lower.match(/\b(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})\b/);
        if (m) {
            var yr = parseInt(m[3], 10);
            if (yr < 100) { yr += 2000; }
            var d = new Date(yr, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
            if (!isNaN(d.getTime())) { return formatDate(d); }
        }

        var MON = '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*';

        m = lower.match(new RegExp('\\b(\\d{1,2})\\s*(?:st|nd|rd|th)?\\s+' + MON + '\\b'));
        if (!m) {
            var r = lower.match(new RegExp('\\b' + MON + '\\s+(\\d{1,2})\\b'));
            if (r) { m = [r[0], r[2], r[1]]; }
        }
        if (m) {
            for (i = 0; i < MONTHS.length; i++) {
                if (MONTHS[i].indexOf(m[2]) === 0) {
                    return formatDate(new Date(now.getFullYear(), i, parseInt(m[1], 10)));
                }
            }
        }

        if (/\btoday\b/.test(lower)) { return formatDate(now); }

        if (/\btomorrow\b/.test(lower)) {
            var t = new Date(now);
            t.setDate(t.getDate() + 1);
            return formatDate(t);
        }

        m = lower.match(/\bnext\s+([a-z]+day)\b/);
        if (m) {
            var target = DAYS.indexOf(m[1]);
            if (target !== -1) {
                var nx = new Date(now);
                var delta = (target - nx.getDay() + 7) % 7 || 7;
                nx.setDate(nx.getDate() + delta);
                return formatDate(nx);
            }
        }

        m = lower.match(/\bin\s+(\d{1,3})\s+days?\b/);
        if (m) {
            var fut = new Date(now);
            fut.setDate(fut.getDate() + parseInt(m[1], 10));
            return formatDate(fut);
        }

        return null;
    }

    function parseTags(text) {
        var tags = [];
        var re = /[@#]([A-Za-z][\w-]*)/g;
        var m;
        while ((m = re.exec(text)) !== null) {
            tags.push(m[0]);
        }
        return tags.length ? tags.join('  ') : null;
    }

    var engine = document.querySelector('[data-engine]');
    var input = document.getElementById('scrap');
    var caret = document.getElementById('caret');

    var outputs = {
        project: document.getElementById('out-project'),
        event: document.getElementById('out-event'),
        date: document.getElementById('out-date'),
        tags: document.getElementById('out-tags')
    };

    var last = {};

    function setOut(el, value, key) {
        if (!el) { return; }
        var text = value || '—';
        if (last[key] === text) { return; }
        last[key] = text;

        el.textContent = text;
        el.classList.toggle('hit', !!value);

        if (reduced) { return; }

        el.classList.remove('pulse');
        void el.offsetWidth;
        el.classList.add('pulse');

        var row = el.closest('.out-row');
        if (row && value) {
            row.classList.remove('flash');
            void row.offsetWidth;
            row.classList.add('flash');
        }
    }

    function run() {
        if (!input) { return; }
        var text = input.value;
        setOut(outputs.project, parseProject(text), 'project');
        setOut(outputs.event, parseEvent(text), 'event');
        setOut(outputs.date, parseDate(text), 'date');
        setOut(outputs.tags, parseTags(text), 'tags');
    }

    var measurer = null;

    function measureWidth(text) {
        if (!input) { return 0; }
        if (!measurer) {
            measurer = document.createElement('span');
            var cs = window.getComputedStyle(input);
            measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;';
            measurer.style.font = cs.font;
            measurer.style.letterSpacing = cs.letterSpacing;
            document.body.appendChild(measurer);
        }
        measurer.textContent = text;
        return measurer.offsetWidth;
    }

    function moveCaret(text) {
        if (!caret) { return; }
        caret.style.transform = 'translateX(' + measureWidth(text) + 'px)';
    }

    var DEMO_TEXT = 'Project 907 customer visit on 20-08-2026';
    var typed = false;
    var typingTimer = null;

    function stopTyping() {
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
        if (engine) { engine.classList.remove('typing'); }
    }

    function autoType() {
        if (typed || !input) { return; }
        typed = true;

        if (reduced) {
            input.value = DEMO_TEXT;
            run();
            return;
        }

        engine.classList.add('typing');
        var i = 0;

        function step() {
            if (i > DEMO_TEXT.length) {
                typingTimer = setTimeout(stopTyping, 700);
                return;
            }
            input.value = DEMO_TEXT.slice(0, i);
            moveCaret(input.value);
            run();
            i++;
            typingTimer = setTimeout(step, 26 + Math.random() * 46);
        }

        typingTimer = setTimeout(step, 260);
    }

    if (input) {
        input.addEventListener('input', function () {
            typed = true;
            stopTyping();
            run();
        });
        input.addEventListener('focus', function () {
            typed = true;
            stopTyping();
        });
        run();
    }

    document.querySelectorAll('.sample').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!input) { return; }
            typed = true;
            stopTyping();
            input.value = btn.getAttribute('data-sample') || '';
            input.focus();
            run();
        });
    });

    /* =========================================================
       Hero letter split
       ========================================================= */

    var splitTarget = document.querySelector('[data-split]');
    if (splitTarget && !reduced) {
        var source = splitTarget.textContent;
        splitTarget.textContent = '';
        var delay = 0.34;

        source.split('').forEach(function (ch) {
            var span = document.createElement('span');
            if (ch === ' ') {
                span.className = 'sp';
                span.innerHTML = '&nbsp;';
            } else {
                span.className = 'ch';
                span.textContent = ch;
                span.style.animationDelay = delay.toFixed(3) + 's';
                delay += 0.035;
            }
            splitTarget.appendChild(span);
        });
    }

    /* =========================================================
       Reveal on scroll (+ staggered children)
       ========================================================= */

    function showEl(el) {
        el.classList.add('shown');
        var kids = el.matches('[data-stagger]') ? el.children : el.querySelectorAll('[data-stagger] > *');
        Array.prototype.forEach.call(kids, function (kid, i) {
            kid.style.transitionDelay = reduced ? '0s' : (i * 0.045).toFixed(3) + 's';
        });
        el.querySelectorAll('[data-stagger]').forEach(function (group) {
            group.classList.add('shown');
        });
    }

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                showEl(entry.target);
                if (entry.target.matches('[data-engine]')) { autoType(); }
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('[data-reveal], [data-stagger]').forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        document.querySelectorAll('[data-reveal], [data-stagger]').forEach(showEl);
        autoType();
    }

    /* =========================================================
       Scroll progress + back to top + scroll spy
       ========================================================= */

    var progress = document.getElementById('progress');
    var toTop = document.getElementById('toTop');
    var spyLinks = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
    var ticking = false;

    function onScroll() {
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        var y = window.scrollY || doc.scrollTop;

        if (progress) {
            progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        }

        if (toTop) {
            toTop.classList.toggle('on', y > 600);
        }

        var mid = y + window.innerHeight * 0.35;
        var activeId = null;
        spyLinks.forEach(function (link) {
            var section = document.getElementById(link.getAttribute('data-spy'));
            if (section && section.offsetTop <= mid) {
                activeId = link.getAttribute('data-spy');
            }
        });
        spyLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-spy') === activeId);
        });

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    onScroll();

    /* =========================================================
       Pointer-driven effects (desktop only)
       ========================================================= */

    if (finePointer && !reduced) {
        var bloom = document.getElementById('bloom');
        if (bloom) {
            window.addEventListener('mousemove', function (e) {
                var dx = (e.clientX / window.innerWidth - 0.5) * 70;
                var dy = (e.clientY / window.innerHeight - 0.5) * 50;
                bloom.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
            }, { passive: true });
        }

        document.querySelectorAll('.magnetic').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
                var dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
                el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });

        document.querySelectorAll('[data-tilt]').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
                var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
                card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) +
                                       'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-3px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    /* =========================================================
       Live GitHub activity
       ========================================================= */

    (function githubActivity() {
        var panel = document.querySelector('[data-github]');
        if (!panel) { return; }

        var username = panel.getAttribute('data-github') || '';
        var loading = document.getElementById('ghLoading');
        var list = document.getElementById('ghList');
        var empty = document.getElementById('ghEmpty');

        function show(el) { if (el) { el.hidden = false; } }
        function hide(el) { if (el) { el.hidden = true; } }

        // Placeholder username hasn't been swapped for a real one yet.
        if (!username || username.indexOf('your-') === 0) {
            hide(loading);
            show(empty);
            return;
        }

        var timeoutId = setTimeout(function () {
            hide(loading);
            show(empty);
        }, 6000);

        fetch('https://api.github.com/users/' + encodeURIComponent(username) + '/events/public')
            .then(function (res) {
                if (!res.ok) { throw new Error('github fetch failed'); }
                return res.json();
            })
            .then(function (events) {
                clearTimeout(timeoutId);
                hide(loading);

                var rows = [];
                for (var i = 0; i < events.length && rows.length < 6; i++) {
                    var ev = events[i];
                    var line = describeEvent(ev);
                    if (line) { rows.push(line); }
                }

                if (!rows.length) {
                    show(empty);
                    return;
                }

                rows.forEach(function (row) {
                    var li = document.createElement('li');

                    var repo = document.createElement('span');
                    repo.className = 'gh-repo';
                    repo.textContent = row.repo;

                    var msg = document.createElement('span');
                    msg.className = 'gh-msg';
                    msg.textContent = row.msg;

                    var when = document.createElement('span');
                    when.className = 'gh-when';
                    when.textContent = row.when;

                    li.appendChild(repo);
                    li.appendChild(msg);
                    li.appendChild(when);
                    list.appendChild(li);
                });

                show(list);
            })
            .catch(function () {
                clearTimeout(timeoutId);
                hide(loading);
                show(empty);
            });

        function describeEvent(ev) {
            var repo = ev.repo ? ev.repo.name.split('/').pop() : 'repo';
            var when = timeAgo(ev.created_at);

            switch (ev.type) {
                case 'PushEvent':
                    var commit = ev.payload && ev.payload.commits && ev.payload.commits.length
                        ? ev.payload.commits[ev.payload.commits.length - 1].message
                        : 'pushed changes';
                    return { repo: repo, msg: commit.split('\n')[0], when: when };
                case 'CreateEvent':
                    return { repo: repo, msg: 'created ' + (ev.payload.ref_type || 'repo'), when: when };
                case 'PullRequestEvent':
                    return { repo: repo, msg: (ev.payload.action || 'updated') + ' a pull request', when: when };
                case 'IssuesEvent':
                    return { repo: repo, msg: (ev.payload.action || 'updated') + ' an issue', when: when };
                case 'WatchEvent':
                    return { repo: repo, msg: 'starred the repo', when: when };
                case 'ForkEvent':
                    return { repo: repo, msg: 'forked the repo', when: when };
                default:
                    return null;
            }
        }

        function timeAgo(iso) {
            var diff = (Date.now() - new Date(iso).getTime()) / 1000;
            if (diff < 3600) { return Math.max(1, Math.round(diff / 60)) + 'm ago'; }
            if (diff < 86400) { return Math.round(diff / 3600) + 'h ago'; }
            return Math.round(diff / 86400) + 'd ago';
        }
    })();

    /* =========================================================
       Hidden terminal — konami code easter egg
       ========================================================= */

    (function terminal() {
        var overlay = document.getElementById('termOverlay');
        var termInput = document.getElementById('termInput');
        var termLog = document.getElementById('termLog');
        var termBody = document.getElementById('termBody');
        if (!overlay || !termInput || !termLog) { return; }

        var KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        var progressIdx = 0;
        var open = false;

        function line(text, cls) {
            var div = document.createElement('div');
            if (cls) { div.className = cls; }
            div.textContent = text;
            termLog.appendChild(div);
            if (termBody) { termBody.scrollTop = termBody.scrollHeight; }
        }

        function boot() {
            termLog.innerHTML = '';
            line('booting guest shell...', 'out-line');
            line('welcome. this is not part of the résumé.', 'out-line');
            line("type 'help' to see what's here.", 'out-line');
        }

        function openTerm() {
            if (open) { return; }
            open = true;
            overlay.classList.add('on');
            overlay.setAttribute('aria-hidden', 'false');
            boot();
            setTimeout(function () { termInput.focus(); }, 60);
            document.addEventListener('keydown', onEscape);
        }

        function closeTerm() {
            if (!open) { return; }
            open = false;
            overlay.classList.remove('on');
            overlay.setAttribute('aria-hidden', 'true');
            document.removeEventListener('keydown', onEscape);
        }

        function onEscape(e) {
            if (e.key === 'Escape') { closeTerm(); }
        }

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) { closeTerm(); }
        });

        var wordmark = document.getElementById('wordmark');
        if (wordmark) {
            var tapCount = 0;
            var tapTimer = null;
            wordmark.addEventListener('click', function () {
                tapCount++;
                clearTimeout(tapTimer);
                tapTimer = setTimeout(function () { tapCount = 0; }, 2200);
                if (tapCount >= 5) {
                    tapCount = 0;
                    openTerm();
                }
            });
        }

        window.addEventListener('keydown', function (e) {
            if (open) { return; }
            var expected = KONAMI[progressIdx];
            var got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (got === expected) {
                progressIdx++;
                if (progressIdx === KONAMI.length) {
                    progressIdx = 0;
                    openTerm();
                }
            } else {
                progressIdx = (got === KONAMI[0]) ? 1 : 0;
            }
        });

        var COMMANDS = {
            help: function () {
                line('available commands:', 'out-line');
                line('  help                 show this list');
                line('  whoami                who you are talking to');
                line('  projects              jump to projects');
                line('  contact               jump to contact');
                line('  ls                    list sections on this page');
                line('  sudo make me a sandwich   try it');
                line('  clear                 clear the screen');
                line('  exit                  close this terminal');
            },
            whoami: function () {
                line('guest — but you found the part of the site that isn\'t on the résumé.', 'out-line');
                line('Aswinth built this. He also built the résumé. Draw your own conclusions.', 'out-line');
            },
            ls: function () {
                line('#engine  #work  #personal  #experience  #certifications  #stack  #github  #contact', 'out-line');
            },
            projects: function () {
                line('jumping to projects...', 'out-line');
                closeTerm();
                document.getElementById('personal')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
            },
            contact: function () {
                line('jumping to contact...', 'out-line');
                closeTerm();
                document.getElementById('contact')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
            },
            clear: function () {
                termLog.innerHTML = '';
            },
            exit: function () {
                line('goodbye.', 'out-line');
                setTimeout(closeTerm, 220);
            }
        };

        function run(raw) {
            var cmd = raw.trim();
            if (!cmd) { return; }
            line('guest@portfolio:~$ ' + cmd, 'cmd-line');

            var lower = cmd.toLowerCase();

            if (lower === 'sudo make me a sandwich') {
                line("okay.", 'out-line');
                return;
            }
            if (lower.indexOf('sudo') === 0) {
                line('Permission denied: guest is not in the sudoers file. This incident will not be reported.', 'err-line');
                return;
            }

            var handler = COMMANDS[lower];
            if (handler) {
                handler();
            } else {
                line("command not found: " + cmd + " — try 'help'", 'err-line');
            }
        }

        termInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                var val = termInput.value;
                termInput.value = '';
                run(val);
            }
        });

        var termSend = document.getElementById('termSend');
        if (termSend) {
            termSend.addEventListener('click', function () {
                var val = termInput.value;
                termInput.value = '';
                run(val);
                termInput.focus();
            });
        }
    })();

    /* =========================================================
       Mobile nav — hamburger toggle
       ========================================================= */

    (function mobileNav() {
        var toggle = document.getElementById('navToggle');
        var nav = document.getElementById('topnav');
        if (!toggle || !nav) { return; }

        function close() {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', close);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 680) { close(); }
        });
    })();
})();
