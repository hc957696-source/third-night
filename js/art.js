// 所有插画：ART.draw(photo) 返回 SVG 字符串。画布 300x400，低饱和 + 噪点。
var ART = (function () {
  var uid = 0;

  function wrap(body, bg) {
    var f = 'g' + (++uid);
    return '<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><filter id="' + f + '"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>' +
      '<feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0"/></filter></defs>' +
      '<rect width="300" height="400" fill="' + bg + '"/>' + body +
      '<rect width="300" height="400" filter="url(#' + f + ')" opacity="0.5"/>' +
      '<rect width="300" height="400" fill="#20242a" opacity="0.12"/></svg>';
  }

  // 人物剪影。o: {hair:'bob'|'bun'|'short', clip:true, cloth, seated, smile}
  function person(x, y, s, o) {
    o = o || {};
    var skin = o.skin || '#b9ab9c', cloth = o.cloth || '#4c5058', hair = o.hairColor || '#2a2a2d';
    var h = y - 46 * s; // 头中心
    var out = '';
    if (o.seated) {
      out += '<rect x="' + (x - 16 * s) + '" y="' + (y - 30 * s) + '" width="' + 32 * s + '" height="' + 34 * s + '" rx="' + 6 * s + '" fill="' + cloth + '"/>';
      h = y - 40 * s;
    } else {
      out += '<path d="M' + (x - 17 * s) + ' ' + (y + 40 * s) + ' L' + (x - 15 * s) + ' ' + (y - 24 * s) + ' Q' + x + ' ' + (y - 34 * s) + ' ' + (x + 15 * s) + ' ' + (y - 24 * s) + ' L' + (x + 17 * s) + ' ' + (y + 40 * s) + ' Z" fill="' + cloth + '"/>';
    }
    out += '<circle cx="' + x + '" cy="' + h + '" r="' + 11 * s + '" fill="' + skin + '"/>';
    var r = 11.8 * s, cap = 'M' + (x - r) + ' ' + (h - 1 * s) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + (h - 1 * s);
    if (o.hair === 'bob') {
      out += '<path d="' + cap + ' L' + (x + r) + ' ' + (h + 8 * s) + ' L' + (x + 8 * s) + ' ' + (h + 8 * s) + ' L' + (x + 8 * s) + ' ' + (h - 3 * s) + ' L' + (x - 8 * s) + ' ' + (h - 3 * s) + ' L' + (x - 8 * s) + ' ' + (h + 8 * s) + ' L' + (x - r) + ' ' + (h + 8 * s) + ' Z" fill="' + hair + '"/>';
      if (o.clip) out += '<rect x="' + (x + 5 * s) + '" y="' + (h - 9 * s) + '" width="' + 6 * s + '" height="' + 2.4 * s + '" rx="1" fill="' + (o.clipColor || '#a14a46') + '" transform="rotate(-20 ' + (x + 8 * s) + ' ' + (h - 8 * s) + ')"/>';
    } else if (o.hair === 'bun') {
      out += '<path d="' + cap + ' Q' + x + ' ' + (h - 6 * s) + ' ' + (x - r) + ' ' + (h - 1 * s) + ' Z" fill="#a9a6a2"/>' +
        '<circle cx="' + x + '" cy="' + (h - 12 * s) + '" r="' + 5 * s + '" fill="#a9a6a2"/>';
    } else {
      out += '<path d="' + cap + ' Q' + x + ' ' + (h - 5 * s) + ' ' + (x - r) + ' ' + (h - 1 * s) + ' Z" fill="' + hair + '"/>';
    }
    if (o.smile) out += '<path d="M' + (x - 4 * s) + ' ' + (h + 4 * s) + ' Q' + x + ' ' + (h + 7 * s) + ' ' + (x + 4 * s) + ' ' + (h + 4 * s) + '" stroke="#5a4d44" stroke-width="' + s + '" fill="none"/>';
    return out;
  }

  // 灵堂背景：白幔、奠字、供桌、遗像框。face: 'glare' | 'blur' | 'clear'
  function altar(face, scale) {
    var s = scale || 1, cx = 150, top = 70;
    var out = '<rect x="0" y="0" width="300" height="300" fill="#d9d8d3"/>' +
      '<path d="M0 0 Q75 30 150 0 Q225 30 300 0 L300 18 Q225 46 150 18 Q75 46 0 18 Z" fill="#c4c3bd"/>' +
      '<text x="' + cx + '" y="' + (top - 8) + '" font-size="34" text-anchor="middle" fill="#2c2c2e" font-family="serif">奠</text>';
    var fw = 56 * s, fh = 72 * s, fx = cx - fw / 2, fy = top + 10;
    out += '<rect x="' + fx + '" y="' + fy + '" width="' + fw + '" height="' + fh + '" fill="#1f1f22"/>' +
      '<rect x="' + (fx + 4) + '" y="' + (fy + 4) + '" width="' + (fw - 8) + '" height="' + (fh - 8) + '" fill="#8e8e8e"/>';
    if (face === 'clear' || face === 'glare' || face === 'blur') {
      out += '<g' + (face === 'blur' ? ' opacity="0.55"' : '') + '>' + person(cx, fy + fh - 4, 0.9 * s, { hair: 'bob', clip: true, clipColor: '#5e5e5e', skin: '#b4b4b4', hairColor: '#2e2e2e', cloth: '#3e3e3e', hairColor2: '' }) + '</g>';
    }
    if (face === 'glare') {
      out += '<ellipse cx="' + (cx + 4) + '" cy="' + (fy + fh * 0.36) + '" rx="' + 24 * s + '" ry="' + 20 * s + '" fill="#f4f3ee" opacity="0.96"/>' +
        '<ellipse cx="' + (cx + 4) + '" cy="' + (fy + fh * 0.36) + '" rx="' + 34 * s + '" ry="' + 28 * s + '" fill="#f4f3ee" opacity="0.4"/>';
    }
    // 黑纱
    out += '<path d="M' + fx + ' ' + fy + ' L' + (cx) + ' ' + (fy + 14) + ' L' + (fx + fw) + ' ' + fy + '" stroke="#111" stroke-width="5" fill="none"/>' +
      '<circle cx="' + cx + '" cy="' + (fy + 14) + '" r="7" fill="#111"/>';
    // 供桌、蜡烛、白花
    var ty = fy + fh + 30;
    out += '<rect x="40" y="' + ty + '" width="220" height="16" fill="#3a2f2b"/><rect x="50" y="' + (ty + 16) + '" width="200" height="90" fill="#2e2623"/>';
    [80, 220].forEach(function (x) {
      out += '<rect x="' + (x - 4) + '" y="' + (ty - 26) + '" width="8" height="26" fill="#e8e4da"/><ellipse cx="' + x + '" cy="' + (ty - 31) + '" rx="3" ry="6" fill="#e6d9a8"/>';
    });
    [110, 125, 175, 190].forEach(function (x, i) {
      out += '<circle cx="' + x + '" cy="' + (ty - 8 - (i % 2) * 6) + '" r="9" fill="#efeee9"/>';
    });
    return out;
  }

  // 合照用：灵堂缩小放到上半部，下半部站人
  function smallAltar() {
    return '<rect width="300" height="400" fill="#d9d8d3"/><g transform="translate(60,0) scale(0.6)">' + altar('blur', 0.8) + '</g>' +
      '<rect y="190" width="300" height="210" fill="#3a3a3c"/>';
  }

  var scenes = {
    bday: function (p) {
      return '<rect width="300" height="400" fill="#5c5650"/><rect y="250" width="300" height="150" fill="#463f3a"/>' +
        '<rect x="30" y="40" width="80" height="60" fill="#6c665e"/><rect x="190" y="30" width="70" height="110" fill="#4f4943"/>' +
        person(100, 250, 1.9, { hair: 'bun', cloth: '#5d5a63', smile: true }) +
        person(205, 245, 1.9, { hair: 'bob', clip: true, cloth: '#7a6a62', smile: true }) +
        '<rect x="20" y="290" width="260" height="14" fill="#2f2a27"/><rect x="30" y="304" width="240" height="96" fill="#3a332f"/>' +
        '<rect x="90" y="248" width="120" height="42" rx="4" fill="#e9e2d6"/><rect x="90" y="248" width="120" height="9" rx="3" fill="#c9a9a6"/>' +
        '<text x="150" y="280" font-size="14" text-anchor="middle" fill="#8a4a46" font-family="serif">' + (p.cake || '') + '</text>' +
        [118, 139, 161, 182].map(function (x) { return '<rect x="' + (x - 1.5) + '" y="232" width="3" height="16" fill="#d8cfc0"/><ellipse cx="' + x + '" cy="228" rx="2.2" ry="4" fill="#e3c98e"/>'; }).join('');
    },
    station: function () {
      return '<rect width="300" height="400" fill="#1d2127"/><rect y="290" width="300" height="110" fill="#26292d"/>' +
        '<rect x="20" y="120" width="260" height="140" fill="#2e333a"/><rect x="20" y="105" width="260" height="22" fill="#3b4048"/>' +
        '<text x="150" y="121" font-size="13" text-anchor="middle" fill="#c9c6bc" font-family="sans-serif">城 北 客 运 站</text>' +
        [40, 95, 150, 205].map(function (x) { return '<rect x="' + x + '" y="150" width="40" height="50" fill="#57606b" opacity="0.7"/>'; }).join('') +
        '<rect x="30" y="255" width="200" height="70" rx="8" fill="#556066"/><rect x="40" y="265" width="150" height="24" fill="#2c3338"/>' +
        '<circle cx="222" cy="310" r="6" fill="#e2dcc4"/><circle cx="70" cy="328" r="11" fill="#151719"/><circle cx="190" cy="328" r="11" fill="#151719"/>';
    },
    bus: function () {
      var rain = '';
      for (var i = 0; i < 40; i++) rain += '<line x1="' + ((i * 37) % 280 + 15) + '" y1="' + ((i * 53) % 300 + 40) + '" x2="' + ((i * 37) % 280 + 12) + '" y2="' + ((i * 53) % 300 + 58) + '" stroke="#9aa4ad" stroke-width="1" opacity="0.5"/>';
      return '<rect width="300" height="400" fill="#121519"/><rect x="18" y="30" width="264" height="330" rx="18" fill="#1a1f25" stroke="#30363d" stroke-width="10"/>' +
        '<path d="M18 290 L120 220 L180 220 L282 290 Z" fill="#20252b"/><circle cx="150" cy="214" r="3" fill="#d9cfa8" opacity="0.6"/>' +
        '<g opacity="0.18">' + person(200, 300, 1.3, { hair: 'bob', clip: true, cloth: '#8b8f96', skin: '#c9c9c9' }) + '</g>' + rain;
    },
    gate: function () {
      return '<rect width="300" height="400" fill="#16181b"/><rect y="320" width="300" height="80" fill="#202225"/>' +
        '<path d="M40 130 L150 80 L260 130 Z" fill="#2a2c2f"/><rect x="60" y="130" width="180" height="190" fill="#34363a"/>' +
        '<rect x="115" y="190" width="70" height="130" fill="#d6cfb8" opacity="0.85"/><rect x="115" y="190" width="70" height="130" fill="none" stroke="#1d1e20" stroke-width="5"/>' +
        [85, 215].map(function (x) { return '<line x1="' + x + '" y1="130" x2="' + x + '" y2="150" stroke="#666" /><ellipse cx="' + x + '" cy="168" rx="15" ry="19" fill="#ecebe6"/><rect x="' + (x - 6) + '" y="185" width="12" height="4" fill="#555"/>'; }).join('');
    },
    wake1: function () { return altar('glare', 1) + '<rect y="300" width="300" height="100" fill="#3a3a3c"/>'; },
    yard: function () {
      return '<rect width="300" height="400" fill="#8d9096"/><rect y="270" width="300" height="130" fill="#6e7075"/>' +
        '<rect x="60" y="80" width="180" height="190" fill="#5a5c60"/><rect x="110" y="140" width="80" height="130" fill="#3e3f42"/>' +
        '<rect x="160" y="200" width="16" height="10" rx="2" fill="#2a2a2a"/><path d="M164 200 Q168 190 172 200" stroke="#2a2a2a" stroke-width="2" fill="none"/>' +
        '<path d="M122 286 Q128 278 140 280 L142 290 L120 290 Z" fill="#c3b8ac"/><path d="M148 286 Q154 278 166 280 L168 290 L146 290 Z" fill="#c3b8ac"/>';
    },
    wake2: function () {
      // 10 个人：9 个穿孝服的家人 + 灵前椅子上穿深色便服的奶奶
      var out = smallAltar();
      out += '<rect x="246" y="150" width="34" height="52" fill="#3a2f2b"/>' + person(263, 200, 1.0, { hair: 'bun', cloth: '#3f3d44', seated: true });
      [[40, 290], [85, 286], [130, 290], [175, 286], [220, 290], [265, 286]].forEach(function (pt, i) {
        out += person(pt[0], pt[1], 1.0, { cloth: '#ecebe6', hair: i === 3 ? 'bob' : 'short' });
      });
      [[70, 372], [150, 376], [230, 372]].forEach(function (pt) { out += person(pt[0], pt[1], 1.15, { cloth: '#ecebe6' }); });
      return out;
    },
    wake3: function () {
      return '<rect width="300" height="400" fill="#cfcec9"/>' +
        '<rect x="55" y="40" width="190" height="250" fill="#1d1d20"/><rect x="66" y="51" width="168" height="228" fill="#9a9a9a"/>' +
        person(150, 270, 2.9, { hair: 'bob', clip: true, clipColor: '#5a5a5a', skin: '#bdbdbd', hairColor: '#2c2c2c', cloth: '#404040' }) +
        '<path d="M55 40 L150 62 L245 40" stroke="#0d0d0d" stroke-width="8" fill="none"/><circle cx="150" cy="62" r="12" fill="#0d0d0d"/>' +
        '<rect y="300" width="300" height="100" fill="#2e2623"/><rect x="236" y="250" width="10" height="50" fill="#e8e4da"/><ellipse cx="241" cy="243" rx="4" ry="8" fill="#e6d9a8"/>';
    },
    family: function () {
      // 11 个人。活着的家人只有 10 个。
      var out = smallAltar();
      [[35, 286], [81, 290], [127, 286], [173, 290], [219, 286], [265, 290]].forEach(function (pt, i) {
        out += person(pt[0], pt[1], 1.0, { cloth: '#e3e2dd', hair: i === 2 ? 'bob' : 'short' });
      });
      out += '<rect x="128" y="330" width="44" height="60" fill="#3a2f2b"/>' + person(150, 378, 1.15, { hair: 'bun', cloth: '#3f3d44', seated: true });
      [[40, 372], [90, 376], [210, 376], [260, 372]].forEach(function (pt) { out += person(pt[0], pt[1], 1.15, { cloth: '#ecebe6' }); });
      return out;
    }
  };

  var bgs = { bday: '#5c5650', station: '#1d2127', bus: '#121519', gate: '#16181b', wake1: '#d9d8d3', yard: '#8d9096', wake2: '#d9d8d3', wake3: '#cfcec9', family: '#d9d8d3' };

  return {
    draw: function (p) { return wrap(scenes[p.id](p), bgs[p.id]); },
    has: function (id) { return !!scenes[id]; }
  };
})();

if (typeof module !== 'undefined') module.exports = ART;
