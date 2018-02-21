/*
2  * Cookies.js - 1.2.4-pre
3  * https://github.com/ScottHamper/Cookies
4  *
5  * This is free and unencumbered software released into the public domain.
6  */
7 (function (global, undefined) {
8     'use strict';
9

10     var factory = function (window) {
11         if (typeof window.document !== 'object') {
12             throw new Error('Cookies.js requires a `window` with a `document` object');
13         }
14

15         var Cookies = function (key, value, options) {
16             return arguments.length === 1 ?
17                 Cookies.get(key) : Cookies.set(key, value, options);
18         };
19

20         // Allows for setter injection in unit tests
21         Cookies._document = window.document;
22

23         // Used to ensure cookie keys do not collide with
24         // built-in `Object` properties
25         Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
26
27         Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');
28

29         Cookies.defaults = {
30             path: '/',
31             secure: false
32         };
33

34         Cookies.get = function (key) {
35             if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
36                 Cookies._renewCache();
37             }
38
39             var value = Cookies._cache[Cookies._cacheKeyPrefix + key];
40

41             return value === undefined ? undefined : decodeURIComponent(value);
42         };
43

44         Cookies.set = function (key, value, options) {
45             options = Cookies._getExtendedOptions(options);
46             options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);
47

48             Cookies._document.cookie = Cookies._generateCookieString(key, value, options);
49

50             return Cookies;
51         };
52

53         Cookies.expire = function (key, options) {
54             return Cookies.set(key, undefined, options);
55         };
56

57         Cookies._getExtendedOptions = function (options) {
58             return {
59                 path: options && options.path || Cookies.defaults.path,
60                 domain: options && options.domain || Cookies.defaults.domain,
61                 expires: options && options.expires || Cookies.defaults.expires,
62                 secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
63             };
64         };
65

66         Cookies._isValidDate = function (date) {
67             return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
68         };
69

70         Cookies._getExpiresDate = function (expires, now) {
71             now = now || new Date();
72

73             if (typeof expires === 'number') {
74                 expires = expires === Infinity ?
75                     Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
76             } else if (typeof expires === 'string') {
77                 expires = new Date(expires);
78             }
79

80             if (expires && !Cookies._isValidDate(expires)) {
81                 throw new Error('`expires` parameter cannot be converted to a valid Date instance');
82             }
83

84             return expires;
85         };
86

87         Cookies._generateCookieString = function (key, value, options) {
88             key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
89             key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
90             value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
91             options = options || {};
92

93             var cookieString = key + '=' + value;
94             cookieString += options.path ? ';path=' + options.path : '';
95             cookieString += options.domain ? ';domain=' + options.domain : '';
96             cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
97             cookieString += options.secure ? ';secure' : '';
98

99             return cookieString;
100         };
101

102         Cookies._getCacheFromString = function (documentCookie) {
103             var cookieCache = {};
104             var cookiesArray = documentCookie ? documentCookie.split('; ') : [];
105

106             for (var i = 0; i < cookiesArray.length; i++) {
107                 var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);
108

109                 if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
110                     cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
111                 }
112             }
113

114             return cookieCache;
115         };
116

117         Cookies._getKeyValuePairFromCookieString = function (cookieString) {
118             // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
119             var separatorIndex = cookieString.indexOf('=');
120

121             // IE omits the "=" when the cookie value is an empty string
122             separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;
123

124             var key = cookieString.substr(0, separatorIndex);
125             var decodedKey;
126             try {
127                 decodedKey = decodeURIComponent(key);
128             } catch (e) {
129                 if (console && typeof console.error === 'function') {
130                     console.error('Could not decode cookie with key "' + key + '"', e);
131                 }
132             }
133
134             return {
135                 key: decodedKey,
136                 value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
137             };
138         };
139

140         Cookies._renewCache = function () {
141             Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
142             Cookies._cachedDocumentCookie = Cookies._document.cookie;
143         };
144

145         Cookies._areEnabled = function () {
146             var testKey = 'cookies.js';
147             var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
148             Cookies.expire(testKey);
149             return areEnabled;
150         };
151

152         Cookies.enabled = Cookies._areEnabled();
153

154         return Cookies;
155     };
156     var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;
157

158     // AMD support
159     if (typeof define === 'function' && define.amd) {
160         define(function () { return cookiesExport; });
161     // CommonJS/Node.js support
162     } else if (typeof exports === 'object') {
163         // Support Node.js specific `module.exports` (which can be a function)
164         if (typeof module === 'object' && typeof module.exports === 'object') {
165             exports = module.exports = cookiesExport;
166         }
167         // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
168         exports.Cookies = cookiesExport;
169     } else {
170         global.Cookies = cookiesExport;
171     }
172 })(typeof window === 'undefined' ? this : window);
