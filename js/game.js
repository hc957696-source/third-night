// 《第三夜》界面与状态。剧情全部来自 STORY（story.js）。
(function () {
  var S = STORY, KEY = 'third-night-v1';
  var screen = document.getElementById('screen');
  var banner = document.getElementById('banner');
  var overlay = document.getElementById('overlay');
  var view = { name: 'title' }, history = [];
  var st;

  // ---------- 存档 ----------
  function fresh(keepEndings) {
    return { started: false, startedAt: 0, unlocked: {}, read: {}, fired: {}, pending: {}, seen: {}, wrong: {},
      replied: null, log: [], ending: null, done: false, override: null, dead: false, endings: keepEndings || [] };
  }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) return Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
    return fresh();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  // ---------- 时间与电量 ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clock() {
    if (st.override) return st.override;
    var base = S.start.t.split(':'), mins = +base[0] * 60 + +base[1];
    if (st.startedAt) mins += Math.floor((Date.now() - st.startedAt) / 60000);
    var day = +S.start.d.split('-')[1] + Math.floor(mins / 1440);
    mins %= 1440;
    return { d: '11-' + pad(day), t: pad(Math.floor(mins / 60)) + ':' + pad(mins % 60) };
  }
  function battery() {
    if (st.dead) return 0;
    var used = st.startedAt ? Math.floor((Date.now() - st.startedAt) / 45000) : 0;
    return Math.max(5, S.start.battery - used);
  }
  function dayLabel(d) { var p = d.split('-'); return (+p[0]) + '月' + (+p[1]) + '日'; }

  // ---------- 小工具 ----------
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'); }
  function norm(s) {
    return String(s).replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); }).replace(/\s+/g, '');
  }
  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }
  function avatar(p, small) { return '<span class="av' + (small ? ' sm' : '') + '" style="background:' + p.c + '">' + esc(p.av) + '</span>'; }
  var ICON = {
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    sndOn: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8c2 2 2 6 0 8M18.5 5.5c3.5 3.5 3.5 9.5 0 13" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
    sndOff: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="1.6"/></svg>'
  };

  // ---------- 内容可见性 ----------
  function visible(item) { return !item.ev || !!st.fired[item.ev]; }
  function stamp(m) { return m.ev ? '11-13 ' + st.fired[m.ev] : m.d + ' ' + m.t; }
  function failed(m) { return m.from === 'me' && stamp(m) > S.death && st.ending !== 'home'; }
  function msgs(chat) { return chat.msgs.filter(visible); }
  function unread(chat) {
    if (st.seen[chat.id] === undefined) {
      // 初始未读：11 月 13 日别人发来的消息
      st.seen[chat.id] = msgs(chat).filter(function (m) { return !(m.d === '11-13' && m.from !== 'me'); }).length;
    }
    return Math.max(0, msgs(chat).length - st.seen[chat.id]);
  }
  function totalUnread() { return S.chats.reduce(function (n, c) { return n + unread(c); }, 0); }
  function strangerUnread() { return st.fired.finale && !st.read.stranger ? 1 : 0; }

  // ---------- 事件 ----------
  function trigger(key) {
    if (key.indexOf('unlock:') === 0) st.unlocked[key.slice(7)] = true;
    S.events.forEach(function (ev) {
      if (ev.on.indexOf(key) < 0 || st.fired[ev.id]) return;
      var due = Date.now() + ((ev.fast && ev.fast[key]) || ev.delay) * 1000;
      if (!st.pending[ev.id] || due < st.pending[ev.id]) st.pending[ev.id] = due;
    });
    save();
  }
  function tick() {
    var now = Date.now(), changed = false;
    Object.keys(st.pending).forEach(function (id) {
      if (st.pending[id] > now) return;
      delete st.pending[id];
      st.fired[id] = clock().t;
      if (id === 'home') st.ending = 'home';
      changed = true;
      notify(byId(S.events, id));
    });
    // 正在输密码时不重绘，否则会冲掉已输入的字和输入法状态
    if (changed) { save(); if (screen.querySelector('.tlock')) refreshStatus(); else render(true); }
    else refreshStatus();
  }

  function notify(ev) {
    var parts = ev.notify.split(':'), title, text;
    if (parts[0] === 'chat') {
      var chat = byId(S.chats, parts[1]), m = msgs(chat).filter(function (x) { return x.ev === ev.id; }).pop();
      title = chat.name;
      text = (chat.id === 'family' ? S.people[m.from].name + '：' : '') + (m.voice ? '[语音]' : m.photo ? '[图片]' : m.text);
    } else { title = S.finale.name; text = S.finale.text; }
    showBanner(title, text, ev.notify);
  }
  var bannerTimer;
  function showBanner(title, text, target) {
    AUDIO.ping();
    banner.innerHTML = '<b>' + esc(title) + '</b><span>' + esc(text) + '</span>';
    banner.dataset.target = target || '';
    banner.className = 'show';
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () { banner.className = ''; }, 4500);
  }
  banner.addEventListener('click', function () {
    banner.className = '';
    var t = banner.dataset.target;
    // 结局演出中只放行真结局自己的群消息横幅
    if (!t || !st.unlocked.screen || st.done || (st.replied && st.replied !== 'home')) return;
    var p = t.split(':');
    go(p[0] === 'chat' ? 'chat' : 'smsThread', p[1]);
  });

  // ---------- 导航 ----------
  function go(name, arg) { history.push(view); view = { name: name, arg: arg }; render(); }
  function back() { view = history.pop() || { name: 'home' }; render(); }
  function home() { history = []; view = { name: 'home' }; render(); }

  // ---------- 视图 ----------
  function status() {
    var c = clock(), b = battery();
    return '<div class="status"><span class="st-time">' + c.t + '</span>' +
      '<button class="snd" data-act="sound" aria-label="声音开关">' + (AUDIO.isOn() ? ICON.sndOn : ICON.sndOff) + '</button>' +
      '<span class="bat' + (b <= 10 ? ' low' : '') + '"><i style="width:' + b + '%"></i></span><span class="st-bat">' + b + '%</span></div>';
  }
  function refreshStatus() {
    // 只改文字和电量条，不重建按钮，免得吞掉声音开关的点击
    var t = screen.querySelector('.st-time'), b = battery();
    if (t) {
      t.textContent = clock().t;
      screen.querySelector('.st-bat').textContent = b + '%';
      screen.querySelector('.bat i').style.width = b + '%';
      screen.querySelector('.bat').className = 'bat' + (b <= 10 ? ' low' : '');
    }
    var big = screen.querySelector('.lock-time');
    if (big) big.textContent = clock().t;
  }
  function header(title) {
    return status() + '<div class="hdr"><button class="back" data-act="back" aria-label="返回">' + ICON.back + '</button><h2>' + esc(title) + '</h2></div>';
  }
  function homeBar() { return '<button class="homebar" data-act="home" aria-label="回到主屏"></button>'; }

  var views = {
    title: function () {
      var n = st.endings.length;
      return '<div class="title-scr"><h1>' + S.title + '</h1><p class="notice">' + esc(S.notice) + '</p>' +
        (st.started && !(st.done && st.replied !== 'home') ? '<button class="btn" data-act="continue">继续</button><button class="btn ghost" data-act="restart">重新开始</button>'
                    : '<button class="btn" data-act="begin">开始</button>') +
        '<button class="btn ghost" data-act="sound">' + (AUDIO.isOn() ? '声音：开' : '声音：关') + '</button>' +
        (n ? '<p class="got">已达成结局 ' + n + ' / 3</p>' : '') + '</div>';
    },
    intro: function (i) {
      return '<div class="intro" data-act="introNext">' + S.intro.slice(0, i + 1).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') +
        '<span class="tap">轻触继续</span></div>';
    },
    lock: function (mode) {
      var c = clock(), lk = S.locks.screen, bday = byId(S.photos, 'bday');
      var notes = st.override ? [{ t: '城北客运站', x: '【城北客运站】您乘坐的班次已到站：青石镇路口。' }] : [
        { t: '林家大院（11）', x: '奶奶：[语音]' }, { t: '奶奶', x: '[语音]' }, { t: '妈妈', x: '满满？' }, { t: '未接来电', x: '妈妈（23）' }
      ];
      var out = '<div class="lock"><div class="wall">' + ART.draw(bday) + '</div>' + status() +
        '<div class="lock-time">' + c.t + '</div><div class="lock-date">' + dayLabel(c.d) + '</div>';
      if (mode !== 'pin') {
        out += '<div class="lock-notes">' + notes.map(function (n) { return '<div class="ln"><b>' + esc(n.t) + '</b><span>' + esc(n.x) + '</span></div>'; }).join('') + '</div>' +
          (st.override ? '' : '<button class="unlock" data-act="pin">轻触解锁</button>');
      } else {
        var w = st.wrong.screen || 0;
        out += '<div class="pin"><p>' + lk.prompt + '</p><div class="dots">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (pinBuf.length > i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
          '<p class="hint">' + esc(lk.hint) + (w >= 3 ? '<br>' + esc(lk.help) : '') + '</p><div class="keys">' +
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(function (k) {
            return k ? '<button data-act="key" data-arg="' + k + '">' + k + '</button>' : '<span></span>';
          }).join('') + '</div></div>';
      }
      return out + '</div>';
    },
    home: function () {
      var apps = [
        { id: 'chats', name: '微语', badge: totalUnread(), cls: 'a-chat', g: '语' },
        { id: 'photos', name: '相册', badge: 0, cls: 'a-photo', g: '相' },
        { id: 'notes', name: '备忘录', badge: 0, cls: 'a-note', g: '记' },
        { id: 'calls', name: '电话', badge: st.read.calls ? 0 : 33, cls: 'a-call', g: '话' },
        { id: 'sms', name: '短信', badge: strangerUnread(), cls: 'a-sms', g: '信' }
      ];
      return '<div class="homescr">' + status() + '<div class="grid">' + apps.map(function (a) {
        return '<button class="app" data-act="open" data-arg="' + a.id + '"><span class="ic ' + a.cls + '">' + a.g +
          (a.badge ? '<em>' + a.badge + '</em>' : '') + '</span>' + a.name + '</button>';
      }).join('') + '</div>' + homeBar() + '</div>';
    },
    chats: function () {
      return header('微语') + '<div class="list">' + S.chats.map(function (c) {
        var ms = msgs(c), last = ms[ms.length - 1], n = unread(c);
        var preview = last.voice ? '[语音]' : last.photo ? '[图片]' : last.text;
        if (c.id === 'family' && last.from !== 'me') preview = S.people[last.from].name + '：' + preview;
        return '<button class="row" data-act="chat" data-arg="' + c.id + '">' + avatar(c) + '<div class="rt"><b>' + esc(c.name) +
          '</b><span>' + esc(preview) + '</span></div><div class="rm"><small>' + esc(last.ev ? st.fired[last.ev] : (last.d === '11-13' ? last.t : dayLabel(last.d))) + '</small>' +
          (n ? '<em>' + n + '</em>' : '') + '</div></button>';
      }).join('') + '</div>' + homeBar();
    },
    chat: function (id) {
      var c = byId(S.chats, id), lastDay = '', out = header(c.name) + '<div class="thread">';
      st.seen[id] = msgs(c).length; save();
      c.msgs.forEach(function (m, i) {
        if (!visible(m)) return;
        var d = m.ev ? '11-13' : m.d;
        if (d !== lastDay) { out += '<div class="day">' + dayLabel(d) + '</div>'; lastDay = d; }
        var me = m.from === 'me', p = S.people[m.from], body, extra = '';
        if (m.voice) {
          var key = 'v:' + id + ':' + i;
          body = '<button class="bub voice" data-act="voice" data-arg="' + key + '" data-sec="' + m.sec + '">▶ ' + m.sec + '″</button>';
          if (st.read[key]) extra = '<div class="stt">' + esc(m.voice) + '</div>';
        } else if (m.photo) {
          body = '<button class="bub pic" data-act="photo" data-arg="' + m.photo + '">' + ART.draw(byId(S.photos, m.photo)) + '</button>';
        } else body = '<div class="bub">' + esc(m.text) + '</div>';
        out += '<div class="msg' + (me ? ' me' : '') + '">' + (me ? '' : avatar(p, true)) + '<div class="mc">' +
          (!me && id === 'family' ? '<small class="who">' + esc(p.name) + '</small>' : '') +
          '<div class="mb">' + (failed(m) ? '<span class="fail" title="发送失败">!</span>' : '') + body + '</div>' + extra +
          '<small class="tm">' + esc(m.ev ? st.fired[m.ev] : m.t) + '</small></div>' + (me ? avatar(S.people.me, true) : '') + '</div>';
      });
      return out + '</div>' + homeBar();
    },
    photos: function () {
      var list = S.photos.filter(function (p) { return p.album === 'main' && visible(p); });
      return header('相册') + '<div class="pgrid">' + list.map(function (p) {
        return '<button class="thumb" data-act="photo" data-arg="' + p.id + '">' + ART.draw(p) + '</button>';
      }).join('') + '</div>' +
        (st.read.diary ? '<button class="album" data-act="deleted">最近删除<span>' + (st.unlocked.deleted ? '1 张' : '已加锁') + '</span></button>' : '') + homeBar();
    },
    deleted: function () {
      if (!st.unlocked.deleted) return textLock('deleted');
      return header('最近删除') + '<div class="pgrid">' + S.photos.filter(function (p) { return p.album === 'deleted'; }).map(function (p) {
        return '<button class="thumb" data-act="photo" data-arg="' + p.id + '">' + ART.draw(p) + '</button>';
      }).join('') + '</div><p class="tip">照片将在 30 天后永久删除</p>' + homeBar();
    },
    photo: function (id) {
      var p = byId(S.photos, id), when = p.ev ? '11月13日 ' + st.fired[p.ev] : dayLabel(p.d) + ' ' + p.t;
      return header(when) + '<div class="viewer">' + ART.draw(p) + '</div>' + (p.caption ? '<p class="cap">' + esc(p.caption) + '</p>' : '') + homeBar();
    },
    notes: function () {
      return header('备忘录') + '<div class="list">' + S.notes.map(function (n) {
        var locked = n.lock && !st.unlocked[n.lock];
        var first = n.body ? n.body.split('\n')[0] : (locked ? '已加锁' : n.entries[0].text.split('\n')[0]);
        return '<button class="row note" data-act="note" data-arg="' + n.id + '"><div class="rt"><b>' + (n.lock ? '🔒 ' : '') + esc(n.title) +
          '</b><span>' + esc(first) + '</span></div><div class="rm"><small>' + dayLabel(n.d) + '</small></div></button>';
      }).join('') + '</div>' + homeBar();
    },
    note: function (id) {
      var n = byId(S.notes, id);
      if (n.lock && !st.unlocked[n.lock]) return textLock(n.lock);
      if (n.entries && !st.read.diary) { st.read.diary = true; trigger('read:diary'); }
      var body = n.body ? '<p>' + esc(n.body) + '</p>' : n.entries.map(function (e) {
        return '<h3>' + dayLabel(e.d) + ' ' + e.t + '</h3><p>' + esc(e.text) + '</p>';
      }).join('');
      return header(n.title) + '<div class="paper">' + body + '</div>' + homeBar();
    },
    calls: function () {
      st.read.calls = true; save();
      return header('电话') + '<div class="list">' + S.calls.map(function (c) {
        return '<div class="row call' + (c.missed ? ' missed' : '') + '"><div class="rt"><b>' + esc(c.who) + (c.n > 1 ? '（' + c.n + '）' : '') +
          '</b><span>' + (c.missed ? '未接来电' : c.out ? '呼出' : '呼入') + '</span></div><div class="rm"><small>' + dayLabel(c.d) + ' ' + c.t + '</small></div></div>';
      }).join('') + '</div>' + homeBar();
    },
    sms: function () {
      var rows = S.sms.map(function (s) {
        var last = s.msgs[s.msgs.length - 1];
        return '<button class="row" data-act="smsThread" data-arg="' + s.id + '"><div class="rt"><b>' + esc(s.name) + '</b><span>' + esc(last.text) +
          '</span></div><div class="rm"><small>' + dayLabel(last.d) + '</small></div></button>';
      });
      if (st.fired.finale) rows.unshift('<button class="row" data-act="smsThread" data-arg="stranger"><div class="rt"><b>' + S.finale.name +
        '</b><span>' + esc(S.finale.text) + '</span></div><div class="rm"><small>' + st.fired.finale + '</small>' + (strangerUnread() ? '<em>1</em>' : '') + '</div></button>');
      return header('短信') + '<div class="list">' + rows.join('') + '</div>' + homeBar();
    },
    smsThread: function (id) {
      if (id === 'stranger') return stranger();
      var s = byId(S.sms, id);
      return header(s.name) + '<div class="thread">' + s.msgs.map(function (m) {
        return '<div class="day">' + dayLabel(m.d) + ' ' + m.t + '</div><div class="msg"><div class="mc"><div class="bub">' + esc(m.text) + '</div></div></div>';
      }).join('') + '</div>' + homeBar();
    }
  };

  function textLock(id) {
    var lk = S.locks[id], w = st.wrong[id] || 0;
    return header(lk.prompt) + '<form class="tlock" data-lock="' + id + '"><p class="hint">' + esc(lk.hint) + '</p>' +
      (w >= 3 ? '<p class="help">' + esc(lk.help) + '</p>' : '') +
      '<input name="a" autocomplete="off" ' + (lk.answer.match(/^\d+$/) ? 'inputmode="numeric" ' : '') + 'placeholder="输入密码" aria-label="密码">' +
      '<button class="btn" type="submit">解锁</button>' + (w ? '<p class="err">密码错误</p>' : '') + '</form>' + homeBar();
  }

  function stranger() {
    st.read.stranger = true; save();
    var out = header(S.finale.name) + '<div class="thread"><div class="day">11月13日 ' + st.fired.finale + '</div>' +
      '<div class="msg"><div class="mc"><div class="bub">' + esc(S.finale.text) + '</div></div></div>';
    st.log.forEach(function (l) {
      out += '<div class="msg' + (l.me ? ' me' : '') + '"><div class="mc"><div class="bub">' + esc(l.text) + '</div></div></div>';
    });
    out += '</div>';
    if (!st.replied) {
      out += '<div class="replies">' + S.finale.replies.map(function (r, i) {
        var ok = !r.needs || st.unlocked[r.needs.split(':')[1]];
        return '<button class="reply" ' + (ok ? 'data-act="reply" data-arg="' + i + '"' : 'disabled') + '>' + esc(ok ? r.text : r.locked) + '</button>';
      }).join('') + '</div>';
    }
    return out + homeBar();
  }

  // ---------- 结局 ----------
  function reply(i) {
    var r = S.finale.replies[i], end = S.endings[r.ending];
    st.replied = r.ending;
    st.log.push({ me: true, text: r.text });
    save(); render();
    var delay = 2200;
    end.replies.forEach(function (text) {
      setTimeout(function () { st.log.push({ text: text }); save(); AUDIO.ping(); if (view.arg === 'stranger') render(); }, delay);
      delay += 2200;
    });
    setTimeout(function () { finish(r.ending); }, delay);
  }

  function finish(key) {
    if (key === 'home') {
      trigger('ending:home');
      setTimeout(function () { card('home'); }, 14000);
    } else if (key === 'bus') {
      setTimeout(function () {
        st.override = { d: '11-10', t: '21:40' }; save();
        history = []; view = { name: 'lock' }; render();
        AUDIO.ping();
        setTimeout(function () { card('bus'); }, 5000);
      }, 1500);
    } else {
      var n = 0;
      var iv = setInterval(function () {
        showBanner('奶奶', '[语音]', '');
        if (++n >= 3) {
          clearInterval(iv);
          setTimeout(function () {
            st.dead = true; save();
            document.body.classList.add('dead');
            setTimeout(function () { card('road'); }, 2500);
          }, 1500);
        }
      }, 1600);
    }
  }

  function card(key) {
    var e = S.endings[key];
    if (st.endings.indexOf(key) < 0) st.endings.push(key);
    st.done = true; save();
    AUDIO.fade();
    overlay.innerHTML = '<div class="card"><small>结局 ' + e.no + ' / 3</small><h2>' + esc(e.title) + '</h2><p>' + esc(e.card) + '</p>' +
      (e.after ? '<p class="after">' + esc(e.after) + '</p>' : '') +
      (key === 'home' ? '<button class="btn" data-act="lookAgain">再看看这部手机</button>' : '') +
      '<button class="btn ghost" data-act="restart">重新开始</button><p class="got">已达成结局 ' + st.endings.length + ' / 3</p></div>';
    overlay.className = 'show';
  }

  // ---------- 渲染与交互 ----------
  var pinBuf = '';
  function render(keepScroll) {
    var th = screen.querySelector('.thread'), top = th ? th.scrollTop : 0, nearBottom = th && th.scrollHeight - th.scrollTop - th.clientHeight < 60;
    screen.innerHTML = views[view.name](view.arg);
    var nt = screen.querySelector('.thread');
    if (nt) nt.scrollTop = keepScroll && !nearBottom ? top : nt.scrollHeight;
  }

  function checkAnswer(id, value) {
    if (norm(value) === S.locks[id].answer) { st.wrong[id] = 0; trigger('unlock:' + id); return true; }
    st.wrong[id] = (st.wrong[id] || 0) + 1; save();
    return false;
  }

  screen.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, id = f.dataset.lock;
    if (checkAnswer(id, f.a.value)) render();
    else { render(); var nf = screen.querySelector('.tlock'); nf.classList.add('shake'); }
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act, arg = el.dataset.arg;
    switch (act) {
      case 'sound': AUDIO.toggle(); render(true); break;
      case 'begin':
        document.body.classList.remove('dead');
        st = fresh(st.endings); st.started = true; save();
        view = { name: 'intro', arg: 0 }; render(); break;
      case 'continue':
        if (!st.startedAt) { st.startedAt = Date.now(); save(); } // 开场途中刷新过
        view = { name: st.unlocked.screen && !st.override ? 'home' : 'lock' }; render(); break;
      case 'restart':
        overlay.className = ''; document.body.classList.remove('dead');
        st = fresh(st.endings); save(); history = []; view = { name: 'title' }; render(); break;
      case 'introNext':
        if (view.arg < S.intro.length - 1) { view.arg++; render(); }
        else { st.startedAt = Date.now(); save(); view = { name: 'lock' }; render(); }
        break;
      case 'pin': pinBuf = ''; view = { name: 'lock', arg: 'pin' }; render(); break;
      case 'key':
        if (arg === '⌫') pinBuf = pinBuf.slice(0, -1); else if (pinBuf.length < 4) pinBuf += arg;
        render();
        if (pinBuf.length === 4) {
          var ok = checkAnswer('screen', pinBuf);
          setTimeout(function () {
            pinBuf = '';
            if (ok) home(); else { render(); screen.querySelector('.pin').classList.add('shake'); }
          }, 250);
        }
        break;
      case 'home': if (st.unlocked.screen && !st.override && !st.dead) home(); break;
      case 'back': back(); break;
      case 'open': go(arg); break;
      case 'chat': case 'photo': case 'note': case 'smsThread': go(act, arg); break;
      case 'deleted': go('deleted'); break;
      case 'voice':
        AUDIO.voice(+el.dataset.sec);
        if (!st.read[arg]) {
          el.textContent = '转文字中…';
          setTimeout(function () { st.read[arg] = true; save(); render(true); }, 1400);
        }
        break;
      case 'reply': reply(+arg); break;
      case 'lookAgain': overlay.className = ''; home(); break;
    }
  });

  // ---------- 启动 ----------
  st = load();
  if (st.replied && !st.done) {
    // 结局演出途中刷新：直接补完
    var end = S.endings[st.replied];
    st.log = st.log.slice(0, 1).concat(end.replies.map(function (t) { return { text: t }; }));
    if (st.replied === 'home') { st.fired.home = st.fired.home || clock().t; st.fired.home2 = st.fired.home2 || clock().t; st.ending = 'home'; delete st.pending.home; delete st.pending.home2; }
    if (st.replied === 'bus') st.override = { d: '11-10', t: '21:40' };
    if (st.replied === 'road') { st.dead = true; document.body.classList.add('dead'); }
    card(st.replied);
  }
  render();
  setInterval(tick, 1000);
})();
