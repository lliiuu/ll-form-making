
/** ***************************************** */
/*                                          */
/* Copyright (c) 2018 AoEncry */
/* @author bgu, pgao, zyang */
/*                                          */
/** ***************************************** */


var AoEncryJS = AoEncryJS || (function(Math, undefined) {
	var C = {};
	var fK = C.gM = {};
	var Base = fK.Base = (function() {
		function F() {
		};
		return {
			extend : function(ho) {
				F.prototype = this;
				var hf = new F();
				if (ho) {
					hf.mc(ho);
				}
				if (!hf.hasOwnProperty('fw')) {
					hf.fw = function() {
						hf.so.fw.apply(this, arguments);
					};
				}
				hf.fw.prototype = hf;
				hf.so = this;
				return hf;
			},
			create : function() {
				var lZ = this.extend();
				lZ.fw.apply(lZ, arguments);
				return lZ;
			},
			fw : function() {
			},
			mc : function(jR) {
				for (var propertyName in jR) {
					if (jR.hasOwnProperty(propertyName)) {
						this[propertyName] = jR[propertyName];
					}
				}
				if (jR.hasOwnProperty('toString')) {
					this.toString = jR.toString;
				}
			},
			clone : function() {
				return this.fw.prototype.extend(this);
			}
		};
	}());
	var ej = fK.ej = Base.extend({
				fw : function(dC, fq) {
					dC = this.dC = dC || [];
					if (fq != undefined) {
						this.fq = fq;
					} else {
						this.fq = dC.length * 4;
					}
				},
				toString : function(sl) {
					return (sl || jj).stringify(this);
				},
				concat : function(eP) {
					var ky = this.dC;
					var ld = eP.dC;
					var jQ = this.fq;
					var nc = eP.fq;
					this.dY();
					if (jQ % 4) {
						for (var i = 0; i < nc; i++) {
							var ss = (ld[i >>> 2] >>> (24 - (i % 4) * 8))
									& 0xff;
							ky[(jQ + i) >>> 2] |= ss << (24 - ((jQ + i) % 4)
									* 8);
						}
					} else if (ld.length > 0xffff) {
						for (var i = 0; i < nc; i += 4) {
							ky[(jQ + i) >>> 2] = ld[i >>> 2];
						}
					} else {
						ky.push.apply(ky, ld);
					}
					this.fq += nc;
					return this;
				},
				dY : function() {
					var dC = this.dC;
					var fq = this.fq;
					dC[fq >>> 2] &= 0xffffffff << (32 - (fq % 4) * 8);
					dC.length = Math.ceil(fq / 4);
				},
				clone : function() {
					var clone = Base.clone.call(this);
					clone.dC = this.dC.slice(0);
					return clone;
				},
				random : function(qV) {
					var dC = [];
					for (var i = 0; i < qV; i += 4) {
						dC.push((AoEncryJS.fj.js.jo() * 0x100000000) | 0);
					}
					return new ej.fw(dC, qV);
				}
			});
	var it = C.fj = {};
	var js = it.js = {
		jo : function() {
			var n = 0xefc8249d;
			var data = new Date().getTime().toString();
			for (var i = 0; i < data.length; i++) {
				n += data.charCodeAt(i);
				var h = 0.02519603282416938 * n;
				n = h >>> 0;
				h -= n;
				h *= n;
				n = h >>> 0;
				h -= n;
				n += h * 0x100000000;
			}
			while (true) {
				var tm = new Date().getTime().toString();
				if (tm != data) {
					return (n >>> 0) * 2.3283064365386963e-10;
				}
			}
		}
	};
	var jj = it.jj = {
		stringify : function(eP) {
			var dC = eP.dC;
			var fq = eP.fq;
			var lC = [];
			for (var i = 0; i < fq; i++) {
				var ln = (dC[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
				lC.push((ln >>> 4).toString(16));
				lC.push((ln & 0x0f).toString(16));
			}
			return lC.join('');
		},
		parse : function(dV) {
			var gd = dV.length;
			var dC = [];
			for (var i = 0; i < gd; i += 2) {
				dC[i >>> 3] |= parseInt(dV.substr(i, 2), 16) << (24 - (i % 8)
						* 4);
			}
			return new ej.fw(dC, gd / 2);
		}
	};
	var ml = it.ml = {
		stringify : function(eP) {
			var dC = eP.dC;
			var fq = eP.fq;
			var re = [];
			for (var i = 0; i < fq; i++) {
				var ln = (dC[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
				re.push(String.fromCharCode(ln));
			}
			return re.join('');
		},
		parse : function(pH) {
			var pY = pH.length;
			var dC = [];
			for (var i = 0; i < pY; i++) {
				dC[i >>> 2] |= (pH.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
			}
			return new ej.fw(dC, pY);
		}
	};
	var fr = it.fr = {
		stringify : function(eP) {
			try {
				return decodeURIComponent(escape(ml.stringify(eP)));
			} catch (e) {
				throw new Error('Malformed UTF-8 data');
			}
		},
		parse : function(st) {
			return ml.parse(unescape(encodeURIComponent(st)));
		}
	};
	var jr = fK.jr = Base.extend({
				reset : function() {
					this.hm = new ej.fw();
					this.qc = 0;
				},
				mR : function(data) {
					if (typeof data == 'string') {
						data = fr.parse(data);
					}
					this.hm.concat(data);
					this.qc += data.fq;
				},
				iM : function(sr) {
					var data = this.hm;
					var iO = data.dC;
					var og = data.fq;
					var fd = this.fd;
					var kr = fd * 4;
					var kU = og / kr;
					if (sr) {
						kU = Math.ceil(kU);
					} else {
						kU = Math.max((kU | 0) - this.pR, 0);
					}
					var nk = kU * fd;
					var pE = Math.min(nk * 4, og);
					if (nk) {
						for (var offset = 0; offset < nk; offset += fd) {
							this.oe(iO, offset);
						}
						var tF = iO.splice(0, nk);
						data.fq -= pE;
					}
					return new ej.fw(tF, pE);
				},
				clone : function() {
					var clone = Base.clone.call(this);
					clone.hm = this.hm.clone();
					return clone;
				},
				pR : 0
			});
	var ia = fK.ia = jr.extend({
				cj : Base.extend(),
				fw : function(cj) {
					this.cj = this.cj.extend(cj);
					this.reset();
				},
				reset : function() {
					jr.reset.call(this);
					this.ob();
				},
				update : function(iY) {
					this.mR(iY);
					this.iM();
					this.hm = fr.parse(iY);
					return this;
				},
				gf : function(iY) {
					if (iY) {
						this.mR(iY);
					}
					var hash = this.mb();
					return hash;
				},
				fd : 512 / 32,
				nX : function(mj) {
					return function(message, cj) {
						return new mj.fw(cj).gf(message);
					};
				},
				sF : function(mj) {
					return function(message, key) {
						return new jL.ql.fw(mj, key).gf(message);
					};
				}
			});
	var jL = C.hB = {};
	return C;
}(Math));
if (typeof QMX == "undefined" || !QMX) {
	var QMX = {};
}
QMX.namespace = function() {
	var a = arguments, o = null, i, j, d;
	for (i = 0; i < a.length; i = i + 1) {
		d = ("" + a[i]).split(".");
		o = QMX;
		for (j = (d[0] == "QMX") ? 1 : 0; j < d.length; j = j + 1) {
			o[d[j]] = o[d[j]] || {};
			o = o[d[j]];
		}
	}
	return o;
};
QMX.log = function(rq, tY, src) {
	var l = QMX.widget.wX;
	if (l && l.log) {
		return l.log(rq, tY, src);
	} else {
		return false;
	}
};
QMX.uG = function(name, iQ, data) {
	var lW = QMX.fZ.pA, m, v, b, ls, i;
	if (!lW[name]) {
		lW[name] = {
			sz : [],
			sQ : []
		};
	}
	m = lW[name];
	v = data.version;
	b = data.qM;
	ls = QMX.fZ.qD;
	m.name = name;
	m.version = v;
	m.qM = b;
	m.sz.push(v);
	m.sQ.push(b);
	m.iQ = iQ;
	for (i = 0; i < ls.length; i = i + 1) {
		ls[i](m);
	}
	if (iQ) {
		iQ.VERSION = v;
		iQ.vJ = b;
	} else {
		QMX.log("iQ is undefined for ta " + name, "warn");
	}
};
QMX.fZ = QMX.fZ || {
	pA : [],
	qD : []
};
QMX.fZ.vx = function(name) {
	return QMX.fZ.pA[name] || null;
};
QMX.fZ.uz = function(rR) {
	var hC = function(s) {
		var c = 0;
		return parseFloat(s.replace(/\./g, function() {
					return (c++ == 1) ? '' : '.';
				}));
	}, nav = navigator, o = {
		pQ : 0,
		opera : 0,
		qy : 0,
		webkit : 0,
		uI : 0,
		hQ : null,
		si : 0,
		sA : 0,
		sM : 0,
		sV : 0,
		qL : null,
		sN : 0,
		rS : 0,
		vT : nav && nav.vu,
		secure : false,
		lF : null
	}, ua = rR || (navigator && navigator.userAgent), qW = window
			&& window.location, href = qW && qW.href, m;
	o.secure = href && (href.toLowerCase().indexOf("https") === 0);
	if (ua) {
		if ((/windows|win32/i).test(ua)) {
			o.lF = 'windows';
		} else if ((/macintosh/i).test(ua)) {
			o.lF = 'macintosh';
		} else if ((/rhino/i).test(ua)) {
			o.lF = 'rhino';
		}
		if ((/KHTML/).test(ua)) {
			o.webkit = 1;
		}
		m = ua.match(/AppleWebKit\/([^\s]*)/);
		if (m && m[1]) {
			o.webkit = hC(m[1]);
			if (/ Mobile\//.test(ua)) {
				o.hQ = 'Apple';
				m = ua.match(/OS ([^\s]*)/);
				if (m && m[1]) {
					m = hC(m[1].replace('_', '.'));
				}
				o.qL = m;
				o.sA = o.sV = o.sM = 0;
				m = ua.match(/iPad|iPod|iPhone/);
				if (m && m[0]) {
					o[m[0].toLowerCase()] = o.qL;
				}
			} else {
				m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
				if (m) {
					o.hQ = m[0];
				}
				if (/webOS/.test(ua)) {
					o.hQ = 'WebOS';
					m = ua.match(/webOS\/([^\s]*);/);
					if (m && m[1]) {
						o.rS = hC(m[1]);
					}
				}
				if (/ Android/.test(ua)) {
					o.hQ = 'Android';
					m = ua.match(/Android ([^\s]*);/);
					if (m && m[1]) {
						o.sN = hC(m[1]);
					}
				}
			}
			m = ua.match(/Chrome\/([^\s]*)/);
			if (m && m[1]) {
				o.uI = hC(m[1]);
			} else {
				m = ua.match(/AdobeAIR\/([^\s]*)/);
				if (m) {
					o.si = m[0];
				}
			}
		}
		if (!o.webkit) {
			m = ua.match(/Opera[\s\/]([^\s]*)/);
			if (m && m[1]) {
				o.opera = hC(m[1]);
				m = ua.match(/Version\/([^\s]*)/);
				if (m && m[1]) {
					o.opera = hC(m[1]);
				}
				m = ua.match(/Opera Mini[^;]*/);
				if (m) {
					o.hQ = m[0];
				}
			} else {
				m = ua.match(/MSIE\s([^;]*)/);
				if (m && m[1]) {
					o.pQ = hC(m[1]);
				} else {
					m = ua.match(/Gecko\/([^\s]*)/);
					if (m) {
						o.qy = 1;
						m = ua.match(/rv:([^\s\)]*)/);
						if (m && m[1]) {
							o.qy = hC(m[1]);
						}
					}
				}
			}
		}
	}
	return o;
};
QMX.fZ.ua = QMX.fZ.uz();
(function() {
	QMX.namespace("te", "widget", "example");
	if ("undefined" !== typeof QMX_config) {
		var l = QMX_config.vE, ls = QMX.fZ.qD, unique = true, i;
		if (l) {
			for (i = 0; i < ls.length; i++) {
				if (ls[i] == l) {
					unique = false;
					break;
				}
			}
			if (unique) {
				ls.push(l);
			}
		}
	}
})();
QMX.lang = QMX.lang || {};
(function() {
	var L = QMX.lang, iI = Object.prototype, sv = '[object Array]', uE = '[object Function]', tC = '[object Object]', uy = [], uu = {
		'&' : '&amp;',
		'<' : '&lt;',
		'>' : '&gt;',
		'"' : '&quot;',
		"'" : '&#x27;',
		'/' : '&#x2F;',
		'`' : '&#x60;'
	}, qO = ["toString", "valueOf"], ok = {
		isArray : function(o) {
			return iI.toString.apply(o) === sv;
		},
		rz : function(o) {
			return typeof o === 'boolean';
		},
		isFunction : function(o) {
			return (typeof o === 'function') || iI.toString.apply(o) === uE;
		},
		wx : function(o) {
			return o === null;
		},
		oE : function(o) {
			return typeof o === 'number' && isFinite(o);
		},
		kB : function(o) {
			return (o && (typeof o === 'object' || L.isFunction(o))) || false;
		},
		oB : function(o) {
			return typeof o === 'string';
		},
		qK : function(o) {
			return typeof o === 'undefined';
		},
		pi : (QMX.fZ.ua.pQ) ? function(r, s) {
			var i, kA, f;
			for (i = 0; i < qO.length; i = i + 1) {
				kA = qO[i];
				f = s[kA];
				if (L.isFunction(f) && f != iI[kA]) {
					r[kA] = f;
				}
			}
		} : function() {
		},
		wa : function(html) {
			return html.replace(/[&<>"'\/`]/g, function(match) {
						return uu[match];
					});
		},
		extend : function(iV, iP, ho) {
			if (!iP || !iV) {
				throw new Error("extend failed, please check that "
						+ "all dependencies are included.");
			}
			var F = function() {
			}, i;
			F.prototype = iP.prototype;
			iV.prototype = new F();
			iV.prototype.constructor = iV;
			iV.eJ = iP.prototype;
			if (iP.prototype.constructor == iI.constructor) {
				iP.prototype.constructor = iP;
			}
			if (ho) {
				for (i in ho) {
					if (L.hasOwnProperty(ho, i)) {
						iV.prototype[i] = ho[i];
					}
				}
				L.pi(iV.prototype, ho);
			}
		},
		mo : function(r, s) {
			if (!s || !r) {
				throw new Error("Absorb failed, jb dependencies.");
			}
			var a = arguments, i, p, nf = a[2];
			if (nf && nf !== true) {
				for (i = 2; i < a.length; i = i + 1) {
					r[a[i]] = s[a[i]];
				}
			} else {
				for (p in s) {
					if (nf || !(p in r)) {
						r[p] = s[p];
					}
				}
				L.pi(r, s);
			}
			return r;
		},
		py : function(r, s) {
			if (!s || !r) {
				throw new Error("Augment failed, jb dependencies.");
			}
			var a = [r.prototype, s.prototype], i;
			for (i = 2; i < arguments.length; i = i + 1) {
				a.push(arguments[i]);
			}
			L.mo.apply(this, a);
			return r;
		},
		dump : function(o, d) {
			var i, eF, s = [], om = "{...}", uN = "f(){...}", pf = ', ', ARROW = ' => ';
			if (!L.kB(o)) {
				return o + "";
			} else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
				return o;
			} else if (L.isFunction(o)) {
				return uN;
			}
			d = (L.oE(d)) ? d : 3;
			if (L.isArray(o)) {
				s.push("[");
				for (i = 0, eF = o.length; i < eF; i = i + 1) {
					if (L.kB(o[i])) {
						s.push((d > 0) ? L.dump(o[i], d - 1) : om);
					} else {
						s.push(o[i]);
					}
					s.push(pf);
				}
				if (s.length > 1) {
					s.pop();
				}
				s.push("]");
			} else {
				s.push("{");
				for (i in o) {
					if (L.hasOwnProperty(o, i)) {
						s.push(i + ARROW);
						if (L.kB(o[i])) {
							s.push((d > 0) ? L.dump(o[i], d - 1) : om);
						} else {
							s.push(o[i]);
						}
						s.push(pf);
					}
				}
				if (s.length > 1) {
					s.pop();
				}
				s.push("}");
			}
			return s.join("");
		},
		vz : function(s, o, f, ud) {
			var i, j, k, key, v, meta, lm = [], mX, qh = s.length, sD = 'dump', SPACE = ' ', uk = '{', uh = '}', dump, lD;
			for (;;) {
				i = s.lastIndexOf(uk, qh);
				if (i < 0) {
					break;
				}
				j = s.indexOf(uh, i);
				if (i + 1 > j) {
					break;
				}
				mX = s.substring(i + 1, j);
				key = mX;
				meta = null;
				k = key.indexOf(SPACE);
				if (k > -1) {
					meta = key.substring(k + 1);
					key = key.substring(0, k);
				}
				v = o[key];
				if (f) {
					v = f(key, v, meta);
				}
				if (L.kB(v)) {
					if (L.isArray(v)) {
						v = L.dump(v, parseInt(meta, 10));
					} else {
						meta = meta || "";
						dump = meta.indexOf(sD);
						if (dump > -1) {
							meta = meta.substring(4);
						}
						lD = v.toString();
						if (lD === tC || dump > -1) {
							v = L.dump(v, parseInt(meta, 10));
						} else {
							v = lD;
						}
					}
				} else if (!L.oB(v) && !L.oE(v)) {
					v = "~-" + lm.length + "-~";
					lm[lm.length] = mX;
				}
				s = s.substring(0, i) + v + s.substring(j + 1);
				if (ud === false) {
					qh = i - 1;
				}
			}
			for (i = lm.length - 1; i >= 0; i = i - 1) {
				s = s.replace(new RegExp("~-" + i + "-~"), "{" + lm[i] + "}",
						"g");
			}
			return s;
		},
		trim : function(s) {
			try {
				return s.replace(/^\s+|\s+$/g, "");
			} catch (e) {
				return s;
			}
		},
		merge : function() {
			var o = {}, a = arguments, l = a.length, i;
			for (i = 0; i < l; i = i + 1) {
				L.mo(o, a[i], true);
			}
			return o;
		},
		vl : function(when, o, fn, data, ou) {
			when = when || 0;
			o = o || {};
			var m = fn, d = data, f, r;
			if (L.oB(fn)) {
				m = o[fn];
			}
			if (!m) {
				throw new TypeError("method undefined");
			}
			if (!L.qK(data) && !L.isArray(d)) {
				d = [data];
			}
			f = function() {
				m.apply(o, d || uy);
			};
			r = (ou) ? setInterval(f, when) : setTimeout(f, when);
			return {
				interval : ou,
				cancel : function() {
					if (this.interval) {
						clearInterval(r);
					} else {
						clearTimeout(r);
					}
				}
			};
		},
		wN : function(o) {
			return (L.kB(o) || L.oB(o) || L.oE(o) || L.rz(o));
		}
	};
	L.hasOwnProperty = (iI.hasOwnProperty) ? function(o, prop) {
		return o && o.hasOwnProperty && o.hasOwnProperty(prop);
	} : function(o, prop) {
		return !L.qK(o[prop]) && o.constructor.prototype[prop] !== o[prop];
	};
	ok.mo(L, ok, true);
	QMX.te.Lang = L;
	L.sm = L.py;
	QMX.sm = L.py;
	QMX.extend = L.extend;
})();
QMX.uG("yahoo", QMX, {
			version : "2.9.0",
			qM : "2800"
		});
if (typeof Aostar == "undefined" || !Aostar)
	var Aostar = {};
if (typeof Aostar.cn == "undefined" || !Aostar.cn)
	Aostar.cn = {};
Aostar.cn.fE = new function() {
	this.wS = function(i) {
		var h = i.toString(16);
		if ((h.length % 2) == 1)
			h = '0' + h;
		return h;
	};
	this.nN = function(jf) {
		var h = jf.toString(16);
		if (h.substr(0, 1) != '-') {
			if (h.length % 2 == 1) {
				h = '0' + h;
			} else {
				if (!h.match(/^[0-7]/)) {
					h = '00' + h;
				}
			}
		} else {
			var uB = h.substr(1);
			var mq = uB.length;
			if (mq % 2 == 1) {
				mq += 1;
			} else {
				if (!h.match(/^[0-7]/)) {
					mq += 2;
				}
			}
			var pv = '';
			for (var i = 0; i < mq; i++) {
				pv += 'f';
			}
			var sP = new J(pv, 16);
			var rH = sP.xor(jf).add(J.ONE);
			h = rH.toString(16).replace(/^-/, '');
		}
		return h;
	};
	this.vq = function(nR, oQ) {
		var vg = xb(nR);
		var ot = vg.replace(/(.{64})/g, "$1\r\n");
		ot = ot.replace(/\r\n$/, '');
		return "-----BEGIN " + oQ + "-----\r\n" + ot + "\r\n-----END " + oQ
				+ "-----\r\n";
	};
	this.iG = function(param) {
		var et = Aostar.cn;
		var keys = Object.keys(param);
		if (keys.length != 1)
			throw "key of param shall be only one.";
		var key = keys[0];
		if (":bool:int:bitstr:octstr:null:gj:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:np:set:eK:"
				.indexOf(":" + key + ":") == -1)
			throw "undefined key: " + key;
		if (key == "bool")
			return new et.mr(param[key]);
		if (key == "int")
			return new et.hb(param[key]);
		if (key == "bitstr")
			return new et.lY(param[key]);
		if (key == "octstr")
			return new et.lq(param[key]);
		if (key == "null")
			return new et.oH(param[key]);
		if (key == "gj")
			return new et.kf(param[key]);
		if (key == "enum")
			return new et.pa(param[key]);
		if (key == "utf8str")
			return new et.nt(param[key]);
		if (key == "numstr")
			return new et.lP(param[key]);
		if (key == "prnstr")
			return new et.oV(param[key]);
		if (key == "telstr")
			return new et.lG(param[key]);
		if (key == "ia5str")
			return new et.oW(param[key]);
		if (key == "utctime")
			return new et.lL(param[key]);
		if (key == "gentime")
			return new et.nC(param[key]);
		if (key == "np") {
			var ih = param[key];
			var a = [];
			for (var i = 0; i < ih.length; i++) {
				var fU = et.fE.iG(ih[i]);
				a.push(fU);
			}
			return new et.jh({
						'array' : a
					});
		}
		if (key == "set") {
			var ih = param[key];
			var a = [];
			for (var i = 0; i < ih.length; i++) {
				var fU = et.fE.iG(ih[i]);
				a.push(fU);
			}
			return new et.nm({
						'array' : a
					});
		}
		if (key == "eK") {
			var gG = param[key];
			if (Object.prototype.toString.call(gG) === '[object Array]'
					&& gG.length == 3) {
				var fp = et.fE.iG(gG[2]);
				return new et.kF({
							eK : gG[0],
							kV : gG[1],
							fp : fp
						});
			} else {
				var kl = {};
				if (gG.kV !== undefined)
					kl.kV = gG.kV;
				if (gG.eK !== undefined)
					kl.eK = gG.eK;
				if (gG.fp === undefined)
					throw "fp shall be specified for 'eK'.";
				kl.fp = et.fE.iG(gG.fp);
				return new et.kF(kl);
			}
		}
	};
	this.we = function(param) {
		var fU = this.iG(param);
		return fU.hy();
	};
};
Aostar.cn.fE.mQ = function(cw) {
	var s = "";
	var qC = parseInt(cw.substr(0, 2), 16);
	var fO = Math.floor(qC / 40);
	var ue = qC % 40;
	var s = fO + "." + ue;
	var lz = "";
	for (var i = 2; i < cw.length; i += 2) {
		var value = parseInt(cw.substr(i, 2), 16);
		var kS = ("00000000" + value.toString(2)).slice(-8);
		lz = lz + kS.substr(1, 7);
		if (kS.substr(0, 1) == "0") {
			var eN = new J(lz, 2);
			s = s + "." + eN.toString(10);
			lz = "";
		}
	};
	return s;
};
Aostar.cn.fE.wp = function(jm) {
	var kM = function(i) {
		var h = i.toString(16);
		if (h.length == 1)
			h = '0' + h;
		return h;
	};
	var oj = function(oa) {
		var h = '';
		var eN = new J(oa, 10);
		var b = eN.toString(2);
		var ib = 7 - b.length % 7;
		if (ib == 7)
			ib = 0;
		var kN = '';
		for (var i = 0; i < ib; i++)
			kN += '0';
		b = kN + b;
		for (var i = 0; i < b.length - 1; i += 7) {
			var ji = b.substr(i, 7);
			if (i != b.length - 7)
				ji = '1' + ji;
			h += kM(parseInt(ji, 2));
		}
		return h;
	};
	if (!jm.match(/^[0-9.]+$/)) {
		throw "malformed gj string: " + jm;
	}
	var h = '';
	var a = jm.split('.');
	var fO = parseInt(a[0]) * 40 + parseInt(a[1]);
	h += kM(fO);
	a.splice(0, 2);
	for (var i = 0; i < a.length; i++) {
		h += oj(a[i]);
	}
	return h;
};
Aostar.cn.ha = function() {
	var ei = true;
	var fb = null;
	var ep = '00';
	var mZ = '00';
	var cv = '';
	this.uZ = function() {
		if (typeof this.cv == "undefined" || this.cv == null) {
			throw "this.cv is null kt undefined.";
		}
		if (this.cv.length % 2 == 1) {
			throw "value cw must be even length: n=" + cv.length + ",v="
					+ this.cv;
		}
		var n = this.cv.length / 2;
		var hK = n.toString(16);
		if (hK.length % 2 == 1) {
			hK = "0" + hK;
		}
		if (n < 128) {
			return hK;
		} else {
			var rf = hK.length / 2;
			if (rf > 15) {
				throw "ASN.1 length too long to represent by 8x: n = "
						+ n.toString(16);
			}
			var head = 128 + rf;
			return head.toString(16) + hK;
		}
	};
	this.hy = function() {
		if (this.fb == null || this.ei) {
			this.cv = this.gQ();
			this.mZ = this.uZ();
			this.fb = this.ep + this.mZ + this.cv;
			this.ei = false;
		}
		return this.fb;
	};
	this.wl = function() {
		this.hy();
		return this.cv;
	};
	this.gQ = function() {
		return '';
	};
};
Aostar.cn.gP = function(dr) {
	Aostar.cn.gP.eJ.constructor.call(this);
	var s = null;
	var cv = null;
	this.ut = function() {
		return this.s;
	};
	this.jA = function(kv) {
		this.fb = null;
		this.ei = true;
		this.s = kv;
		this.cv = ii(this.s);
	};
	this.ng = function(hW) {
		this.fb = null;
		this.ei = true;
		this.s = null;
		this.cv = hW;
	};
	this.gQ = function() {
		return this.cv;
	};
	if (typeof dr != "undefined") {
		if (typeof dr == "string") {
			this.jA(dr);
		} else if (typeof dr['fF'] != "undefined") {
			this.jA(dr['fF']);
		} else if (typeof dr['cw'] != "undefined") {
			this.ng(dr['cw']);
		}
	}
};
QMX.lang.extend(Aostar.cn.gP, Aostar.cn.ha);
Aostar.cn.mJ = function(dr) {
	Aostar.cn.mJ.eJ.constructor.call(this);
	var s = null;
	var date = null;
	this.ur = function(d) {
		jS = d.getTime() + (d.getTimezoneOffset() * 60000);
		var tk = new Date(jS);
		return tk;
	};
	this.formatDate = function(jw, type, jC) {
		var gA = this.mD;
		var d = this.ur(jw);
		var year = String(d.getFullYear());
		if (type == 'jS')
			year = year.substr(2, 2);
		var month = gA(String(d.getMonth() + 1), 2);
		var nZ = gA(String(d.getDate()), 2);
		var pg = gA(String(d.getHours()), 2);
		var min = gA(String(d.getMinutes()), 2);
		var mN = gA(String(d.getSeconds()), 2);
		var s = year + month + nZ + pg + min + mN;
		if (jC === true) {
			var mT = d.getMilliseconds();
			if (mT != 0) {
				var nV = gA(String(mT), 3);
				nV = nV.replace(/[0]+$/, "");
				s = s + "." + nV;
			}
		}
		return s + "Z";
	};
	this.mD = function(s, eF) {
		if (s.length >= eF)
			return s;
		return new Array(eF - s.length + 1).join('0') + s;
	};
	this.ut = function() {
		return this.s;
	};
	this.jA = function(kv) {
		this.fb = null;
		this.ei = true;
		this.s = kv;
		this.cv = ii(kv);
	};
	this.xa = function(year, month, nZ, pg, min, mN) {
		var jw = new Date(Date.UTC(year, month - 1, nZ, pg, min, mN, 0));
		this.jU(jw);
	};
	this.gQ = function() {
		return this.cv;
	};
};
QMX.lang.extend(Aostar.cn.mJ, Aostar.cn.ha);
Aostar.cn.mf = function(dr) {
	Aostar.cn.gP.eJ.constructor.call(this);
	var gC = null;
	this.wY = function(rM) {
		this.fb = null;
		this.ei = true;
		this.gC = rM;
	};
	this.wi = function(hk) {
		this.fb = null;
		this.ei = true;
		this.gC.push(hk);
	};
	this.gC = new Array();
	if (typeof dr != "undefined") {
		if (typeof dr['array'] != "undefined") {
			this.gC = dr['array'];
		}
	}
};
QMX.lang.extend(Aostar.cn.mf, Aostar.cn.ha);
Aostar.cn.mr = function() {
	Aostar.cn.mr.eJ.constructor.call(this);
	this.ep = "01";
	this.fb = "0101ff";
};
QMX.lang.extend(Aostar.cn.mr, Aostar.cn.ha);
Aostar.cn.hb = function(dr) {
	Aostar.cn.hb.eJ.constructor.call(this);
	this.ep = "02";
	this.lb = function(jf) {
		this.fb = null;
		this.ei = true;
		this.cv = Aostar.cn.fE.nN(jf);
	};
	this.kq = function(eV) {
		var eN = new J(String(eV), 10);
		this.lb(eN);
	};
	this.ir = function(hW) {
		this.cv = hW;
	};
	this.gQ = function() {
		return this.cv;
	};
	if (typeof dr != "undefined") {
		if (typeof dr['jY'] != "undefined") {
			this.lb(dr['jY']);
		} else if (typeof dr['int'] != "undefined") {
			this.kq(dr['int']);
		} else if (typeof dr == "number") {
			this.kq(dr);
		} else if (typeof dr['cw'] != "undefined") {
			this.ir(dr['cw']);
		}
	}
};
QMX.lang.extend(Aostar.cn.hb, Aostar.cn.ha);
Aostar.cn.lY = function(dr) {
	if (dr !== undefined && typeof dr.fp !== "undefined") {
		var o = Aostar.cn.fE.iG(dr.fp);
		dr.cw = "00" + o.hy();
	}
	Aostar.cn.lY.eJ.constructor.call(this);
	this.ep = "03";
	this.qx = function(wg) {
		this.fb = null;
		this.ei = true;
		this.cv = wg;
	};
	this.vs = function(gB, tI) {
		if (gB < 0 || 7 < gB) {
			throw "unused he shall be from 0 to 7: u = " + gB;
		}
		var tq = "0" + gB;
		this.fb = null;
		this.ei = true;
		this.cv = tq + tI;
	};
	this.qE = function(iT) {
		iT = iT.replace(/0+$/, '');
		var gB = 8 - iT.length % 8;
		if (gB == 8)
			gB = 0;
		for (var i = 0; i <= gB; i++) {
			iT += '0';
		}
		var h = '';
		for (var i = 0; i < iT.length - 1; i += 8) {
			var b = iT.substr(i, 8);
			var x = parseInt(b, 2).toString(16);
			if (x.length == 1)
				x = '0' + x;
			h += x;
		}
		this.fb = null;
		this.ei = true;
		this.cv = '0' + gB + h;
	};
	this.tJ = function(oG) {
		var s = '';
		for (var i = 0; i < oG.length; i++) {
			if (oG[i] == true) {
				s += '1';
			} else {
				s += '0';
			}
		}
		this.qE(s);
	};
	this.wA = function(qN) {
		var a = new Array(qN);
		for (var i = 0; i < qN; i++) {
			a[i] = false;
		}
		return a;
	};
	this.gQ = function() {
		return this.cv;
	};
	if (typeof dr != "undefined") {
		if (typeof dr == "string" && dr.toLowerCase().match(/^[0-9a-f]+$/)) {
			this.qx(dr);
		} else if (typeof dr['cw'] != "undefined") {
			this.qx(dr['cw']);
		} else if (typeof dr['kS'] != "undefined") {
			this.qE(dr['kS']);
		} else if (typeof dr['array'] != "undefined") {
			this.tJ(dr['array']);
		}
	}
};
QMX.lang.extend(Aostar.cn.lY, Aostar.cn.ha);
Aostar.cn.lq = function(dr) {
	if (dr !== undefined && typeof dr.fp !== "undefined") {
		var o = Aostar.cn.fE.iG(dr.fp);
		dr.cw = o.hy();
	}
	Aostar.cn.lq.eJ.constructor.call(this, dr);
	this.ep = "04";
};
QMX.lang.extend(Aostar.cn.lq, Aostar.cn.gP);
Aostar.cn.oH = function() {
	Aostar.cn.oH.eJ.constructor.call(this);
	this.ep = "05";
	this.fb = "0500";
};
QMX.lang.extend(Aostar.cn.oH, Aostar.cn.ha);
Aostar.cn.kf = function(dr) {
	var kM = function(i) {
		var h = i.toString(16);
		if (h.length == 1)
			h = '0' + h;
		return h;
	};
	var oj = function(oa) {
		var h = '';
		var eN = new J(oa, 10);
		var b = eN.toString(2);
		var ib = 7 - b.length % 7;
		if (ib == 7)
			ib = 0;
		var kN = '';
		for (var i = 0; i < ib; i++)
			kN += '0';
		b = kN + b;
		for (var i = 0; i < b.length - 1; i += 7) {
			var ji = b.substr(i, 7);
			if (i != b.length - 7)
				ji = '1' + ji;
			h += kM(parseInt(ji, 2));
		}
		return h;
	};
	Aostar.cn.kf.eJ.constructor.call(this);
	this.ep = "06";
	this.ir = function(hW) {
		this.fb = null;
		this.ei = true;
		this.s = null;
		this.cv = hW;
	};
	this.oS = function(jm) {
		if (!jm.match(/^[0-9.]+$/)) {
			throw "malformed gj string: " + jm;
		}
		var h = '';
		var a = jm.split('.');
		var fO = parseInt(a[0]) * 40 + parseInt(a[1]);
		h += kM(fO);
		a.splice(0, 2);
		for (var i = 0; i < a.length; i++) {
			h += oj(a[i]);
		}
		this.fb = null;
		this.ei = true;
		this.s = null;
		this.cv = h;
	};
	this.rm = function(eS) {
		var gj = Aostar.cn.iR.jF.wC(eS);
		if (gj !== '') {
			this.oS(gj);
		} else {
			throw "kf eS undefined: " + eS;
		}
	};
	this.gQ = function() {
		return this.cv;
	};
	if (dr !== undefined) {
		if (typeof dr === "string") {
			if (dr.match(/^[0-2].[0-9.]+$/)) {
				this.oS(dr);
			} else {
				this.rm(dr);
			}
		} else if (dr.gj !== undefined) {
			this.oS(dr.gj);
		} else if (dr.cw !== undefined) {
			this.ir(dr.cw);
		} else if (dr.name !== undefined) {
			this.rm(dr.name);
		}
	}
};
QMX.lang.extend(Aostar.cn.kf, Aostar.cn.ha);
Aostar.cn.pa = function(dr) {
	Aostar.cn.pa.eJ.constructor.call(this);
	this.ep = "0a";
	this.lb = function(jf) {
		this.fb = null;
		this.ei = true;
		this.cv = Aostar.cn.fE.nN(jf);
	};
	this.kq = function(eV) {
		var eN = new J(String(eV), 10);
		this.lb(eN);
	};
	this.ir = function(hW) {
		this.cv = hW;
	};
	this.gQ = function() {
		return this.cv;
	};
	if (typeof dr != "undefined") {
		if (typeof dr['int'] != "undefined") {
			this.kq(dr['int']);
		} else if (typeof dr == "number") {
			this.kq(dr);
		} else if (typeof dr['cw'] != "undefined") {
			this.ir(dr['cw']);
		}
	}
};
QMX.lang.extend(Aostar.cn.pa, Aostar.cn.ha);
Aostar.cn.nt = function(dr) {
	Aostar.cn.nt.eJ.constructor.call(this, dr);
	this.ep = "0c";
};
QMX.lang.extend(Aostar.cn.nt, Aostar.cn.gP);
Aostar.cn.lP = function(dr) {
	Aostar.cn.lP.eJ.constructor.call(this, dr);
	this.ep = "12";
};
QMX.lang.extend(Aostar.cn.lP, Aostar.cn.gP);
Aostar.cn.oV = function(dr) {
	Aostar.cn.oV.eJ.constructor.call(this, dr);
	this.ep = "13";
};
QMX.lang.extend(Aostar.cn.oV, Aostar.cn.gP);
Aostar.cn.lG = function(dr) {
	Aostar.cn.lG.eJ.constructor.call(this, dr);
	this.ep = "14";
};
QMX.lang.extend(Aostar.cn.lG, Aostar.cn.gP);
Aostar.cn.oW = function(dr) {
	Aostar.cn.oW.eJ.constructor.call(this, dr);
	this.ep = "16";
};
QMX.lang.extend(Aostar.cn.oW, Aostar.cn.gP);
Aostar.cn.lL = function(dr) {
	Aostar.cn.lL.eJ.constructor.call(this, dr);
	this.ep = "17";
	this.jU = function(jw) {
		this.fb = null;
		this.ei = true;
		this.date = jw;
		this.s = this.formatDate(this.date, 'jS');
		this.cv = ii(this.s);
	};
	this.gQ = function() {
		if (typeof this.date == "undefined" && typeof this.s == "undefined") {
			this.date = new Date();
			this.s = this.formatDate(this.date, 'jS');
			this.cv = ii(this.s);
		}
		return this.cv;
	};
	if (dr !== undefined) {
		if (dr.fF !== undefined) {
			this.jA(dr.fF);
		} else if (typeof dr == "string" && dr.match(/^[0-9]{12}Z$/)) {
			this.jA(dr);
		} else if (dr.cw !== undefined) {
			this.ng(dr.cw);
		} else if (dr.date !== undefined) {
			this.jU(dr.date);
		}
	}
};
QMX.lang.extend(Aostar.cn.lL, Aostar.cn.mJ);
Aostar.cn.nC = function(dr) {
	Aostar.cn.nC.eJ.constructor.call(this, dr);
	this.ep = "18";
	this.jC = false;
	this.jU = function(jw) {
		this.fb = null;
		this.ei = true;
		this.date = jw;
		this.s = this.formatDate(this.date, 'gen', this.jC);
		this.cv = ii(this.s);
	};
	this.gQ = function() {
		if (this.date === undefined && this.s === undefined) {
			this.date = new Date();
			this.s = this.formatDate(this.date, 'gen', this.jC);
			this.cv = ii(this.s);
		}
		return this.cv;
	};
	if (dr !== undefined) {
		if (dr.fF !== undefined) {
			this.jA(dr.fF);
		} else if (typeof dr == "string" && dr.match(/^[0-9]{14}Z$/)) {
			this.jA(dr);
		} else if (dr.cw !== undefined) {
			this.ng(dr.cw);
		} else if (dr.date !== undefined) {
			this.jU(dr.date);
		}
		if (dr.mT === true) {
			this.jC = true;
		}
	}
};
QMX.lang.extend(Aostar.cn.nC, Aostar.cn.mJ);
Aostar.cn.jh = function(dr) {
	Aostar.cn.jh.eJ.constructor.call(this, dr);
	this.ep = "30";
	this.gQ = function() {
		var h = '';
		for (var i = 0; i < this.gC.length; i++) {
			var fU = this.gC[i];
			h += fU.hy();
		}
		this.cv = h;
		return this.cv;
	};
};
QMX.lang.extend(Aostar.cn.jh, Aostar.cn.mf);
Aostar.cn.nm = function(dr) {
	Aostar.cn.nm.eJ.constructor.call(this, dr);
	this.ep = "31";
	this.pq = true;
	this.gQ = function() {
		var a = new Array();
		for (var i = 0; i < this.gC.length; i++) {
			var fU = this.gC[i];
			a.push(fU.hy());
		}
		if (this.pq == true)
			a.sort();
		this.cv = a.join('');
		return this.cv;
	};
	if (typeof dr != "undefined") {
		if (typeof dr.rN != "undefined" && dr.rN == false)
			this.pq = false;
	}
};
QMX.lang.extend(Aostar.cn.nm, Aostar.cn.mf);
Aostar.cn.kF = function(dr) {
	Aostar.cn.kF.eJ.constructor.call(this);
	this.ep = "a0";
	this.cv = '';
	this.lu = true;
	this.hk = null;
	this.tX = function(rY, qU, hk) {
		this.ep = qU;
		this.lu = rY;
		this.hk = hk;
		if (this.lu) {
			this.cv = this.hk.hy();
			this.fb = null;
			this.ei = true;
		} else {
			this.cv = null;
			this.fb = hk.hy();
			this.fb = this.fb.replace(/^../, qU);
			this.ei = false;
		}
	};
	this.gQ = function() {
		return this.cv;
	};
	if (typeof dr != "undefined") {
		if (typeof dr['eK'] != "undefined") {
			this.ep = dr['eK'];
		}
		if (typeof dr['kV'] != "undefined") {
			this.lu = dr['kV'];
		}
		if (typeof dr['fp'] != "undefined") {
			this.hk = dr['fp'];
			this.tX(this.lu, this.ep, this.hk);
		}
	}
};
QMX.lang.extend(Aostar.cn.kF, Aostar.cn.ha);
var co = new function() {
};
co.oZ = function(s, pos) {
	if (s.substring(pos + 2, pos + 3) != '8')
		return 1;
	var i = parseInt(s.substring(pos + 3, pos + 4));
	if (i == 0)
		return -1;
	if (0 < i && i < 10)
		return i + 1;
	return -2;
};
co.lM = function(s, pos) {
	var eF = co.oZ(s, pos);
	if (eF < 1)
		return '';
	return s.substring(pos + 2, pos + 2 + eF * 2);
};
co.mF = function(s, pos) {
	var nn = co.lM(s, pos);
	if (nn == '')
		return -1;
	var eN;
	if (parseInt(nn.substring(0, 1)) < 8) {
		eN = new J(nn, 16);
	} else {
		eN = new J(nn.substring(2), 16);
	}
	return eN.eV();
};
co.nl = function(s, pos) {
	var mk = co.oZ(s, pos);
	if (mk < 0)
		return mk;
	return pos + (mk + 1) * 2;
};
co.fG = function(s, pos) {
	var ke = co.nl(s, pos);
	var eF = co.mF(s, pos);
	return s.substring(ke, ke + eF * 2);
};
co.uR = function(s, pos) {
	var ep = s.substr(pos, 2);
	var mZ = co.lM(s, pos);
	var cv = co.fG(s, pos);
	return ep + mZ + cv;
};
co.ty = function(s, pos) {
	var ke = co.nl(s, pos);
	var eF = co.mF(s, pos);
	return ke + eF * 2;
};
co.gY = function(h, pos) {
	var a = new Array();
	var jV = co.nl(h, pos);
	if (h.substr(pos, 2) == "03") {
		a.push(jV + 2);
	} else {
		a.push(jV);
	}
	var eF = co.mF(h, pos);
	var p = jV;
	var k = 0;
	while (1) {
		var ly = co.ty(h, p);
		if (ly == null || (ly - jV >= (eF * 2)))
			break;
		if (k >= 200)
			break;
		a.push(ly);
		p = ly;
		k++;
	}
	return a;
};
co.wz = function(h, ca, nth) {
	var a = co.gY(h, ca);
	return a[nth];
};
co.mn = function(h, fV, fP) {
	if (fP.length == 0) {
		return fV;
	}
	var vc = fP.shift();
	var a = co.gY(h, fV);
	return co.mn(h, a[vc], fP);
};
co.wR = function(h, fV, fP) {
	var ca = co.mn(h, fV, fP);
	return co.uR(h, ca);
};
co.wf = function(h, fV, fP) {
	var ca = co.mn(h, fV, fP);
	return co.fG(h, ca);
};
co.vL = function(h, fV, fP, nK) {
	var ca = co.mn(h, fV, fP);
	if (ca === undefined) {
		throw "can't find fP object";
	}
	if (nK !== undefined) {
		if (h.substr(ca, 2) != nK) {
			throw "checking eK doesn't match: " + h.substr(ca, 2) + "!=" + nK;
		}
	}
	return co.fG(h, ca);
};
co.wo = function(cw) {
	var mD = function(s, eF) {
		if (s.length >= eF)
			return s;
		return new Array(eF - s.length + 1).join('0') + s;
	};
	var a = [];
	var uS = cw.substr(0, 2);
	var fO = parseInt(uS, 16);
	a[0] = new String(Math.floor(fO / 40));
	a[1] = new String(fO % 40);
	var qm = cw.substr(2);
	var b = [];
	for (var i = 0; i < qm.length / 2; i++) {
		b.push(parseInt(qm.substr(i * 2, 2), 16));
	}
	var c = [];
	var ij = "";
	for (var i = 0; i < b.length; i++) {
		if (b[i] & 0x80) {
			ij = ij + mD((b[i] & 0x7f).toString(2), 7);
		} else {
			ij = ij + mD((b[i] & 0x7f).toString(2), 7);
			c.push(new String(parseInt(ij, 2)));
			ij = "";
		}
	}
	var s = a.join(".");
	if (c.length > 0)
		s = s + "." + c.join(".");
	return s;
};
co.dump = function(jv, fC, ca, indent) {
	var cw = jv;
	if (jv instanceof Aostar.cn.ha)
		cw = jv.hy();
	var kG = function(cw, gZ) {
		if (cw.length <= gZ * 2) {
			return cw;
		} else {
			var s = cw.substr(0, gZ) + "..(total " + cw.length / 2 + "gg).."
					+ cw.substr(cw.length - gZ, gZ);
			return s;
		};
	};
	if (fC === undefined)
		fC = {
			"mE" : 32
		};
	if (ca === undefined)
		ca = 0;
	if (indent === undefined)
		indent = "";
	var kx = fC.mE;
	if (cw.substr(ca, 2) == "01") {
		var v = co.fG(cw, ca);
		if (v == "00") {
			return indent + "BOOLEAN FALSE\n";
		} else {
			return indent + "BOOLEAN TRUE\n";
		}
	}
	if (cw.substr(ca, 2) == "02") {
		var v = co.fG(cw, ca);
		return indent + "INTEGER " + kG(v, kx) + "\n";
	}
	if (cw.substr(ca, 2) == "03") {
		var v = co.fG(cw, ca);
		return indent + "BITSTRING " + kG(v, kx) + "\n";
	}
	if (cw.substr(ca, 2) == "04") {
		var v = co.fG(cw, ca);
		if (co.pM(v)) {
			var s = indent + "OCTETSTRING, encapsulates\n";
			s = s + co.dump(v, fC, 0, indent + "  ");
			return s;
		} else {
			return indent + "OCTETSTRING " + kG(v, kx) + "\n";
		}
	}
	if (cw.substr(ca, 2) == "05") {
		return indent + "NULL\n";
	}
	if (cw.substr(ca, 2) == "06") {
		var cv = co.fG(cw, ca);
		var gH = Aostar.cn.fE.mQ(cv);
		var eS = Aostar.cn.iR.jF.mC(gH);
		var jB = gH.replace(/\./g, ' ');
		if (eS != '') {
			return indent + "ObjectIdentifier " + eS + " (" + jB + ")\n";
		} else {
			return indent + "ObjectIdentifier (" + jB + ")\n";
		}
	}
	if (cw.substr(ca, 2) == "0c") {
		return indent + "UTF8String '" + fh(co.fG(cw, ca)) + "'\n";
	}
	if (cw.substr(ca, 2) == "13") {
		return indent + "PrintableString '" + fh(co.fG(cw, ca)) + "'\n";
	}
	if (cw.substr(ca, 2) == "14") {
		return indent + "TeletexString '" + fh(co.fG(cw, ca)) + "'\n";
	}
	if (cw.substr(ca, 2) == "16") {
		return indent + "IA5String '" + fh(co.fG(cw, ca)) + "'\n";
	}
	if (cw.substr(ca, 2) == "17") {
		return indent + "UTCTime " + fh(co.fG(cw, ca)) + "\n";
	}
	if (cw.substr(ca, 2) == "18") {
		return indent + "GeneralizedTime " + fh(co.fG(cw, ca)) + "\n";
	}
	if (cw.substr(ca, 2) == "30") {
		if (cw.substr(ca, 4) == "3000") {
			return indent + "SEQUENCE {}\n";
		}
		var s = indent + "SEQUENCE\n";
		var fz = co.gY(cw, ca);
		var kk = fC;
		if ((fz.length == 2 || fz.length == 3) && cw.substr(fz[0], 2) == "06"
				&& cw.substr(fz[fz.length - 1], 2) == "04") {
			var mh = co.fG(cw, fz[0]);
			var gH = Aostar.cn.fE.mQ(mh);
			var eS = Aostar.cn.iR.jF.mC(gH);
			var jJ = JSON.parse(JSON.stringify(fC));
			jJ.nF = eS;
			kk = jJ;
		}
		for (var i = 0; i < fz.length; i++) {
			s = s + co.dump(cw, kk, fz[i], indent + "  ");
		}
		return s;
	}
	if (cw.substr(ca, 2) == "31") {
		var s = indent + "SET\n";
		var fz = co.gY(cw, ca);
		for (var i = 0; i < fz.length; i++) {
			s = s + co.dump(cw, fC, fz[i], indent + "  ");
		}
		return s;
	}
	var eK = parseInt(cw.substr(ca, 2), 16);
	if ((eK & 128) != 0) {
		var jy = eK & 31;
		if ((eK & 32) != 0) {
			var s = indent + "[" + jy + "]\n";
			var fz = co.gY(cw, ca);
			for (var i = 0; i < fz.length; i++) {
				s = s + co.dump(cw, fC, fz[i], indent + "  ");
			}
			return s;
		} else {
			var v = co.fG(cw, ca);
			if (v.substr(0, 8) == "68747470") {
				v = fh(v);
			}
			if (fC.nF === "subjectAltName" && jy == 2) {
				v = fh(v);
			}
			var s = indent + "[" + jy + "] " + v + "\n";
			return s;
		}
	}
	return indent + "UNKNOWN(" + cw.substr(ca, 2) + ") " + co.fG(cw, ca) + "\n";
};
co.jP = function(jv, fC, ca) {
	var cw = jv;
	if (jv instanceof Aostar.cn.ha)
		cw = jv.hy();
	var kG = function(cw, gZ) {
		if (cw.length <= gZ * 2) {
			return cw;
		} else {
			var s = cw.substr(0, gZ) + cw.substr(cw.length - gZ, gZ);
			return s;
		};
	};
	if (fC === undefined)
		fC = {
			"mE" : 32
		};
	if (ca === undefined)
		ca = 0;
	var kx = fC.mE;
	if (cw.substr(ca, 2) == "01") {
		var v = co.fG(cw, ca);
		if (v == "00") {
			return false;
		} else {
			return true;
		}
	}
	if (cw.substr(ca, 2) == "02") {
		var v = co.fG(cw, ca);
		return v;
	}
	if (cw.substr(ca, 2) == "03") {
		var v = co.fG(cw, ca);
		return kG(v, kx);
	}
	if (cw.substr(ca, 2) == "04") {
		var v = co.fG(cw, ca);
		if (co.pM(v)) {
			var s = new Array();
			s.push(co.jP(v, fC, 0));
			return s;
		} else {
			return v;
		}
	}
	if (cw.substr(ca, 2) == "05") {
		return "";
	}
	if (cw.substr(ca, 2) == "06") {
		var cv = co.fG(cw, ca);
		var gH = Aostar.cn.fE.mQ(cv);
		var eS = Aostar.cn.iR.jF.mC(gH);
		var jB = gH.replace(/\./g, ' ');
		if (eS != '') {
			return jB;
		} else {
			return jB;
		}
	}
	if (cw.substr(ca, 2) == "0c") {
		return fh(co.fG(cw, ca));
	}
	if (cw.substr(ca, 2) == "13") {
		return fh(co.fG(cw, ca));
	}
	if (cw.substr(ca, 2) == "14") {
		return fh(co.fG(cw, ca));
	}
	if (cw.substr(ca, 2) == "16") {
		return fh(co.fG(cw, ca));
	}
	if (cw.substr(ca, 2) == "17") {
		return fh(co.fG(cw, ca));
	}
	if (cw.substr(ca, 2) == "18") {
		return fh(co.fG(cw, ca));
	}
	if (cw.substr(ca, 2) == "30") {
		var s = new Array();
		if (cw.substr(ca, 4) == "3000") {
			return s;
		}
		var fz = co.gY(cw, ca);
		var kk = fC;
		if ((fz.length == 2 || fz.length == 3) && cw.substr(fz[0], 2) == "06"
				&& cw.substr(fz[fz.length - 1], 2) == "04") {
			var mh = co.fG(cw, fz[0]);
			var gH = Aostar.cn.fE.mQ(mh);
			var eS = Aostar.cn.iR.jF.mC(gH);
			var jJ = JSON.parse(JSON.stringify(fC));
			jJ.nF = eS;
			kk = jJ;
		}
		for (var i = 0; i < fz.length; i++) {
			s.push(co.jP(cw, kk, fz[i]));
		}
		return s;
	}
	if (cw.substr(ca, 2) == "31") {
		var s = new Array();;
		var fz = co.gY(cw, ca);
		for (var i = 0; i < fz.length; i++) {
			s.push(co.jP(cw, fC, fz[i]));
		}
		return s;
	}
	var eK = parseInt(cw.substr(ca, 2), 16);
	var indent = "";
	if ((eK & 128) != 0) {
		var jy = eK & 31;
		if ((eK & 32) != 0) {
			var s = indent + "[" + jy + "]\n";
			var fz = co.gY(cw, ca);
			for (var i = 0; i < fz.length; i++) {
				s = s + co.dump(cw, fC, fz[i], indent + "  ");
			}
			return s;
		} else {
			var v = co.fG(cw, ca);
			if (v.substr(0, 8) == "68747470") {
				v = fh(v);
			}
			if (fC.nF === "subjectAltName" && jy == 2) {
				v = fh(v);
			}
			var s = indent + "[" + jy + "] " + v + "\n";
			return s;
		}
	}
	return indent + "UNKNOWN(" + cw.substr(ca, 2) + ") " + co.fG(cw, ca) + "\n";
};
co.pM = function(cw) {
	if (cw.length % 2 == 1)
		return false;
	var sO = co.mF(cw, 0);
	var tV = cw.substr(0, 2);
	var tG = co.lM(cw, 0);
	var ub = cw.length - tV.length - tG.length;
	if (ub == sO * 2)
		return true;
	return false;
};
var ip = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var nJ = "=";
function dH(h) {
	var i;
	var c;
	var fL = "";
	for (i = 0; i + 3 <= h.length; i += 3) {
		c = parseInt(h.substring(i, i + 3), 16);
		fL += ip.charAt(c >> 6) + ip.charAt(c & 63);
	}
	if (i + 1 == h.length) {
		c = parseInt(h.substring(i, i + 1), 16);
		fL += ip.charAt(c << 2);
	} else if (i + 2 == h.length) {
		c = parseInt(h.substring(i, i + 2), 16);
		fL += ip.charAt(c >> 2) + ip.charAt((c & 3) << 4);
	}
	if (nJ)
		while ((fL.length & 3) > 0)
			fL += nJ;
	return fL;
};
function cb(s) {
	var fL = "";
	var i;
	var k = 0;
	var jq;
	var v;
	for (i = 0; i < s.length; ++i) {
		if (s.charAt(i) == nJ)
			break;
		v = ip.indexOf(s.charAt(i));
		if (v < 0)
			continue;
		if (k == 0) {
			fL += ai(v >> 2);
			jq = v & 3;
			k = 1;
		} else if (k == 1) {
			fL += ai((jq << 2) | (v >> 4));
			jq = v & 0xf;
			k = 2;
		} else if (k == 2) {
			fL += ai(jq);
			fL += ai(v >> 2);
			jq = v & 3;
			k = 3;
		} else {
			fL += ai((jq << 2) | (v >> 4));
			fL += ai(v & 0xf);
			k = 0;
		}
	}
	if (k == 1)
		fL += ai(jq << 2);
	return fL;
};
function di(s) {
	var h = cb(s);
	var i;
	var a = new Array();
	for (i = 0; 2 * i < h.length; ++i) {
		a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
	}
	return a;
};
AoEncryJS.gM.jk || (function(undefined) {
	var C = AoEncryJS;
	var fK = C.gM;
	var Base = fK.Base;
	var ej = fK.ej;
	var jr = fK.jr;
	var it = C.fj;
	var fr = it.fr;
	var nA = it.nA;
	var jL = C.hB;
	var ri = jL.ri;
	var jk = fK.jk = jr.extend({
				cj : Base.extend(),
				pb : function(key, cj) {
					return this.create(this.nq, key, cj);
				},
				lN : function(key, cj) {
					return this.create(this.sU, key, cj);
				},
				fw : function(sq, key, cj) {
					this.cj = this.cj.extend(cj);
					this.qX = sq;
					this.wP = key;
					this.reset();
				},
				reset : function() {
					jr.reset.call(this);
					this.ob();
				},
				wL : function(kz) {
					this.mR(kz);
					return this.iM();
				},
				gf : function(kz) {
					if (kz) {
						this.mR(kz);
					}
					var uT = this.mb();
					return uT;
				},
				hG : 128 / 32,
				ic : 128 / 32,
				nq : 1,
				sU : 2,
				nX : (function() {
					function aN(key) {
						if (typeof key == 'string') {
							return qF;
						} else {
							return iH;
						}
					};
					return function(fB) {
						return {
							kb : function(message, key, cj) {
								return aN(key).kb(fB, message, key, cj);
							},
							jO : function(fi, key, cj) {
								return aN(key).jO(fB, fi, key, cj);
							}
						};
					};
				}())
			});
	var sf = fK.sf = jk.extend({
				mb : function() {
					var lh = this.iM(!!'flush');
					return lh;
				},
				fd : 1
			});
	var tM = C.mode = {};
	var pe = fK.pe = Base.extend({
				pb : function(fB, fs) {
					return this.sB.create(fB, fs);
				},
				lN : function(fB, fs) {
					return this.uU.create(fB, fs);
				},
				fw : function(fB, fs) {
					this.ox = fB;
					this.qA = fs;
				}
			});
	var gD = tM.gD = (function() {
		var gD = pe.extend();
		gD.sB = gD.extend({
					nM : function(dC, offset) {
						var fB = this.ox;
						var fd = fB.fd;
						av.call(this, dC, offset, fd);
						fB.wn(dC, offset);
						this.pw = dC.slice(offset, offset + fd);
					}
				});
		gD.uU = gD.extend({
					nM : function(dC, offset) {
						var fB = this.ox;
						var fd = fB.fd;
						var rW = dC.slice(offset, offset + fd);
						fB.wE(dC, offset);
						av.call(this, dC, offset, fd);
						this.pw = rW;
					}
				});
		function av(dC, offset, fd) {
			var fs = this.qA;
			if (fs) {
				var block = fs;
				this.qA = undefined;
			} else {
				var block = this.pw;
			}
			for (var i = 0; i < fd; i++) {
				dC[offset + i] ^= block[i];
			}
		};
		return gD;
	}());
	var tn = C.gA = {};
	var nL = tn.nL = {
		gA : function(data, fd) {
			var kr = fd * 4;
			var ga = kr - data.fq % kr;
			var va = (ga << 24) | (ga << 16) | (ga << 8) | ga;
			var oK = [];
			for (var i = 0; i < ga; i += 4) {
				oK.push(va);
			}
			var padding = ej.create(oK, ga);
			data.concat(padding);
		},
		rQ : function(data) {
			var ga = data.dC[(data.fq - 1) >>> 2] & 0xff;
			data.fq -= ga;
		}
	};
	var sg = fK.sg = jk.extend({
				cj : jk.cj.extend({
							mode : gD,
							padding : nL
						}),
				reset : function() {
					jk.reset.call(this);
					var cj = this.cj;
					var fs = cj.fs;
					var mode = cj.mode;
					if (this.qX == this.nq) {
						var qv = mode.pb;
					} else {
						var qv = mode.lN;
						this.pR = 1;
					}
					this.sS = qv.call(mode, this, fs && fs.dC);
				},
				oe : function(dC, offset) {
					this.sS.nM(dC, offset);
				},
				mb : function() {
					var padding = this.cj.padding;
					if (this.qX == this.nq) {
						padding.gA(this.hm, this.fd);
						var lh = this.iM(!!'flush');
					} else {
						var lh = this.iM(!!'flush');
						padding.rQ(lh);
					}
					return lh;
				},
				fd : 128 / 32
			});
	var lc = fK.lc = Base.extend({
				fw : function(kR) {
					this.mc(kR);
				},
				toString : function(nx) {
					return (nx || this.nx).stringify(this);
				}
			});
	var vZ = C.format = {};
	var wO = vZ.tx = {
		stringify : function(kR) {
			var fi = kR.fi;
			var eG = kR.eG;
			if (eG) {
				var eP = ej.create([0x53616c74, 0x65645f5f]).concat(eG)
						.concat(fi);
			} else {
				var eP = fi;
			}
			return eP.toString(nA);
		},
		parse : function(wZ) {
			var fi = nA.parse(wZ);
			var lH = fi.dC;
			if (lH[0] == 0x53616c74 && lH[1] == 0x65645f5f) {
				var eG = ej.create(lH.slice(2, 4));
				lH.splice(0, 4);
				fi.fq -= 16;
			}
			return lc.create({
						fi : fi,
						eG : eG
					});
		}
	};
	var iH = fK.iH = Base.extend({
				cj : Base.extend({
							format : wO
						}),
				kb : function(fB, message, key, cj) {
					cj = this.cj.extend(cj);
					var qr = fB.pb(key, cj);
					var fi = qr.gf(message);
					var mO = qr.cj;
					return lc.create({
								fi : fi,
								key : key,
								fs : mO.fs,
								wB : fB,
								mode : mO.mode,
								padding : mO.padding,
								fd : fB.fd,
								nx : cj.format
							});
				},
				jO : function(fB, fi, key, cj) {
					cj = this.cj.extend(cj);
					fi = this.rj(fi, cj.format);
					var plaintext = fB.lN(key, cj).gf(fi.fi || fi);
					return plaintext;
				},
				rj : function(fi, format) {
					if (typeof fi == 'string') {
						return format.parse(fi, this);
					} else {
						return fi;
					}
				}
			});
	var ug = C.lK = {};
	var uJ = ug.tx = {
		qZ : function(kT, hG, ic, eG) {
			if (!eG) {
				eG = ej.random(64 / 8);
			}
			var key = ri.create({
						hG : hG + ic
					}).wJ(kT, eG);
			var fs = ej.create(key.dC.slice(hG), ic * 4);
			key.fq = hG * 4;
			return lc.create({
						key : key,
						fs : fs,
						eG : eG
					});
		}
	};
	var qF = fK.qF = iH.extend({
				cj : iH.cj.extend({
							lK : uJ
						}),
				kb : function(fB, message, kT, cj) {
					cj = this.cj.extend(cj);
					var jE = cj.lK.qZ(kT, fB.hG, fB.ic);
					cj.fs = jE.fs;
					var fi = iH.kb.call(this, fB, message, jE.key, cj);
					fi.mc(jE);
					return fi;
				},
				jO : function(fB, fi, kT, cj) {
					cj = this.cj.extend(cj);
					fi = this.rj(fi, cj.format);
					var jE = cj.lK.qZ(kT, fB.hG, fB.ic, fi.eG);
					cj.fs = jE.fs;
					var plaintext = iH.jO.call(this, fB, fi, jE.key, cj);
					return plaintext;
				}
			});
}());
function O(q, x) {
	this.x = x;
	this.q = q;
};
function cS(other) {
	if (other == this)
		return true;
	return (this.q.eh(other.q) && this.x.eh(other.x));
};
function dg() {
	return this.x;
};
function dI() {
	return new O(this.q, this.x.gx().cK(this.q));
};
function cF(b) {
	return new O(this.q, this.x.add(b.bX()).cK(this.q));
};
function cL(b) {
	return new O(this.q, this.x.eA(b.bX()).cK(this.q));
};
function cZ(b) {
	return new O(this.q, this.x.multiply(b.bX()).cK(this.q));
};
function dn() {
	return new O(this.q, this.x.square().cK(this.q));
};
function cB(b) {
	return new O(this.q, this.x.multiply(b.bX().hh(this.q)).cK(this.q));
};
O.prototype.eh = cS;
O.prototype.bX = dg;
O.prototype.gx = dI;
O.prototype.add = cF;
O.prototype.eA = cL;
O.prototype.multiply = cZ;
O.prototype.square = dn;
O.prototype.divide = cB;
function V(dw, x, y, z) {
	this.dw = dw;
	this.x = x;
	this.y = y;
	if (z == null) {
		this.z = J.ONE;
	} else {
		this.z = z;
	}
	this.iC = null;
};
function dq() {
	if (this.iC == null) {
		this.iC = this.z.hh(this.dw.q);
	}
	return this.dw.fu(this.x.bX().multiply(this.iC).cK(this.dw.q));
};
function cW() {
	if (this.iC == null) {
		this.iC = this.z.hh(this.dw.q);
	}
	return this.dw.fu(this.y.bX().multiply(this.iC).cK(this.dw.q));
};
function dN(other) {
	if (other == this)
		return true;
	if (this.eY())
		return other.eY();
	if (other.eY())
		return this.eY();
	var u, v;
	u = other.y.bX().multiply(this.z).eA(this.y.bX().multiply(other.z))
			.cK(this.dw.q);
	if (!u.eh(J.ZERO))
		return false;
	v = other.x.bX().multiply(this.z).eA(this.x.bX().multiply(other.z))
			.cK(this.dw.q);
	return v.eh(J.ZERO);
};
function cO() {
	if ((this.x == null) && (this.y == null))
		return true;
	return this.z.eh(J.ZERO) && !this.y.bX().eh(J.ZERO);
};
function cc() {
	return new V(this.dw, this.x, this.y.gx(), this.z);
};
function cJ(b) {
	if (this.eY())
		return b;
	if (b.eY())
		return this;
	var u = b.y.bX().multiply(this.z).eA(this.y.bX().multiply(b.z))
			.cK(this.dw.q);
	var v = b.x.bX().multiply(this.z).eA(this.x.bX().multiply(b.z))
			.cK(this.dw.q);
	if (J.ZERO.eh(v)) {
		if (J.ZERO.eh(u)) {
			return this.ik();
		}
		return this.dw.fW();
	}
	var jl = new J("3");
	var x1 = this.x.bX();
	var y1 = this.y.bX();
	var x2 = b.x.bX();
	var y2 = b.y.bX();
	var qH = v.square();
	var kI = qH.multiply(v);
	var pz = x1.multiply(qH);
	var qf = u.square().multiply(this.z);
	var fY = qf.eA(pz.shiftLeft(1)).multiply(b.z).eA(kI).multiply(v)
			.cK(this.dw.q);
	var iw = pz.multiply(jl).multiply(u).eA(y1.multiply(kI)).eA(qf.multiply(u))
			.multiply(b.z).add(u.multiply(kI)).cK(this.dw.q);
	var mU = kI.multiply(this.z).multiply(b.z).cK(this.dw.q);
	return new V(this.dw, this.dw.fu(fY), this.dw.fu(iw), mU);
};
function dA() {
	if (this.eY())
		return this;
	if (this.y.bX().fA() == 0)
		return this.dw.fW();
	var jl = new J("3");
	var x1 = this.x.bX();
	var y1 = this.y.bX();
	var lQ = y1.multiply(this.z);
	var pd = lQ.multiply(y1).cK(this.dw.q);
	var a = this.dw.a.bX();
	var w = x1.square().multiply(jl);
	if (!J.ZERO.eh(a)) {
		w = w.add(this.z.square().multiply(a));
	}
	w = w.cK(this.dw.q);
	var fY = w.square().eA(x1.shiftLeft(3).multiply(pd)).shiftLeft(1)
			.multiply(lQ).cK(this.dw.q);
	var iw = w.multiply(jl).multiply(x1).eA(pd.shiftLeft(1)).shiftLeft(2)
			.multiply(pd).eA(w.square().multiply(w)).cK(this.dw.q);
	var mU = lQ.square().multiply(lQ).shiftLeft(3).cK(this.dw.q);
	return new V(this.dw, this.dw.fu(fY), this.dw.fu(iw), mU);
};
function cl(k) {
	if (this.eY())
		return this;
	if (k.fA() == 0)
		return this.dw.fW();
	var e = k;
	var h = e.multiply(new J("3"));
	var nG = this.gx();
	var R = this;
	var i;
	for (i = h.fJ() - 2; i > 0; --i) {
		R = R.ik();
		var iz = h.fv(i);
		var na = e.fv(i);
		if (iz != na) {
			R = R.add(iz ? this : nG);
		}
	}
	return R;
};
function ci(j, x, k) {
	var i;
	if (j.fJ() > k.fJ())
		i = j.fJ() - 1;
	else
		i = k.fJ() - 1;
	var R = this.dw.fW();
	var both = this.add(x);
	while (i >= 0) {
		R = R.ik();
		if (j.fv(i)) {
			if (k.fv(i)) {
				R = R.add(both);
			} else {
				R = R.add(this);
			}
		} else {
			if (k.fv(i)) {
				R = R.add(x);
			}
		}
		--i;
	}
	return R;
};
V.prototype.eU = dq;
V.prototype.fM = cW;
V.prototype.eh = dN;
V.prototype.eY = cO;
V.prototype.gx = cc;
V.prototype.add = cJ;
V.prototype.ik = dA;
V.prototype.multiply = cl;
V.prototype.vm = ci;
function aC(q, a, b) {
	this.q = q;
	this.a = this.fu(a);
	this.b = this.fu(b);
	this.nT = new V(this, null, null);
};
function cf() {
	return this.q;
};
function dv() {
	return this.a;
};
function cN() {
	return this.b;
};
function dz(other) {
	if (other == this)
		return true;
	return (this.q.eh(other.q) && this.a.eh(other.a) && this.b.eh(other.b));
};
function dR() {
	return this.nT;
};
function da(x) {
	return new O(this.q, x);
};
function cX(s) {
	switch (parseInt(s.substr(0, 2), 16)) {
		case 0 :
			return this.nT;
		case 2 :
		case 3 :
			return null;
		case 4 :
		case 6 :
		case 7 :
			var eF = (s.length - 2) / 2;
			var gl = s.substr(2, eF);
			var fQ = s.substr(eF + 2, eF);
			return new V(this, this.fu(new J(gl, 16)), this.fu(new J(fQ, 16)));
		default :
			return null;
	}
};
aC.prototype.oY = cf;
aC.prototype.uv = dv;
aC.prototype.tu = cN;
aC.prototype.eh = dz;
aC.prototype.fW = dR;
aC.prototype.fu = da;
aC.prototype.uK = cX;
if (typeof Aostar == "undefined" || !Aostar)
	var Aostar = {};
if (typeof Aostar.crypto == "undefined" || !Aostar.crypto)
	Aostar.crypto = {};
Aostar.crypto.eg = function(dr) {
	var fc = "secp256r1";
	var ft = null;
	var fN = null;
	var cD = null;
	var lO = new aY();
	var vh = null;
	this.type = "EC";
	function dP(P, k, Q, l) {
		var m = Math.max(k.fJ(), l.fJ());
		var Z = P.gK(Q);
		var R = P.dw.fW();
		for (var i = m - 1; i >= 0; --i) {
			R = R.rh();
			R.z = J.ONE;
			if (k.fv(i)) {
				if (l.fv(i)) {
					R = R.gK(Z);
				} else {
					R = R.gK(P);
				}
			} else {
				if (l.fv(i)) {
					R = R.gK(Q);
				}
			}
		}
		return R;
	};
	this.hM = function(lo) {
		return new J(lo.fJ(), lO).cK(lo.eA(J.ONE)).add(J.ONE);
	};
	this.oM = function(fc) {
		this.ft = Aostar.crypto.eR.getByName(fc);
		this.fN = null;
		this.cD = null;
		this.fc = fc;
	};
	this.ki = function(fN) {
		this.qw = true;
		this.fN = fN;
	};
	this.kH = function(cD) {
		this.rk = true;
		this.cD = cD;
	};
	this.vB = function() {
		var h = this.cD;
		if (h.substr(0, 2) !== "04")
			throw "this method supports uncompressed format(04) only";
		var eb = this.ft.hz / 4;
		if (h.length !== 2 + eb * 2)
			throw "malformed public key cw length";
		var result = {};
		result.x = h.substr(2, eb);
		result.y = h.substr(2 + eb);
		return result;
	};
	this.vW = function() {
		var s = this.fc;
		if (s === "secp256r1" || s === "NIST P-256" || s === "P-256"
				|| s === "prime256v1")
			return "P-256";
		if (s === "secp384r1" || s === "NIST P-384" || s === "P-384")
			return "P-384";
		return null;
	};
	this.nS = function() {
		var mz = this.ft['n'];
		var gw = this.hM(mz);
		var gF = this.ft['G'].multiply(gw);
		var kw = gF.eU().bX();
		var jN = gF.fM().bX();
		var eb = this.ft['hz'] / 4;
		var iJ = ("0000000000" + gw.toString(16)).slice(-eb);
		var jK = ("0000000000" + kw.toString(16)).slice(-eb);
		var kP = ("0000000000" + jN.toString(16)).slice(-eb);
		var jg = "04" + jK + kP;
		this.ki(iJ);
		this.kH(jg);
		return {
			'ecprvhex' : iJ,
			'ecpubhex' : jg
		};
	};
	this.ve = function(gV) {
		var gw = new J(gV, 16);
		var gF = this.ft['G'].multiply(gw);
		var kw = gF.eU().bX();
		var jN = gF.fM().bX();
		var eb = this.ft['hz'] / 4;
		var iJ = ("0000000000" + gw.toString(16)).slice(-eb);
		var jK = ("0000000000" + kw.toString(16)).slice(-eb);
		var kP = ("0000000000" + jN.toString(16)).slice(-eb);
		var jg = "04" + jK + kP;
		return {
			'ecprvhex' : iJ,
			'ecpubhex' : jg
		};
	};
	this.lf = function(eD) {
		return this.iE(eD, this.fN);
	};
	this.iE = function(eD, nB) {
		var d = new J(nB, 16);
		var n = this.ft['n'];
		var e = new J(eD, 16);
		do {
			var k = this.hM(n);
			var G = this.ft['G'];
			var Q = G.multiply(k);
			var r = Q.eU().bX().cK(n);
		} while (r.ce(J.ZERO) <= 0);
		var s = k.hh(n).multiply(e.add(d.multiply(r))).cK(n);
		return Aostar.crypto.eg.oR(r, s);
	};
	this.sign = function(hash, nD) {
		var d = nD;
		var n = this.ft['n'];
		var e = J.hA(hash);
		do {
			var k = this.hM(n);
			var G = this.ft['G'];
			var Q = G.multiply(k);
			var r = Q.eU().bX().cK(n);
		} while (r.ce(J.ZERO) <= 0);
		var s = k.hh(n).multiply(e.add(d.multiply(r))).cK(n);
		return this.oJ(r, s);
	};
	this.kh = function(eD, fl) {
		return this.iZ(eD, fl, this.cD);
	};
	this.iZ = function(eD, fl, gT) {
		var r, s;
		var fp = Aostar.crypto.eg.oO(fl);
		r = fp.r;
		s = fp.s;
		var Q;
		Q = V.kW(this.ft['dw'], gT);
		var e = new J(eD, 16);
		return this.iX(e, r, s, Q);
	};
	this.jb = function(hash, cC, gc) {
		var r, s;
		if (oc.gu.isArray(cC)) {
			var fp = this.pj(cC);
			r = fp.r;
			s = fp.s;
		} else if ("object" === typeof cC && cC.r && cC.s) {
			r = cC.r;
			s = cC.s;
		} else {
			throw "Invalid value for signature";
		}
		var Q;
		if (gc instanceof V) {
			Q = gc;
		} else if (oc.gu.isArray(gc)) {
			Q = V.nI(this.ft['dw'], gc);
		} else {
			throw "Invalid format for gc value, must be byte array kt V";
		}
		var e = J.hA(hash);
		return this.iX(e, r, s, Q);
	};
	this.iX = function(e, r, s, Q) {
		var n = this.ft['n'];
		var G = this.ft['G'];
		if (r.ce(J.ONE) < 0 || r.ce(n) >= 0)
			return false;
		if (s.ce(J.ONE) < 0 || s.ce(n) >= 0)
			return false;
		var c = s.hh(n);
		var rO = e.multiply(c).cK(n);
		var sC = r.multiply(c).cK(n);
		var nP = G.multiply(rO).add(Q.multiply(sC));
		var v = nP.eU().bX().cK(n);
		return v.eh(r);
	};
	this.oJ = function(r, s) {
		var hj = r.mA();
		var hH = s.mA();
		var dS = [];
		dS.push(0x02);
		dS.push(hj.length);
		dS = dS.concat(hj);
		dS.push(0x02);
		dS.push(hH.length);
		dS = dS.concat(hH);
		dS.unshift(dS.length);
		dS.unshift(0x30);
		return dS;
	};
	this.pj = function(cC) {
		var cursor;
		if (cC[0] != 0x30)
			throw new Error("gn not a valid jh");
		cursor = 2;
		if (cC[cursor] != 0x02)
			throw new Error("First element in signature must be a hb");;
		var hj = cC.slice(cursor + 2, cursor + 2 + cC[cursor + 1]);
		cursor += 2 + cC[cursor + 1];
		if (cC[cursor] != 0x02)
			throw new Error("Second element in signature must be a hb");
		var hH = cC.slice(cursor + 2, cursor + 2 + cC[cursor + 1]);
		cursor += 2 + cC[cursor + 1];
		var r = J.hA(hj);
		var s = J.hA(hH);
		return {
			r : r,
			s : s
		};
	};
	this.uF = function(cC) {
		if (cC.length !== 65) {
			throw "gn has the wrong length";
		}
		var i = cC[0] - 27;
		if (i < 0 || i > 7) {
			throw "Invalid signature type";
		}
		var n = this.ft['n'];
		var r = J.hA(cC.slice(1, 33)).cK(n);
		var s = J.hA(cC.slice(33, 65)).cK(n);
		return {
			r : r,
			s : s,
			i : i
		};
	};
	if (dr !== undefined) {
		if (dr['dw'] !== undefined) {
			this.fc = dr['dw'];
		}
	}
	if (this.fc === undefined)
		this.fc = fc;
	this.oM(this.fc);
	if (dr !== undefined) {
		if (dr['prv'] !== undefined)
			this.ki(dr['prv']);
		if (dr['pub'] !== undefined)
			this.kH(dr['pub']);
	}
};
Aostar.crypto.eg.oO = function(fl) {
	var p = Aostar.crypto.eg.oi(fl);
	var lB = new J(p.r, 16);
	var jT = new J(p.s, 16);
	return {
		'r' : lB,
		's' : jT
	};
};
Aostar.crypto.eg.oi = function(fl) {
	if (fl.substr(0, 2) != "30")
		throw "signature is not a ASN.1 dS";
	var a = co.gY(fl, 0);
	if (a.length != 2)
		throw "number of signature ASN.1 dS elements seem wrong";
	var pP = a[0];
	var pN = a[1];
	if (fl.substr(pP, 2) != "02")
		throw "1st item of sequene of signature is not ASN.1 integer";
	if (fl.substr(pN, 2) != "02")
		throw "2nd item of sequene of signature is not ASN.1 integer";
	var hR = co.fG(fl, pP);
	var hF = co.fG(fl, pN);
	return {
		'r' : hR,
		's' : hF
	};
};
Aostar.crypto.eg.wv = function(rX) {
	var nY = Aostar.crypto.eg.oi(rX);
	var hR = nY.r;
	var hF = nY.s;
	if (hR.substr(0, 2) == "00" && (((hR.length / 2) * 8) % (16 * 8)) == 8)
		hR = hR.substr(2);
	if (hF.substr(0, 2) == "00" && (((hF.length / 2) * 8) % (16 * 8)) == 8)
		hF = hF.substr(2);
	if ((((hR.length / 2) * 8) % (16 * 8)) != 0)
		throw "unknown eg cC r length error";
	if ((((hF.length / 2) * 8) % (16 * 8)) != 0)
		throw "unknown eg cC s length error";
	return hR + hF;
};
Aostar.crypto.eg.wm = function(kL) {
	if ((((kL.length / 2) * 8) % (16 * 8)) != 0)
		throw "unknown eg concatinated r-s cC  length error";
	var hR = kL.substr(0, kL.length / 2);
	var hF = kL.substr(kL.length / 2);
	return Aostar.crypto.eg.uq(hR, hF);
};
Aostar.crypto.eg.uq = function(hR, hF) {
	var lB = new J(hR, 16);
	var jT = new J(hF, 16);
	return Aostar.crypto.eg.oR(lB, jT);
};
Aostar.crypto.eg.oR = function(lB, jT) {
	var sc = new Aostar.cn.hb({
				'jY' : lB
			});
	var rw = new Aostar.cn.hb({
				'jY' : jT
			});
	var rs = new Aostar.cn.jh({
				'array' : [sc, rw]
			});
	return rs.hy();
};
O.prototype.vn = function() {
	return Math.floor((this.bX().fJ() + 7) / 8);
};
V.prototype.vw = function(vb) {
	var qQ = function(i, eF) {
		var gg = i.vK();
		if (eF < gg.length) {
			gg = gg.slice(gg.length - eF);
		} else
			while (eF > gg.length) {
				gg.unshift(0);
			}
		return gg;
	};
	var x = this.eU().bX();
	var y = this.fM().bX();
	var fj = qQ(x, 32);
	if (vb) {
		if (y.dZ()) {
			fj.unshift(0x02);
		} else {
			fj.unshift(0x03);
		}
	} else {
		fj.unshift(0x04);
		fj = fj.concat(qQ(y, 32));
	}
	return fj;
};
V.nI = function(dw, fj) {
	var type = fj[0];
	var gy = fj.length - 1;
	var qt = fj.slice(1, 1 + gy / 2);
	var qJ = fj.slice(1 + gy / 2, 1 + gy);
	qt.unshift(0);
	qJ.unshift(0);
	var x = new J(qt);
	var y = new J(qJ);
	return new V(dw, dw.fu(x), dw.fu(y));
};
V.kW = function(dw, kC) {
	var type = kC.substr(0, 2);
	var gy = kC.length - 2;
	var gl = kC.substr(2, gy / 2);
	var fQ = kC.substr(2 + gy / 2, gy / 2);
	var x = new J(gl, 16);
	var y = new J(fQ, 16);
	return new V(dw, dw.fu(x), dw.fu(y));
};
V.prototype.gK = function(b) {
	if (this.eY())
		return b;
	if (b.eY())
		return this;
	if (this.x.eh(b.x)) {
		if (this.y.eh(b.y)) {
			return this.ik();
		}
		return this.dw.fW();
	}
	var rF = b.x.eA(this.x);
	var sG = b.y.eA(this.y);
	var jM = sG.divide(rF);
	var fY = jM.square().eA(this.x).eA(b.x);
	var iw = jM.multiply(this.x.eA(fY)).eA(this.y);
	return new V(this.dw, fY, iw);
};
V.prototype.rh = function() {
	if (this.eY())
		return this;
	if (this.y.bX().fA() == 0) {
		return this.dw.fW();
	}
	var qu = this.dw.fu(J.valueOf(2));
	var jl = this.dw.fu(J.valueOf(3));
	var jM = this.x.square().multiply(jl).add(this.dw.a).divide(this.y
			.multiply(qu));
	var fY = jM.square().eA(this.x.multiply(qu));
	var iw = jM.multiply(this.x.eA(fY)).eA(this.y);
	return new V(this.dw, fY, iw);
};
V.prototype.wM = function(k) {
	if (this.eY())
		return this;
	if (k.fA() == 0)
		return this.dw.fW();
	var e = k;
	var h = e.multiply(new J("3"));
	var nG = this.gx();
	var R = this;
	var i;
	for (i = h.fJ() - 2; i > 0; --i) {
		R = R.ik();
		var iz = h.fv(i);
		var na = e.fv(i);
		if (iz != na) {
			R = R.gK(iz ? this : nG);
		}
	}
	return R;
};
V.prototype.rI = function() {
	var x = this.eU().bX();
	var y = this.fM().bX();
	var a = this.dw.uv().bX();
	var b = this.dw.tu().bX();
	var n = this.dw.oY();
	var lhs = y.multiply(y).cK(n);
	var rhs = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).cK(n);
	return lhs.eh(rhs);
};
V.prototype.toString = function() {
	return '(' + this.eU().bX().toString() + ',' + this.fM().bX().toString()
			+ ')';
};
V.prototype.wQ = function() {
	var n = this.dw.oY();
	if (this.eY()) {
		throw new Error("Point is at nT.");
	}
	var x = this.eU().bX();
	var y = this.fM().bX();
	if (x.ce(J.ONE) < 0 || x.ce(n.eA(J.ONE)) > 0) {
		throw new Error('x coordinate out of bounds');
	}
	if (y.ce(J.ONE) < 0 || y.ce(n.eA(J.ONE)) > 0) {
		throw new Error('y coordinate out of bounds');
	}
	if (!this.rI()) {
		throw new Error("Point is not on the dw.");
	}
	if (this.multiply(n).eY()) {
		throw new Error("Point is not a scalar multiple of G.");
	}
	return true;
};
var gW;
var uM = 0xdeadbeefcafe;
var rd = ((uM & 0xffffff) == 0xefcafe);
function J(a, b, c) {
	if (a != null)
		if ("number" == typeof a)
			this.mx(a, b, c);
		else if (b == null && "string" != typeof a)
			this.mW(a, 256);
		else
			this.mW(a, b);
};
function T() {
	return new J(null);
};
function du(i, x, w, j, c, n) {
	while (--n >= 0) {
		var v = x * this[i++] + w[j] + c;
		c = Math.floor(v / 0x4000000);
		w[j++] = v & 0x3ffffff;
	}
	return c;
};
function cz(i, x, w, j, c, n) {
	var ja = x & 0x7fff, kX = x >> 15;
	for (var pO = n; pO--; pO >= 0) {
		var l = this[i] & 0x7fff;
		var h = this[i++] >> 15;
		var m = kX * l + h * ja;
		l = ja * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
		c = (l >>> 30) + (m >>> 15) + kX * h + (c >>> 30);
		w[j++] = l & 0x3fffffff;
	}
	return c;
};
function dQ(i, x, w, j, c, n) {
	var ja = x & 0x3fff, kX = x >> 14;
	while (--n >= 0) {
		var l = this[i] & 0x3fff;
		var h = this[i++] >> 14;
		var m = kX * l + h * ja;
		l = ja * l + ((m & 0x3fff) << 14) + w[j] + c;
		c = (l >> 28) + (m >> 14) + kX * h;
		w[j++] = l & 0xfffffff;
	}
	return c;
};
var ra = typeof navigator !== "undefined";
if (ra && rd && (navigator.appName == "Microsoft Internet Explorer")) {
	J.prototype.fa = cz;
	gW = 30;
} else if (ra && rd && (navigator.appName != "Netscape")) {
	J.prototype.fa = du;
	gW = 26;
} else {
	J.prototype.fa = dQ;
	gW = 28;
}
J.prototype.dm = gW;
J.prototype.dU = ((1 << gW) - 1);
J.prototype.fg = (1 << gW);
var nH = 52;
J.prototype.tw = Math.pow(2, nH);
J.prototype.pL = nH - gW;
J.prototype.qR = 2 * gW - nH;
var rA = "0123456789abcdefghijklmnopqrstuvwxyz";
var lp = new Array();
var iL, eO;
iL = "0".charCodeAt(0);
for (eO = 0; eO <= 9; ++eO)
	lp[iL++] = eO;
iL = "a".charCodeAt(0);
for (eO = 10; eO < 36; ++eO)
	lp[iL++] = eO;
iL = "A".charCodeAt(0);
for (eO = 10; eO < 36; ++eO)
	lp[iL++] = eO;
function ai(n) {
	return rA.charAt(n);
};
function bK(s, i) {
	var c = lp[s.charCodeAt(i)];
	return (c == null) ? -1 : c;
};
function cA(r) {
	for (var i = this.t - 1; i >= 0; --i)
		r[i] = this[i];
	r.t = this.t;
	r.s = this.s;
};
function cq(x) {
	this.t = 1;
	this.s = (x < 0) ? -1 : 0;
	if (x > 0)
		this[0] = x;
	else if (x < -1)
		this[0] = x + this.fg;
	else
		this.t = 0;
};
function bu(i) {
	var r = T();
	r.fT(i);
	return r;
};
function dB(s, b) {
	var k;
	if (b == 16)
		k = 4;
	else if (b == 8)
		k = 3;
	else if (b == 256)
		k = 8;
	else if (b == 2)
		k = 1;
	else if (b == 32)
		k = 5;
	else if (b == 4)
		k = 2;
	else {
		this.rn(s, b);
		return;
	}
	this.t = 0;
	this.s = 0;
	var i = s.length, hn = false, gq = 0;
	while (--i >= 0) {
		var x = (k == 8) ? s[i] & 0xff : bK(s, i);
		if (x < 0) {
			if (s.charAt(i) == "-")
				hn = true;
			continue;
		}
		hn = false;
		if (gq == 0)
			this[this.t++] = x;
		else if (gq + k > this.dm) {
			this[this.t - 1] |= (x & ((1 << (this.dm - gq)) - 1)) << gq;
			this[this.t++] = (x >> (this.dm - gq));
		} else
			this[this.t - 1] |= x << gq;
		gq += k;
		if (gq >= this.dm)
			gq -= this.dm;
	}
	if (k == 8 && (s[0] & 0x80) != 0) {
		this.s = -1;
		if (gq > 0)
			this[this.t - 1] |= ((1 << (this.dm - gq)) - 1) << gq;
	}
	this.dY();
	if (hn)
		J.ZERO.bW(this, this);
};
function cR() {
	var c = this.s & this.dU;
	while (this.t > 0 && this[this.t - 1] == c)
		--this.t;
};
function dp(b) {
	if (this.s < 0)
		return "-" + this.gx().toString(b);
	var k;
	if (b == 16)
		k = 4;
	else if (b == 8)
		k = 3;
	else if (b == 2)
		k = 1;
	else if (b == 32)
		k = 5;
	else if (b == 4)
		k = 2;
	else
		return this.ez(b);
	var jp = (1 << k) - 1, d, m = false, r = "", i = this.t;
	var p = this.dm - (i * this.dm) % k;
	if (i-- > 0) {
		if (p < this.dm && (d = this[i] >> p) > 0) {
			m = true;
			r = ai(d);
		}
		while (i >= 0) {
			if (p < k) {
				d = (this[i] & ((1 << p) - 1)) << (k - p);
				d |= this[--i] >> (p += this.dm - k);
			} else {
				d = (this[i] >> (p -= k)) & jp;
				if (p <= 0) {
					p += this.dm;
					--i;
				}
			}
			if (d > 0)
				m = true;
			if (m)
				r += ai(d);
		}
	}
	return m ? r : "0";
};
function dk() {
	var r = T();
	J.ZERO.bW(this, r);
	return r;
};
function dF() {
	return (this.s < 0) ? this.gx() : this;
};
function af(a) {
	var r = this.s - a.s;
	if (r != 0)
		return r;
	var i = this.t;
	r = i - a.t;
	if (r != 0)
		return (this.s < 0) ? -r : r;
	while (--i >= 0)
		if ((r = this[i] - a[i]) != 0)
			return r;
	return 0;
};
function aK(x) {
	var r = 1, t;
	if ((t = x >>> 16) != 0) {
		x = t;
		r += 16;
	}
	if ((t = x >> 8) != 0) {
		x = t;
		r += 8;
	}
	if ((t = x >> 4) != 0) {
		x = t;
		r += 4;
	}
	if ((t = x >> 2) != 0) {
		x = t;
		r += 2;
	}
	if ((t = x >> 1) != 0) {
		x = t;
		r += 1;
	}
	return r;
};
function cE() {
	if (this.t <= 0)
		return 0;
	return this.dm * (this.t - 1) + aK(this[this.t - 1] ^ (this.s & this.dU));
};
function cY(n, r) {
	var i;
	for (i = this.t - 1; i >= 0; --i)
		r[i + n] = this[i];
	for (i = n - 1; i >= 0; --i)
		r[i] = 0;
	r.t = this.t + n;
	r.s = this.s;
};
function cp(n, r) {
	for (var i = n; i < this.t; ++i)
		r[i - n] = this[i];
	r.t = Math.max(this.t - n, 0);
	r.s = this.s;
};
function cQ(n, r) {
	var eu = n % this.dm;
	var lx = this.dm - eu;
	var lT = (1 << lx) - 1;
	var ew = Math.floor(n / this.dm), c = (this.s << eu) & this.dU, i;
	for (i = this.t - 1; i >= 0; --i) {
		r[i + ew + 1] = (this[i] >> lx) | c;
		c = (this[i] & lT) << eu;
	}
	for (i = ew - 1; i >= 0; --i)
		r[i] = 0;
	r[ew] = c;
	r.t = this.t + ew + 1;
	r.s = this.s;
	r.dY();
};
function cI(n, r) {
	r.s = this.s;
	var ew = Math.floor(n / this.dm);
	if (ew >= this.t) {
		r.t = 0;
		return;
	}
	var eu = n % this.dm;
	var lx = this.dm - eu;
	var lT = (1 << eu) - 1;
	r[0] = this[ew] >> eu;
	for (var i = ew + 1; i < this.t; ++i) {
		r[i - ew - 1] |= (this[i] & lT) << lx;
		r[i - ew] = this[i] >> eu;
	}
	if (eu > 0)
		r[this.t - ew - 1] |= (this.s & lT) << lx;
	r.t = this.t - ew;
	r.dY();
};
function dh(a, r) {
	var i = 0, c = 0, m = Math.min(a.t, this.t);
	while (i < m) {
		c += this[i] - a[i];
		r[i++] = c & this.dU;
		c >>= this.dm;
	}
	if (a.t < this.t) {
		c -= a.s;
		while (i < this.t) {
			c += this[i];
			r[i++] = c & this.dU;
			c >>= this.dm;
		}
		c += this.s;
	} else {
		c += this.s;
		while (i < a.t) {
			c -= a[i];
			r[i++] = c & this.dU;
			c >>= this.dm;
		}
		c -= a.s;
	}
	r.s = (c < 0) ? -1 : 0;
	if (c < -1)
		r[i++] = this.fg + c;
	else if (c > 0)
		r[i++] = c;
	r.t = i;
	r.dY();
};
function bZ(a, r) {
	var x = this.abs(), y = a.abs();
	var i = x.t;
	r.t = i + y.t;
	while (--i >= 0)
		r[i] = 0;
	for (i = 0; i < y.t; ++i)
		r[i + x.t] = x.fa(0, y[i], r, i, 0, x.t);
	r.s = 0;
	r.dY();
	if (this.s != a.s)
		J.ZERO.bW(r, r);
};
function bY(r) {
	var x = this.abs();
	var i = r.t = 2 * x.t;
	while (--i >= 0)
		r[i] = 0;
	for (i = 0; i < x.t - 1; ++i) {
		var c = x.fa(i, x[i], r, 2 * i, 0, 1);
		if ((r[i + x.t] += x.fa(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.fg) {
			r[i + x.t] -= x.fg;
			r[i + x.t + 1] = 1;
		}
	}
	if (r.t > 0)
		r[r.t - 1] += x.fa(i, x[i], r, 2 * i, 0, 1);
	r.s = 0;
	r.dY();
};
function dO(m, q, r) {
	var io = m.abs();
	if (io.t <= 0)
		return;
	var pt = this.abs();
	if (pt.t < io.t) {
		if (q != null)
			q.fT(0);
		if (r != null)
			this.gI(r);
		return;
	}
	if (r == null)
		r = T();
	var y = T(), qq = this.s, ms = m.s;
	var jd = this.dm - aK(io[io.t - 1]);
	if (jd > 0) {
		io.fR(jd, y);
		pt.fR(jd, r);
	} else {
		io.gI(y);
		pt.gI(r);
	}
	var hq = y.t;
	var oD = y[hq - 1];
	if (oD == 0)
		return;
	var nz = oD * (1 << this.pL) + ((hq > 1) ? y[hq - 2] >> this.qR : 0);
	var tp = this.tw / nz, vd = (1 << this.pL) / nz, e = 1 << this.qR;
	var i = r.t, j = i - hq, t = (q == null) ? T() : q;
	y.iB(j, t);
	if (r.ce(t) >= 0) {
		r[r.t++] = 1;
		r.bW(t, r);
	}
	J.ONE.iB(hq, t);
	t.bW(y, y);
	while (y.t < hq)
		y[y.t++] = 0;
	while (--j >= 0) {
		var me = (r[--i] == oD) ? this.dU : Math.floor(r[i] * tp
				+ (r[i - 1] + e) * vd);
		if ((r[i] += y.fa(0, me, r, j, 0, hq)) < me) {
			y.iB(j, t);
			r.bW(t, r);
			while (r[i] < --me)
				r.bW(t, r);
		}
	}
	if (q != null) {
		r.iS(hq, q);
		if (qq != ms)
			J.ZERO.bW(q, q);
	}
	r.t = hq;
	r.dY();
	if (jd > 0)
		r.ea(jd, r);
	if (qq < 0)
		J.ZERO.bW(r, r);
};
function cG(a) {
	var r = T();
	this.abs().en(a, null, r);
	if (this.s < 0 && r.ce(J.ZERO) > 0)
		a.bW(r, r);
	return r;
};
function bB(m) {
	this.m = m;
};
function dM(x) {
	if (x.s < 0 || x.ce(this.m) >= 0)
		return x.cK(this.m);
	else
		return x;
};
function cU(x) {
	return x;
};
function cV(x) {
	x.en(this.m, null, x);
};
function cT(x, y, r) {
	x.gN(y, r);
	this.reduce(r);
};
function ck(x, r) {
	x.gs(r);
	this.reduce(r);
};
bB.prototype.convert = dM;
bB.prototype.revert = cU;
bB.prototype.reduce = cV;
bB.prototype.hl = cT;
bB.prototype.ey = ck;
function dK() {
	if (this.t < 1)
		return 0;
	var x = this[0];
	if ((x & 1) == 0)
		return 0;
	var y = x & 3;
	y = (y * (2 - (x & 0xf) * y)) & 0xf;
	y = (y * (2 - (x & 0xff) * y)) & 0xff;
	y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
	y = (y * (2 - x * y % this.fg)) % this.fg;
	return (y > 0) ? this.fg - y : -y;
};
function al(m) {
	this.m = m;
	this.qj = m.rZ();
	this.pD = this.qj & 0x7fff;
	this.rD = this.qj >> 15;
	this.sp = (1 << (m.dm - 15)) - 1;
	this.tf = 2 * m.t;
};
function bF(x) {
	var r = T();
	x.abs().iB(this.m.t, r);
	r.en(this.m, null, r);
	if (x.s < 0 && r.ce(J.ZERO) > 0)
		this.m.bW(r, r);
	return r;
};
function bS(x) {
	var r = T();
	x.gI(r);
	this.reduce(r);
	return r;
};
function de(x) {
	while (x.t <= this.tf)
		x[x.t++] = 0;
	for (var i = 0; i < this.m.t; ++i) {
		var j = x[i] & 0x7fff;
		var rv = (j * this.pD + (((j * this.rD + (x[i] >> 15) * this.pD) & this.sp) << 15))
				& x.dU;
		j = i + this.m.t;
		x[j] += this.m.fa(0, rv, x, i, 0, this.m.t);
		while (x[j] >= x.fg) {
			x[j] -= x.fg;
			x[++j]++;
		}
	}
	x.dY();
	x.iS(this.m.t, x);
	if (x.ce(this.m) >= 0)
		x.bW(this.m, x);
};
function aJ(x, r) {
	x.gs(r);
	this.reduce(r);
};
function cd(x, y, r) {
	x.gN(y, r);
	this.reduce(r);
};
al.prototype.convert = bF;
al.prototype.revert = bS;
al.prototype.reduce = de;
al.prototype.hl = cd;
al.prototype.ey = aJ;
function df() {
	return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
};
function dc(e, z) {
	if (e > 0xffffffff || e < 1)
		return J.ONE;
	var r = T(), r2 = T(), g = z.convert(this), i = aK(e) - 1;
	g.gI(r);
	while (--i >= 0) {
		z.ey(r, r2);
		if ((e & (1 << i)) > 0)
			z.hl(r2, g, r);
		else {
			var t = r;
			r = r2;
			r2 = t;
		}
	}
	return z.revert(r);
};
function cr(e, m) {
	var z;
	if (e < 256 || m.dZ())
		z = new bB(m);
	else
		z = new al(m);
	return this.exp(e, z);
};
J.prototype.gI = cA;
J.prototype.fT = cq;
J.prototype.mW = dB;
J.prototype.dY = cR;
J.prototype.iB = cY;
J.prototype.iS = cp;
J.prototype.fR = cQ;
J.prototype.ea = cI;
J.prototype.bW = dh;
J.prototype.gN = bZ;
J.prototype.gs = bY;
J.prototype.en = dO;
J.prototype.rZ = dK;
J.prototype.dZ = df;
J.prototype.exp = dc;
J.prototype.toString = dp;
J.prototype.gx = dk;
J.prototype.abs = dF;
J.prototype.ce = af;
J.prototype.fJ = cE;
J.prototype.cK = cG;
J.prototype.pU = cr;
J.ZERO = bu(0);
J.ONE = bu(1);
function aF1() {
	var r = T();
	this.gI(r);
	return r;
};
function bG1() {
	if (this.s < 0) {
		if (this.t == 1)
			return this[0] - this.fg;
		else if (this.t == 0)
			return -1;
	} else if (this.t == 1)
		return this[0];
	else if (this.t == 0)
		return 0;
	return ((this[1] & ((1 << (32 - this.dm)) - 1)) << this.dm) | this[0];
};
function as1() {
	return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
};
function bg1() {
	return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
};
function bJ1(r) {
	return Math.floor(Math.LN2 * this.dm / Math.log(r));
};
function aD1() {
	if (this.s < 0)
		return -1;
	else if (this.t <= 0 || (this.t == 1 && this[0] <= 0))
		return 0;
	else
		return 1;
};
function an1(b) {
	if (b == null)
		b = 10;
	if (this.fA() == 0 || b < 2 || b > 36)
		return "0";
	var gE = this.jX(b);
	var a = Math.pow(b, gE);
	var d = bu(a), y = T(), z = T(), r = "";
	this.en(d, y, z);
	while (y.fA() > 0) {
		r = (a + z.eV()).toString(b).substr(1) + r;
		y.en(d, y, z);
	}
	return z.eV().toString(b) + r;
};
function aU1(s, b) {
	this.fT(0);
	if (b == null)
		b = 10;
	var gE = this.jX(b);
	var d = Math.pow(b, gE), hn = false, j = 0, w = 0;
	for (var i = 0; i < s.length; ++i) {
		var x = bK(s, i);
		if (x < 0) {
			if (s.charAt(i) == "-" && this.fA() == 0)
				hn = true;
			continue;
		}
		w = b * w + x;
		if (++j >= gE) {
			this.lw(d);
			this.gS(w, 0);
			j = 0;
			w = 0;
		}
	}
	if (j > 0) {
		this.lw(Math.pow(b, j));
		this.gS(w, 0);
	}
	if (hn)
		J.ZERO.bW(this, this);
};
function aV1(a, b, c) {
	if ("number" == typeof b) {
		if (a < 2)
			this.fT(1);
		else {
			this.mx(a, c);
			if (!this.fv(a - 1))
				this.el(J.ONE.shiftLeft(a - 1), bk, this);
			if (this.dZ())
				this.gS(1, 0);
			while (!this.oy(b)) {
				this.gS(2, 0);
				if (this.fJ() > a)
					this.bW(J.ONE.shiftLeft(a - 1), this);
			}
		}
	} else {
		var x = new Array(), t = a & 7;
		x.length = (a >> 3) + 1;
		b.oP(x);
		if (t > 0)
			x[0] &= ((1 << t) - 1);
		else
			x[0] = 0;
		this.mW(x, 256);
	}
};
function aA1() {
	var i = this.t, r = new Array();
	r[0] = this.s;
	var p = this.dm - (i * this.dm) % 8, d, k = 0;
	if (i-- > 0) {
		if (p < this.dm && (d = this[i] >> p) != (this.s & this.dU) >> p)
			r[k++] = d | (this.s << (this.dm - p));
		while (i >= 0) {
			if (p < 8) {
				d = (this[i] & ((1 << p) - 1)) << (8 - p);
				d |= this[--i] >> (p += this.dm - 8);
			} else {
				d = (this[i] >> (p -= 8)) & 0xff;
				if (p <= 0) {
					p += this.dm;
					--i;
				}
			}
			if ((d & 0x80) != 0)
				d |= -256;
			if (k == 0 && (this.s & 0x80) != (d & 0x80))
				++k;
			if (k > 0 || d != this.s)
				r[k++] = d;
		}
	}
	return r;
};
function ad1(a) {
	return (this.ce(a) == 0);
};
function aT1(a) {
	return (this.ce(a) < 0) ? this : a;
};
function ar1(a) {
	return (this.ce(a) > 0) ? this : a;
};
function aa1(a, eH, r) {
	var i, f, m = Math.min(a.t, this.t);
	for (i = 0; i < m; ++i)
		r[i] = eH(this[i], a[i]);
	if (a.t < this.t) {
		f = a.s & this.dU;
		for (i = m; i < this.t; ++i)
			r[i] = eH(this[i], f);
		r.t = this.t;
	} else {
		f = this.s & this.dU;
		for (i = m; i < a.t; ++i)
			r[i] = eH(f, a[i]);
		r.t = a.t;
	}
	r.s = eH(this.s, a.s);
	r.dY();
};
function aQ1(x, y) {
	return x & y;
};
function az1(a) {
	var r = T();
	this.el(a, aQ, r);
	return r;
};
function bk1(x, y) {
	return x | y;
};
function aB1(a) {
	var r = T();
	this.el(a, bk, r);
	return r;
};
function aE1(x, y) {
	return x ^ y;
};
function aI1(a) {
	var r = T();
	this.el(a, aE, r);
	return r;
};
function ax1(x, y) {
	return x & ~y;
};
function bU1(a) {
	var r = T();
	this.el(a, ax, r);
	return r;
};
function aM1() {
	var r = T();
	for (var i = 0; i < this.t; ++i)
		r[i] = this.dU & ~this[i];
	r.t = this.t;
	r.s = ~this.s;
	return r;
};
function bQ1(n) {
	var r = T();
	if (n < 0)
		this.ea(-n, r);
	else
		this.fR(n, r);
	return r;
};
function bc1(n) {
	var r = T();
	if (n < 0)
		this.fR(-n, r);
	else
		this.ea(n, r);
	return r;
};
function bb1(x) {
	if (x == 0)
		return -1;
	var r = 0;
	if ((x & 0xffff) == 0) {
		x >>= 16;
		r += 16;
	}
	if ((x & 0xff) == 0) {
		x >>= 8;
		r += 8;
	}
	if ((x & 0xf) == 0) {
		x >>= 4;
		r += 4;
	}
	if ((x & 3) == 0) {
		x >>= 2;
		r += 2;
	}
	if ((x & 1) == 0)
		++r;
	return r;
};
function ae1() {
	for (var i = 0; i < this.t; ++i)
		if (this[i] != 0)
			return i * this.dm + bb(this[i]);
	if (this.s < 0)
		return this.t * this.dm;
	return -1;
};
function bD1(x) {
	var r = 0;
	while (x != 0) {
		x &= x - 1;
		++r;
	}
	return r;
};
function aP1() {
	var r = 0, x = this.s & this.dU;
	for (var i = 0; i < this.t; ++i)
		r += bD(this[i] ^ x);
	return r;
};
function bx1(n) {
	var j = Math.floor(n / this.dm);
	if (j >= this.t)
		return (this.s != 0);
	return ((this[j] & (1 << (n % this.dm))) != 0);
};
function bL1(n, eH) {
	var r = J.ONE.shiftLeft(n);
	this.el(r, eH, r);
	return r;
};
function bP1(n) {
	return this.hI(n, bk);
};
function bV1(n) {
	return this.hI(n, ax);
};
function bw1(n) {
	return this.hI(n, aE);
};
function ag1(a, r) {
	var i = 0, c = 0, m = Math.min(a.t, this.t);
	while (i < m) {
		c += this[i] + a[i];
		r[i++] = c & this.dU;
		c >>= this.dm;
	}
	if (a.t < this.t) {
		c += a.s;
		while (i < this.t) {
			c += this[i];
			r[i++] = c & this.dU;
			c >>= this.dm;
		}
		c += this.s;
	} else {
		c += this.s;
		while (i < a.t) {
			c += a[i];
			r[i++] = c & this.dU;
			c >>= this.dm;
		}
		c += a.s;
	}
	r.s = (c < 0) ? -1 : 0;
	if (c > 0)
		r[i++] = c;
	else if (c < -1)
		r[i++] = this.fg + c;
	r.t = i;
	r.dY();
};
function bh1(a) {
	var r = T();
	this.gh(a, r);
	return r;
};
function ah1(a) {
	var r = T();
	this.bW(a, r);
	return r;
};
function bn1(a) {
	var r = T();
	this.gN(a, r);
	return r;
};
function bC1() {
	var r = T();
	this.gs(r);
	return r;
};
function aZ1(a) {
	var r = T();
	this.en(a, r, null);
	return r;
};
function aq1(a) {
	var r = T();
	this.en(a, null, r);
	return r;
};
function bj1(a) {
	var q = T(), r = T();
	this.en(a, q, r);
	return new Array(q, r);
};
function aW1(n) {
	this[this.t] = this.fa(0, n - 1, this, 0, 0, this.t);
	++this.t;
	this.dY();
};
function aX1(n, w) {
	if (n == 0)
		return;
	while (this.t <= w)
		this[this.t++] = 0;
	this[w] += n;
	while (this[w] >= this.fg) {
		this[w] -= this.fg;
		if (++w >= this.t)
			this[this.t++] = 0;
		++this[w];
	}
};
function aO1() {
};
function bd1(x) {
	return x;
};
function aL1(x, y, r) {
	x.gN(y, r);
};
function aS1(x, r) {
	x.gs(r);
};
aO.prototype.convert = bd;
aO.prototype.revert = bd;
aO.prototype.hl = aL;
aO.prototype.ey = aS;
function ak1(e) {
	return this.exp(e, new aO());
};
function bv1(a, n, r) {
	var i = Math.min(this.t + a.t, n);
	r.s = 0;
	r.t = i;
	while (i > 0)
		r[--i] = 0;
	var j;
	for (j = r.t - this.t; i < j; ++i)
		r[i + this.t] = this.fa(0, a[i], r, i, 0, this.t);
	for (j = Math.min(a.t, n); i < j; ++i)
		this.fa(0, a[i], r, i, 0, n - i);
	r.dY();
};
function bq1(a, n, r) {
	--n;
	var i = r.t = this.t + a.t - n;
	r.s = 0;
	while (--i >= 0)
		r[i] = 0;
	for (i = Math.max(n - this.t, 0); i < a.t; ++i)
		r[this.t + i - n] = this.fa(n - i, a[i], r, 0, 0, this.t + i - n);
	r.dY();
	r.iS(1, r);
};
function bH1(m) {
	this.r2 = T();
	this.il = T();
	J.ONE.iB(2 * m.t, this.r2);
	this.nb = this.r2.divide(m);
	this.m = m;
};
function aH1(x) {
	if (x.s < 0 || x.t > 2 * this.m.t)
		return x.cK(this.m);
	else if (x.ce(this.m) < 0)
		return x;
	else {
		var r = T();
		x.gI(r);
		this.reduce(r);
		return r;
	}
};
function aj1(x) {
	return x;
};
function ao1(x) {
	x.iS(this.m.t - 1, this.r2);
	if (x.t > this.m.t + 1) {
		x.t = this.m.t + 1;
		x.dY();
	}
	this.nb.mY(this.r2, this.m.t + 1, this.il);
	this.m.mv(this.il, this.m.t + 1, this.r2);
	while (x.ce(this.r2) < 0)
		x.gS(1, this.m.t + 1);
	x.bW(this.r2, x);
	while (x.ce(this.m) >= 0)
		x.bW(this.m, x);
};
function bo1(x, r) {
	x.gs(r);
	this.reduce(r);
};
function aG1(x, y, r) {
	x.gN(y, r);
	this.reduce(r);
};
bH.prototype.convert = aH;
bH.prototype.revert = aj;
bH.prototype.reduce = ao;
bH.prototype.hl = aG;
bH.prototype.ey = bo;
function be1(e, m) {
	var i = e.fJ(), k, r = bu(1), z;
	if (i <= 0)
		return r;
	else if (i < 18)
		k = 1;
	else if (i < 48)
		k = 3;
	else if (i < 144)
		k = 4;
	else if (i < 768)
		k = 5;
	else
		k = 6;
	if (i < 8)
		z = new bB(m);
	else if (m.dZ())
		z = new bH(m);
	else
		z = new al(m);
	var g = new Array(), n = 3, ge = k - 1, jp = (1 << k) - 1;
	g[1] = z.convert(this);
	if (k > 1) {
		var ko = T();
		z.ey(g[1], ko);
		while (n <= jp) {
			g[n] = T();
			z.hl(ko, g[n - 2], g[n]);
			n += 2;
		}
	}
	var j = e.t - 1, w, lA = true, r2 = T(), t;
	i = aK(e[j]) - 1;
	while (j >= 0) {
		if (i >= ge)
			w = (e[j] >> (i - ge)) & jp;
		else {
			w = (e[j] & ((1 << (i + 1)) - 1)) << (ge - i);
			if (j > 0)
				w |= e[j - 1] >> (this.dm + i - ge);
		}
		n = k;
		while ((w & 1) == 0) {
			w >>= 1;
			--n;
		}
		if ((i -= n) < 0) {
			i += this.dm;
			--j;
		}
		if (lA) {
			g[w].gI(r);
			lA = false;
		} else {
			while (n > 1) {
				z.ey(r, r2);
				z.ey(r2, r);
				n -= 2;
			}
			if (n > 0)
				z.ey(r, r2);
			else {
				t = r;
				r = r2;
				r2 = t;
			}
			z.hl(r2, g[w], r);
		}
		while (j >= 0 && (e[j] & (1 << i)) == 0) {
			z.ey(r, r2);
			t = r;
			r = r2;
			r2 = t;
			if (--i < 0) {
				i = this.dm - 1;
				--j;
			}
		}
	}
	return z.revert(r);
};
function by1(a) {
	var x = (this.s < 0) ? this.gx() : this.clone();
	var y = (a.s < 0) ? a.gx() : a.clone();
	if (x.ce(y) < 0) {
		var t = x;
		x = y;
		y = t;
	}
	var i = x.gz(), g = y.gz();
	if (g < 0)
		return x;
	if (i < g)
		g = i;
	if (g > 0) {
		x.ea(g, x);
		y.ea(g, y);
	}
	while (x.fA() > 0) {
		if ((i = x.gz()) > 0)
			x.ea(i, x);
		if ((i = y.gz()) > 0)
			y.ea(i, y);
		if (x.ce(y) >= 0) {
			x.bW(y, x);
			x.ea(1, x);
		} else {
			y.bW(x, y);
			y.ea(1, y);
		}
	}
	if (g > 0)
		y.fR(g, y);
	return y;
};
function ab1(n) {
	if (n <= 0)
		return 0;
	var d = this.fg % n, r = (this.s < 0) ? n - 1 : 0;
	if (this.t > 0)
		if (d == 0)
			r = this[0] % n;
		else
			for (var i = this.t - 1; i >= 0; --i)
				r = (d * r + this[i]) % n;
	return r;
};
function ay1(m) {
	var gL = m.dZ();
	if ((this.dZ() && gL) || m.fA() == 0)
		return J.ZERO;
	var u = m.clone(), v = this.clone();
	var a = bu(1), b = bu(0), c = bu(0), d = bu(1);
	while (u.fA() != 0) {
		while (u.dZ()) {
			u.ea(1, u);
			if (gL) {
				if (!a.dZ() || !b.dZ()) {
					a.gh(this, a);
					b.bW(m, b);
				}
				a.ea(1, a);
			} else if (!b.dZ())
				b.bW(m, b);
			b.ea(1, b);
		}
		while (v.dZ()) {
			v.ea(1, v);
			if (gL) {
				if (!c.dZ() || !d.dZ()) {
					c.gh(this, c);
					d.bW(m, d);
				}
				c.ea(1, c);
			} else if (!d.dZ())
				d.bW(m, d);
			d.ea(1, d);
		}
		if (u.ce(v) >= 0) {
			u.bW(v, u);
			if (gL)
				a.bW(c, a);
			b.bW(d, b);
		} else {
			v.bW(u, v);
			if (gL)
				c.bW(a, c);
			d.bW(b, d);
		}
	}
	if (v.ce(J.ONE) != 0)
		return J.ZERO;
	if (d.ce(m) >= 0)
		return d.eA(m);
	if (d.fA() < 0)
		d.gh(m, d);
	else
		return d;
	if (d.fA() < 0)
		return d.add(m);
	else
		return d;
};
var es = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
		67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
		139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211,
		223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283,
		293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379,
		383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461,
		463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563,
		569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643,
		647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739,
		743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829,
		839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937,
		941, 947, 953, 967, 971, 977, 983, 991, 997];
var mH = (1 << 26) / es[es.length - 1];
function au1(t) {
	var i, x = this.abs();
	if (x.t == 1 && x[0] <= es[es.length - 1]) {
		for (i = 0; i < es.length; ++i)
			if (x[0] == es[i])
				return true;
		return false;
	}
	if (x.dZ())
		return false;
	i = 1;
	while (i < es.length) {
		var m = es[i], j = i + 1;
		while (j < es.length && m < mH)
			m *= es[j++];
		m = x.lX(m);
		while (i < j)
			if (m % es[i++] == 0)
				return false;
	}
	return x.mP(t);
};
function bO1(t) {
	var gJ = this.eA(J.ONE);
	var k = gJ.gz();
	if (k <= 0)
		return false;
	var r = gJ.kE(k);
	t = (t + 1) >> 1;
	if (t > es.length)
		t = es.length;
	var a = T();
	for (var i = 0; i < t; ++i) {
		a.fT(es[Math.floor(AoEncryJS.fj.js.jo() * es.length)]);
		var y = a.nu(r, this);
		if (y.ce(J.ONE) != 0 && y.ce(gJ) != 0) {
			var j = 1;
			while (j++ < k && y.ce(gJ) != 0) {
				y = y.pU(2, this);
				if (y.ce(J.ONE) == 0)
					return false;
			}
			if (y.ce(gJ) != 0)
				return false;
		}
	}
	return true;
};
J.prototype.jX = bJ;
J.prototype.ez = an;
J.prototype.rn = aU;
J.prototype.mx = aV;
J.prototype.el = aa;
J.prototype.hI = bL;
J.prototype.gh = ag;
J.prototype.lw = aW;
J.prototype.gS = aX;
J.prototype.mv = bv;
J.prototype.mY = bq;
J.prototype.lX = ab;
J.prototype.mP = bO;
J.prototype.clone = aF;
J.prototype.eV = bG;
J.prototype.tj = as;
J.prototype.sn = bg;
J.prototype.fA = aD;
J.prototype.su = aA;
J.prototype.eh = ad;
J.prototype.min = aT;
J.prototype.max = ar;
J.prototype.and = az;
J.prototype.kt = aB;
J.prototype.xor = aI;
J.prototype.tc = bU;
J.prototype.not = aM;
J.prototype.shiftLeft = bQ;
J.prototype.kE = bc;
J.prototype.gz = ae;
J.prototype.sH = aP;
J.prototype.fv = bx;
J.prototype.uH = bP;
J.prototype.tA = bV;
J.prototype.uO = bw;
J.prototype.add = bh;
J.prototype.eA = ah;
J.prototype.multiply = bn;
J.prototype.divide = aZ;
J.prototype.un = aq;
J.prototype.uw = bj;
J.prototype.nu = be;
J.prototype.hh = ay;
J.prototype.pow = ak;
J.prototype.tS = by;
J.prototype.oy = au;
J.prototype.square = bC;
J.prototype.bH = bH;
var hw;
var ek;
var eZ;
function bp1(x) {
	ek[eZ++] ^= x & 255;
	ek[eZ++] ^= (x >> 8) & 255;
	ek[eZ++] ^= (x >> 16) & 255;
	ek[eZ++] ^= (x >> 24) & 255;
	if (eZ >= iW)
		eZ -= iW;
};
function bA1() {
	bp(new Date().getTime());
};
if (ek == null) {
	ek = new Array();
	eZ = 0;
	var t;
	if (typeof window !== "undefined" && window.crypto) {
		if (window.crypto.po) {
			var ua = new Uint8Array(32);
			window.crypto.po(ua);
			for (t = 0; t < 32; ++t)
				ek[eZ++] = ua[t];
		} else if (navigator.appName == "Netscape"
				&& navigator.appVersion < "5") {
			var z = window.crypto.random(32);
			for (t = 0; t < z.length; ++t)
				ek[eZ++] = z.charCodeAt(t) & 255;
		}
	}
	while (eZ < iW) {
		t = Math.floor(65536 * AoEncryJS.fj.js.jo());
		ek[eZ++] = t >>> 8;
		ek[eZ++] = t & 255;
	}
	eZ = 0;
	bA();
}
function aw1() {
	if (hw == null) {
		bA();
		hw = bM();
		hw.fw(ek);
		for (eZ = 0; eZ < ek.length; ++eZ)
			ek[eZ] = 0;
		eZ = 0;
	}
	return hw.next();
};
function bN1(lv) {
	var i;
	for (i = 0; i < lv.length; ++i)
		lv[i] = aw();
};
function aY() {
};
aY.prototype.oP = bN;
function bI1() {
	this.i = 0;
	this.j = 0;
	this.S = new Array();
};
function aR1(key) {
	var i, j, t;
	for (i = 0; i < 256; ++i)
		this.S[i] = i;
	j = 0;
	for (i = 0; i < 256; ++i) {
		j = (j + this.S[i] + key[i % key.length]) & 255;
		t = this.S[i];
		this.S[i] = this.S[j];
		this.S[j] = t;
	}
	this.i = 0;
	this.j = 0;
};
function bf1() {
	var t;
	this.i = (this.i + 1) & 255;
	this.j = (this.j + this.S[this.i]) & 255;
	t = this.S[this.i];
	this.S[this.i] = this.S[this.j];
	this.S[this.j] = t;
	return this.S[(t + this.S[this.i]) & 255];
};
bI.prototype.fw = aR;
bI.prototype.next = bf;
function bM1() {
	return new bI();
};
var iW = 256;
if (typeof pF !== 'undefined') {
	pF = ta.pF = {
		J : J,
		aY : aY
	};
} else {
	/*wH = {
		J : J,
		aY : aY
	};*/
}

function aF() {
	var r = T();
	this.gI(r);
	return r;
};
function bG() {
	if (this.s < 0) {
		if (this.t == 1)
			return this[0] - this.fg;
		else if (this.t == 0)
			return -1;
	} else if (this.t == 1)
		return this[0];
	else if (this.t == 0)
		return 0;
	return ((this[1] & ((1 << (32 - this.dm)) - 1)) << this.dm) | this[0];
};
function as() {
	return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
};
function bg() {
	return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
};
function bJ(r) {
	return Math.floor(Math.LN2 * this.dm / Math.log(r));
};
function aD() {
	if (this.s < 0)
		return -1;
	else if (this.t <= 0 || (this.t == 1 && this[0] <= 0))
		return 0;
	else
		return 1;
};
function an(b) {
	if (b == null)
		b = 10;
	if (this.fA() == 0 || b < 2 || b > 36)
		return "0";
	var gE = this.jX(b);
	var a = Math.pow(b, gE);
	var d = bu(a), y = T(), z = T(), r = "";
	this.en(d, y, z);
	while (y.fA() > 0) {
		r = (a + z.eV()).toString(b).substr(1) + r;
		y.en(d, y, z);
	}
	return z.eV().toString(b) + r;
};
function aU(s, b) {
	this.fT(0);
	if (b == null)
		b = 10;
	var gE = this.jX(b);
	var d = Math.pow(b, gE), hn = false, j = 0, w = 0;
	for (var i = 0; i < s.length; ++i) {
		var x = bK(s, i);
		if (x < 0) {
			if (s.charAt(i) == "-" && this.fA() == 0)
				hn = true;
			continue;
		}
		w = b * w + x;
		if (++j >= gE) {
			this.lw(d);
			this.gS(w, 0);
			j = 0;
			w = 0;
		}
	}
	if (j > 0) {
		this.lw(Math.pow(b, j));
		this.gS(w, 0);
	}
	if (hn)
		J.ZERO.bW(this, this);
};
function aV(a, b, c) {
	if ("number" == typeof b) {
		if (a < 2)
			this.fT(1);
		else {
			this.mx(a, c);
			if (!this.fv(a - 1))
				this.el(J.ONE.shiftLeft(a - 1), bk, this);
			if (this.dZ())
				this.gS(1, 0);
			while (!this.oy(b)) {
				this.gS(2, 0);
				if (this.fJ() > a)
					this.bW(J.ONE.shiftLeft(a - 1), this);
			}
		}
	} else {
		var x = new Array(), t = a & 7;
		x.length = (a >> 3) + 1;
		b.oP(x);
		if (t > 0)
			x[0] &= ((1 << t) - 1);
		else
			x[0] = 0;
		this.mW(x, 256);
	}
};
function aA() {
	var i = this.t, r = new Array();
	r[0] = this.s;
	var p = this.dm - (i * this.dm) % 8, d, k = 0;
	if (i-- > 0) {
		if (p < this.dm && (d = this[i] >> p) != (this.s & this.dU) >> p)
			r[k++] = d | (this.s << (this.dm - p));
		while (i >= 0) {
			if (p < 8) {
				d = (this[i] & ((1 << p) - 1)) << (8 - p);
				d |= this[--i] >> (p += this.dm - 8);
			} else {
				d = (this[i] >> (p -= 8)) & 0xff;
				if (p <= 0) {
					p += this.dm;
					--i;
				}
			}
			if ((d & 0x80) != 0)
				d |= -256;
			if (k == 0 && (this.s & 0x80) != (d & 0x80))
				++k;
			if (k > 0 || d != this.s)
				r[k++] = d;
		}
	}
	return r;
};
function ad(a) {
	return (this.ce(a) == 0);
};
function aT(a) {
	return (this.ce(a) < 0) ? this : a;
};
function ar(a) {
	return (this.ce(a) > 0) ? this : a;
};
function aa(a, eH, r) {
	var i, f, m = Math.min(a.t, this.t);
	for (i = 0; i < m; ++i)
		r[i] = eH(this[i], a[i]);
	if (a.t < this.t) {
		f = a.s & this.dU;
		for (i = m; i < this.t; ++i)
			r[i] = eH(this[i], f);
		r.t = this.t;
	} else {
		f = this.s & this.dU;
		for (i = m; i < a.t; ++i)
			r[i] = eH(f, a[i]);
		r.t = a.t;
	}
	r.s = eH(this.s, a.s);
	r.dY();
};
function aQ(x, y) {
	return x & y;
};
function az(a) {
	var r = T();
	this.el(a, aQ, r);
	return r;
};
function bk(x, y) {
	return x | y;
};
function aB(a) {
	var r = T();
	this.el(a, bk, r);
	return r;
};
function aE(x, y) {
	return x ^ y;
};
function aI(a) {
	var r = T();
	this.el(a, aE, r);
	return r;
};
function ax(x, y) {
	return x & ~y;
};
function bU(a) {
	var r = T();
	this.el(a, ax, r);
	return r;
};
function aM() {
	var r = T();
	for (var i = 0; i < this.t; ++i)
		r[i] = this.dU & ~this[i];
	r.t = this.t;
	r.s = ~this.s;
	return r;
};
function bQ(n) {
	var r = T();
	if (n < 0)
		this.ea(-n, r);
	else
		this.fR(n, r);
	return r;
};
function bc(n) {
	var r = T();
	if (n < 0)
		this.fR(-n, r);
	else
		this.ea(n, r);
	return r;
};
function bb(x) {
	if (x == 0)
		return -1;
	var r = 0;
	if ((x & 0xffff) == 0) {
		x >>= 16;
		r += 16;
	}
	if ((x & 0xff) == 0) {
		x >>= 8;
		r += 8;
	}
	if ((x & 0xf) == 0) {
		x >>= 4;
		r += 4;
	}
	if ((x & 3) == 0) {
		x >>= 2;
		r += 2;
	}
	if ((x & 1) == 0)
		++r;
	return r;
};
function ae() {
	for (var i = 0; i < this.t; ++i)
		if (this[i] != 0)
			return i * this.dm + bb(this[i]);
	if (this.s < 0)
		return this.t * this.dm;
	return -1;
};
function bD(x) {
	var r = 0;
	while (x != 0) {
		x &= x - 1;
		++r;
	}
	return r;
};
function aP() {
	var r = 0, x = this.s & this.dU;
	for (var i = 0; i < this.t; ++i)
		r += bD(this[i] ^ x);
	return r;
};
function bx(n) {
	var j = Math.floor(n / this.dm);
	if (j >= this.t)
		return (this.s != 0);
	return ((this[j] & (1 << (n % this.dm))) != 0);
};
function bL(n, eH) {
	var r = J.ONE.shiftLeft(n);
	this.el(r, eH, r);
	return r;
};
function bP(n) {
	return this.hI(n, bk);
};
function bV(n) {
	return this.hI(n, ax);
};
function bw(n) {
	return this.hI(n, aE);
};
function ag(a, r) {
	var i = 0, c = 0, m = Math.min(a.t, this.t);
	while (i < m) {
		c += this[i] + a[i];
		r[i++] = c & this.dU;
		c >>= this.dm;
	}
	if (a.t < this.t) {
		c += a.s;
		while (i < this.t) {
			c += this[i];
			r[i++] = c & this.dU;
			c >>= this.dm;
		}
		c += this.s;
	} else {
		c += this.s;
		while (i < a.t) {
			c += a[i];
			r[i++] = c & this.dU;
			c >>= this.dm;
		}
		c += a.s;
	}
	r.s = (c < 0) ? -1 : 0;
	if (c > 0)
		r[i++] = c;
	else if (c < -1)
		r[i++] = this.fg + c;
	r.t = i;
	r.dY();
};
function bh(a) {
	var r = T();
	this.gh(a, r);
	return r;
};
function ah(a) {
	var r = T();
	this.bW(a, r);
	return r;
};
function bn(a) {
	var r = T();
	this.gN(a, r);
	return r;
};
function bC() {
	var r = T();
	this.gs(r);
	return r;
};
function aZ(a) {
	var r = T();
	this.en(a, r, null);
	return r;
};
function aq(a) {
	var r = T();
	this.en(a, null, r);
	return r;
};
function bj(a) {
	var q = T(), r = T();
	this.en(a, q, r);
	return new Array(q, r);
};
function aW(n) {
	this[this.t] = this.fa(0, n - 1, this, 0, 0, this.t);
	++this.t;
	this.dY();
};
function aX(n, w) {
	if (n == 0)
		return;
	while (this.t <= w)
		this[this.t++] = 0;
	this[w] += n;
	while (this[w] >= this.fg) {
		this[w] -= this.fg;
		if (++w >= this.t)
			this[this.t++] = 0;
		++this[w];
	}
};
function aO() {
};
function bd(x) {
	return x;
};
function aL(x, y, r) {
	x.gN(y, r);
};
function aS(x, r) {
	x.gs(r);
};
aO.prototype.convert = bd;
aO.prototype.revert = bd;
aO.prototype.hl = aL;
aO.prototype.ey = aS;
function ak(e) {
	return this.exp(e, new aO());
};
function bv(a, n, r) {
	var i = Math.min(this.t + a.t, n);
	r.s = 0;
	r.t = i;
	while (i > 0)
		r[--i] = 0;
	var j;
	for (j = r.t - this.t; i < j; ++i)
		r[i + this.t] = this.fa(0, a[i], r, i, 0, this.t);
	for (j = Math.min(a.t, n); i < j; ++i)
		this.fa(0, a[i], r, i, 0, n - i);
	r.dY();
};
function bq(a, n, r) {
	--n;
	var i = r.t = this.t + a.t - n;
	r.s = 0;
	while (--i >= 0)
		r[i] = 0;
	for (i = Math.max(n - this.t, 0); i < a.t; ++i)
		r[this.t + i - n] = this.fa(n - i, a[i], r, 0, 0, this.t + i - n);
	r.dY();
	r.iS(1, r);
};
function bH(m) {
	this.r2 = T();
	this.il = T();
	J.ONE.iB(2 * m.t, this.r2);
	this.nb = this.r2.divide(m);
	this.m = m;
};
function aH(x) {
	if (x.s < 0 || x.t > 2 * this.m.t)
		return x.cK(this.m);
	else if (x.ce(this.m) < 0)
		return x;
	else {
		var r = T();
		x.gI(r);
		this.reduce(r);
		return r;
	}
};
function aj(x) {
	return x;
};
function ao(x) {
	x.iS(this.m.t - 1, this.r2);
	if (x.t > this.m.t + 1) {
		x.t = this.m.t + 1;
		x.dY();
	}
	this.nb.mY(this.r2, this.m.t + 1, this.il);
	this.m.mv(this.il, this.m.t + 1, this.r2);
	while (x.ce(this.r2) < 0)
		x.gS(1, this.m.t + 1);
	x.bW(this.r2, x);
	while (x.ce(this.m) >= 0)
		x.bW(this.m, x);
};
function bo(x, r) {
	x.gs(r);
	this.reduce(r);
};
function aG(x, y, r) {
	x.gN(y, r);
	this.reduce(r);
};
bH.prototype.convert = aH;
bH.prototype.revert = aj;
bH.prototype.reduce = ao;
bH.prototype.hl = aG;
bH.prototype.ey = bo;
function be(e, m) {
	var i = e.fJ(), k, r = bu(1), z;
	if (i <= 0)
		return r;
	else if (i < 18)
		k = 1;
	else if (i < 48)
		k = 3;
	else if (i < 144)
		k = 4;
	else if (i < 768)
		k = 5;
	else
		k = 6;
	if (i < 8)
		z = new bB(m);
	else if (m.dZ())
		z = new bH(m);
	else
		z = new al(m);
	var g = new Array(), n = 3, ge = k - 1, jp = (1 << k) - 1;
	g[1] = z.convert(this);
	if (k > 1) {
		var ko = T();
		z.ey(g[1], ko);
		while (n <= jp) {
			g[n] = T();
			z.hl(ko, g[n - 2], g[n]);
			n += 2;
		}
	}
	var j = e.t - 1, w, lA = true, r2 = T(), t;
	i = aK(e[j]) - 1;
	while (j >= 0) {
		if (i >= ge)
			w = (e[j] >> (i - ge)) & jp;
		else {
			w = (e[j] & ((1 << (i + 1)) - 1)) << (ge - i);
			if (j > 0)
				w |= e[j - 1] >> (this.dm + i - ge);
		}
		n = k;
		while ((w & 1) == 0) {
			w >>= 1;
			--n;
		}
		if ((i -= n) < 0) {
			i += this.dm;
			--j;
		}
		if (lA) {
			g[w].gI(r);
			lA = false;
		} else {
			while (n > 1) {
				z.ey(r, r2);
				z.ey(r2, r);
				n -= 2;
			}
			if (n > 0)
				z.ey(r, r2);
			else {
				t = r;
				r = r2;
				r2 = t;
			}
			z.hl(r2, g[w], r);
		}
		while (j >= 0 && (e[j] & (1 << i)) == 0) {
			z.ey(r, r2);
			t = r;
			r = r2;
			r2 = t;
			if (--i < 0) {
				i = this.dm - 1;
				--j;
			}
		}
	}
	return z.revert(r);
};
function by(a) {
	var x = (this.s < 0) ? this.gx() : this.clone();
	var y = (a.s < 0) ? a.gx() : a.clone();
	if (x.ce(y) < 0) {
		var t = x;
		x = y;
		y = t;
	}
	var i = x.gz(), g = y.gz();
	if (g < 0)
		return x;
	if (i < g)
		g = i;
	if (g > 0) {
		x.ea(g, x);
		y.ea(g, y);
	}
	while (x.fA() > 0) {
		if ((i = x.gz()) > 0)
			x.ea(i, x);
		if ((i = y.gz()) > 0)
			y.ea(i, y);
		if (x.ce(y) >= 0) {
			x.bW(y, x);
			x.ea(1, x);
		} else {
			y.bW(x, y);
			y.ea(1, y);
		}
	}
	if (g > 0)
		y.fR(g, y);
	return y;
};
function ab(n) {
	if (n <= 0)
		return 0;
	var d = this.fg % n, r = (this.s < 0) ? n - 1 : 0;
	if (this.t > 0)
		if (d == 0)
			r = this[0] % n;
		else
			for (var i = this.t - 1; i >= 0; --i)
				r = (d * r + this[i]) % n;
	return r;
};
function ay(m) {
	var gL = m.dZ();
	if ((this.dZ() && gL) || m.fA() == 0)
		return J.ZERO;
	var u = m.clone(), v = this.clone();
	var a = bu(1), b = bu(0), c = bu(0), d = bu(1);
	while (u.fA() != 0) {
		while (u.dZ()) {
			u.ea(1, u);
			if (gL) {
				if (!a.dZ() || !b.dZ()) {
					a.gh(this, a);
					b.bW(m, b);
				}
				a.ea(1, a);
			} else if (!b.dZ())
				b.bW(m, b);
			b.ea(1, b);
		}
		while (v.dZ()) {
			v.ea(1, v);
			if (gL) {
				if (!c.dZ() || !d.dZ()) {
					c.gh(this, c);
					d.bW(m, d);
				}
				c.ea(1, c);
			} else if (!d.dZ())
				d.bW(m, d);
			d.ea(1, d);
		}
		if (u.ce(v) >= 0) {
			u.bW(v, u);
			if (gL)
				a.bW(c, a);
			b.bW(d, b);
		} else {
			v.bW(u, v);
			if (gL)
				c.bW(a, c);
			d.bW(b, d);
		}
	}
	if (v.ce(J.ONE) != 0)
		return J.ZERO;
	if (d.ce(m) >= 0)
		return d.eA(m);
	if (d.fA() < 0)
		d.gh(m, d);
	else
		return d;
	if (d.fA() < 0)
		return d.add(m);
	else
		return d;
};
var es = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
		67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
		139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211,
		223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283,
		293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379,
		383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461,
		463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563,
		569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643,
		647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739,
		743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829,
		839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937,
		941, 947, 953, 967, 971, 977, 983, 991, 997];
var mH = (1 << 26) / es[es.length - 1];
function au(t) {
	var i, x = this.abs();
	if (x.t == 1 && x[0] <= es[es.length - 1]) {
		for (i = 0; i < es.length; ++i)
			if (x[0] == es[i])
				return true;
		return false;
	}
	if (x.dZ())
		return false;
	i = 1;
	while (i < es.length) {
		var m = es[i], j = i + 1;
		while (j < es.length && m < mH)
			m *= es[j++];
		m = x.lX(m);
		while (i < j)
			if (m % es[i++] == 0)
				return false;
	}
	return x.mP(t);
};
function bO(t) {
	var gJ = this.eA(J.ONE);
	var k = gJ.gz();
	if (k <= 0)
		return false;
	var r = gJ.kE(k);
	t = (t + 1) >> 1;
	if (t > es.length)
		t = es.length;
	var a = T();
	for (var i = 0; i < t; ++i) {
		a.fT(es[Math.floor(AoEncryJS.fj.js.jo() * es.length)]);
		var y = a.nu(r, this);
		if (y.ce(J.ONE) != 0 && y.ce(gJ) != 0) {
			var j = 1;
			while (j++ < k && y.ce(gJ) != 0) {
				y = y.pU(2, this);
				if (y.ce(J.ONE) == 0)
					return false;
			}
			if (y.ce(gJ) != 0)
				return false;
		}
	}
	return true;
};
J.prototype.jX = bJ;
J.prototype.ez = an;
J.prototype.rn = aU;
J.prototype.mx = aV;
J.prototype.el = aa;
J.prototype.hI = bL;
J.prototype.gh = ag;
J.prototype.lw = aW;
J.prototype.gS = aX;
J.prototype.mv = bv;
J.prototype.mY = bq;
J.prototype.lX = ab;
J.prototype.mP = bO;
J.prototype.clone = aF;
J.prototype.eV = bG;
J.prototype.tj = as;
J.prototype.sn = bg;
J.prototype.fA = aD;
J.prototype.su = aA;
J.prototype.eh = ad;
J.prototype.min = aT;
J.prototype.max = ar;
J.prototype.and = az;
J.prototype.kt = aB;
J.prototype.xor = aI;
J.prototype.tc = bU;
J.prototype.not = aM;
J.prototype.shiftLeft = bQ;
J.prototype.kE = bc;
J.prototype.gz = ae;
J.prototype.sH = aP;
J.prototype.fv = bx;
J.prototype.uH = bP;
J.prototype.tA = bV;
J.prototype.uO = bw;
J.prototype.add = bh;
J.prototype.eA = ah;
J.prototype.multiply = bn;
J.prototype.divide = aZ;
J.prototype.un = aq;
J.prototype.uw = bj;
J.prototype.nu = be;
J.prototype.hh = ay;
J.prototype.pow = ak;
J.prototype.tS = by;
J.prototype.oy = au;
J.prototype.square = bC;
function bI() {
	this.i = 0;
	this.j = 0;
	this.S = new Array();
};
function aR(key) {
	var i, j, t;
	for (i = 0; i < 256; ++i)
		this.S[i] = i;
	j = 0;
	for (i = 0; i < 256; ++i) {
		j = (j + this.S[i] + key[i % key.length]) & 255;
		t = this.S[i];
		this.S[i] = this.S[j];
		this.S[j] = t;
	}
	this.i = 0;
	this.j = 0;
};
function bf() {
	var t;
	this.i = (this.i + 1) & 255;
	this.j = (this.j + this.S[this.i]) & 255;
	t = this.S[this.i];
	this.S[this.i] = this.S[this.j];
	this.S[this.j] = t;
	return this.S[(t + this.S[this.i]) & 255];
};
bI.prototype.fw = aR;
bI.prototype.next = bf;
function bM() {
	return new bI();
};
var iW = 256;
var hw;
var ek;
var eZ;
function bp(x) {
	ek[eZ++] ^= x & 255;
	ek[eZ++] ^= (x >> 8) & 255;
	ek[eZ++] ^= (x >> 16) & 255;
	ek[eZ++] ^= (x >> 24) & 255;
	if (eZ >= iW)
		eZ -= iW;
};
function bA() {
	bp(new Date().getTime());
};
if (ek == null) {
	ek = new Array();
	eZ = 0;
	var t;
	if (window.crypto && window.crypto.po) {
		var ua = new Uint8Array(32);
		window.crypto.po(ua);
		for (t = 0; t < 32; ++t)
			ek[eZ++] = ua[t];
	}
	if (navigator.appName == "Netscape" && navigator.appVersion < "5"
			&& window.crypto) {
		var z = window.crypto.random(32);
		for (t = 0; t < z.length; ++t)
			ek[eZ++] = z.charCodeAt(t) & 255;
	}
	while (eZ < iW) {
		t = Math.floor(65536 * AoEncryJS.fj.js.jo());
		ek[eZ++] = t >>> 8;
		ek[eZ++] = t & 255;
	}
	eZ = 0;
	bA();
}
function aw() {
	if (hw == null) {
		bA();
		hw = bM();
		hw.fw(ek);
		for (eZ = 0; eZ < ek.length; ++eZ)
			ek[eZ] = 0;
		eZ = 0;
	}
	return hw.next();
};
function bN(lv) {
	var i;
	for (i = 0; i < lv.length; ++i)
		lv[i] = aw();
};

aY.prototype.oP = bN;
if (typeof Aostar == "undefined" || !Aostar)
	var Aostar = {};
if (typeof Aostar.crypto == "undefined" || !Aostar.crypto)
	Aostar.crypto = {};
Aostar.crypto.gu = new function() {
	this.mL = {
		'hJ' : "3021300906052b0e03021a05000414",
		'sha224' : "302d300d06096086480165030402040500041c",
		'hE' : "3031300d060960864801650304020105000420",
		'sha384' : "3041300d060960864801650304020205000430",
		'hv' : "3051300d060960864801650304020305000440",
		'md2' : "3020300c06082a864886f70d020205000410",
		'ix' : "3020300c06082a864886f70d020505000410",
		'jD' : "3021300906052b2403020105000414"
	};
	this.la = {
		'ix' : 'cryptojs',
		'hJ' : 'cryptojs',
		'sha224' : 'cryptojs',
		'hE' : 'cryptojs',
		'sha384' : 'cryptojs',
		'hv' : 'cryptojs',
		'jD' : 'cryptojs',
		'hmacmd5' : 'cryptojs',
		'hmacsha1' : 'cryptojs',
		'hmacsha224' : 'cryptojs',
		'hmacsha256' : 'cryptojs',
		'hmacsha384' : 'cryptojs',
		'hmacsha512' : 'cryptojs',
		'hmacripemd160' : 'cryptojs',
		'sm3' : 'cryptojs',
		'MD5withRSA' : 'cryptojs/jsrsa',
		'SHA1withRSA' : 'cryptojs/jsrsa',
		'SHA224withRSA' : 'cryptojs/jsrsa',
		'SHA256withRSA' : 'cryptojs/jsrsa',
		'SHA384withRSA' : 'cryptojs/jsrsa',
		'SHA512withRSA' : 'cryptojs/jsrsa',
		'RIPEMD160withRSA' : 'cryptojs/jsrsa',
		'MD5withECDSA' : 'cryptojs/jsrsa',
		'SHA1withECDSA' : 'cryptojs/jsrsa',
		'SHA224withECDSA' : 'cryptojs/jsrsa',
		'SHA256withECDSA' : 'cryptojs/jsrsa',
		'SHA384withECDSA' : 'cryptojs/jsrsa',
		'SHA512withECDSA' : 'cryptojs/jsrsa',
		'RIPEMD160withECDSA' : 'cryptojs/jsrsa',
		'SHA1withDSA' : 'cryptojs/jsrsa',
		'SHA224withDSA' : 'cryptojs/jsrsa',
		'SHA256withDSA' : 'cryptojs/jsrsa',
		'MD5withRSAandMGF1' : 'cryptojs/jsrsa',
		'SHA1withRSAandMGF1' : 'cryptojs/jsrsa',
		'SHA224withRSAandMGF1' : 'cryptojs/jsrsa',
		'SHA256withRSAandMGF1' : 'cryptojs/jsrsa',
		'SHA384withRSAandMGF1' : 'cryptojs/jsrsa',
		'SHA512withRSAandMGF1' : 'cryptojs/jsrsa',
		'RIPEMD160withRSAandMGF1' : 'cryptojs/jsrsa'
	};
	this.od = {
		'ix' : 'AoEncryJS.hB.MD5',
		'hJ' : 'AoEncryJS.hB.SHA1',
		'sha224' : 'AoEncryJS.hB.SHA224',
		'hE' : 'AoEncryJS.hB.SHA256',
		'sha384' : 'AoEncryJS.hB.SHA384',
		'hv' : 'AoEncryJS.hB.SHA512',
		'jD' : 'AoEncryJS.hB.RIPEMD160',
		'sm3' : 'AoEncryJS.hB.jH'
	};
	this.us = function(mI, cg) {
		if (typeof this.mL[cg] == "undefined")
			throw "cg not supported in gu.mL: " + cg;
		return this.mL[cg] + mI;
	};
	this.vM = function(mI, cg, hG) {
		var ps = this.us(mI, cg);
		var ph = hG / 4;
		if (ps.length + 22 > ph)
			throw "key is too short for SigAlg: hz=" + hG + "," + cg;
		var pV = "0001";
		var qB = "00" + ps;
		var qb = "";
		var tW = ph - pV.length - qB.length;
		for (var i = 0; i < tW; i += 2) {
			qb += "ff";
		}
		var uQ = pV + qb + qB;
		return uQ;
	};
	this.wj = function(s, cg) {
		var eT = new Aostar.crypto.gv({
					'cg' : cg
				});
		return eT.gr(s);
	};
	this.eD = function(tg, cg) {
		var eT = new Aostar.crypto.gv({
					'cg' : cg
				});
		return eT.gO(tg);
	};
	this.hJ = function(s) {
		var eT = new Aostar.crypto.gv({
					'cg' : 'hJ',
					'dE' : 'cryptojs'
				});
		return eT.gr(s);
	};
	this.hE = function(s) {
		var eT = new Aostar.crypto.gv({
					'cg' : 'hE',
					'dE' : 'cryptojs'
				});
		return eT.gr(s);
	};
	this.wr = function(s) {
		var eT = new Aostar.crypto.gv({
					'cg' : 'hE',
					'dE' : 'cryptojs'
				});
		return eT.gO(s);
	};
	this.hv = function(s) {
		var eT = new Aostar.crypto.gv({
					'cg' : 'hv',
					'dE' : 'cryptojs'
				});
		return eT.gr(s);
	};
	this.xc = function(s) {
		var eT = new Aostar.crypto.gv({
					'cg' : 'hv',
					'dE' : 'cryptojs'
				});
		return eT.gO(s);
	};
	this.ix = function(s) {
		var eT = new Aostar.crypto.gv({
					'cg' : 'ix',
					'dE' : 'cryptojs'
				});
		return eT.gr(s);
	};
	this.jD = function(s) {
		var eT = new Aostar.crypto.gv({
					'cg' : 'jD',
					'dE' : 'cryptojs'
				});
		return eT.gr(s);
	};
	this.vR = function(s) {
	};
};
Aostar.crypto.gv = function(dr) {
	var eT = null;
	var ev = null;
	var fk = null;
	this.hg = function(cg, dE) {
		if (cg != null && dE === undefined)
			dE = Aostar.crypto.gu.la[cg];
		if (':ix:hJ:sha224:hE:sha384:hv:jD:sm3:'.indexOf(cg) != -1
				&& dE == 'cryptojs') {
			try {
				this.eT = eval(Aostar.crypto.gu.od[cg]).create();
			} catch (ex) {
				throw "hg hash cg set fail cg=" + cg + "/" + ex;
			}
			this.fm = function(fF) {
				this.eT.update(fF);
			};
			this.eW = function(cw) {
				var lU = AoEncryJS.fj.jj.parse(cw);
				this.eT.update(lU);
			};
			this.gX = function() {
				var hash = this.eT.gf();
				return hash.toString(AoEncryJS.fj.jj);
			};
			this.gr = function(fF) {
				this.fm(fF);
				return this.gX();
			};
			this.gO = function(cw) {
				this.eW(cw);
				return this.gX();
			};
		}
		if (':hE:'.indexOf(cg) != -1 && dE == 'pn') {
			try {
				this.eT = new pn.hash.hE();
			} catch (ex) {
				throw "hg hash cg set fail cg=" + cg + "/" + ex;
			}
			this.fm = function(fF) {
				this.eT.update(fF);
			};
			this.eW = function(cw) {
				var rJ = pn.uW.cw.wt(cw);
				this.eT.update(rJ);
			};
			this.gX = function() {
				var hash = this.eT.gf();
				return pn.uW.cw.wh(hash);
			};
			this.gr = function(fF) {
				this.fm(fF);
				return this.gX();
			};
			this.gO = function(cw) {
				this.eW(cw);
				return this.gX();
			};
		}
	};
	this.fm = function(fF) {
		throw "fm(fF) not supported for this cg/dE: " + this.ev + "/" + this.fk;
	};
	this.eW = function(cw) {
		throw "eW(cw) not supported for this cg/dE: " + this.ev + "/" + this.fk;
	};
	this.gX = function() {
		throw "gX() not supported for this cg/dE: " + this.ev + "/" + this.fk;
	};
	this.gr = function(fF) {
		throw "gr(fF) not supported for this cg/dE: " + this.ev + "/" + this.fk;
	};
	this.gO = function(cw) {
		throw "gO(cw) not supported for this cg/dE: " + this.ev + "/" + this.fk;
	};
	if (dr !== undefined) {
		if (dr['cg'] !== undefined) {
			this.ev = dr['cg'];
			if (dr['dE'] === undefined)
				this.fk = Aostar.crypto.gu.la[this.ev];
			this.hg(this.ev, this.fk);
		}
	}
};
Aostar.crypto.wT = function(dr) {
	var kY = null;
	var gi = null;
	var ev = null;
	var fk = null;
	var hO = null;
	this.hg = function(cg, dE) {
		if (cg == null)
			cg = "hmacsha1";
		cg = cg.toLowerCase();
		if (cg.substr(0, 4) != "hmac") {
			throw "hg unsupported ql cg: " + cg;
		}
		if (dE === undefined)
			dE = Aostar.crypto.gu.la[cg];
		this.hO = cg + "/" + dE;
		var nr = cg.substr(4);
		if (':ix:hJ:sha224:hE:sha384:hv:jD:'.indexOf(nr) != -1
				&& dE == 'cryptojs') {
			try {
				var sd = eval(Aostar.crypto.gu.od[nr]);
				this.kY = AoEncryJS.hB.ql.create(sd, this.gi);
			} catch (ex) {
				throw "hg hash cg set fail nr=" + nr + "/" + ex;
			}
			this.fm = function(fF) {
				this.kY.update(fF);
			};
			this.eW = function(cw) {
				var lU = AoEncryJS.fj.jj.parse(cw);
				this.kY.update(lU);
			};
			this.mt = function() {
				var hash = this.kY.gf();
				return hash.toString(AoEncryJS.fj.jj);
			};
			this.sb = function(fF) {
				this.fm(fF);
				return this.mt();
			};
			this.tQ = function(cw) {
				this.eW(cw);
				return this.mt();
			};
		}
	};
	this.fm = function(fF) {
		throw "fm(fF) not supported for this cg/dE: " + this.hO;
	};
	this.eW = function(cw) {
		throw "eW(cw) not supported for this cg/dE: " + this.hO;
	};
	this.mt = function() {
		throw "gX() not supported for this cg/dE: " + this.hO;
	};
	this.sb = function(fF) {
		throw "gr(fF) not supported for this cg/dE: " + this.hO;
	};
	this.tQ = function(cw) {
		throw "gO(cw) not supported for this cg/dE: " + this.hO;
	};
	if (dr !== undefined) {
		if (dr['gi'] !== undefined) {
			this.gi = dr['gi'];
		}
		if (dr['cg'] !== undefined) {
			this.ev = dr['cg'];
			if (dr['dE'] === undefined)
				this.fk = Aostar.crypto.gu.la[this.ev];
			this.hg(this.ev, this.fk);
		}
	}
};
Aostar.crypto.gn = function(dr) {
	var eL = null;
	var dW = null;
	var eT = null;
	var cC = null;
	var ev = null;
	var fk = null;
	var ht = null;
	var iF = null;
	var iy = null;
	var state = null;
	var oT = -1;
	var sx = null;
	var fH = null;
	var ps = null;
	var vA = null;
	var jz = null;
	this.qo = function() {
		if (this.ev.match(/^(.+)with(.+)$/)) {
			this.iF = RegExp.$1.toLowerCase();
			this.iy = RegExp.$2.toLowerCase();
		}
	};
	this.wb = function(cw, fJ) {
		var s = "";
		var tE = fJ / 4 - cw.length;
		for (var i = 0; i < tE; i++) {
			s = s + "0";
		}
		return s + cw;
	};
	this.hg = function(cg, dE) {
		this.qo();
		if (dE != 'cryptojs/jsrsa')
			throw "provider not supported: " + dE;
		if (':ix:hJ:sha224:hE:sha384:hv:jD:sm3:'.indexOf(this.iF) != -1) {
			try {
				this.eT = new Aostar.crypto.gv({
							'cg' : this.iF
						});
			} catch (ex) {
				throw "hg hash cg set fail cg=" + this.iF + "/" + ex;
			}
			this.fw = function(qe, gi) {
				var hs = null;
				try {
					if (gi === undefined) {
						hs = sY.uf(qe);
					} else {
						hs = sY.uf(qe, gi);
					}
				} catch (ex) {
					throw "fw failed:" + ex;
				}
				if (hs.qw === true) {
					this.eL = hs;
					this.state = "SIGN";
				} else if (hs.rk === true) {
					this.dW = hs;
					this.state = "VERIFY";
				} else {
					throw "fw failed.:" + hs;
				}
			};
			this.ka = function(dr) {
				if (typeof dr['ecprvhex'] == 'string'
						&& typeof dr['fI'] == 'string') {
					this.ecprvhex = dr['ecprvhex'];
					this.fI = dr['fI'];
				} else {
					this.eL = dr;
				}
				this.state = "SIGN";
				if (dr['eI'] !== undefined && typeof dr['eI'] == 'string') {
					this.eI = dr['eI'];
				} else {
					this.eI = "1234567812345678";
				}
			};
			this.jZ = function(dr) {
				if (typeof dr['ecpubhex'] == 'string'
						&& typeof dr['fI'] == 'string') {
					this.ecpubhex = dr['ecpubhex'];
					this.fI = dr['fI'];
				} else if (dr instanceof Aostar.crypto.eg) {
					this.dW = dr;
				} else if (dr instanceof tP) {
					this.dW = dr;
				}
				this.state = "VERIFY";
				if (dr['eI'] !== undefined && typeof dr['eI'] == 'string') {
					this.eI = dr['eI'];
				} else {
					this.eI = "1234567812345678";
				}
			};
			this.qp = function(oU) {
				var iR = new wu();
				iR.vQ(oU);
				this.dW = iR.wD;
				this.state = "VERIFY";
			};
			this.fm = function(fF) {
				this.eT.fm(fF);
			};
			this.eW = function(cw) {
				this.eT.eW(cw);
			};
			this.sign = function() {
				if (this.fI != "sm2") {
					this.fH = this.eT.gX();
				}
				if (typeof this.ecprvhex != "undefined"
						&& typeof this.fI != "undefined") {
					if (this.fI == "sm2") {
						var eC = new Aostar.crypto.SM3withSM2({
									dw : this.fI
								});
						var G = eC.ft['G'];
						var Q = G.multiply(new J(this.ecprvhex, 16));
						var cD = Q.eU().bX().ez(16) + Q.fM().bX().ez(16);
						var fo = new ap();
						var z = new ap().pJ(G, cD, this.eI);
						var jt = fo.iA(fo.fe(z).toString());
						var dX = AoEncryJS.fj.fr.stringify(this.eT.eT.hm);
						dX = AoEncryJS.fj.fr.parse(dX).toString();
						dX = fo.ff(dX);
						var kQ = new Array(fo.nj());
						fo.er(jt, 0, jt.length);
						fo.er(dX, 0, dX.length);
						fo.gk(kQ, 0);
						var eD = fo.fe(kQ).toString();
						this.fH = eD;
						this.jz = eC.iE(this.fH, this.ecprvhex);
					} else {
						var eC = new Aostar.crypto.eg({
									'dw' : this.fI
								});
						this.jz = eC.iE(this.fH, this.ecprvhex);
					}
				} else if (this.iy == "rsaandmgf1") {
					this.jz = this.eL.vt(this.fH, this.iF, this.oT);
				} else if (this.iy == "rsa") {
					this.jz = this.eL.lf(this.fH, this.iF);
				} else if (this.eL instanceof Aostar.crypto.eg) {
					this.jz = this.eL.lf(this.fH);
				} else if (this.eL instanceof Aostar.crypto.uo) {
					this.jz = this.eL.lf(this.fH);
				} else {
					throw "gn: unsupported public key cg: " + this.iy;
				}
				return this.jz;
			};
			this.sL = function(fF) {
				this.fm(fF);
				this.sign();
			};
			this.iE = function(cw) {
				this.eW(cw);
				this.sign();
			};
			this.jb = function(hu) {
				if (this.fI != "sm2") {
					this.fH = this.eT.gX();
				}
				if (typeof this.ecpubhex != "undefined"
						&& typeof this.fI != "undefined") {
					if (this.fI == "sm2") {
						var eC = new Aostar.crypto.SM3withSM2({
									dw : this.fI
								});
						var G = eC.ft['G'];
						var cD = this.ecpubhex.substr(2, 128);
						var fo = new ap();
						var z = new ap().pJ(G, cD, this.eI);
						var jt = fo.iA(fo.fe(z).toString());
						var dX = AoEncryJS.fj.fr.stringify(this.eT.eT.hm);
						dX = AoEncryJS.fj.fr.parse(dX).toString();
						dX = fo.ff(dX);
						var kQ = new Array(fo.nj());
						fo.er(jt, 0, jt.length);
						fo.er(dX, 0, dX.length);
						fo.gk(kQ, 0);
						var eD = fo.fe(kQ).toString();
						this.fH = eD;
						return eC.iZ(this.fH, hu, this.ecpubhex);
					} else {
						var eC = new Aostar.crypto.eg({
									dw : this.fI
								});
						return eC.iZ(this.fH, hu, this.ecpubhex);
					}
				} else if (this.iy == "rsaandmgf1") {
					return this.dW.wc(this.fH, hu, this.iF, this.oT);
				} else if (this.iy == "rsa") {
					return this.dW.kh(this.fH, hu);
				} else if (this.dW instanceof Aostar.crypto.eg) {
					return this.dW.kh(this.fH, hu);
				} else if (this.dW instanceof Aostar.crypto.uo) {
					return this.dW.kh(this.fH, hu);
				} else {
					throw "gn: unsupported public key cg: " + this.iy;
				}
			};
		}
	};
	this.fw = function(key, gi) {
		throw "fw(key, gi) not supported for this cg:dE=" + this.ht;
	};
	this.jZ = function(vX) {
		throw "jZ(rsaPubKeyy) not supported for this cg:dE=" + this.ht;
	};
	this.qp = function(oU) {
		throw "qp(oU) not supported for this cg:dE=" + this.ht;
	};
	this.ka = function(eL) {
		throw "ka(eL) not supported for this cg:dE=" + this.ht;
	};
	this.fm = function(fF) {
		throw "fm(fF) not supported for this cg:dE=" + this.ht;
	};
	this.eW = function(cw) {
		throw "eW(cw) not supported for this cg:dE=" + this.ht;
	};
	this.sign = function() {
		throw "sign() not supported for this cg:dE=" + this.ht;
	};
	this.sL = function(fF) {
		throw "gr(fF) not supported for this cg:dE=" + this.ht;
	};
	this.iE = function(cw) {
		throw "gO(cw) not supported for this cg:dE=" + this.ht;
	};
	this.jb = function(hu) {
		throw "jb(hu) not supported for this cg:dE=" + this.ht;
	};
	this.sx = dr;
	if (dr !== undefined) {
		if (dr['cg'] !== undefined) {
			this.ev = dr['cg'];
			if (dr['dE'] === undefined) {
				this.fk = Aostar.crypto.gu.la[this.ev];
			} else {
				this.fk = dr['dE'];
			}
			this.ht = this.ev + ":" + this.fk;
			this.hg(this.ev, this.fk);
			this.qo();
		}
		if (dr['psssaltlen'] !== undefined)
			this.oT = dr['psssaltlen'];
		if (dr['prvkeypem'] !== undefined) {
			if (dr['prvkeypas'] !== undefined) {
				throw "both prvkeypem and prvkeypas parameters not supported";
			} else {
				try {
					var eL = new tP();
					eL.wq(dr['prvkeypem']);
					this.ka(eL);
				} catch (ex) {
					throw "fatal error to load pem private key: " + ex;
				}
			}
		}
	}
};
Aostar.crypto.jF = new function() {
	this.vN = {
		'2a864886f70d010101' : 'rsaEncryption',
		'2a8648ce3d0201' : 'ecPublicKey',
		'2a8648ce380401' : 'dsa',
		'2a8648ce3d030107' : 'secp256r1',
		'2b8104001f' : 'secp192k1',
		'2b81040021' : 'secp224r1',
		'2b8104000a' : 'secp256k1',
		'2b81040023' : 'secp521r1',
		'2b81040022' : 'secp384r1',
		'2a8648ce380403' : 'SHA1withDSA',
		'608648016503040301' : 'SHA224withDSA',
		'608648016503040302' : 'SHA256withDSA'
	};
};
if (typeof Aostar == "undefined" || !Aostar)
	var Aostar = {};
if (typeof Aostar.crypto == "undefined" || !Aostar.crypto)
	Aostar.crypto = {};
Aostar.crypto.eR = new function() {
	var gR = {};
	var pk = {};
	function bE(cw) {
		return new J(cw, 16);
	};
	this.getByName = function(pS) {
		var name = pS;
		if (typeof pk[name] != "undefined") {
			name = pk[pS];
		}
		if (typeof gR[name] != "undefined") {
			return gR[name];
		}
		throw "unregistered EC dw name: " + name;
	};
	this.hx = function(name, hz, tN, ti, rC, vf, tZ, uV, tL, qs, gj, qS) {
		gR[name] = {};
		var p = bE(tN);
		var a = bE(ti);
		var b = bE(rC);
		var n = bE(vf);
		var h = bE(tZ);
		var dw = new aC(p, a, b);
		var G = dw.uK("04" + uV + tL);
		gR[name]['name'] = name;
		gR[name]['hz'] = hz;
		gR[name]['dw'] = dw;
		gR[name]['G'] = G;
		gR[name]['n'] = n;
		gR[name]['h'] = h;
		gR[name]['gj'] = gj;
		gR[name]['qS'] = qS;
		for (var i = 0; i < qs.length; i++) {
			pk[qs[i]] = name;
		}
	};
};
Aostar.crypto.eR.hx("secp128r1", 128, "FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF",
		"FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC", "E87579C11079F43DD824993C2CEE5ED3",
		"FFFFFFFE0000000075A30D1B9038A115", "1",
		"161FF7528B899B2D0C28607CA52C5B86", "CF5AC8395BAFEB13C02DA292DDED7A83",
		[], "", "secp128r1 : SECG dw over a 128 bit prime field");
Aostar.crypto.eR.hx("secp160k1", 160,
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73", "0", "7",
		"0100000000000000000001B8FA16DFAB9ACA16B6B3", "1",
		"3B4C382CE37AA192A4019E763036F4F5DD4D7EBB",
		"938CF935318FDCED6BC28286531733C3F03C4FEE", [], "",
		"secp160k1 : SECG dw over a 160 bit prime field");
Aostar.crypto.eR.hx("secp160r1", 160,
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF",
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC",
		"1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45",
		"0100000000000000000001F4C8F927AED3CA752257", "1",
		"4A96B5688EF573284664698968C38BB913CBFC82",
		"23A628553168947D59DCC912042351377AC5FB32", [], "",
		"secp160r1 : SECG dw over a 160 bit prime field");
Aostar.crypto.eR.hx("secp192k1", 192,
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37", "0", "3",
		"FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D", "1",
		"DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D",
		"9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D", []);
Aostar.crypto.eR.hx("secp192r1", 192,
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF",
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC",
		"64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1",
		"FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831", "1",
		"188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012",
		"07192B95FFC8DA78631011ED6B24CDD573F977A11E794811", []);
Aostar.crypto.eR.hx("secp224r1", 224,
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001",
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE",
		"B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4",
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D", "1",
		"B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21",
		"BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34", []);
Aostar.crypto.eR.hx("secp256k1", 256,
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F",
		"0", "7",
		"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
		"1",
		"79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798",
		"483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", []);
Aostar.crypto.eR.hx("secp256r1", 256,
		"FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF",
		"FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC",
		"5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B",
		"FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551",
		"1",
		"6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296",
		"4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5", [
				"NIST P-256", "P-256", "prime256v1"]);
Aostar.crypto.eR
		.hx(
				"secp384r1",
				384,
				"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF",
				"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC",
				"B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF",
				"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973",
				"1",
				"AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7",
				"3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f",
				["NIST P-384", "P-384"]);
Aostar.crypto.eR
		.hx(
				"secp521r1",
				521,
				"1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
				"1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC",
				"051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00",
				"1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409",
				"1",
				"C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66",
				"011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650",
				["NIST P-521", "P-521"]);
Aostar.crypto.eR.hx("sm2", 256,
		"FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF",
		"FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC",
		"28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93",
		"FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123",
		"1",
		"32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7",
		"BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0", [
				"sm2", "SM2"]);
function bz(fD, gV) {
	this.hU = 1;
	this.iK = null;
	this.kn = null;
	this.jn = null;
	this.gV = null;
	this.key = new Array(32);
	this.iu = 0;
	if (typeof(fD) != 'undefined') {
		this.fD = fD;
	} else {
		this.fD = CipherMode.C1C3C2;
	}
	if (typeof(gV) != 'undefined') {
		this.gV = gV;
	} else {
		this.gV = null;
	}
};
bz.prototype = {
	ma : function(h) {
		if ((h.length & 1) == 0) {
			return h;
		} else {
			return "0" + h;
		}
	},
	wI : function(n) {
		if (n > 127 || n < -128) {
			var result = 0xff & n;
			if (result > 127) {
				result = 0x7f & n;
				result = 0x7f ^ result;
				return -(result + 1);
			}
			return result;
		} else {
			return n;
		}
	},
	Reset : function() {
		this.kn = new ap();
		this.jn = new ap();
		var mK = this.iA(this.iK.eU().bX().ez(16));
		var lk = this.iA(this.iK.fM().bX().ez(16));
		this.jn.er(mK, 0, mK.length);
		this.kn.er(mK, 0, mK.length);
		this.kn.er(lk, 0, lk.length);
		this.hU = 1;
		this.pr();
	},
	pr : function() {
		var ku = new ap(this.kn);
		ku.gb(this.hU >> 24 & 0xff);
		ku.gb(this.hU >> 16 & 0xff);
		ku.gb(this.hU >> 8 & 0xff);
		ku.gb(this.hU & 0xff);
		ku.gk(this.key, 0);
		this.iu = 0;
		this.hU++;
	},
	pW : function(ig) {
		var k = null;
		var eE = null;
		var eC = new Aostar.crypto.eg({
					"dw" : "sm2"
				});
		var hi = (this.gV == null ? this.qG(eC) : eC.ve(this.gV));
		k = new J(hi.ecprvhex, 16);
		var gT = hi.ecpubhex;
		eE = V.kW(eC.ft['dw'], gT);
		this.iK = ig.multiply(k);
		this.Reset();
		return eE;
	},
	qG : function(eC) {
		var hi = eC.nS();
		if (this.sI(hi.ecpubhex)) {
			return hi;
		} else {
			return this.qG(eC);
		}
	},
	sI : function(ecpubhex) {
		var gy = ecpubhex.length - 2;
		var sJ = ecpubhex.substr(2, 2);
		var ru = ecpubhex.substr(2 + gy / 2, 2);
		if (sJ === '00' || ru === '00') {
			return false;
		} else {
			return true;
		}
	},
	qg : function(data) {
		this.jn.er(data, 0, data.length);
		for (var i = 0; i < data.length; i++) {
			if (this.iu == this.key.length) {
				this.pr();
			}
			data[i] ^= this.key[this.iu++];
		}
	},
	pK : function(jI, eE) {
		this.iK = eE.multiply(jI);
		this.Reset();
	},
	oA : function(data) {
		for (var i = 0; i < data.length; i++) {
			if (this.iu == this.key.length) {
				this.pr();
			}
			data[i] ^= this.key[this.iu++];
		}
		this.jn.er(data, 0, data.length);
	},
	kD : function(eB) {
		var lk = this.iA(this.iK.fM().bX().ez(16));
		this.jn.er(lk, 0, lk.length);
		this.jn.gk(eB, 0);
		this.Reset();
	},
	qT : function(dW, plaintext) {
		var data = new Array(plaintext.length);
		Array.Copy(plaintext, 0, data, 0, plaintext.length);
		var eE = this.pW(dW);
		this.qg(data);
		var eB = new Array(32);
		this.kD(eB);
		var ef;
		if (this.fD == CipherMode.C1C3C2) {
			ef = this.ma(eE.eU().bX().ez(16)) + this.ma(eE.fM().bX().ez(16))
					+ this.fe(eB).toString() + this.fe(data).toString();
		} else if (this.fD == CipherMode.C1C2C3) {
			ef = this.ma(eE.eU().bX().ez(16)) + this.ma(eE.fM().bX().ez(16))
					+ this.fe(data).toString() + this.fe(eB).toString();
		} else {
			throw new Error("[SM2:kg]invalid type fD(" + this.fD + ")");
		}
		return "04" + ef;
	},
	pB : function(dW, plaintext) {
		var data = new Array(plaintext.length);
		Array.Copy(plaintext, 0, data, 0, plaintext.length);
		var eE = this.pW(dW);
		this.qg(data);
		var eB = new Array(32);
		this.kD(eB);
		var x = new Aostar.cn.hb({
					jY : eE.eU().bX()
				});
		var y = new Aostar.cn.hb({
					jY : eE.fM().bX()
				});
		var qn = new Aostar.cn.lq({
					cw : this.fe(eB).toString()
				});
		var qP = new Aostar.cn.lq({
					cw : this.fe(data).toString()
				});
		var options;
		if (this.fD == CipherMode.C1C3C2) {
			options = {
				array : [x, y, qn, qP]
			};
		} else if (this.fD == CipherMode.C1C2C3) {
			options = {
				array : [x, y, qP, qn]
			};
		} else {
			throw new Error("[SM2:pB]invalid type fD(" + this.fD + ")");
		}
		var np = new Aostar.cn.jh(options);
		return np.hy();
	},
	ff : function(dV) {
		var dC = [];
		var gd = dV.length;
		for (var i = 0; i < gd; i += 2) {
			dC[dC.length] = parseInt(dV.substr(i, 2), 16);
		}
		return dC;
	},
	iA : function(dV) {
		var dC = [];
		if (dV.length < 64) {
			dV = this.ll(dV, 64);
		}
		if (dV.length > 64) {
			dV = dV.substr(dV.length - 64, dV.length);
		}
		var gd = dV.length;
		for (var i = 0; i < gd; i += 2) {
			dC[dC.length] = parseInt(dV.substr(i, 2), 16);
		}
		return dC;
	},
	ll : function(dV, length) {
		return new Array((length + 1) - dV.length).join("0") + dV;
	},
	fe : function(hc) {
		var dC = new Array(32);
		var j = 0;
		for (var i = 0; i < hc.length * 2; i += 2) {
			dC[i >>> 3] |= parseInt(hc[j]) << (24 - (i % 8) * 4);
			j++;
		}
		var eP = new AoEncryJS.gM.ej.fw(dC, hc.length);
		return eP;
	},
	kg : function(pp, fi) {
		var ef = fi.substr(0, 2) === "04" ? fi.substr(2) : fi;
		var hd = ef.substr(0, 64);
		var iU = ef.substr(0 + hd.length, 64);
		var eB;
		var oz;
		if (this.fD == CipherMode.C1C3C2) {
			eB = ef.substr(hd.length + iU.length, 64);
			oz = ef.substr(hd.length + iU.length + 64);
		} else {
			oz = ef.substr(hd.length + iU.length, ef.length - 192);
			eB = ef.substr(ef.length - 64);
		}
		var pG = this.ff(oz);
		var eE = this.le(hd, iU);
		this.pK(pp, eE);
		this.oA(pG);
		var kJ = new Array(32);
		this.kD(kJ);
		var oC = this.fe(kJ).toString().toUpperCase() == eB.toUpperCase();
		if (oC) {
			var eP = this.fe(pG);
			return eP;
		} else {
			throw new Error("[SM2:kg] C3 is not match!");
			return null;
		}
	},
	nv : function(pp, fi) {
		var ef = fi;
		var ju = co.jP(ef);
		var hd = ju[0];
		var iU = ju[1];
		var eB;
		var mB;
		if (this.fD == CipherMode.C1C3C2) {
			eB = ju[2];
			mB = ju[3];
		} else if (this.fD == CipherMode.C1C2C3) {
			mB = ju[2];
			eB = ju[3];
		} else {
			throw new Error("[SM2:nv]invalid type fD(" + this.fD + ")");
		}
		var data = this.ff(mB);
		var eE = this.le(hd, iU);
		this.pK(pp, eE);
		this.oA(data);
		var kJ = new Array(32);
		this.kD(kJ);
		var oC = this.fe(kJ).toString().toUpperCase() == eB.toUpperCase();
		if (oC) {
			var eP = this.fe(data);
			return eP;
		} else {
			throw new Error("[SM2:nv] C3 is not match!");
			return '';
		}
	},
	le : function(x, y) {
		var eC = new Aostar.crypto.eg({
					"dw" : "sm2"
				});
		if (x.length < 64) {
			x = this.ll(x, 64);
		} else {
			x = x.substr((x.length - 64), 64);
		}
		if (y.length < 64) {
			y = this.ll(y, 64);
		} else {
			y = y.substr((y.length - 64), 64);
		}
		var gT = '04' + x + y;
		var nP = V.kW(eC.ft['dw'], gT);
		return nP;
	}
};
window.CipherMode = {
	C1C2C3 : 0,
	C1C3C2 : 1
};
window.SM2 = {
	C1C2C3 : 0,
	C1C3C2 : 1,
	c1c2c3 : 0,
	c1c3c2 : 1
};
if (typeof Aostar == "undefined" || !Aostar)
	var Aostar = {};
if (typeof Aostar.crypto == "undefined" || !Aostar.crypto)
	Aostar.crypto = {};
Aostar.crypto.SM3withSM2 = function(dr) {
	var fc = "sm2";
	var ft = null;
	var fN = null;
	var cD = null;
	var lO = new aY();
	var vh = null;
	this.type = "SM2";
	function dP(P, k, Q, l) {
		var m = Math.max(k.fJ(), l.fJ());
		var Z = P.gK(Q);
		var R = P.dw.fW();
		for (var i = m - 1; i >= 0; --i) {
			R = R.rh();
			R.z = J.ONE;
			if (k.fv(i)) {
				if (l.fv(i)) {
					R = R.gK(Z);
				} else {
					R = R.gK(P);
				}
			} else {
				if (l.fv(i)) {
					R = R.gK(Q);
				}
			}
		}
		return R;
	};
	this.hM = function(lo) {
		return new J(lo.fJ(), lO).cK(lo.eA(J.ONE)).add(J.ONE);
	};
	this.oM = function(fc) {
		this.ft = Aostar.crypto.eR.getByName(fc);
		this.fN = null;
		this.cD = null;
		this.fc = fc;
	};
	this.ki = function(fN) {
		this.qw = true;
		this.fN = fN;
	};
	this.kH = function(cD) {
		this.rk = true;
		this.cD = cD;
	};
	this.nS = function() {
		var mz = this.ft['n'];
		var gw = this.hM(mz);
		var gF = this.ft['G'].multiply(gw);
		var kw = gF.eU().bX();
		var jN = gF.fM().bX();
		var eb = this.ft['hz'] / 4;
		var iJ = ("0000000000" + gw.toString(16)).slice(-eb);
		var jK = ("0000000000" + kw.toString(16)).slice(-eb);
		var kP = ("0000000000" + jN.toString(16)).slice(-eb);
		var jg = "04" + jK + kP;
		this.ki(iJ);
		this.kH(jg);
		return {
			'ecprvhex' : iJ,
			'ecpubhex' : jg
		};
	};
	this.lf = function(eD) {
		return this.iE(eD, this.fN);
	};
	this.iE = function(eD, nB) {
		var d = new J(nB, 16);
		var n = this.ft['n'];
		var e = new J(eD, 16);
		var k = null;
		var pZ = null;
		var r = null;
		var s = null;
		var jI = d;
		do {
			do {
				var hi = this.nS();
				k = new J(hi.ecprvhex, 16);
				var gT = hi.ecpubhex;
				pZ = V.kW(this.ft['dw'], gT);
				r = e.add(pZ.eU().bX());
				r = r.cK(n);
			} while (r.eh(J.ZERO) || r.add(k).eh(n));
			var pl = jI.add(J.ONE);
			pl = pl.hh(n);
			s = r.multiply(jI);
			s = k.eA(s).cK(n);
			s = pl.multiply(s).cK(n);
		} while (s.eh(J.ZERO));
		return Aostar.crypto.eg.oR(r, s);
	};
	this.sign = function(hash, nD) {
		var d = nD;
		var n = this.ft['n'];
		var e = J.hA(hash);
		do {
			var k = this.hM(n);
			var G = this.ft['G'];
			var Q = G.multiply(k);
			var r = Q.eU().bX().cK(n);
		} while (r.ce(J.ZERO) <= 0);
		var s = k.hh(n).multiply(e.add(d.multiply(r))).cK(n);
		return this.oJ(r, s);
	};
	this.kh = function(eD, fl) {
		return this.iZ(eD, fl, this.cD);
	};
	this.iZ = function(eD, fl, gT) {
		var r, s;
		var fp = Aostar.crypto.eg.oO(fl);
		r = fp.r;
		s = fp.s;
		var Q;
		Q = V.kW(this.ft['dw'], gT);
		var e = new J(eD, 16);
		return this.iX(e, r, s, Q);
	};
	this.jb = function(hash, cC, gc) {
		var r, s;
		if (oc.gu.isArray(cC)) {
			var fp = this.pj(cC);
			r = fp.r;
			s = fp.s;
		} else if ("object" === typeof cC && cC.r && cC.s) {
			r = cC.r;
			s = cC.s;
		} else {
			throw "Invalid value for signature";
		}
		var Q;
		if (gc instanceof V) {
			Q = gc;
		} else if (oc.gu.isArray(gc)) {
			Q = V.nI(this.ft['dw'], gc);
		} else {
			throw "Invalid format for gc value, must be byte array kt V";
		}
		var e = J.hA(hash);
		return this.iX(e, r, s, Q);
	};
	this.iX = function(e, r, s, Q) {
		var n = this.ft['n'];
		var G = this.ft['G'];
		var t = r.add(s).cK(n);
		if (t.eh(J.ZERO))
			return false;
		var mw = G.multiply(s);
		mw = mw.add(Q.multiply(t));
		var R = e.add(mw.eU().bX()).cK(n);
		return r.eh(R);
	};
	this.oJ = function(r, s) {
		var hj = r.mA();
		var hH = s.mA();
		var dS = [];
		dS.push(0x02);
		dS.push(hj.length);
		dS = dS.concat(hj);
		dS.push(0x02);
		dS.push(hH.length);
		dS = dS.concat(hH);
		dS.unshift(dS.length);
		dS.unshift(0x30);
		return dS;
	};
	this.pj = function(cC) {
		var cursor;
		if (cC[0] != 0x30)
			throw new Error("gn not a valid jh");
		cursor = 2;
		if (cC[cursor] != 0x02)
			throw new Error("First element in signature must be a hb");;
		var hj = cC.slice(cursor + 2, cursor + 2 + cC[cursor + 1]);
		cursor += 2 + cC[cursor + 1];
		if (cC[cursor] != 0x02)
			throw new Error("Second element in signature must be a hb");
		var hH = cC.slice(cursor + 2, cursor + 2 + cC[cursor + 1]);
		cursor += 2 + cC[cursor + 1];
		var r = J.hA(hj);
		var s = J.hA(hH);
		return {
			r : r,
			s : s
		};
	};
	this.uF = function(cC) {
		if (cC.length !== 65) {
			throw "gn has the wrong length";
		}
		var i = cC[0] - 27;
		if (i < 0 || i > 7) {
			throw "Invalid signature type";
		}
		var n = this.ft['n'];
		var r = J.hA(cC.slice(1, 33)).cK(n);
		var s = J.hA(cC.slice(33, 65)).cK(n);
		return {
			r : r,
			s : s,
			i : i
		};
	};
	if (dr !== undefined) {
		if (dr['dw'] !== undefined) {
			this.fc = dr['dw'];
		}
	}
	if (this.fc === undefined)
		this.fc = fc;
	this.oM(this.fc);
	if (dr !== undefined) {
		if (dr['prv'] !== undefined)
			this.ki(dr['prv']);
		if (dr['pub'] !== undefined)
			this.kH(dr['pub']);
	}
};
(function() {
	var C = AoEncryJS;
	var fK = C.gM;
	var ej = fK.ej;
	var ia = fK.ia;
	var jL = C.hB;
	var W = [];
	var jH = jL.jH = ia.extend({
		ob : function() {
			this.ni = new ej.fw([0x7380166f, 0x4914b2b9, 0x172442d7,
					0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e])
		},
		oe : function(M, offset) {
			var H = this.ni.dC;
			var a = H[0];
			var b = H[1];
			var c = H[2];
			var d = H[3];
			var e = H[4];
			for (var i = 0; i < 80; i++) {
				if (i < 16) {
					W[i] = M[offset + i] | 0
				} else {
					var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
					W[i] = (n << 1) | (n >>> 31)
				}
				var t = ((a << 5) | (a >>> 27)) + e + W[i];
				if (i < 20) {
					t += ((b & c) | (~b & d)) + 0x5a827999
				} else if (i < 40) {
					t += (b ^ c ^ d) + 0x6ed9eba1
				} else if (i < 60) {
					t += ((b & c) | (b & d) | (c & d)) - 0x70e44324
				} else {
					t += (b ^ c ^ d) - 0x359d3e2a
				}
				e = d;
				d = c;
				c = (b << 30) | (b >>> 2);
				b = a;
				a = t
			}
			H[0] = (H[0] + a) | 0;
			H[1] = (H[1] + b) | 0;
			H[2] = (H[2] + c) | 0;
			H[3] = (H[3] + d) | 0;
			H[4] = (H[4] + e) | 0
		},
		mb : function() {
			var data = this.hm;
			var iO = data.dC;
			var pu = this.qc * 8;
			var kO = data.fq * 8;
			iO[kO >>> 5] |= 0x80 << (24 - kO % 32);
			iO[(((kO + 64) >>> 9) << 4) + 14] = Math.floor(pu / 0x100000000);
			iO[(((kO + 64) >>> 9) << 4) + 15] = pu;
			data.fq = iO.length * 4;
			this.iM();
			return this.ni
		},
		clone : function() {
			var clone = ia.clone.call(this);
			clone.ni = this.ni.clone();
			return clone
		}
	});
	C.jH = ia.nX(jH);
	C.vi = ia.sF(jH)
}());
function ap() {
	this.sy = 64;
	this.eQ = new Array();
	this.fS = 0;
	this.im = 0;
	this.rc = 32;
	this.nU = [1937774191, 1226093241, 388252375, -628488704, -1452330820,
			372324522, -477237683, -1325724082];
	this.v = new Array(8);
	this.sj = new Array(8);
	this.nh = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.X = new Array(68);
	this.jc = 0;
	this.sK = 0x79cc4519;
	this.sX = 0x7a879d8a;
	if (arguments.length > 0) {
		this.uC(arguments[0])
	} else {
		this.Init()
	}
};
ap.prototype = {
	Init : function() {
		this.eQ = new Array(4);
		this.Reset()
	},
	uC : function(t) {
		this.eQ = new Array(t.eQ.length);
		Array.Copy(t.eQ, 0, this.eQ, 0, t.eQ.length);
		this.fS = t.fS;
		this.im = t.im;
		Array.Copy(t.X, 0, this.X, 0, t.X.length);
		this.jc = t.jc;
		Array.Copy(t.v, 0, this.v, 0, t.v.length)
	},
	nj : function() {
		return this.rc
	},
	Reset : function() {
		this.im = 0;
		this.fS = 0;
		Array.Clear(this.eQ, 0, this.eQ.length);
		Array.Copy(this.nU, 0, this.v, 0, this.nU.length);
		this.jc = 0;
		Array.Copy(this.nh, 0, this.X, 0, this.nh.length)
	},
	vr : function() {
		return this.sy
	},
	mg : function() {
		var i;
		var fX = this.X;
		var mV = new Array(64);
		for (i = 16; i < 68; i++) {
			fX[i] = this.uY(fX[i - 16] ^ fX[i - 9] ^ (K(fX[i - 3], 15)))
					^ (K(fX[i - 13], 7)) ^ fX[i - 6]
		}
		for (i = 0; i < 64; i++) {
			mV[i] = fX[i] ^ fX[i + 4]
		}
		var eO = this.v;
		var cu = this.sj;
		Array.Copy(eO, 0, cu, 0, this.nU.length);
		var hD, lE, lg, lj, je;
		for (i = 0; i < 16; i++) {
			je = K(cu[0], 12);
			hD = je + cu[4] + K(this.sK, i);
			hD = K(hD, 7);
			lE = hD ^ je;
			lg = this.sZ(cu[0], cu[1], cu[2]) + cu[3] + lE + mV[i];
			lj = this.tU(cu[4], cu[5], cu[6]) + cu[7] + hD + fX[i];
			cu[3] = cu[2];
			cu[2] = K(cu[1], 9);
			cu[1] = cu[0];
			cu[0] = lg;
			cu[7] = cu[6];
			cu[6] = K(cu[5], 19);
			cu[5] = cu[4];
			cu[4] = this.oq(lj)
		}
		for (i = 16; i < 64; i++) {
			je = K(cu[0], 12);
			hD = je + cu[4] + K(this.sX, i);
			hD = K(hD, 7);
			lE = hD ^ je;
			lg = this.uc(cu[0], cu[1], cu[2]) + cu[3] + lE + mV[i];
			lj = this.tK(cu[4], cu[5], cu[6]) + cu[7] + hD + fX[i];
			cu[3] = cu[2];
			cu[2] = K(cu[1], 9);
			cu[1] = cu[0];
			cu[0] = lg;
			cu[7] = cu[6];
			cu[6] = K(cu[5], 19);
			cu[5] = cu[4];
			cu[4] = this.oq(lj)
		}
		for (i = 0; i < 8; i++) {
			eO[i] ^= (cu[i])
		}
		this.jc = 0;
		Array.Copy(this.nh, 0, this.X, 0, this.nh.length)
	},
	ov : function(kd, gU) {
		var n = kd[gU] << 24;
		n |= (kd[++gU] & 0xff) << 16;
		n |= (kd[++gU] & 0xff) << 8;
		n |= (kd[++gU] & 0xff);
		this.X[this.jc] = n;
		if (++this.jc == 16) {
			this.mg()
		}
	},
	uj : function(fJ) {
		if (this.jc > 14) {
			this.mg()
		}
		this.X[14] = (this.rG(fJ, 32));
		this.X[15] = (fJ & (0xffffffff))
	},
	rU : function(n, eu, off) {
		eu[off] = (n >>> 24 & 0xFF);
		eu[++off] = (n >>> 16 & 0xFF);
		eu[++off] = (n >>> 8 & 0xFF);
		eu[++off] = (n & 0xFF);
	},
	gk : function(wG, tz) {
		this.tO();
		for (var i = 0; i < 8; i++) {
			this.rU(this.v[i], wG, tz + i * 4)
		}
		this.Reset();
		return this.rc
	},
	gb : function(input) {
		this.eQ[this.fS++] = input;
		if (this.fS == this.eQ.length) {
			this.ov(this.eQ, 0);
			this.fS = 0
		}
		this.im++
	},
	er : function(input, gU, length) {
		while ((this.fS != 0) && (length > 0)) {
			this.gb(input[gU]);
			gU++;
			length--
		}
		while (length > this.eQ.length) {
			this.ov(input, gU);
			gU += this.eQ.length;
			length -= this.eQ.length;
			this.im += this.eQ.length
		}
		while (length > 0) {
			this.gb(input[gU]);
			gU++;
			length--
		}
	},
	tO : function() {
		var fJ = (this.im << 3);
		this.gb((128));
		while (this.fS != 0)
			this.gb((0));
		this.uj(fJ);
		this.mg()
	},
	ROTATE : function(x, n) {
		return (x << n) | (this.sk(x, (32 - n)))
	},
	oq : function(X) {
		return ((X) ^ K((X), 9) ^ K((X), 17))
	},
	uY : function(X) {
		return ((X) ^ K((X), 15) ^ K((X), 23))
	},
	sZ : function(X, Y, Z) {
		return (X ^ Y ^ Z)
	},
	uc : function(X, Y, Z) {
		return ((X & Y) | (X & Z) | (Y & Z))
	},
	tU : function(X, Y, Z) {
		return (X ^ Y ^ Z)
	},
	tK : function(X, Y, Z) {
		return ((X & Y) | (~X & Z))
	},
	sk : function(number, he) {
		if (number > qk.qY || number < qk.qz) {
			number = dj(number);
		}
		if (number >= 0) {
			return number >> he
		} else {
			return (number >> he) + (2 << ~he)
		}
	},
	rG : function(number, he) {
		var kc;
		var big = new J();
		big.fT(number);
		if (big.fA() >= 0) {
			kc = big.kE(he).eV()
		} else {
			var oI = new J();
			oI.fT(2);
			var qI = ~he;
			var iq = '';
			if (qI < 0) {
				var sT = 64 + qI;
				for (var i = 0; i < sT; i++) {
					iq += '0'
				}
				var pI = new J();
				pI.fT(number >> he);
				var rg = new J("10" + iq, 2);
				iq = rg.ez(10);
				var r = rg.add(pI);
				kc = r.ez(10)
			} else {
				iq = oI.shiftLeft((~he)).eV();
				kc = (number >> he) + iq
			}
		}
		return kc
	},
	pJ : function(g, cD, eI) {
		var gp = AoEncryJS.fj.fr.parse(eI);
		var eF = gp.dC.length * 4 * 8;
		this.gb((eF >> 8 & 0x00ff));
		this.gb((eF & 0x00ff));
		var qi = this.ff(gp.toString());
		this.er(qi, 0, qi.length);
		var ro = this.ff(g.dw.a.bX().ez(16));
		var qa = this.ff(g.dw.b.bX().ez(16));
		var ny = this.ff(g.eU().bX().ez(16));
		var nQ = this.ff(g.fM().bX().ez(16));
		var ow = this.ff(cD.substr(0, 64));
		var oh = this.ff(cD.substr(64, 64));
		this.er(ro, 0, ro.length);
		this.er(qa, 0, qa.length);
		this.er(ny, 0, ny.length);
		this.er(nQ, 0, nQ.length);
		this.er(ow, 0, ow.length);
		this.er(oh, 0, oh.length);
		var eT = new Array(this.nj());
		this.gk(eT, 0);
		return eT
	},
	ff : function(dV) {
		var dC = [];
		var gd = dV.length;
		for (var i = 0; i < gd; i += 2) {
			dC[dC.length] = parseInt(dV.substr(i, 2), 16)
		}
		return dC
	},
	iA : function(dV) {
		var dC = [];
		if (dV.length < 64) {
			dV = this.ll(dV, 64);
		}
		if (dV.length > 64) {
			dV = dV.substr(dV.length - 64, dV.length);
		}
		var gd = dV.length;
		for (var i = 0; i < gd; i += 2) {
			dC[dC.length] = parseInt(dV.substr(i, 2), 16);
		}
		return dC;
	},
	ll : function(dV, length) {
		return new Array((length + 1) - dV.length).join("0") + dV;
	},
	fe : function(hc) {
		var dC = [];
		var j = 0;
		for (var i = 0; i < hc.length * 2; i += 2) {
			dC[i >>> 3] |= parseInt(hc[j]) << (24 - (i % 8) * 4);
			j++
		}
		var eP = new AoEncryJS.gM.ej.fw(dC, hc.length);
		return eP
	}
};
Array.Clear = function(jW, nd, length) {
	for (var rE in jW) {
		jW[rE] = null
	}
};
Array.Copy = function(rK, sourceIndex, jW, nd, length) {
	var oX = rK.slice(sourceIndex, sourceIndex + length);
	for (var i = 0; i < oX.length; i++) {
		jW[nd] = oX[i];
		nd++
	}
};
function K(n, distance) {
	return (n << distance) | (n >>> -distance);
};
window.qk = {
	qz : -parseInt('10000000000000000000000000000000', 2),
	qY : parseInt('1111111111111111111111111111111', 2),
	parse : function(n) {
		if (n < this.qz) {
			var lJ = new Number(-n);
			var ks = lJ.toString(2);
			var jx = ks.substr(ks.length - 31, 31);
			var jG = '';
			for (var i = 0; i < jx.length; i++) {
				var mG = jx.substr(i, 1);
				jG += mG == '0' ? '1' : '0'
			}
			var result = parseInt(jG, 2);
			return (result + 1)
		} else if (n > this.qY) {
			var lJ = Number(n);
			var ks = lJ.toString(2);
			var jx = ks.substr(ks.length - 31, 31);
			var jG = '';
			for (var i = 0; i < jx.length; i++) {
				var mG = jx.substr(i, 1);
				jG += mG == '0' ? '1' : '0'
			}
			var result = parseInt(jG, 2);
			return -(result + 1)
		} else {
			return n
		}
	},
	vI : function(n) {
		if (n > 255) {
			var result = 0xff & n;
			return result;
		}
		if (n < -256) {
			var result = 0xff & n;
			result = 0xff ^ result;
			return (result + 1);
		} else {
			return n
		}
	}
};
function dj(n) {
	if (n > 2147483647 || n < -2147483648) {
		var result = 0xffffffff & n;
		if (result > 2147483647) {
			result = 0x7fffffff & n;
			result = 0x7fffffff ^ result;
			return -(result + 1);
		}
		return result;
	} else {
		return n
	}
};
var CommonUtils = {
	stringToHex : function(ed) {
		return AoEncryJS.fj.fr.parse(ed).toString().toUpperCase();
	},
	hexToBytes : function(hZ) {
		var ee = [];
		var sR = hZ.length;
		for (var i = 0; i < sR; i += 2) {
			ee[ee.length] = parseInt(hZ.substr(i, 2), 16)
		}
		return ee;
	},
	v_ltd : function() {
		var word = new AoEncryJS.gM.ej.fw([-442786843, -1214389064, -1377332043,
				-443502618, -1735465320, -1612398687, -427708442, -1971263844,
				-1343841143, -375811867, -2052266609, -1207959552]);
		var text = word.toString(AoEncryJS.fj.fr);
		return text;
	}
};
export function Sm2Utils(fD, gV) {
	if (typeof(fD) != 'undefined') {
		this.fD = fD;
	} else {
		this.fD = CipherMode.C1C2C3;
	}
	if (typeof(gV) != 'undefined') {
		this.fB = new bz(this.fD, gV);
	} else {
		this.fB = new bz(this.fD);
	}
};
Sm2Utils.prototype = {
	encryptFromText : function(cD, ed) {
		var kj = this.fB.ff(AoEncryJS.fj.fr.parse(ed).toString());
		if (cD.length > 64 * 2) {
			cD = cD.substr(cD.length - 64 * 2);
		}
		var gl = cD.substr(0, 64);
		var fQ = cD.substr(64);
		var ig = this.fB.le(gl, fQ);
		var gm = this.fB.qT(ig, kj);
		return gm.toUpperCase();
	},
	encryptFromHex : function(cD, hZ) {
		var kj = this.fB.ff(hZ);
		if (cD.length > 64 * 2) {
			cD = cD.substr(cD.length - 64 * 2);
		}
		var gl = cD.substr(0, 64);
		var fQ = cD.substr(64);
		var ig = this.fB.le(gl, fQ);
		var gm = this.fB.qT(ig, kj);
		return gm.toUpperCase();
	},
	encryptToASN1 : function(cD, ed) {
		var kj = this.fB.ff(AoEncryJS.fj.fr.parse(ed).toString());
		if (cD.length > 64 * 2) {
			cD = cD.substr(cD.length - 64 * 2);
		}
		var gl = cD.substr(0, 64);
		var fQ = cD.substr(64);
		var ig = this.fB.le(gl, fQ);
		var gm = this.fB.pB(ig, kj);
		return gm.toUpperCase();
	},
	decryptToText : function(kZ, gm) {
		var kK = new J(kZ, 16);
		var eP = this.fB.kg(kK, gm);
		var plainText = AoEncryJS.fj.fr.stringify(eP);
		return plainText;
	},
	decryptToHex : function(kZ, gm) {
		var kK = new J(kZ, 16);
		var eP = this.fB.kg(kK, gm);
		var uD = AoEncryJS.fj.jj.stringify(eP);
		return uD.toUpperCase();
	},
	decryptFromASN1 : function(kZ, gm) {
		var kK = new J(kZ, 16);
		var eP = this.fB.nv(kK, gm);
		var plainText = AoEncryJS.fj.fr.stringify(eP);
		return plainText;
	},
	sign : function() {
		var gp, fN, ed;
		var cC = new Aostar.crypto.gn({
					"cg" : "SM3withSM2",
					"dE" : "cryptojs/jsrsa"
				});
		if (arguments.length === 2) {
			fN = arguments[0];
			ed = arguments[1];
			cC.ka({
						'ecprvhex' : fN,
						'fI' : "sm2"
					});
		} else if (arguments.length >= 3) {
			gp = arguments[0];
			fN = arguments[1];
			ed = arguments[2];
			cC.ka({
						'ecprvhex' : fN,
						'eI' : gp,
						'fI' : "sm2"
					});
		}
		cC.fm(ed);
		var rV = cC.sign();
		return rV.toUpperCase();
	},
	verifySign : function() {
		var gp, cD, ed, ns;
		var cC = new Aostar.crypto.gn({
					"cg" : "SM3withSM2",
					"dE" : "cryptojs/jsrsa"
				});
		if (arguments.length === 3) {
			cD = arguments[0];
			ed = arguments[1];
			ns = arguments[2];
			cC.jZ({
						'ecpubhex' : cD,
						'fI' : "sm2"
					});
		} else if (arguments.length >= 4) {
			gp = arguments[0];
			cD = arguments[1];
			ed = arguments[2];
			ns = arguments[3];
			cC.jZ({
						'ecpubhex' : cD,
						'eI' : gp,
						'fI' : "sm2"
					});
		}
		cC.fm(ed);
		return cC.jb(ns);
	},
	randomWord : function(eF) {
		var fF = "";
		var hc = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b',
				'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
				'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
				'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
				'Y', 'Z', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(',
				')', '_'];
		for (var i = 0; i < eF; i++) {
			var pos = Math.round(AoEncryJS.fj.js.jo() * (hc.length - 1));
			fF += hc[pos];
		}
		return fF;
	},
	v_ltd : function() {
		var word = new AoEncryJS.gM.ej.fw([-442786843, -1214389064, -1377332043,
				-443502618, -1735465320, -1612398687, -427708442, -1971263844,
				-1343841143, -375811867, -2052266609, -1207959552]);
		var text = word.toString(AoEncryJS.fj.fr);
		return text;
	}
};
export var Sm3Utils = {
	encryptFromBytes : function(ee) {
		var eo = new ap();
		eo.er(ee, 0, ee.length);
		var eB = new Array(32);
		eo.gk(eB, 0);
		var eD = eo.fe(eB).toString();
		return eD.toUpperCase();
	},
	encryptFromHex : function(hZ) {
		var eo = new ap();
		var ee = eo.ff(hZ.toString());
		eo.er(ee, 0, ee.length);
		var eB = new Array(32);
		eo.gk(eB, 0);
		var eD = eo.fe(eB).toString();
		return eD.toUpperCase();
	},
	encryptFromText : function(ed) {
		var eo = new ap();
		var nR = AoEncryJS.fj.fr.parse(ed);
		var ee = eo.ff(nR.toString());
		eo.er(ee, 0, ee.length);
		var eB = new Array(32);
		eo.gk(eB, 0);
		var eD = eo.fe(eB).toString();
		return eD.toUpperCase();
	},
	v_ltd : function() {
		var word = new AoEncryJS.gM.ej.fw([-442786843, -1214389064, -1377332043,
				-443502618, -1735465320, -1612398687, -427708442, -1971263844,
				-1343841143, -375811867, -2052266609, -1207959552]);
		var text = word.toString(AoEncryJS.fj.fr);
		return text;
	}
};
