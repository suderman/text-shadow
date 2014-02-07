/*
*   text-shadow for IE9
*   IE9にCSS3のtext-shadow（擬き）を適用させるJavaScript
*   JavaScript polyfill to apply CSS3 text-shadow effect to Internet Explorer 9
*   Copyright (c) 2014 Kazz
*   http://asamuzak.jp
*   Dual licensed under MIT or GPL
*   http://asamuzak.jp/license
*/

function textShadowForIE9(eObj) {
    'use strict';
    var _doc = document;
    if(_doc.documentMode === 9) {
        var ieShadowSettings = function() {
            var arr = [];
            if(!eObj) {
                arr = [
                    // ここ（arr = [];内）にtext-shadowを適用させるセレクタの配列を記述
                    // セレクタ毎に「カンマ区切り」で配列を追加
                    // Write your text-shadow settings here, like below.
                    // { sel : 'h1', shadow : '2px 2px 2px gray' },
                    // { sel : 'em', shadow : '1px 1px 1px rgb(0, 100, 100) !important' }
                ];
                for(var _$, reg = /text\-shadow\s*:\s*([0-9a-zA-Z\s\-\+\*&#\.\(\)%,!"'><\\]+);?/, elm = _doc.getElementsByTagName('*'), i = 0, l = elm.length; i < l; i++) {
                    elm[i].style && (_$ = elm[i].style.cssText.match(reg)) && (elm[i].id === '' && (elm[i].id = 'oId' + _cNum()), arr[arr.length] = { sel : '#' + elm[i].id, shadow : _$[1] });
                }
                return cssShadowValues().concat(arr);
            }
            else {
                _doc.querySelector(eObj.sel) && _doc.querySelector(eObj.sel).getAttribute('data-pseudo') && (eObj.shadow = eObj.shadow.replace(/none/, '0 0 transparent'));
                arr[arr.length] = eObj;
                return arr;
            }
        };
        var getCompStyle = function(obj, pseudo) {
            return _doc.defaultView.getComputedStyle(obj, pseudo ? pseudo : '');
        };
        var getGeneralObj = function(obj) {
            var arr = [];
            for((obj = obj.previousSibling) && obj.nodeType === 1 && (arr[arr.length] = obj); obj;) {
                (obj = obj.previousSibling) && obj.nodeType === 1 && (arr[arr.length] = obj);
            }
            return arr;
        };
        var getAncestObj = function(obj) {
            var arr = [];
            if(obj.parentNode) {
                for(obj = obj.parentNode, arr[arr.length] = obj; obj.nodeName.toLowerCase() !== _doc.documentElement.nodeName.toLowerCase();) {
                    (obj = obj.parentNode) && (arr[arr.length] = obj);
                }
            }
            return arr;
        };
        var convUnitToPx = function(sUnit, obj, pseudo) {
            var getUnitRatio = function(q) {
                var _$, elm = _doc.createElement('div');
                elm.id = 'dDiv' + _cNum();
                elm.style.height = 0;
                elm.style.width = q;
                elm.style.visibility = 'hidden';
                _body.appendChild(elm);
                _$ = elm.offsetWidth;
                _body.removeChild(elm);
                return _$;
            };
            var _$ = sUnit.match(/^(\-?[0-9]+(?:\.[0-9]+)?)(v(?:[hw]|m(?:ax|in)?)|(?:re|m)m|p[ctx]|c[hm]|e[mx]|in|%)?$/);
            if(!_$) { return; }
            var n = _$[1] * 1, u = _$[2] || null, v;
            if(n !== 0 && !u) { return; }
            if(n === 0 || u === 'px') { return n; }
            v = /^(?:(?:[cm]|re)m|p[ct]|v[hw]|in)$/.test(u) ? getUnitRatio(Math.abs(n) + u) : /^(?:e[mx]|ch)$/.test(u) ? getUnitRatio(Math.abs(n) + u) / getUnitRatio('1em') * getUnitRatio(getCompStyle(obj, pseudo ? pseudo : '').fontSize) : /^vm(?:in)?$/.test(u) ? Math.min(getUnitRatio(Math.abs(n) + 'vw'), getUnitRatio(Math.abs(n) + 'vh')) : u === 'vmax' ? Math.max(getUnitRatio(Math.abs(n) + 'vw'), getUnitRatio(Math.abs(n) + 'vh')) : u === '%' && getUnitRatio(getCompStyle(obj, pseudo ? pseudo : '').width) * n / 100;
            return n >= 0 ? v : v * -1;
        };
        var revArr = function(arr) {
            for(var _$ = [], i = 0, l = arr.length; i < l; i++) {
                _$.unshift(arr[i]);
            }
            return _$;
        };
        var getCssValues = function(prop) {
            var getCssRules = function(sSheet) {
                var matchMedia = function(q) {
                    var _$ = _doc.createElement('style'), elm = _doc.createElement('div'), bool;
                    elm.id = 'dDiv' + _cNum();
                    elm.style.height = 0;
                    elm.style.visibility = 'hidden';
                    _body.appendChild(elm);
                    _head.appendChild(_$);
                    _$.sheet.insertRule('@media ' + q + '{#' + elm.id + '{width:42px;}}', _$.sheet.cssRules.length);
                    bool = elm.offsetWidth === 42;
                    _head.removeChild(_$);
                    _body.removeChild(elm);
                    return { matches: bool, media: q };
                };
                for(var _$, reg = prop.replace(/(\-)/, '\\-') + '\\s*:\\s*([0-9a-zA-Z\\s\\-\\+\\*&#\\.\\(\\)%,!"\'><\\\\]+);?', arr = [], sRules = sSheet.cssRules, i = 0, l = sRules.length; i < l; i++) {
                    var sSelText = sRules[i].selectorText, sType = sRules[i].type, sStyle = sRules[i].style;
                    switch(sType) {
                        case 1 :
                            (_$ = sStyle.cssText.match(reg)) && ((arr[arr.length] = { sel : sSelText, prop : prop, val : sStyle.getPropertyPriority(prop) ? _$[1] + ' !important' : _$[1] }), dReg.test(sSelText) && (dArr[dArr.length] = { sel : sSelText, cText : sStyle.getPropertyPriority(prop) ? _$[1] + ' !important' : _$[1] }));
                            pReg.test(sSelText) && (pArr[pArr.length] = { sel : sSelText, cText : sStyle.cssText });
                            break;
                        case 3 :
                            arr = arr.concat(getCssRules(sRules[i].styleSheet));
                            break;
                        case 4 :
                            matchMedia(sRules[i].media.mediaText).matches && (arr = arr.concat(getCssRules(sRules[i])));
                            break;
                    }
                }
                return arr;
            };
            var arr = [];
            if(_doc.styleSheets) {
                for(var _$ = _doc.styleSheets, i = 0, l = _$.length; i < l; i++) {
                    arr = arr.concat(getCssRules(_$[i]));
                }
            }
            return arr;
        };
        var cssShadowValues = function() {
            for(var _$, arr = [], sArr = getCssValues('text-shadow'), reg = /^(#[0-9a-fA-F]{3,6})\s+([0-9a-zA-Z\s\-\.\(\)%,!]+)$/, i = 0, l = sArr.length; i < l; i++) {
                arr[arr.length] = { sel : sArr[i].sel, shadow : (_$ = sArr[i].val.match(reg)) ? _$[2] + ' ' + _$[1] : sArr[i].val };
            }
            return arr;
        };
        var setShadow = function(tObj) {
            var setShadowNodeColor = function(obj) {
                for(var _$ = obj.firstChild; _$; _$ = _$.nextSibling) {
                    _$.nodeType === 1 && (!_$.hasChildNodes() ? _$.style.visibility = 'hidden' : (!/quasiPseudo/.test(_$.className) && (_$.style.color = obj.style.color), setShadowNodeColor(_$)));
                }
            };
            var hideAncestShadow = function(oObj, pObj) {
                for(var _$ = pObj.firstChild; _$; _$ = _$.nextSibling) {
                    _$.hasChildNodes() && (_$.nodeName.toLowerCase() === oObj.tagName.toLowerCase() && _$.firstChild.nodeValue === oObj.firstChild.nodeValue ? _$.style.visibility = 'hidden' : hideAncestShadow(oObj, _$));
                }
            };
            var boolShadowChild = function(obj) {
                for(var _$ = true, arr = getAncestObj(obj), i = 0, l = arr.length; i < l; i++) {
                    if(arr[i].tagName.toLowerCase() === 'span' && /dummyShadow/.test(arr[i].className)) {
                        _$ = false; break;
                    }
                }
                return _$;
            };
            var getDynCSS = function(pseudo, arr) {
                var _$, obj = { pText : '', fLetter : '', fLine : '' }, reg, dyn, i, l, j, k;
                for(reg = '', i = 0, l = pseudo.length; i < l; i++) {
                    dyn = /_/.test(pseudo[i]) ? pseudo[i].split('_') : [pseudo[i]];
                    if(dyn.length === 1) {
                        reg = '(?:(?:(::?(before|after))|(:' + dyn[0] + ')){2})';
                    }
                    else if(dyn.length > 1) {
                        reg = '(?:(?:(::?(before|after))|(:(?:';
                        for(j = 0, k = dyn.length; j < k; j++) {
                            reg += (dyn[j] + '|');
                        }
                        reg = reg.replace(/\|$/, '') + '){' + dyn.length + '})){2})';
                    }
                    for(j = 0, k = arr.length; j < k; j++) {
                        _$ = new RegExp(reg);
                        if(_$.test(arr[j].split('||')[0])) {
                            obj.pText = arr[j].split('||')[1].replace(/;$/, '') + ';';
                            break;
                        }
                    }
                    if(obj.pText !== '') { break; }
                }
                for(reg = '', i = 0, l = pseudo.length; i < l; i++) {
                    dyn = /_/.test(pseudo[i]) ? pseudo[i].split('_') : [pseudo[i]];
                    if(dyn.length === 1) {
                        reg = '(?:(?:(::?first\\-letter)|(:' + dyn[0] + ')){2})';
                    }
                    else if(dyn.length > 1) {
                        reg = '(?:(?:(::?first\\-letter)|(:(?:';
                        for(j = 0, k = dyn.length; j < k; j++) {
                            reg += (dyn[j] + '|');
                        }
                        reg = reg.replace(/\|$/, '') + '){' + dyn.length + '})){2})';
                    }
                    for(j = 0, k = arr.length; j < k; j++) {
                        _$ = new RegExp(reg);
                        if(_$.test(arr[j].split('||')[0])) {
                            obj.fLetter = arr[j].split('||')[1].replace(/;$/, '') + ';';
                            break;
                        }
                    }
                    if(obj.fLetter !== '') { break; }
                }
                for(reg = '', i = 0, l = pseudo.length; i < l; i++) {
                    dyn = /_/.test(pseudo[i]) ? pseudo[i].split('_') : [pseudo[i]];
                    if(dyn.length === 1) {
                        reg = '(?:(?:(::?first\\-line)|(:' + dyn[0] + ')){2})';
                    }
                    else if(dyn.length > 1) {
                        reg = '(?:(?:(::?first\\-line)|(:(';
                        for(j = 0, k = dyn.length; j < k; j++) {
                            reg += (dyn[j] + '|');
                        }
                        reg = reg.replace(/\|$/, '') + '){' + dyn.length + '})){2})';
                    }
                    for(j = 0, k = arr.length; j < k; j++) {
                        _$ = new RegExp(reg);
                        if(_$.test(arr[j].split('||')[0])) {
                            obj.fLine = arr[j].split('||')[1].replace(/;$/, '') + ';';
                            break;
                        }
                    }
                    if(obj.fLine !== '') { break; }
                }
                return obj;
            };
            if(tObj.shadow !== 'invalid') {
                for(var _$ = false, tShadow = tObj.shadow, tElm = tObj.elm, arr = tElm.childNodes, i = 0; i < arr.length; i++) {
                    arr[i].nodeType === 1 && arr[i].nodeName.toLowerCase() === 'span' && /dummyShadow/.test(arr[i].className) && (/hasImp/.test(arr[i].className) ? (_$ = true) : (tElm.removeChild(arr[i]), --i));
                }
                if(!_$ || tObj.hasImp) {
                    var aBg, cNode, sNode = _doc.createDocumentFragment();
                    for(arr = getAncestObj(tElm), i = 0, l = arr.length; i < l; i++) {
                        !aBg && (getCompStyle(arr[i]).backgroundColor !== 'transparent' || getCompStyle(arr[i]).backgroundImage !== 'none') && (aBg = arr[i]);
                        for(cNode = arr[i].firstChild; cNode; cNode = cNode.nextSibling) {
                            cNode.nodeType === 1 && cNode.nodeName.toLowerCase() === 'span' && /dummyShadow/.test(cNode.className) && hideAncestShadow(tElm, cNode);
                        }
                    }
                    tShadow !== 'none' && tShadow.length > 1 && (getCompStyle(tElm).backgroundColor !== 'transparent' || getCompStyle(tElm).backgroundImage !== 'none') && (tShadow = revArr(tShadow));
                    if(tShadow === 'none') {
                        for(cNode = tElm.parentNode.firstChild; cNode; cNode = cNode.nextSibling) {
                            if(cNode.nodeName.toLowerCase() === 'span' && cNode.className === 'dummyShadow') {
                                getCompStyle(tElm).display === 'inline-block' && (tElm.style.display = 'inline');
                                getCompStyle(tElm).position === 'relative' && (tElm.style.position = 'static');
                                break;
                            }
                        }
                        !eObj && tElm.getAttribute('data-dynpseudo') && tElm.setAttribute('data-dynpseudo', encodeURIComponent(decodeURIComponent(tElm.getAttribute('data-dynpseudo')).replace(/(\|;\|default.+)$/, '') + '|;|default||0 0 transparent' + (tObj.hasImp ? ' !important;' : ';')));
                    }
                    if(tShadow !== 'none' && tElm.hasChildNodes() && boolShadowChild(tElm)) {
                        var setPseudoCSS = function(dCss, dInt, dPseudo) {
                            var convPseudoPropVal = function(t, p) {
                                var ratio = convUnitToPx(getCompStyle(tElm, '').fontSize) / convUnitToPx(getCompStyle(tElm, p).fontSize);
                                /margin/.test(t) && (t += 'margin-top:' + (convUnitToPx(getCompStyle(tElm, p).marginTop, tElm, p) * ratio) + 'px;margin-right:' + (convUnitToPx(getCompStyle(tElm, p).marginRight, tElm, p) * ratio) + 'px;margin-bottom:' + (convUnitToPx(getCompStyle(tElm, p).marginBottom, tElm, p) * ratio) + 'px;margin-left:' + (convUnitToPx(getCompStyle(tElm, p).marginLeft, tElm, p) * ratio) + 'px;');
                                /border/.test(t) && (t += 'border-top-width:' + (convUnitToPx(getCompStyle(tElm, p).borderTopWidth, tElm, p) * ratio) + 'px;border-right-width:' + (convUnitToPx(getCompStyle(tElm, p).borderRightWidth, tElm, p) * ratio) + 'px;border-bottom-width:' + (convUnitToPx(getCompStyle(tElm, p).borderBottomWidth, tElm, p) * ratio) + 'px;border-left-width:' + (convUnitToPx(getCompStyle(tElm, p).borderLeftWidth, tElm, p) * ratio) + 'px;border-color:transparent !important; border-image:none !important;');
                                /padding/.test(t) && (t += 'padding-top:' + (convUnitToPx(getCompStyle(tElm, p).paddingTop, tElm, p) * ratio) + 'px;padding-right:' + (convUnitToPx(getCompStyle(tElm, p).paddingRight, tElm, p) * ratio) + 'px;padding-bottom:' + (convUnitToPx(getCompStyle(tElm, p).paddingBottom, tElm, p) * ratio) + 'px;padding-left:' + (convUnitToPx(getCompStyle(tElm, p).paddingLeft, tElm, p) * ratio) + 'px;');
                                return t;
                            };
                            var setPseudoCssText = function(t, p) {
                                t = t.replace(/background(\-[a-z]+?)?\s*:\s*.+?;/ig, '').replace(/[^\-]color\s*:\s*.+?;/i, '');
                                /margin|border|padding/.test(t) && (t = convPseudoPropVal(t, p));
                                return t;
                            };
                            var getPseudoShadowValue = function(shadow, n, p) {
                                var _$,
                                    rad = convUnitToPx(shadow[n].z, tElm, p),
                                    left = convUnitToPx(shadow[n].x, tElm, p) - rad - xPos - pxRad,
                                    top = convUnitToPx(shadow[n].y, tElm, p) - rad - yPos - pxRad,
                                    color = (_$ = shadow[n].cProf.match(/^((?:rgb|hsl)a?\(\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*(?:,\s*(?:0?\.[0-9]+|1(?:\.0+)?)\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)?$/)) && ('color:' + _$[1] + ';'),
                                    filt = '-ms-filter:"progid:DXImageTransform.Microsoft.Blur(PixelRadius=' + rad + ',MakeShadow=false,ShadowOpacity=1)";display:inline-block;';
                                return { rad : rad, top : top, left : left, color : color , filt : filt };
                            };
                            var convEntityToStr = function(q) {
                                for(var _$, arr = q.match(/\\[0-9a-f]{1,4}/ig) || [q], i = 0, l = arr.length; i < l; i++) {
                                    (_$ = arr[i].match(/\\([0-9a-f]{1,4})/i)) && (arr[i] = String.fromCharCode(parseInt(_$[1], 16)));
                                    /&/.test(arr[i]) && (arr[i] = '&amp;');
                                    /"/.test(arr[i]) && (arr[i] = '&quot;');
                                    /</.test(arr[i]) && (arr[i] = '&lt;');
                                    />/.test(arr[i]) && (arr[i] = '&gt;');
                                }
                                return arr.join('');
                            };
                            var getListStyleType = function(style, n) {
                                var getPredefinedStyle = function(s) {
                                    var type = '', glyphs = [];
                                    switch(s) {
                                        /*  Predefined Repeating Styles */
                                        case 'circle' :
                                            type = 'repeating'; glyphs = ['25E6'];
                                            break;
                                        case 'disc' :
                                            type = 'repeating'; glyphs = ['2022'];
                                            break;
                                        case 'square' :
                                            type = 'repeating'; glyphs = ['25FE'];
                                            break;
                                        /*  Predefined Alphabetic Styles    */
                                        case ('lower-alpha' || 'lower-latin') :
                                            type = 'alphabetic';
                                            glyphs = ['61', '62', '63', '64', '65', '66', '67', '68', '69', '6A', '6B', '6C', '6D', '6E', '6F', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7A'];
                                            break;
                                        case 'lower-greek' :
                                            type = 'alphabetic';
                                            glyphs = ['3B1', '3B2', '3B3', '3B4', '3B5', '3B6', '3B7', '3B8', '3B9', '3BA', '3BB', '3BC', '3BD', '3BE', '3BF', '3C0', '3C1', '3C3', '3C4', '3C5', '3C6', '3C7', '3C8', '3C9'];
                                            break;
                                        case ('upper-alpha' || 'upper-latin') :
                                            type = 'alphabetic';
                                            glyphs = ['41', '42', '43', '44', '45', '46', '47', '48', '49', '4A', '4B', '4C', '4D', '4E', '4F', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5A'];
                                            break;
                                    }
                                    return { style : s, type : type, glyphs : glyphs };
                                };
                                var _$, glph = '', M, C, X, I;
                                switch(style) {
                                    case 'decimal-leading-zero' :
                                        glph = n >= 0 && n < 10 ? '0' + n : n < 0 && n >= -9 ? '-0' + Math.abs(n) : n;
                                        break;
                                    case ('upper-roman' || 'lower-roman') :
                                        _$ = style.match(/((?:upp|low)er)\-roman/)[1];
                                        M = ['', 'M', 'MM', 'MMM', 'MMMM'];
                                        C = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
                                        X = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
                                        I = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
                                        if(n > 0 && n <= 4999) {
                                            glph += M[Math.floor(n / 1000)];
                                            n %= 1000;
                                            glph += C[Math.floor(n / 100)];
                                            n %= 100;
                                            glph += X[Math.floor(n / 10)];
                                            n %= 10;
                                            glph += I[n];
                                        }
                                        _$ === 'lower' && (glph = glph.toLowerCase());
                                        break;
                                    case 'armenian' :
                                        M = ['', '54C', '54D', '54E', '54F', '550', '551', '552', '553', '554'];
                                        C = ['', '543', '544', '545', '546', '547', '548', '549', '54A', '54B'];
                                        X = ['', '53A', '53B', '53C', '53D', '53E', '53F', '540', '541', '542'];
                                        I = ['', '531', '532', '533', '534', '535', '536', '537', '538', '539'];
                                        if(n > 0 && n <= 9999) {
                                            glph += String.fromCharCode(parseInt(M[Math.floor(n / 1000)], 16));
                                            n %= 1000;
                                            glph += String.fromCharCode(parseInt(C[Math.floor(n / 100)], 16));
                                            n %= 100;
                                            glph += String.fromCharCode(parseInt(X[Math.floor(n / 10)], 16));
                                            n %= 10;
                                            glph += String.fromCharCode(parseInt(I[n], 16));
                                        }
                                        break;
                                    case 'georgian' :
                                        _$ = ['', '10F5'];
                                        M = ['', '10E9', '10EA', '10EB', '10EC', '10ED', '10EE', '10F4', '10EF', '10F0'];
                                        C = ['', '10E0', '10E1', '10E2', '10F3', '10E4', '10E5', '10E6', '10E7', '10E8'];
                                        X = ['', '10D8', '10D9', '10DA', '10DB', '10DC', '10F2', '10DD', '10DE', '10DF'];
                                        I = ['', '10D0', '10D1', '10D2', '10D3', '10D4', '10D5', '10D6', '10F1', '10D7'];
                                        if(n > 0 && n <= 19999) {
                                            glph += String.fromCharCode(parseInt(_$[Math.floor(n / 10000)], 16));
                                            n %= 10000;
                                            glph += String.fromCharCode(parseInt(M[Math.floor(n / 1000)], 16));
                                            n %= 1000;
                                            glph += String.fromCharCode(parseInt(C[Math.floor(n / 100)], 16));
                                            n %= 100;
                                            glph += String.fromCharCode(parseInt(X[Math.floor(n / 10)], 16));
                                            n %= 10;
                                            glph += String.fromCharCode(parseInt(I[n], 16));
                                        }
                                        break;
                                    default :
                                        var obj = getPredefinedStyle(style);
                                        _$ = '';
                                        if(obj.type === 'alphabetic') {
                                            n -= 1;
                                            _$ = n % obj.glyphs.length + '';
                                            for(n = Math.floor( n / obj.glyphs.length); n >= obj.glyphs.length;) {
                                                _$ = n % obj.glyphs.length + ' ' + _$, n = Math.floor(n / obj.glyphs.length);
                                                _$ = n % obj.glyphs.length + ' ' + _$;
                                            }
                                            for(var arr = _$.split(' '), i = 0, l = arr.length; i < l; i++) {
                                                glph += String.fromCharCode(parseInt(obj.glyphs[arr[i] * 1], 16));
                                            }
                                        }
                                        if(obj.type === 'repeating') {
                                            glph = String.fromCharCode(parseInt(obj.glyphs[(n - 1) % obj.glyphs.length], 16));
                                        }
                                        break;
                                }
                                return glph;
                            };
                            var getContentValue = function(obj, qCont, pseudo) {
                                var getAncestCountOrder = function(obj, r, c) {
                                    for(var _$, cReg = new RegExp(r), iReg = new RegExp(r + '\\s+(\\-?[0-9]+)$'), n = 1, arr, aArr, gArr = getGeneralObj(obj), i = 0, l = gArr.length; i < l; i++) {
                                        gArr[i].tagName.toLowerCase() === obj.tagName.toLowerCase() && (n += 1);
                                    }
                                    c && (_$ = c.match(iReg)) && (n *= (_$[1] * 1));
                                    for(arr = [], aArr = getAncestObj(obj), i = 0, l = aArr.length; i < l; i++) {
                                        var cReset = getCompStyle(aArr[i]).counterReset || getCompStyle(aArr[i], pseudo).counterReset;
                                        cReset && cReg.test(cReset) && ((_$ = cReset.match(iReg)) && (n += (_$[1] * 1)), (arr[arr.length] = n));
                                        if(aArr[i].tagName.toLowerCase() === obj.tagName.toLowerCase()) {
                                            n = 1;
                                            gArr = getGeneralObj(aArr[i]);
                                            for(var j = 0, k = gArr.length; j < k; j++) {
                                                gArr[j].tagName.toLowerCase() === obj.tagName.toLowerCase() && (n += 1);
                                            }
                                            c && (_$ = c.match(iReg)) && (n *= (_$[1] * 1));
                                        }
                                    }
                                    return revArr(arr);
                                };
                                qCont !== '' && /^(normal|none|''|"")/.test(qCont) && (qCont = '');
                                if(qCont === '') { return; }
                                var _$, arr, aArr, reg, aReg, str, aStr, i, l, j, k, n,
                                    cIncre = getCompStyle(obj).counterIncrement || getCompStyle(obj, pseudo).counterIncrement,
                                    qNode = _doc.createDocumentFragment();
                                if(/attr\([a-z\-]+\)/.test(qCont)) {
                                    for(arr = qCont.match(/attr\(([a-z\-]+)\)/g), i = 0, l = arr.length; i < l; i++) {
                                        arr[i] = arr[i].match(/attr\(([a-z\-]+)\)/)[1];
                                        _$ = new RegExp('\\s*attr\\(' + arr[i] + '\\)\\s*');
                                        obj.getAttribute(arr[i]) && (qCont = qCont.replace(_$, obj.getAttribute(arr[i])));
                                    }
                                }
                                if(/counters\(\s*.+?\s*,\s*["'].+?['"]\s*(,\s*[^\s]+?)?\s*\)/.test(qCont)) {
                                    for(arr = qCont.match(/counters\(\s*.+?\s*,\s*["'].+?['"]\s*(,\s*[^\s]+?)?\s*\)/g), i = 0, l = arr.length; i < l; i++) {
                                        if(_$ = arr[i].match(/counters\(\s*(.+?)\s*,\s*["'](.+?)['"]\s*(?:,\s*([^\s]+?))?\s*\)/)) {
                                            var mk = _$[2];
                                            str = _$[1]; aStr = _$[3] || '';
                                            if(cIncre && cIncre === 'none' || aStr === 'none') {
                                                _$ = new RegExp('\\s*counters\\(\\s*' + str + '\\s*,\\s*["\']' + mk + '["\']\\s*(,\\s*' + aStr + '?)?\\s*\\)\\s*');
                                                qCont = qCont.replace(_$, '');
                                            }
                                            else {
                                                aArr = getAncestCountOrder(obj, str, cIncre);
                                                if(aStr !== '' && aStr !== 'decimal') {
                                                    for(j = 0, k = aArr.length; j < k; j++) {
                                                        aArr[j] = getListStyleType(aStr, aArr[j]);
                                                    }
                                                }
                                                _$ = new RegExp('\\s*counters\\(\\s*' + str + '\\s*,\\s*["\']' + mk + '["\']\\s*(,\\s*' + aStr + '?)?\\s*\\)\\s*');
                                                qCont = qCont.replace(_$, aArr.join(mk));
                                            }
                                        }
                                    }
                                }
                                if(/counter\(.+?\)/.test(qCont)) {
                                    for(arr = qCont.match(/counter\(.+?\)/g), i = 0, l = arr.length; i < l; i++) {
                                        if(_$ = arr[i].match(/counter\(\s*([^\s]+?)\s*(?:,\s*([^\s]+?)\s*)?\)/)) {
                                            str = _$[1]; aStr = _$[2] || '';
                                            if(cIncre && cIncre === 'none' || aStr === 'none') {
                                                _$ = new RegExp('\\s*counter\\(\\s*' + str + '\\s*(,\\s*' + aStr + '\\s*)?\\)\\s*');
                                                qCont = qCont.replace(_$, '');
                                            }
                                            else {
                                                reg = new RegExp(str), aReg = new RegExp(str + '\\s+(\\-?[0-9]+)?');
                                                for(n = 1, aArr = getGeneralObj(obj), j = 0, k = aArr.length; j < k; j++) {
                                                    var cReset = getCompStyle(aArr[j]).counterReset;
                                                    if(cReset && reg.test(cReset)) {
                                                        (_$ = cReset.match(aReg)) && (n += (_$[1] * 1));
                                                        break;
                                                    }
                                                    aArr[j].tagName.toLowerCase() === obj.tagName.toLowerCase() && (n += 1);
                                                }
                                                if(cIncre && reg.test(cIncre)) {
                                                    n *= ((_$ = cIncre.match(aReg)) ? _$[1] * 1 : 1);
                                                    aStr !== '' && aStr !== 'decimal' && (n = getListStyleType(aStr, n));
                                                }
                                                _$ = new RegExp('counter\\(\\s*' + str + '\\s*(,\\s*' + aStr + '\\s*)?\\)');
                                                qCont = qCont.replace(_$, n);
                                            }
                                        }
                                    }
                                }
                                if(/["'].+?['"]/.test(qCont)) {
                                    for(arr = qCont.match(/["'].+?['"]/g), i = 0, l = arr.length; i < l; i++) {
                                        if(_$ = arr[i].match(/["'](.+?)['"]/)) {
                                            str = _$[1];
                                            reg = str.replace(/\\/g, '\\\\');
                                            if(/(\\([0-9a-f]{1,4}){1,})/i.test(str)) {
                                                for(aArr = str.match(/(\\([0-9a-f]{1,4}){1,})/ig), j = 0, k = aArr.length; j < k; j++) {
                                                    str = str.replace(aArr[j], convEntityToStr(aArr[j]));
                                                }
                                            }
                                            _$ = new RegExp('\\s*[\'"]' + reg + '["\']\\s*');
                                            qCont = qCont.replace(_$, str.replace(/\s/g, '&#160;'));
                                        }
                                    }
                                }
                                if(/url\(.+?\)/.test(qCont)) {
                                    for(arr = qCont.match(/url\(.+?\)/g), i = 0, l = arr.length; i < l; i++) {
                                        arr[i] = arr[i].match(/url\((.+?)\)/)[1];
                                        _$ = new RegExp('\\s*url\\(' + arr[i] + '\\)\\s*');
                                        qCont = qCont.replace(_$, '||<img src="' + arr[i].replace(/["']/g, '') + '" />||').replace(/^\|\|/, '').replace(/\|\|$/, '');
                                    }
                                }
                                if(/(?:open|close)\-quote/.test(qCont) && getCompStyle(obj).quotes) {
                                    for(arr = qCont.match(/(?:open|close)\-quote/g), i = 0, l = arr.length; i < l; i++) {
                                        arr[i] = arr[i].match(/((?:no\-)?(?:open|close)\-quote)/)[1];
                                        n = 0, aArr = getCompStyle(obj).quotes.split(' ') || ['', ''];
                                        if(aArr.length > 2) {
                                            for(_$ = getAncestObj(obj), j = 0, k = _$.length; j < k; j++) {
                                                _$[j].tagName.toLowerCase() === obj.tagName.toLowerCase() && (/no\-(?:open|close)\-quote/.test(getCompStyle(_$[j], pseudo).content) ? (/open\-quote/.test(arr[i]) ? (n += 2) : /close\-quote/.test(arr[i]) && (n -= 2)) : (n += 2));
                                            }
                                        }
                                        /[^\-]?open\-quote/.test(arr[i]) && (qCont = qCont.replace(/\s*[^\-]?open\-quote\s*/g, aArr[n].replace(/^["']/, '').replace(/['"]$/, '')));
                                        /[^\-]?close\-quote/.test(arr[i]) && (qCont = qCont.replace(/\s*[^\-]?close\-quote\s*/g, aArr[n + 1].replace(/^["']/, '').replace(/['"]$/, '')));
                                        /no\-(?:open|close)\-quote/.test(arr[i]) && (qCont = '');
                                    }
                                }
                                for(arr = /\|\|/.test(qCont) ? qCont.split('||') : [qCont], i = 0, l = arr.length; i < l; i++) {
                                    (_$ = arr[i].match(/^<([a-z]+)\s/)) ? (_$ = _doc.createElement(_$[1]), _$.src = arr[i].match(/src="(.+?)"/)[1], _$.style.visibility = 'hidden', qNode.appendChild(_$)) : qNode.appendChild(_doc.createTextNode(arr[i].replace(/&#160;/g, '\u00a0')));
                                }
                                return qNode;
                            };
                            var setQuasiFirstLetter = function(cNode, cText, n) {
                                var setFirstLetter = function(obj) {
                                    for(var _$ = false, reg = /^(?:1(?:0(?:6(?:4[0-8]|2[7-9]|3[0-9])|2(?:1[4-9]|2[0-3])|7(?:1[2-5]|4[89])|1(?:0[01]|8[12])|0(?:8[89]|9[0-9]))|1(?:8(?:0[013-9]|2[0-24-9]|3[0-3]|1[0-9])|7(?:9[0-8]|7[6-9]|8[0-9])|51[893-6]|632)|2(?:3(?:1[0-57-9]|0[890-5]|49)?|2(?:9[016-9]|89)|5(?:39)?)|5(?:4[5689]|6[367]|2[34])|7(?:9[2-9]|48|1)|8(?:[237]|0[0-5])|6(?:[17]|4[2-5])|4(?:7[258]|17)|37[0-5]|91)|6(?:5(?:3(?:7[135-9]|0[67]|1[12]|4[01]|8[01]|39)|1(?:1[013-9]|0[0894-6]|2[018]|3[01])|0(?:7[27-9]|4[0-9]|8[0-9]|9[0-9])|2(?:8[1-35-9]|9[0245])|79[2-4])|8(?:1(?:[69]|8[0-4]?|7[6-9]?)|2(?:[014-9]|23?)|4(?:1[0-5]|09))|9(?:8(?:2[02-5]|19)|70[3-9]|95[2-5])|1(?:0[0-24-6]|4[4-9]|5[1-4])|4(?:83[01]|6[89])?|6(?:8[67]|463|512)|7(?:[68]71|903)|3)|4(?:[67]|3(?:4(?:5[7-9]|8[67]|6[0-9]|7)|2(?:5[6-8]|1[45])|7(?:4[23]|6[01])|3(?:1[01]|59)|12[4-7]|61[2-5])|2(?:7(?:4[0-3]|3[89])|5(?:1[01]|09)|6(?:11|22)|23[89])?|0(?:5[780-2]|4[89])?|1(?:7[0-5])?|96[0-8]|4(?:011)?)|8(?:2(?:6[1-9]|5[0-47-9]|7[50-37-9]|8[0-6]|1[4-9]|3[01]|2[0-9]|4[0-9])|3(?:1[78]|3[34])|94)|7(?:00(?:[2-7]|8[5-8]?)|2(?:2[7-9]|3[01]|9[45])|3(?:6[0-7]|79)|486[4-7]|16[4-7])|3(?:[347]|8(?:5[0-8]|4[4-9]|9[89]|60)?|9(?:0[01]|73)?|6(?:7[45]|63)|5(?:72)?)|2(?:0(?:9[6-9]|4[01]|39)|1(?:0[0-9]|10|42)|4(?:0[45]|16)|800)|5(?:7(?:4[12]|8[78])|8(?:6[7-9])?|9(?:4[12])?)|9(?:[1-3]|0(?:0[12]|3)))$/, qNode = _doc.createDocumentFragment(), isPunc = false, str = '', elm = _doc.createElement('span'), arr = obj.nodeValue, i = 0, l = arr.length; i < l; i++) {
                                        isPunc = reg.test(arr.charCodeAt(i).toString());
                                        if(isPunc) {
                                            str += arr.charAt(i);
                                        }
                                        else {
                                            if(_$) { break; }
                                            str += arr.charAt(i);
                                            _$ = reg.test(arr.charCodeAt(i + 1).toString());
                                            if(!_$) { break; }
                                        }
                                    }
                                    elm.appendChild(_doc.createTextNode(str));
                                    elm.className = 'qFLetter quasiPseudo';
                                    (_$ = cText.match(/text\-shadow\s*:\s*((?:.+?)+?(?:\s*!\s*important)?);/i)) ? (arr = getShadowValue(_$[1]), arr.length > n ? (_$ = getPseudoShadowValue(arr, n, '::first-letter'), cText = cText.replace(/text\-shadow\s*:\s*(?:(?:.+?)+?(?:!\s*important)?);/i, ''), obj.parentNode && /qBefore/.test(obj.parentNode.className) && (_$ -= convUnitToPx(getCompStyle(obj.parentNode).left), _$.top -= convUnitToPx(getCompStyle(obj.parentNode).top)), elm.setAttribute('style', cascadeCText(cText + 'top:' + _$.top + 'px;left:' + _$.left + 'px;' + _$.color + _$.filt + 'position:relative;'))) : (cText += 'visibility:hidden !important;', elm.setAttribute('style', cascadeCText(cText)))) : elm.setAttribute('style', cascadeCText(cText));
                                    (obj.parentNode && /quasiPseudo/.test(obj.parentNode.className)) ? (qNode.appendChild(elm), qNode.appendChild(_doc.createTextNode(obj.nodeValue.replace(str, '')))) : (_$ = _doc.createElement('span'), _$.className = 'quasiPseudo', _$.setAttribute('style', '-ms-filter:none;display:inline;position:relative;'), _$.appendChild(elm), qNode.appendChild(_$), qNode.appendChild(_doc.createTextNode(obj.nodeValue.replace(str, ''))));
                                    return { qNode : qNode, isPunc : isPunc };
                                };
                                var _$, cType = cNode.nodeType;
                                if(cType === 1) {
                                    for(var dNode = cNode.firstChild; dNode; dNode = dNode.firstChild) {
                                        dNode.nodeType === 3 && (_$ = setFirstLetter(dNode), dNode.parentNode.replaceChild(_$.qNode, dNode));
                                    }
                                }
                                else if(cType === 3) {
                                    _$ = setFirstLetter(cNode);
                                    cNode = _doc.createDocumentFragment();
                                    cNode.appendChild(_$.qNode);
                                }
                                return { qNode : cNode, isPunc : (/float\s*:\s*(?:(?:lef|righ)t)/i.test(cText) ? false : _$.isPunc) };
                            };
                            var getFirstLineHeight = function(obj) {
                                var _$, elm = _doc.createElement('div'), fSize = convUnitToPx(getCompStyle(tElm, '::first-line').fontSize, tElm), cWidth = 0, fWidth = tElm.offsetWidth;
                                elm.id = 'dDiv' + _cNum();
                                elm.style.visibility = 'hidden';
                                elm.appendChild(obj);
                                _body.appendChild(elm);
                                for(var cNode = elm.firstChild; cNode; cNode = cNode.nextSibling) {
                                    var cType = cNode.nodeType;
                                    if(cType === 1 && cNode.hasChildNodes()) {
                                        if((cWidth += cNode.offsetWidth) <= fWidth && !/quasiPseudo/.test(cNode.className)) {
                                            (_$ = convUnitToPx(getCompStyle(cNode).fontSize, cNode)) > fSize && (fSize = _$);
                                            for(var dNode = _doc.createDocumentFragment(), arr = cNode.childNodes, i = 0, l = arr.length; i < l; i++) {
                                                dNode.appendChild(arr[i]);
                                            }
                                            (_$ = getFirstLineHeight(dNode)) > fSize && (fSize = _$);
                                        }
                                    }
                                    else if(cType === 1 && !cNode.hasChildNodes()) {
                                        (cWidth += cNode.offsetWidth) <= fWidth && (_$ = cNode.offsetHeight) > fSize && (fSize = _$);
                                        cNode.style.visibility = 'hidden;';
                                    }
                                    else if(cType === 3) {
                                        cWidth += (cNode.length * convUnitToPx(getCompStyle(elm).fontSize, elm));
                                    }
                                    if(cWidth >= fWidth) { break; }
                                }
                                _body.removeChild(elm);
                                return fSize;
                            };
                            for(var _$, cText = '', str, elm, arr, qNode, i = 0, l = dCss.length; i < l; i++) {
                                str = dCss[i].split('||')[0];
                                if(!dReg.test(str) && (_$ = str.match(/::?(before|after)/))) {
                                    var pseudo = _$[1], qCont;
                                    cText = setPseudoCssText(cascadeCText(dCss[i].split('||')[1].replace(/;$/, '') + ';' + (dPseudo ? dPseudo.pText : '')), '::' + pseudo);
                                    qCont = getContentValue(tElm, ((_$ = cText.match(/content\s*:\s*((?:.+?)+?(?:!\s*important)?);/i)) ? _$[1].replace(/^\s*/, '').replace(/\s*$/, '') : ''), '::' + pseudo);
                                    qCont && (cText = cText.replace(/content\s*:\s*(?:.+?)\s*(?:!\s*important)?;/i, ''), qNode = _doc.createElement('span'), qNode.className = pseudo === 'before' ? 'qBefore quasiPseudo' : (pseudo === 'after' && 'qAfter quasiPseudo'), elm = _doc.createElement('span'), (_$ = cText.match(/text\-shadow\s*:\s*((?:.+?)+?(?:\s*!\s*important)?);/i)) && (arr = getShadowValue(_$[1]), arr.length > dInt ? (_$ = getPseudoShadowValue(arr, dInt, '::' + pseudo), qNode.setAttribute('style', cascadeCText('position:relative;top:' + _$.top + 'px;left:' + _$.left + 'px;' + _$.color + _$.filt)), cText += '-ms-filter:none;display:inline;') : (cText += 'visibility:hidden !important;')), qNode.appendChild(qCont), cText = cText.replace(/text\-shadow\s*:\s*((.+?)+?(!\s*important)?);/i, ''), elm.className = 'quasiPseudo', elm.setAttribute('style', cascadeCText(cText + 'position:relative;')), elm.appendChild(qNode), pseudo === 'before' ? sNode.firstChild.className === 'quasiPseudo' ? sNode.replaceChild(elm, sNode.firstChild) : sNode.insertBefore(elm, sNode.firstChild) : (pseudo === 'after' && (sNode.lastChild.className === 'quasiPseudo' ? sNode.replaceChild(elm, sNode.lastChild) : sNode.appendChild(elm))));
                                }
                                if(!dReg.test(str) && /::?first\-letter/.test(str)) {
                                    cText = setPseudoCssText(cascadeCText(dCss[i].split('||')[1].replace(/;$/, '') + ';' + (dPseudo ? dPseudo.fLetter : '')), '::first-letter');
                                    qNode = _doc.createDocumentFragment();
                                    sNode.firstChild.nodeType === 1 ? (_$ = setQuasiFirstLetter(sNode.firstChild.cloneNode(true), cText, dInt), qNode.appendChild(_$.qNode), _$.isPunc ? (_$ = setQuasiFirstLetter(sNode.childNodes[1].cloneNode(true), cText, dInt), qNode.appendChild(_$.qNode), sNode.replaceChild(qNode, sNode.childNodes[1]), sNode.removeChild(sNode.firstChild)) : sNode.replaceChild(qNode, sNode.firstChild)) : (sNode.firstChild.nodeType === 3 && (_$ = setQuasiFirstLetter(sNode.firstChild.cloneNode(true), cText, dInt), qNode.appendChild(_$.qNode), sNode.replaceChild(qNode, sNode.firstChild)));
                                }
                            }
                            for(cText = '', i = 0, l = dCss.length; i < l; i++) {
                                str = dCss[i].split('||')[0];
                                if(!dReg.test(str) && /::?first\-line/.test(str)) {
                                    _$ = (convUnitToPx(getCompStyle(tElm, '::first-line').lineHeight, tElm) - convUnitToPx(getCompStyle(tElm, '::first-line').fontSize, tElm)) / 2;
                                    for(qNode = sNode.cloneNode(true), elm = _doc.createElement('span'), cNode = qNode.firstChild; cNode; cNode = cNode.nextSibling) {
                                        (cNode.nodeType === 1 && cNode.className === 'quasiPseudo') && (cNode.setAttribute('style', cascadeCText((cNode.getAttribute('style') ? cNode.getAttribute('style') : '') + 'visibility:hidden !important;')));
                                    }
                                    cText = setPseudoCssText(cascadeCText(dCss[i].split('||')[1].replace(/;$/, '') + ';' + (dPseudo ? dPseudo.fLine : '')), '::first-line');
                                    cText += 'height:' + (getFirstLineHeight(qNode.cloneNode(true)) + _$) + 'px;overflow-y:hidden;';
                                    (_$ = cText.match(/text\-shadow\s*:\s*((?:.+?)+?(?:\s*!\s*important)?);/i)) ? (arr = getShadowValue(_$[1]), arr.length > dInt ? (_$ = getPseudoShadowValue(arr, dInt), cText = cText.replace(/text\-shadow\s*:\s*(?:(?:.+?)+?(?:!\s*important)?);/i, ''), elm.setAttribute('style', cascadeCText(cText + 'top:' + _$.top + 'px;left:' + _$.left + 'px;' + _$.color + _$.filt + 'position:absolute;display:block;'))) : (cText += 'visibility:hidden !important;', cText = cText.replace(/text\-shadow\s*:\s*(?:(?:.+?)+?(?:!\s*important)?);/i, ''), elm.setAttribute('style', cascadeCText(cText + 'position:absolute;display:block;')))) : elm.setAttribute('style', cascadeCText(cText + 'position:absolute;display:block;'));
                                    elm.className = 'qFLine quasiPseudo';
                                    elm.appendChild(qNode);
                                    sNode.insertBefore(elm, sNode.firstChild);
                                }
                            }
                        };
                        for(cNode = tElm.firstChild; cNode; cNode = cNode.nextSibling) {
                            !(cNode.nodeType === 1 && cNode.nodeName.toLowerCase() === 'span' && /dummyShadow/.test(cNode.className)) && sNode.appendChild(cNode.cloneNode(true));
                        }
                        i = 0;
                        for(var pxRad, xPos, yPos, sColor, sBox, sStyle, l = tShadow.length; i < l; i++) {
                            pxRad = convUnitToPx(tShadow[i].z, tElm);
                            xPos = convUnitToPx(tShadow[i].x, tElm) - pxRad + convUnitToPx(getCompStyle(tElm).paddingLeft, tElm);
                            getCompStyle(tElm).textAlign === 'center' && (xPos -= ((convUnitToPx(getCompStyle(tElm).paddingLeft, tElm) + convUnitToPx(getCompStyle(tElm).paddingRight, tElm)) / 2));
                            getCompStyle(tElm).textAlign === 'right' && (xPos -= convUnitToPx(getCompStyle(tElm).paddingRight, tElm));
                            yPos = convUnitToPx(tShadow[i].y, tElm) - pxRad + convUnitToPx(getCompStyle(tElm).paddingTop, tElm);
                            sColor = tShadow[i].cProf || getCompStyle(tElm).color;
                            sBox = _doc.createElement('span');
                            sBox.className = (tObj.hasImp) ? 'dummyShadow hasImp' : 'dummyShadow';
                            sBox.setAttribute('aria-hidden', 'true');
                            sBox.setAttribute('role', 'presentation');
                            sStyle = sBox.style;
                            sStyle.display = 'block';
                            sStyle.position = 'absolute';
                            sStyle.left = xPos + 'px';
                            sStyle.top = yPos + 'px';
                            sStyle.width = '100%';
                            sStyle.color = sColor;
                            sStyle.filter = 'progid:DXImageTransform.Microsoft.Blur(PixelRadius=' + pxRad + ',MakeShadow=false,ShadowOpacity=1)';
                            sStyle.zIndex = -(i + 1);
                            getCompStyle(tElm).display === 'inline' && (tElm.style.display = 'inline-block');
                            getCompStyle(tElm).display === 'table-cell' && (getCompStyle(tElm).verticalAlign === 'middle' && tElm.clientHeight >= convUnitToPx(getCompStyle(tElm).height, tElm) && (sStyle.top = yPos + ((tElm.clientHeight - convUnitToPx(getCompStyle(tElm).height, tElm)) / 2) + 'px'), getCompStyle(tElm).verticalAlign === 'bottom' && (sStyle.top = '', sStyle.bottom = yPos + 'px'));
                            !(getCompStyle(tElm).position === 'absolute' || getCompStyle(tElm).position === 'fixed') && (tElm.style.position = 'relative');
                            (getCompStyle(tElm).backgroundColor !== 'transparent' || getCompStyle(tElm).backgroundImage !== 'none') && (getCompStyle(tElm).zIndex !== ('auto' || null) ? (sStyle.zIndex = tElm.style.zIndex) : (tElm.style.zIndex = sStyle.zIndex = -1));
                            aBg && aBg.tagName.toLowerCase() !== 'body' && (tElm.style.zIndex = 1, sStyle.zIndex = -1);
                            !eObj && tElm.getAttribute('data-dynpseudo') && tElm.setAttribute('data-dynpseudo', encodeURIComponent(decodeURIComponent(tElm.getAttribute('data-dynpseudo')).replace(/(\|;\|default.+)$/, '') + '|;|default||' + convUnitToPx(tShadow[i].x, tElm, '') + 'px ' + convUnitToPx(tShadow[i].y, tElm, '') + 'px ' + pxRad + 'px ' + sColor + ';'));
                            if(tElm.getAttribute('data-pseudo')) {
                                var dCss;
                                _$ = decodeURIComponent(tElm.getAttribute('data-pseudo'));
                                dCss = /\|;\|/.test(_$) ? _$.split('|;|') : [_$];
                                if(eObj) {
                                    var evt = this.event, eType = evt.type, x = evt.clientX, y = evt.clientY, cRect = tElm.getBoundingClientRect(), isHover = (cRect.left <= x && cRect.right >= x && cRect.top <= y && cRect.bottom >= y), isActive = tElm === _doc.activeElement;
                                    switch(eType) {
                                        case 'mouseover' :
                                            _$ = isActive ? getDynCSS(['focus_hover', 'hover'], dCss) : getDynCSS(['hover'], dCss);
                                            break;
                                        case 'mouseout' :
                                            _$ = isActive ? getDynCSS(['focus'], dCss) : '';
                                            break;
                                        case 'mousedown' :
                                            _$ = isActive ? getDynCSS(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus'], dCss) : getDynCSS(['active_hover', 'active', 'hover'], dCss);
                                            break;
                                        case 'mouseup' :
                                            _$ = isHover ? getDynCSS(['focus_hover', 'hover', 'focus'], dCss) : getDynCSS(['focus'], dCss);
                                            break;
                                        case 'keydown' :
                                            _$ = isHover ? getDynCSS(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus'], dCss) : getDynCSS(['active_focus', 'active', 'focus'], dCss);
                                            break;
                                        case 'keyup' :
                                            _$ = isHover ? getDynCSS(['focus_hover', 'hover', 'focus'], dCss) : getDynCSS(['focus'], dCss);
                                            break;
                                        case 'focus' :
                                            _$ = isHover ? getDynCSS(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus'], dCss) : getDynCSS(['focus'], dCss);
                                            break;
                                        case 'blur' :
                                            _$ = '';
                                            break;
                                    }
                                    setPseudoCSS(dCss, i, _$);
                                }
                                else {
                                    setPseudoCSS(dCss, i);
                                }
                            }
                            sBox.appendChild(sNode.cloneNode(true));
                            tElm.appendChild(sBox);
                            setShadowNodeColor(sBox);
                        }
                    }
                }
            }
        };
        var getTargetObj = function(obj) {
            var arr = _doc.querySelectorAll(obj.sel);
            if(arr.length > 0) {
                for(var i = 0, l = arr.length; i < l; i++) {
                    obj.elm = arr[i];
                    setShadow(obj);
                }
            }
        };
        var getShadowValue = function(shadow) {
            if(/none/.test(shadow)) {
                return 'none';
            }
            else {
                for(var _$, aArr = [], arr = shadow.match(/(?:(?:(?:rgb|hsl)a?\(\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*(?:,\s*(?:0?\.[0-9]+|1(?:\.0+)?)\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)\s)?(?:\-?[0-9]+(?:\.[0-9]+)?(?:v(?:[hw]|m(?:ax|in)?)|(?:re|m)m|p[ctx]|c[hm]|e[mx]|in)?\s*){2,3}(?:(?:rgb|hsl)a?\(\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*(?:,\s*(?:0?\.[0-9]+|1(?:\.0+)?)\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)?/g), i = 0, l = arr.length; i < l; i++) {
                    aArr[i] = { x : '0', y : '0', z : '0', cProf : null };
                    if(_$ = arr[i].match(/(\-?[0-9]+(?:\.[0-9]+)?(?:v(?:[hw]|m(?:ax|in)?)|(?:re|m)m|p[ctx]|c[hm]|e[mx]|in)?)\s+(\-?[0-9]+(?:\.[0-9]+)?(?:v(?:[hw]|m(?:ax|in)?)|(?:re|m)m|p[ctx]|c[hm]|e[mx]|in)?)(?:\s+([0-9]+(?:\.[0-9]+)?(?:v(?:[hw]|m(?:ax|in)?)|(?:re|m)m|p[ctx]|c[hm]|e[mx]|in)?))?/)) {
                        aArr[i].x = _$[1];
                        aArr[i].y = _$[2];
                        _$[3] && (aArr[i].z = _$[3]);
                        aArr[i].cProf = (_$ = arr[i].match(/^((?:rgb|hsl)a?\(\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*(?:,\s*(?:0?\.[0-9]+|1(?:\.0+)?)\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/)) ? _$[1] :
                        (_$ = arr[i].match(/\s((?:rgb|hsl)a?\(\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*,\s*[0-9\.]+%?\s*(?:,\s*(?:0?\.[0-9]+|1(?:\.0+)?)\s*)?\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)$/)) && _$[1];
                    }
                    else {
                        aArr = 'invalid'; break;
                    }
                }
                return aArr;
            }
        };
        var pseudoElmShadow = function(obj, reg, arr) {
            for(var i = arr.length - 1, l = 0; i >= l; i--) {
                for(var _$ = arr[i].sel.split(','), j = 0, k = _$.length; j < k; j++) {
                    _$[j].replace(/^\s*/, '').replace(/\s*$/, '') === obj.replace(reg, '') && /none/.test(arr[i].shadow) && (arr[arr.length] = { sel : obj.replace(reg, ''), shadow : '0 0 transparent' });
                }
            }
        };
        var setDataAttr = function(obj, dataAttr, reg) {
            var setEvtListener = function(obj, t) {
                obj.addEventListener(t, toggleDPseudoClassShadow, false);
            };
            for(var arr = obj.sel.split(','), i = 0, l = arr.length; i < l; i++) {
                arr[i] = arr[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if(reg.test(arr[i])) {
                    for(var qArr = _doc.querySelectorAll(arr[i].replace(pReg, '').replace(dReg, '')), j = 0, k = qArr.length; j < k; j++) {
                        var _$ = qArr[j].getAttribute(dataAttr) ? decodeURIComponent(qArr[j].getAttribute(dataAttr)) : '';
                        _$ !== '' && (_$ = _$.replace(/(\|;\|default.+)$/, ''));
                        _$ = _$ !== '' ? _$ + '|;|' + arr[i] + '||' + obj.cText : arr[i] + '||' + obj.cText;
                        /:(?:focus|hover|active)/.test(_$) && (qArr[j].id === '' && (qArr[j].id = 'dId' + _cNum()), _$ += ('|;|default||0 0 transparent;'), /:focus/.test(_$) && (setEvtListener(qArr[j], 'focus'), setEvtListener(qArr[j], 'blur')), /:hover/.test(_$) && (setEvtListener(qArr[j], 'mouseover'), setEvtListener(qArr[j], 'mouseout')), /:active/.test(_$) && (setEvtListener(qArr[j], 'mousedown'), setEvtListener(qArr[j], 'mouseup'), setEvtListener(qArr[j], 'keydown'), setEvtListener(qArr[j], 'keyup')));
                        qArr[j].setAttribute(dataAttr, encodeURIComponent(_$));
                    }
                }
            }
        };
        var cascadeSel = function(arr) {
            for(var _$, aArr = [], i = 0, l = arr.length; i < l; i++) {
                _$ = true;
                for(var j = i; j < l; j++) {
                    i !== j && arr[i].sel === arr[j].sel && !/important/.test(arr[i].shadow) && (_$ = false);
                }
                _$ && (aArr[aArr.length] = arr[i]);
            }
            return aArr;
        };
        var cascadeCText = function(str) {
            for(var _$, arr = [], aArr = (str !== '' ? str.replace(/;$/, '').split(';') : []), i = 0, l = aArr.length; i < l; i++) {
                _$ = true;
                for(var j = i; j < l; j++) {
                    var i0 = aArr[i].split(':')[0].replace(/^\s+/, '').replace(/\s+$/, ''),
                        i1 = aArr[i].split(':')[1],
                        j0 = aArr[j].split(':')[0].replace(/^\s+/, '').replace(/\s+$/, ''),
                        j1 = aArr[j].split(':')[1];
                    i !== j && i0 === j0 && (/important/.test(i1) || !(/important/.test(i1) && /important/.test(j1))) && (_$ = false);
                }
                _$ && (arr[arr.length] = aArr[i]);
            }
            return (arr.length > 0 ? (arr.join(';') + ';') : '');
        };
        var _$,
            _head = _doc.querySelector('head'), _body = _doc.querySelector('body'),
            _cNum = (function(n) { return function() { return n++; };})(0),
            pArr = [], pReg = /::?(?:before|after|first\-l(?:etter|ine))/,
            dArr = [], dReg = /(?:\:(?:focus|hover|active))+/,
            arr = cascadeSel(ieShadowSettings()), qArr, sSel, sReg, i, l, j, k;
        for(i = 0, l = pArr.length; i < l; i++) {
            setDataAttr(pArr[i], 'data-pseudo', pReg);
            for(qArr = pArr[i].sel.split(','), j = 0, k = qArr.length; j < k; j++) {
                pReg.test(qArr[j]) && pseudoElmShadow(qArr[j].replace(/^\s*/, '').replace(/\s*$/, ''), pReg, arr);
            }
        }
        for(i = 0, l = dArr.length; i < l; i++) {
            setDataAttr(dArr[i], 'data-dynpseudo', dReg);
            for(qArr = dArr[i].sel.split(','), j = 0, k = qArr.length; j < k; j++) {
                dReg.test(qArr[j]) && pseudoElmShadow(qArr[j].replace(/^\s*/, '').replace(/\s*$/, ''), dReg, arr);
            }
        }
        arr = cascadeSel(arr);
        for(i = 0, l = arr.length; i < l; i++) {
            for(sSel = arr[i].sel.split(/,/), sReg = /^\s*([a-zA-Z0-9#\.:_\-\s>\+~]+)\s*$/, j = 0, k = sSel.length; j < k; j++) {
                (_$ = sSel[j].match(sReg)) && (sSel[j] = _$[1]);
                getTargetObj({ sel : sSel[j], shadow : getShadowValue(arr[i].shadow), hasImp : /\s*\!\s*important/.test(arr[i].shadow) });
            }
        }
    }
}
function toggleDPseudoClassShadow(evt) {
    'use strict';
    var _doc = document;
    if(_doc.documentMode === 9 ) {
        var checkPseudo = function(p) {
            if(obj.getAttribute('data-pseudo')) {
                for(var bool = false, attr = decodeURIComponent(obj.getAttribute('data-pseudo')).split('|;|'), i = 0, l = attr.length; i < l; i++) {
                    for(var _$, arr = /_/.test(p) ? p.split('_') : [p], j = 0, k = arr.length; j < k; j++) {
                        arr[j] === 'default' ? !/default/.test(attr[i]) && !/:(?:focus|hover|active)/.test(attr[i]) && (bool = true) : (_$ = new RegExp(':' + arr[j]), _$.test(attr[i])) && (bool = true);
                        if(bool) { break; }
                    }
                    if(bool) { break; }
                }
                return bool;
            }
            else {
                return true;
            }
        };
        var toggleShadow = function(p, arr) {
            for(var _$ = false, i = 0, l = p.length; i < l; i++) {
                for(var j = 0, k = arr.length; j < k; j++) {
                    if(p[i] === arr[j].sel && checkPseudo(p[i])) {
                        textShadowForIE9({sel : '#' + obj.id, shadow : arr[j].shadow.replace(/none/, '0 0 transparent')});
                        _$ = true;
                        break;
                    }
                }
                if(_$) { break; }
            }
        };
        for(var _$, obj = evt.target, eType = evt.type, x = evt.clientX, y = evt.clientY, cRect = obj.getBoundingClientRect(), isHover = (cRect.left <= x && cRect.right >= x && cRect.top <= y && cRect.bottom >= y), isActive = (obj === _doc.activeElement), hasImp = false, dCss = [], dAttr = decodeURIComponent(obj.getAttribute('data-dynpseudo')).split('|;|'), i = 0, l = dAttr.length; i < l; i++) {
            (_$ = dAttr[i].split('||')[0].match(/((?:(?:\:(focus|hover|active))+)|default)/)) && (_$ = _$[1], dCss[dCss.length] = { sel : _$.replace(/^:/, '').split(':').sort().join('_'), shadow : dAttr[i].split('||')[1].replace(/none/, '0 0 transparent') }, _$ === 'default' && (hasImp = /important/.test(dAttr[i])));
        }
        if(!hasImp) {
            switch(eType) {
                case 'mouseover' :
                    isActive ? toggleShadow(['focus_hover', 'hover'], dCss) : toggleShadow(['hover'], dCss);
                    break;
                case 'mouseout' :
                    isActive ? toggleShadow(['focus', 'default'], dCss) : toggleShadow(['default'], dCss);
                    break;
                case 'mousedown' :
                    isActive ? toggleShadow(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus'], dCss) : toggleShadow(['active_hover', 'active', 'hover'], dCss);
                    break;
                case 'mouseup' :
                    isHover ? toggleShadow(['focus_hover', 'hover', 'focus'], dCss) : toggleShadow(['focus'], dCss);
                    break;
                case 'keydown' :
                    isHover ? toggleShadow(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus'], dCss) : toggleShadow(['active_focus', 'active', 'focus'], dCss);
                    break;
                case 'keyup' :
                    isHover ? toggleShadow(['focus_hover', 'hover', 'focus'], dCss) : toggleShadow(['focus'], dCss);
                    break;
                case 'focus' :
                    isHover ? toggleShadow(['active_focus_hover', 'active_hover', 'active_focus', 'active', 'focus_hover', 'hover', 'focus'], dCss) : toggleShadow(['focus'], dCss);
                    break;
                case 'blur' :
                    toggleShadow(['default'], dCss);
                    break;
            }
        }
    }
}
(function(_win, _doc) {
    'use strict';
    if(_doc.documentMode === 9) {
        var removeTextShadowForIE9 = function() {
            for(var _$, arr = _doc.querySelectorAll('.dummyShadow'), i = 0, l = arr.length; i < l; i++) {
                if(arr[i]) {
                    _$ = arr[i].parentNode;
                    _$.removeChild(arr[i]);
                    _$.removeAttribute('data-pseudo');
                    _$.removeAttribute('data-dynpseudo');
                    for(var eArr = ['mouseover', 'mouseout', 'mousedown', 'mouseup', 'keydown', 'keyup', 'focus', 'blur'], j = 0, k = eArr.length; j < k; j++) {
                        _$.removeEventListener(eArr[j], toggleDPseudoClassShadow, false);
                    }
                }
            }
            _doc.documentElement.removeEventListener('beforecopy', removeShadowBeforeCopy, true);
            _doc.documentElement.removeEventListener('copy', resetShadowAfterCopy, true);
            _win.alert((_$ = _doc.documentElement.getAttribute('lang')) && /^ja(?:\-JP)?$/.test(_$) ? '\u8a2d\u5b9a\u5b8c\u4e86' : 'Done');
            _$ = _doc.getElementById('textShadowConfirmation');
            _$ && _$.parentNode.removeChild(_$);
        };
        var checkTextShadowConfirmation = function() {
            var _$ = _doc.getElementById('textShadowCheck');
            _$ && (_$.checked ? (setCookie('removeShadow', _$.value), (_$ = getCookie('removeShadow')) ? _$ === '1' && removeTextShadowForIE9() : _win.alert((_$ = _doc.documentElement.getAttribute('lang')) && /^ja(?:\-JP)?$/.test(_$) ? 'Cookie\u3092\u6709\u52b9\u306b\u3057\u3066\u304b\u3089\u518d\u8a2d\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044' : 'Please enable Cookie')) : removeCookie('removeShadow'));
        };
        var removeCookie = function(k) {
            if(!k) { return; }
            _doc.cookie = encodeURIComponent(k) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        };
        var setCookie = function(k, v) {
            if(!k || /^(?:expires|max\-age|path|domain|secure)$/i.test(k)) { return; }
            _doc.cookie = encodeURIComponent(k) + '=' + encodeURIComponent(v);
        };
        var getCookie = function(k) {
            var hasKey = function(k, c) {
                return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(k).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(c);
            };
            var _$ = _doc.cookie;
            if(!k || !_$ || _$ && !hasKey(k, _$)) { return; }
            return decodeURIComponent(_$.replace(new RegExp('(?:^|.*;\\s*)' + encodeURIComponent(k).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
        };
        var removeShadowBeforeCopy = function() {
            for(var _$ = _doc.querySelectorAll('.dummyShadow'), i = 0, l = _$.length; i < l; i++) {
                _$[i] && _$[i].parentNode.removeChild(_$[i]);
            }
            _$ = _doc.getElementById('textShadowConfirmation');
            _$ && _$.parentNode.removeChild(_$);
        };
        var setShadowQAtCopy = function(evt) {
            evt.preventDefault();
            _Q = _doc.selection.createRange().text;
            _win.clipboardData.setData('text', _Q);
            !getCookie('removeShadow') && forScreenReaders();
        };
        var resetShadowAfterCopy = function() {
            _Q !== '' && (_Q = '', textShadowForIE9());
        };
        var forScreenReaders = function() {
            var _$ = _doc.documentElement.getAttribute('lang'),
                _body = _doc.querySelector('body'),
                aDiv = _doc.createElement('div'),
                aForm = _doc.createElement('form'),
                aField = _doc.createElement('fieldset'),
                aLegend = _doc.createElement('legend'),
                aP1 = _doc.createElement('p'),
                aP2 = _doc.createElement('p'),
                aP3 = _doc.createElement('p'),
                aLabel = _doc.createElement('label'),
                aCheck = _doc.createElement('input'),
                aSubmit = _doc.createElement('input');
            _$ = _$ && /^ja(?:\-JP)?$/.test(_$) ? true : false;
            aDiv.id = 'textShadowConfirmation';
            aDiv.setAttribute('style', 'position:absolute;left:-9999px;');
            aDiv.setAttribute('aria-hidden', 'true');
            aDiv.setAttribute('role', 'presentation');
            aForm.id = 'textShadowConfirmForm';
            aLabel.setAttribute('for', 'textShadowCheck');
            aCheck.id = 'textShadowCheck';
            aCheck.setAttribute('type', 'checkbox');
            aCheck.setAttribute('value', '1');
            aCheck.setAttribute('role', 'checkbox');
            aSubmit.setAttribute('type', 'submit');
            aSubmit.setAttribute('role', 'button');
            aLegend.appendChild(_doc.createTextNode(_$ ? '\u30b9\u30af\u30ea\u30fc\u30f3\u30ea\u30fc\u30c0\u30fc\u5229\u7528\u8005\u3078\u306e\u304a\u77e5\u3089\u305b' : 'Notification to Screen Reader users'));
            aP1.appendChild(_doc.createTextNode(_$ ? '\u3053\u306e\u30b5\u30a4\u30c8\u306b\u306f\u3001Internet\u0020Explorer\u00209\u306bCSS3\u306etext\u002dshadow\u7684\u306a\u88c5\u98fe\u52b9\u679c\u3092\u4e0e\u3048\u308bJavaScript\u300ctext\u002dshadow\u0020for\u0020IE9\u300d\u304c\u9069\u7528\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u000a\u3053\u306e\u305f\u3081\u3001\u4e00\u90e8\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30ea\u30fc\u30c0\u30fc\u3067\u306f\u3001text\u002dshadow\u306e\u88c5\u98fe\u52b9\u679c\u304c\u9069\u7528\u3055\u308c\u305f\u90e8\u5206\u306e\u8a9e\u53e5\u304c\u7e70\u308a\u8fd4\u3057\u8aad\u307f\u4e0a\u3052\u3089\u308c\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\u000a\u3053\u306e\u6319\u52d5\u3092\u4fee\u6b63\u3059\u308b\u306b\u306f\u3001\u6b21\u306e\u8a2d\u5b9a\u3092\u884c\u3063\u3066\u4e0b\u3055\u3044\u3002' : 'This site contains a JavaScript polyfill which applies CSS3 text-shadow effect to Internet Explorer 9. Due to this, some screen readers will repeat phrases where text-shadow effect is applied. To change this behavior, set the following.'));
            aLabel.appendChild(aCheck);
            aLabel.appendChild(_doc.createTextNode(_$ ? '\u300ctext\u002dshadow\u0020for\u0020IE9\u300d\u3092\u7121\u52b9\u306b\u3059\u308b' : 'Remove text-shadow for IE9 polyfill'));
            aP2.appendChild(aLabel);
            aSubmit.setAttribute('value', _$ ? '\u5b9f\u884c' : 'Submit');
            aP3.appendChild(aSubmit);
            aField.appendChild(aLegend);
            aField.appendChild(aP1);
            aField.appendChild(aP2);
            aField.appendChild(aP3);
            aForm.appendChild(aField);
            aDiv.appendChild(aForm);
            _body.insertBefore(aDiv, _body.firstChild);
            aForm.addEventListener('submit', function(evt) {
                evt.preventDefault();
                checkTextShadowConfirmation();
            }, false);
        };
        var _Q = '';
        _doc.addEventListener('DOMContentLoaded', function() {
            if(_doc.documentElement.filters) {
                var _$, _body = _doc.querySelector('body'), elm = _doc.createElement('div');
                elm.setAttribute('style', 'width:0;height:0;visibility:hidden;-ms-filter:"progid:DXImageTransform.Microsoft.Blur()"');
                _body.appendChild(elm);
                _$ = elm.filters.item('DXImageTransform.Microsoft.Blur').Enabled;
                _body.removeChild(elm);
                _$ && !getCookie('removeShadow') && (elm = _doc.createElement('style'), _doc.querySelector('head').appendChild(elm), elm.sheet.insertRule('@media print{.dummyShadow{display:none;}}', elm.sheet.cssRules.length), _doc.documentElement.addEventListener('beforecopy', removeShadowBeforeCopy, true), _doc.documentElement.addEventListener('copy', setShadowQAtCopy, true), _doc.documentElement.addEventListener('blur', resetShadowAfterCopy, true), forScreenReaders(), textShadowForIE9());
            }
        }, false);
    }
})(window, document);
