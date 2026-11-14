// Web Audio 实时合成。没有任何惊吓音效。浏览器要求在用户点击后才能出声。
var AUDIO = (function () {
  var ctx = null, master = null, wind = null, on = false;

  function noiseBuffer(sec) {
    var len = ctx.sampleRate * sec, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; } // 棕噪声
    return buf;
  }

  function init() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    // 夜风：棕噪声 → 低通，低通频率被慢速 LFO 推动
    var src = ctx.createBufferSource(); src.buffer = noiseBuffer(4); src.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    var lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    var lfoGain = ctx.createGain(); lfoGain.gain.value = 220;
    lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
    wind = ctx.createGain(); wind.gain.value = 0.5;
    src.connect(lp); lp.connect(wind); wind.connect(master);
    src.start(); lfo.start();
    return true;
  }

  return {
    toggle: function () {
      if (!init()) return false;
      on = !on;
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.setTargetAtTime(on ? 0.6 : 0, ctx.currentTime, 0.4);
      return on;
    },
    isOn: function () { return on; },
    ping: function () {
      if (!on) return;
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
      o.frequency.setValueAtTime(740, t); o.frequency.exponentialRampToValueAtTime(520, t + 0.18);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.45);
    },
    // 语音消息：只有沙沙的噪声，音量忽大忽小，像隔着很远
    voice: function (sec) {
      if (!on) return;
      var t = ctx.currentTime, src = ctx.createBufferSource(); src.buffer = noiseBuffer(sec);
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8;
      var g = ctx.createGain(); g.gain.setValueAtTime(0, t);
      for (var i = 0; i < sec * 4; i++) g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.25, t + i / 4);
      g.gain.linearRampToValueAtTime(0, t + sec);
      src.connect(bp); bp.connect(g); g.connect(master); src.start(t); src.stop(t + sec);
    },
    // 结局：风声慢慢停下
    fade: function () { if (on) wind.gain.setTargetAtTime(0, ctx.currentTime, 3); }
  };
})();
