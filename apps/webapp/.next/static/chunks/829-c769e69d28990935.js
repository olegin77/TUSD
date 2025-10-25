"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [829],
  {
    357: (e, t, r) => {
      r.d(t, { DX: () => a, TL: () => s });
      var o = r(4361),
        n = r(7551),
        i = r(2541);
      function s(e) {
        let t = (function (e) {
            let t = o.forwardRef((e, t) => {
              let { children: r, ...i } = e;
              if (o.isValidElement(r)) {
                var s;
                let e,
                  a,
                  l =
                    ((s = r),
                    (a =
                      (e = Object.getOwnPropertyDescriptor(s.props, "ref")?.get) &&
                      "isReactWarning" in e &&
                      e.isReactWarning)
                      ? s.ref
                      : (a =
                            (e = Object.getOwnPropertyDescriptor(s, "ref")?.get) &&
                            "isReactWarning" in e &&
                            e.isReactWarning)
                        ? s.props.ref
                        : s.props.ref || s.ref),
                  c = (function (e, t) {
                    let r = { ...t };
                    for (let o in t) {
                      let n = e[o],
                        i = t[o];
                      /^on[A-Z]/.test(o)
                        ? n && i
                          ? (r[o] = (...e) => {
                              let t = i(...e);
                              return (n(...e), t);
                            })
                          : n && (r[o] = n)
                        : "style" === o
                          ? (r[o] = { ...n, ...i })
                          : "className" === o && (r[o] = [n, i].filter(Boolean).join(" "));
                    }
                    return { ...e, ...r };
                  })(i, r.props);
                return (
                  r.type !== o.Fragment && (c.ref = t ? (0, n.t)(t, l) : l),
                  o.cloneElement(r, c)
                );
              }
              return o.Children.count(r) > 1 ? o.Children.only(null) : null;
            });
            return ((t.displayName = `${e}.SlotClone`), t);
          })(e),
          r = o.forwardRef((e, r) => {
            let { children: n, ...s } = e,
              a = o.Children.toArray(n),
              l = a.find(c);
            if (l) {
              let e = l.props.children,
                n = a.map((t) =>
                  t !== l
                    ? t
                    : o.Children.count(e) > 1
                      ? o.Children.only(null)
                      : o.isValidElement(e)
                        ? e.props.children
                        : null
                );
              return (0, i.jsx)(t, {
                ...s,
                ref: r,
                children: o.isValidElement(e) ? o.cloneElement(e, void 0, n) : null,
              });
            }
            return (0, i.jsx)(t, { ...s, ref: r, children: n });
          });
        return ((r.displayName = `${e}.Slot`), r);
      }
      var a = s("Slot"),
        l = Symbol("radix.slottable");
      function c(e) {
        return (
          o.isValidElement(e) &&
          "function" == typeof e.type &&
          "__radixId" in e.type &&
          e.type.__radixId === l
        );
      }
    },
    1323: (e, t, r) => {
      r.d(t, { A: () => a });
      var o = r(4361);
      let n = function () {
        for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        return t.filter((e, t, r) => !!e && r.indexOf(e) === t).join(" ");
      };
      var i = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
      let s = (0, o.forwardRef)((e, t) => {
          let {
            color: r = "currentColor",
            size: s = 24,
            strokeWidth: a = 2,
            absoluteStrokeWidth: l,
            className: c = "",
            children: d,
            iconNode: u,
            ...p
          } = e;
          return (0, o.createElement)(
            "svg",
            {
              ref: t,
              ...i,
              width: s,
              height: s,
              stroke: r,
              strokeWidth: l ? (24 * Number(a)) / Number(s) : a,
              className: n("lucide", c),
              ...p,
            },
            [
              ...u.map((e) => {
                let [t, r] = e;
                return (0, o.createElement)(t, r);
              }),
              ...(Array.isArray(d) ? d : [d]),
            ]
          );
        }),
        a = (e, t) => {
          let r = (0, o.forwardRef)((r, i) => {
            let { className: a, ...l } = r;
            return (0, o.createElement)(s, {
              ref: i,
              iconNode: t,
              className: n(
                "lucide-".concat(e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()),
                a
              ),
              ...l,
            });
          });
          return ((r.displayName = "".concat(e)), r);
        };
    },
    2307: (e, t, r) => {
      r.d(t, { QP: () => L });
      let o = (e, t) => {
          if (0 === e.length) return t.classGroupId;
          let r = e[0],
            n = t.nextPart.get(r),
            i = n ? o(e.slice(1), n) : void 0;
          if (i) return i;
          if (0 === t.validators.length) return;
          let s = e.join("-");
          return t.validators.find(({ validator: e }) => e(s))?.classGroupId;
        },
        n = /^\[(.+)\]$/,
        i = (e, t, r, o) => {
          e.forEach((e) => {
            if ("string" == typeof e) {
              ("" === e ? t : s(t, e)).classGroupId = r;
              return;
            }
            if ("function" == typeof e)
              return a(e)
                ? void i(e(o), t, r, o)
                : void t.validators.push({ validator: e, classGroupId: r });
            Object.entries(e).forEach(([e, n]) => {
              i(n, s(t, e), r, o);
            });
          });
        },
        s = (e, t) => {
          let r = e;
          return (
            t.split("-").forEach((e) => {
              (r.nextPart.has(e) || r.nextPart.set(e, { nextPart: new Map(), validators: [] }),
                (r = r.nextPart.get(e)));
            }),
            r
          );
        },
        a = (e) => e.isThemeGetter,
        l = (e, t) =>
          t
            ? e.map(([e, r]) => [
                e,
                r.map((e) =>
                  "string" == typeof e
                    ? t + e
                    : "object" == typeof e
                      ? Object.fromEntries(Object.entries(e).map(([e, r]) => [t + e, r]))
                      : e
                ),
              ])
            : e,
        c = (e) => {
          if (e.length <= 1) return e;
          let t = [],
            r = [];
          return (
            e.forEach((e) => {
              "[" === e[0] ? (t.push(...r.sort(), e), (r = [])) : r.push(e);
            }),
            t.push(...r.sort()),
            t
          );
        },
        d = /\s+/;
      function u() {
        let e,
          t,
          r = 0,
          o = "";
        for (; r < arguments.length; )
          (e = arguments[r++]) && (t = p(e)) && (o && (o += " "), (o += t));
        return o;
      }
      let p = (e) => {
          let t;
          if ("string" == typeof e) return e;
          let r = "";
          for (let o = 0; o < e.length; o++) e[o] && (t = p(e[o])) && (r && (r += " "), (r += t));
          return r;
        },
        h = (e) => {
          let t = (t) => t[e] || [];
          return ((t.isThemeGetter = !0), t);
        },
        f = /^\[(?:([a-z-]+):)?(.+)\]$/i,
        b = /^\d+\/\d+$/,
        m = new Set(["px", "full", "screen"]),
        y = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
        g =
          /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
        v = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
        w = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
        x =
          /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
        k = (e) => j(e) || m.has(e) || b.test(e),
        S = (e) => U(e, "length", G),
        j = (e) => !!e && !Number.isNaN(Number(e)),
        C = (e) => U(e, "number", j),
        O = (e) => !!e && Number.isInteger(Number(e)),
        z = (e) => e.endsWith("%") && j(e.slice(0, -1)),
        E = (e) => f.test(e),
        F = (e) => y.test(e),
        T = new Set(["length", "size", "percentage"]),
        P = (e) => U(e, T, M),
        A = (e) => U(e, "position", M),
        R = new Set(["image", "url"]),
        q = (e) => U(e, R, D),
        I = (e) => U(e, "", $),
        N = () => !0,
        U = (e, t, r) => {
          let o = f.exec(e);
          return !!o && (o[1] ? ("string" == typeof t ? o[1] === t : t.has(o[1])) : r(o[2]));
        },
        G = (e) => g.test(e) && !v.test(e),
        M = () => !1,
        $ = (e) => w.test(e),
        D = (e) => x.test(e);
      Symbol.toStringTag;
      let L = (function (e, ...t) {
        let r,
          s,
          a,
          p = function (c) {
            let d;
            return (
              (s = (r = {
                cache: ((e) => {
                  if (e < 1) return { get: () => void 0, set: () => {} };
                  let t = 0,
                    r = new Map(),
                    o = new Map(),
                    n = (n, i) => {
                      (r.set(n, i), ++t > e && ((t = 0), (o = r), (r = new Map())));
                    };
                  return {
                    get(e) {
                      let t = r.get(e);
                      return void 0 !== t ? t : void 0 !== (t = o.get(e)) ? (n(e, t), t) : void 0;
                    },
                    set(e, t) {
                      r.has(e) ? r.set(e, t) : n(e, t);
                    },
                  };
                })((d = t.reduce((e, t) => t(e), e())).cacheSize),
                parseClassName: ((e) => {
                  let { separator: t, experimentalParseClassName: r } = e,
                    o = 1 === t.length,
                    n = t[0],
                    i = t.length,
                    s = (e) => {
                      let r,
                        s = [],
                        a = 0,
                        l = 0;
                      for (let c = 0; c < e.length; c++) {
                        let d = e[c];
                        if (0 === a) {
                          if (d === n && (o || e.slice(c, c + i) === t)) {
                            (s.push(e.slice(l, c)), (l = c + i));
                            continue;
                          }
                          if ("/" === d) {
                            r = c;
                            continue;
                          }
                        }
                        "[" === d ? a++ : "]" === d && a--;
                      }
                      let c = 0 === s.length ? e : e.substring(l),
                        d = c.startsWith("!"),
                        u = d ? c.substring(1) : c;
                      return {
                        modifiers: s,
                        hasImportantModifier: d,
                        baseClassName: u,
                        maybePostfixModifierPosition: r && r > l ? r - l : void 0,
                      };
                    };
                  return r ? (e) => r({ className: e, parseClassName: s }) : s;
                })(d),
                ...((e) => {
                  let t = ((e) => {
                      let { theme: t, prefix: r } = e,
                        o = { nextPart: new Map(), validators: [] };
                      return (
                        l(Object.entries(e.classGroups), r).forEach(([e, r]) => {
                          i(r, o, e, t);
                        }),
                        o
                      );
                    })(e),
                    { conflictingClassGroups: r, conflictingClassGroupModifiers: s } = e;
                  return {
                    getClassGroupId: (e) => {
                      let r = e.split("-");
                      return (
                        "" === r[0] && 1 !== r.length && r.shift(),
                        o(r, t) ||
                          ((e) => {
                            if (n.test(e)) {
                              let t = n.exec(e)[1],
                                r = t?.substring(0, t.indexOf(":"));
                              if (r) return "arbitrary.." + r;
                            }
                          })(e)
                      );
                    },
                    getConflictingClassGroupIds: (e, t) => {
                      let o = r[e] || [];
                      return t && s[e] ? [...o, ...s[e]] : o;
                    },
                  };
                })(d),
              }).cache.get),
              (a = r.cache.set),
              (p = h),
              h(c)
            );
          };
        function h(e) {
          let t = s(e);
          if (t) return t;
          let o = ((e, t) => {
            let { parseClassName: r, getClassGroupId: o, getConflictingClassGroupIds: n } = t,
              i = [],
              s = e.trim().split(d),
              a = "";
            for (let e = s.length - 1; e >= 0; e -= 1) {
              let t = s[e],
                {
                  modifiers: l,
                  hasImportantModifier: d,
                  baseClassName: u,
                  maybePostfixModifierPosition: p,
                } = r(t),
                h = !!p,
                f = o(h ? u.substring(0, p) : u);
              if (!f) {
                if (!h || !(f = o(u))) {
                  a = t + (a.length > 0 ? " " + a : a);
                  continue;
                }
                h = !1;
              }
              let b = c(l).join(":"),
                m = d ? b + "!" : b,
                y = m + f;
              if (i.includes(y)) continue;
              i.push(y);
              let g = n(f, h);
              for (let e = 0; e < g.length; ++e) {
                let t = g[e];
                i.push(m + t);
              }
              a = t + (a.length > 0 ? " " + a : a);
            }
            return a;
          })(e, r);
          return (a(e, o), o);
        }
        return function () {
          return p(u.apply(null, arguments));
        };
      })(() => {
        let e = h("colors"),
          t = h("spacing"),
          r = h("blur"),
          o = h("brightness"),
          n = h("borderColor"),
          i = h("borderRadius"),
          s = h("borderSpacing"),
          a = h("borderWidth"),
          l = h("contrast"),
          c = h("grayscale"),
          d = h("hueRotate"),
          u = h("invert"),
          p = h("gap"),
          f = h("gradientColorStops"),
          b = h("gradientColorStopPositions"),
          m = h("inset"),
          y = h("margin"),
          g = h("opacity"),
          v = h("padding"),
          w = h("saturate"),
          x = h("scale"),
          T = h("sepia"),
          R = h("skew"),
          U = h("space"),
          G = h("translate"),
          M = () => ["auto", "contain", "none"],
          $ = () => ["auto", "hidden", "clip", "visible", "scroll"],
          D = () => ["auto", E, t],
          L = () => [E, t],
          K = () => ["", k, S],
          _ = () => ["auto", j, E],
          Q = () => [
            "bottom",
            "center",
            "left",
            "left-bottom",
            "left-top",
            "right",
            "right-bottom",
            "right-top",
            "top",
          ],
          W = () => ["solid", "dashed", "dotted", "double", "none"],
          Z = () => [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "color-burn",
            "hard-light",
            "soft-light",
            "difference",
            "exclusion",
            "hue",
            "saturation",
            "color",
            "luminosity",
          ],
          H = () => ["start", "end", "center", "between", "around", "evenly", "stretch"],
          V = () => ["", "0", E],
          B = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
          J = () => [j, E];
        return {
          cacheSize: 500,
          separator: ":",
          theme: {
            colors: [N],
            spacing: [k, S],
            blur: ["none", "", F, E],
            brightness: J(),
            borderColor: [e],
            borderRadius: ["none", "", "full", F, E],
            borderSpacing: L(),
            borderWidth: K(),
            contrast: J(),
            grayscale: V(),
            hueRotate: J(),
            invert: V(),
            gap: L(),
            gradientColorStops: [e],
            gradientColorStopPositions: [z, S],
            inset: D(),
            margin: D(),
            opacity: J(),
            padding: L(),
            saturate: J(),
            scale: J(),
            sepia: V(),
            skew: J(),
            space: L(),
            translate: L(),
          },
          classGroups: {
            aspect: [{ aspect: ["auto", "square", "video", E] }],
            container: ["container"],
            columns: [{ columns: [F] }],
            "break-after": [{ "break-after": B() }],
            "break-before": [{ "break-before": B() }],
            "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }],
            "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
            box: [{ box: ["border", "content"] }],
            display: [
              "block",
              "inline-block",
              "inline",
              "flex",
              "inline-flex",
              "table",
              "inline-table",
              "table-caption",
              "table-cell",
              "table-column",
              "table-column-group",
              "table-footer-group",
              "table-header-group",
              "table-row-group",
              "table-row",
              "flow-root",
              "grid",
              "inline-grid",
              "contents",
              "list-item",
              "hidden",
            ],
            float: [{ float: ["right", "left", "none", "start", "end"] }],
            clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
            isolation: ["isolate", "isolation-auto"],
            "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }],
            "object-position": [{ object: [...Q(), E] }],
            overflow: [{ overflow: $() }],
            "overflow-x": [{ "overflow-x": $() }],
            "overflow-y": [{ "overflow-y": $() }],
            overscroll: [{ overscroll: M() }],
            "overscroll-x": [{ "overscroll-x": M() }],
            "overscroll-y": [{ "overscroll-y": M() }],
            position: ["static", "fixed", "absolute", "relative", "sticky"],
            inset: [{ inset: [m] }],
            "inset-x": [{ "inset-x": [m] }],
            "inset-y": [{ "inset-y": [m] }],
            start: [{ start: [m] }],
            end: [{ end: [m] }],
            top: [{ top: [m] }],
            right: [{ right: [m] }],
            bottom: [{ bottom: [m] }],
            left: [{ left: [m] }],
            visibility: ["visible", "invisible", "collapse"],
            z: [{ z: ["auto", O, E] }],
            basis: [{ basis: D() }],
            "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }],
            "flex-wrap": [{ flex: ["wrap", "wrap-reverse", "nowrap"] }],
            flex: [{ flex: ["1", "auto", "initial", "none", E] }],
            grow: [{ grow: V() }],
            shrink: [{ shrink: V() }],
            order: [{ order: ["first", "last", "none", O, E] }],
            "grid-cols": [{ "grid-cols": [N] }],
            "col-start-end": [{ col: ["auto", { span: ["full", O, E] }, E] }],
            "col-start": [{ "col-start": _() }],
            "col-end": [{ "col-end": _() }],
            "grid-rows": [{ "grid-rows": [N] }],
            "row-start-end": [{ row: ["auto", { span: [O, E] }, E] }],
            "row-start": [{ "row-start": _() }],
            "row-end": [{ "row-end": _() }],
            "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }],
            "auto-cols": [{ "auto-cols": ["auto", "min", "max", "fr", E] }],
            "auto-rows": [{ "auto-rows": ["auto", "min", "max", "fr", E] }],
            gap: [{ gap: [p] }],
            "gap-x": [{ "gap-x": [p] }],
            "gap-y": [{ "gap-y": [p] }],
            "justify-content": [{ justify: ["normal", ...H()] }],
            "justify-items": [{ "justify-items": ["start", "end", "center", "stretch"] }],
            "justify-self": [{ "justify-self": ["auto", "start", "end", "center", "stretch"] }],
            "align-content": [{ content: ["normal", ...H(), "baseline"] }],
            "align-items": [{ items: ["start", "end", "center", "baseline", "stretch"] }],
            "align-self": [{ self: ["auto", "start", "end", "center", "stretch", "baseline"] }],
            "place-content": [{ "place-content": [...H(), "baseline"] }],
            "place-items": [{ "place-items": ["start", "end", "center", "baseline", "stretch"] }],
            "place-self": [{ "place-self": ["auto", "start", "end", "center", "stretch"] }],
            p: [{ p: [v] }],
            px: [{ px: [v] }],
            py: [{ py: [v] }],
            ps: [{ ps: [v] }],
            pe: [{ pe: [v] }],
            pt: [{ pt: [v] }],
            pr: [{ pr: [v] }],
            pb: [{ pb: [v] }],
            pl: [{ pl: [v] }],
            m: [{ m: [y] }],
            mx: [{ mx: [y] }],
            my: [{ my: [y] }],
            ms: [{ ms: [y] }],
            me: [{ me: [y] }],
            mt: [{ mt: [y] }],
            mr: [{ mr: [y] }],
            mb: [{ mb: [y] }],
            ml: [{ ml: [y] }],
            "space-x": [{ "space-x": [U] }],
            "space-x-reverse": ["space-x-reverse"],
            "space-y": [{ "space-y": [U] }],
            "space-y-reverse": ["space-y-reverse"],
            w: [{ w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", E, t] }],
            "min-w": [{ "min-w": [E, t, "min", "max", "fit"] }],
            "max-w": [
              { "max-w": [E, t, "none", "full", "min", "max", "fit", "prose", { screen: [F] }, F] },
            ],
            h: [{ h: [E, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"] }],
            "min-h": [{ "min-h": [E, t, "min", "max", "fit", "svh", "lvh", "dvh"] }],
            "max-h": [{ "max-h": [E, t, "min", "max", "fit", "svh", "lvh", "dvh"] }],
            size: [{ size: [E, t, "auto", "min", "max", "fit"] }],
            "font-size": [{ text: ["base", F, S] }],
            "font-smoothing": ["antialiased", "subpixel-antialiased"],
            "font-style": ["italic", "not-italic"],
            "font-weight": [
              {
                font: [
                  "thin",
                  "extralight",
                  "light",
                  "normal",
                  "medium",
                  "semibold",
                  "bold",
                  "extrabold",
                  "black",
                  C,
                ],
              },
            ],
            "font-family": [{ font: [N] }],
            "fvn-normal": ["normal-nums"],
            "fvn-ordinal": ["ordinal"],
            "fvn-slashed-zero": ["slashed-zero"],
            "fvn-figure": ["lining-nums", "oldstyle-nums"],
            "fvn-spacing": ["proportional-nums", "tabular-nums"],
            "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
            tracking: [{ tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", E] }],
            "line-clamp": [{ "line-clamp": ["none", j, C] }],
            leading: [{ leading: ["none", "tight", "snug", "normal", "relaxed", "loose", k, E] }],
            "list-image": [{ "list-image": ["none", E] }],
            "list-style-type": [{ list: ["none", "disc", "decimal", E] }],
            "list-style-position": [{ list: ["inside", "outside"] }],
            "placeholder-color": [{ placeholder: [e] }],
            "placeholder-opacity": [{ "placeholder-opacity": [g] }],
            "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }],
            "text-color": [{ text: [e] }],
            "text-opacity": [{ "text-opacity": [g] }],
            "text-decoration": ["underline", "overline", "line-through", "no-underline"],
            "text-decoration-style": [{ decoration: [...W(), "wavy"] }],
            "text-decoration-thickness": [{ decoration: ["auto", "from-font", k, S] }],
            "underline-offset": [{ "underline-offset": ["auto", k, E] }],
            "text-decoration-color": [{ decoration: [e] }],
            "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
            "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
            "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
            indent: [{ indent: L() }],
            "vertical-align": [
              {
                align: [
                  "baseline",
                  "top",
                  "middle",
                  "bottom",
                  "text-top",
                  "text-bottom",
                  "sub",
                  "super",
                  E,
                ],
              },
            ],
            whitespace: [
              { whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] },
            ],
            break: [{ break: ["normal", "words", "all", "keep"] }],
            hyphens: [{ hyphens: ["none", "manual", "auto"] }],
            content: [{ content: ["none", E] }],
            "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
            "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
            "bg-opacity": [{ "bg-opacity": [g] }],
            "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
            "bg-position": [{ bg: [...Q(), A] }],
            "bg-repeat": [{ bg: ["no-repeat", { repeat: ["", "x", "y", "round", "space"] }] }],
            "bg-size": [{ bg: ["auto", "cover", "contain", P] }],
            "bg-image": [
              { bg: ["none", { "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, q] },
            ],
            "bg-color": [{ bg: [e] }],
            "gradient-from-pos": [{ from: [b] }],
            "gradient-via-pos": [{ via: [b] }],
            "gradient-to-pos": [{ to: [b] }],
            "gradient-from": [{ from: [f] }],
            "gradient-via": [{ via: [f] }],
            "gradient-to": [{ to: [f] }],
            rounded: [{ rounded: [i] }],
            "rounded-s": [{ "rounded-s": [i] }],
            "rounded-e": [{ "rounded-e": [i] }],
            "rounded-t": [{ "rounded-t": [i] }],
            "rounded-r": [{ "rounded-r": [i] }],
            "rounded-b": [{ "rounded-b": [i] }],
            "rounded-l": [{ "rounded-l": [i] }],
            "rounded-ss": [{ "rounded-ss": [i] }],
            "rounded-se": [{ "rounded-se": [i] }],
            "rounded-ee": [{ "rounded-ee": [i] }],
            "rounded-es": [{ "rounded-es": [i] }],
            "rounded-tl": [{ "rounded-tl": [i] }],
            "rounded-tr": [{ "rounded-tr": [i] }],
            "rounded-br": [{ "rounded-br": [i] }],
            "rounded-bl": [{ "rounded-bl": [i] }],
            "border-w": [{ border: [a] }],
            "border-w-x": [{ "border-x": [a] }],
            "border-w-y": [{ "border-y": [a] }],
            "border-w-s": [{ "border-s": [a] }],
            "border-w-e": [{ "border-e": [a] }],
            "border-w-t": [{ "border-t": [a] }],
            "border-w-r": [{ "border-r": [a] }],
            "border-w-b": [{ "border-b": [a] }],
            "border-w-l": [{ "border-l": [a] }],
            "border-opacity": [{ "border-opacity": [g] }],
            "border-style": [{ border: [...W(), "hidden"] }],
            "divide-x": [{ "divide-x": [a] }],
            "divide-x-reverse": ["divide-x-reverse"],
            "divide-y": [{ "divide-y": [a] }],
            "divide-y-reverse": ["divide-y-reverse"],
            "divide-opacity": [{ "divide-opacity": [g] }],
            "divide-style": [{ divide: W() }],
            "border-color": [{ border: [n] }],
            "border-color-x": [{ "border-x": [n] }],
            "border-color-y": [{ "border-y": [n] }],
            "border-color-s": [{ "border-s": [n] }],
            "border-color-e": [{ "border-e": [n] }],
            "border-color-t": [{ "border-t": [n] }],
            "border-color-r": [{ "border-r": [n] }],
            "border-color-b": [{ "border-b": [n] }],
            "border-color-l": [{ "border-l": [n] }],
            "divide-color": [{ divide: [n] }],
            "outline-style": [{ outline: ["", ...W()] }],
            "outline-offset": [{ "outline-offset": [k, E] }],
            "outline-w": [{ outline: [k, S] }],
            "outline-color": [{ outline: [e] }],
            "ring-w": [{ ring: K() }],
            "ring-w-inset": ["ring-inset"],
            "ring-color": [{ ring: [e] }],
            "ring-opacity": [{ "ring-opacity": [g] }],
            "ring-offset-w": [{ "ring-offset": [k, S] }],
            "ring-offset-color": [{ "ring-offset": [e] }],
            shadow: [{ shadow: ["", "inner", "none", F, I] }],
            "shadow-color": [{ shadow: [N] }],
            opacity: [{ opacity: [g] }],
            "mix-blend": [{ "mix-blend": [...Z(), "plus-lighter", "plus-darker"] }],
            "bg-blend": [{ "bg-blend": Z() }],
            filter: [{ filter: ["", "none"] }],
            blur: [{ blur: [r] }],
            brightness: [{ brightness: [o] }],
            contrast: [{ contrast: [l] }],
            "drop-shadow": [{ "drop-shadow": ["", "none", F, E] }],
            grayscale: [{ grayscale: [c] }],
            "hue-rotate": [{ "hue-rotate": [d] }],
            invert: [{ invert: [u] }],
            saturate: [{ saturate: [w] }],
            sepia: [{ sepia: [T] }],
            "backdrop-filter": [{ "backdrop-filter": ["", "none"] }],
            "backdrop-blur": [{ "backdrop-blur": [r] }],
            "backdrop-brightness": [{ "backdrop-brightness": [o] }],
            "backdrop-contrast": [{ "backdrop-contrast": [l] }],
            "backdrop-grayscale": [{ "backdrop-grayscale": [c] }],
            "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [d] }],
            "backdrop-invert": [{ "backdrop-invert": [u] }],
            "backdrop-opacity": [{ "backdrop-opacity": [g] }],
            "backdrop-saturate": [{ "backdrop-saturate": [w] }],
            "backdrop-sepia": [{ "backdrop-sepia": [T] }],
            "border-collapse": [{ border: ["collapse", "separate"] }],
            "border-spacing": [{ "border-spacing": [s] }],
            "border-spacing-x": [{ "border-spacing-x": [s] }],
            "border-spacing-y": [{ "border-spacing-y": [s] }],
            "table-layout": [{ table: ["auto", "fixed"] }],
            caption: [{ caption: ["top", "bottom"] }],
            transition: [
              { transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", E] },
            ],
            duration: [{ duration: J() }],
            ease: [{ ease: ["linear", "in", "out", "in-out", E] }],
            delay: [{ delay: J() }],
            animate: [{ animate: ["none", "spin", "ping", "pulse", "bounce", E] }],
            transform: [{ transform: ["", "gpu", "none"] }],
            scale: [{ scale: [x] }],
            "scale-x": [{ "scale-x": [x] }],
            "scale-y": [{ "scale-y": [x] }],
            rotate: [{ rotate: [O, E] }],
            "translate-x": [{ "translate-x": [G] }],
            "translate-y": [{ "translate-y": [G] }],
            "skew-x": [{ "skew-x": [R] }],
            "skew-y": [{ "skew-y": [R] }],
            "transform-origin": [
              {
                origin: [
                  "center",
                  "top",
                  "top-right",
                  "right",
                  "bottom-right",
                  "bottom",
                  "bottom-left",
                  "left",
                  "top-left",
                  E,
                ],
              },
            ],
            accent: [{ accent: ["auto", e] }],
            appearance: [{ appearance: ["none", "auto"] }],
            cursor: [
              {
                cursor: [
                  "auto",
                  "default",
                  "pointer",
                  "wait",
                  "text",
                  "move",
                  "help",
                  "not-allowed",
                  "none",
                  "context-menu",
                  "progress",
                  "cell",
                  "crosshair",
                  "vertical-text",
                  "alias",
                  "copy",
                  "no-drop",
                  "grab",
                  "grabbing",
                  "all-scroll",
                  "col-resize",
                  "row-resize",
                  "n-resize",
                  "e-resize",
                  "s-resize",
                  "w-resize",
                  "ne-resize",
                  "nw-resize",
                  "se-resize",
                  "sw-resize",
                  "ew-resize",
                  "ns-resize",
                  "nesw-resize",
                  "nwse-resize",
                  "zoom-in",
                  "zoom-out",
                  E,
                ],
              },
            ],
            "caret-color": [{ caret: [e] }],
            "pointer-events": [{ "pointer-events": ["none", "auto"] }],
            resize: [{ resize: ["none", "y", "x", ""] }],
            "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
            "scroll-m": [{ "scroll-m": L() }],
            "scroll-mx": [{ "scroll-mx": L() }],
            "scroll-my": [{ "scroll-my": L() }],
            "scroll-ms": [{ "scroll-ms": L() }],
            "scroll-me": [{ "scroll-me": L() }],
            "scroll-mt": [{ "scroll-mt": L() }],
            "scroll-mr": [{ "scroll-mr": L() }],
            "scroll-mb": [{ "scroll-mb": L() }],
            "scroll-ml": [{ "scroll-ml": L() }],
            "scroll-p": [{ "scroll-p": L() }],
            "scroll-px": [{ "scroll-px": L() }],
            "scroll-py": [{ "scroll-py": L() }],
            "scroll-ps": [{ "scroll-ps": L() }],
            "scroll-pe": [{ "scroll-pe": L() }],
            "scroll-pt": [{ "scroll-pt": L() }],
            "scroll-pr": [{ "scroll-pr": L() }],
            "scroll-pb": [{ "scroll-pb": L() }],
            "scroll-pl": [{ "scroll-pl": L() }],
            "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
            "snap-stop": [{ snap: ["normal", "always"] }],
            "snap-type": [{ snap: ["none", "x", "y", "both"] }],
            "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
            touch: [{ touch: ["auto", "none", "manipulation"] }],
            "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
            "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
            "touch-pz": ["touch-pinch-zoom"],
            select: [{ select: ["none", "text", "all", "auto"] }],
            "will-change": [{ "will-change": ["auto", "scroll", "contents", "transform", E] }],
            fill: [{ fill: [e, "none"] }],
            "stroke-w": [{ stroke: [k, S, C] }],
            stroke: [{ stroke: [e, "none"] }],
            sr: ["sr-only", "not-sr-only"],
            "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
          },
          conflictingClassGroups: {
            overflow: ["overflow-x", "overflow-y"],
            overscroll: ["overscroll-x", "overscroll-y"],
            inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
            "inset-x": ["right", "left"],
            "inset-y": ["top", "bottom"],
            flex: ["basis", "grow", "shrink"],
            gap: ["gap-x", "gap-y"],
            p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
            px: ["pr", "pl"],
            py: ["pt", "pb"],
            m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
            mx: ["mr", "ml"],
            my: ["mt", "mb"],
            size: ["w", "h"],
            "font-size": ["leading"],
            "fvn-normal": [
              "fvn-ordinal",
              "fvn-slashed-zero",
              "fvn-figure",
              "fvn-spacing",
              "fvn-fraction",
            ],
            "fvn-ordinal": ["fvn-normal"],
            "fvn-slashed-zero": ["fvn-normal"],
            "fvn-figure": ["fvn-normal"],
            "fvn-spacing": ["fvn-normal"],
            "fvn-fraction": ["fvn-normal"],
            "line-clamp": ["display", "overflow"],
            rounded: [
              "rounded-s",
              "rounded-e",
              "rounded-t",
              "rounded-r",
              "rounded-b",
              "rounded-l",
              "rounded-ss",
              "rounded-se",
              "rounded-ee",
              "rounded-es",
              "rounded-tl",
              "rounded-tr",
              "rounded-br",
              "rounded-bl",
            ],
            "rounded-s": ["rounded-ss", "rounded-es"],
            "rounded-e": ["rounded-se", "rounded-ee"],
            "rounded-t": ["rounded-tl", "rounded-tr"],
            "rounded-r": ["rounded-tr", "rounded-br"],
            "rounded-b": ["rounded-br", "rounded-bl"],
            "rounded-l": ["rounded-tl", "rounded-bl"],
            "border-spacing": ["border-spacing-x", "border-spacing-y"],
            "border-w": [
              "border-w-s",
              "border-w-e",
              "border-w-t",
              "border-w-r",
              "border-w-b",
              "border-w-l",
            ],
            "border-w-x": ["border-w-r", "border-w-l"],
            "border-w-y": ["border-w-t", "border-w-b"],
            "border-color": [
              "border-color-s",
              "border-color-e",
              "border-color-t",
              "border-color-r",
              "border-color-b",
              "border-color-l",
            ],
            "border-color-x": ["border-color-r", "border-color-l"],
            "border-color-y": ["border-color-t", "border-color-b"],
            "scroll-m": [
              "scroll-mx",
              "scroll-my",
              "scroll-ms",
              "scroll-me",
              "scroll-mt",
              "scroll-mr",
              "scroll-mb",
              "scroll-ml",
            ],
            "scroll-mx": ["scroll-mr", "scroll-ml"],
            "scroll-my": ["scroll-mt", "scroll-mb"],
            "scroll-p": [
              "scroll-px",
              "scroll-py",
              "scroll-ps",
              "scroll-pe",
              "scroll-pt",
              "scroll-pr",
              "scroll-pb",
              "scroll-pl",
            ],
            "scroll-px": ["scroll-pr", "scroll-pl"],
            "scroll-py": ["scroll-pt", "scroll-pb"],
            touch: ["touch-x", "touch-y", "touch-pz"],
            "touch-x": ["touch"],
            "touch-y": ["touch"],
            "touch-pz": ["touch"],
          },
          conflictingClassGroupModifiers: { "font-size": ["leading"] },
        };
      });
    },
    2462: (e, t, r) => {
      r.d(t, { t: () => i });
      var o = r(9121),
        n = r(4653),
        i = new (class extends o.Q {
          #e = !0;
          #t;
          #r;
          constructor() {
            (super(),
              (this.#r = (e) => {
                if (!n.S$ && window.addEventListener) {
                  let t = () => e(!0),
                    r = () => e(!1);
                  return (
                    window.addEventListener("online", t, !1),
                    window.addEventListener("offline", r, !1),
                    () => {
                      (window.removeEventListener("online", t),
                        window.removeEventListener("offline", r));
                    }
                  );
                }
              }));
          }
          onSubscribe() {
            this.#t || this.setEventListener(this.#r);
          }
          onUnsubscribe() {
            this.hasListeners() || (this.#t?.(), (this.#t = void 0));
          }
          setEventListener(e) {
            ((this.#r = e), this.#t?.(), (this.#t = e(this.setOnline.bind(this))));
          }
          setOnline(e) {
            this.#e !== e &&
              ((this.#e = e),
              this.listeners.forEach((t) => {
                t(e);
              }));
          }
          isOnline() {
            return this.#e;
          }
        })();
    },
    3445: (e, t, r) => {
      r.d(t, { II: () => d, cc: () => c, v_: () => l });
      var o = r(9591),
        n = r(2462),
        i = r(5951),
        s = r(4653);
      function a(e) {
        return Math.min(1e3 * 2 ** e, 3e4);
      }
      function l(e) {
        return (e ?? "online") !== "online" || n.t.isOnline();
      }
      var c = class extends Error {
        constructor(e) {
          (super("CancelledError"), (this.revert = e?.revert), (this.silent = e?.silent));
        }
      };
      function d(e) {
        let t,
          r = !1,
          d = 0,
          u = (0, i.T)(),
          p = () => o.m.isFocused() && ("always" === e.networkMode || n.t.isOnline()) && e.canRun(),
          h = () => l(e.networkMode) && e.canRun(),
          f = (e) => {
            "pending" === u.status && (t?.(), u.resolve(e));
          },
          b = (e) => {
            "pending" === u.status && (t?.(), u.reject(e));
          },
          m = () =>
            new Promise((r) => {
              ((t = (e) => {
                ("pending" !== u.status || p()) && r(e);
              }),
                e.onPause?.());
            }).then(() => {
              ((t = void 0), "pending" === u.status && e.onContinue?.());
            }),
          y = () => {
            let t;
            if ("pending" !== u.status) return;
            let o = 0 === d ? e.initialPromise : void 0;
            try {
              t = o ?? e.fn();
            } catch (e) {
              t = Promise.reject(e);
            }
            Promise.resolve(t)
              .then(f)
              .catch((t) => {
                if ("pending" !== u.status) return;
                let o = e.retry ?? 3 * !s.S$,
                  n = e.retryDelay ?? a,
                  i = "function" == typeof n ? n(d, t) : n,
                  l =
                    !0 === o ||
                    ("number" == typeof o && d < o) ||
                    ("function" == typeof o && o(d, t));
                if (r || !l) return void b(t);
                (d++,
                  e.onFail?.(d, t),
                  (0, s.yy)(i)
                    .then(() => (p() ? void 0 : m()))
                    .then(() => {
                      r ? b(t) : y();
                    }));
              });
          };
        return {
          promise: u,
          status: () => u.status,
          cancel: (t) => {
            if ("pending" === u.status) {
              let r = new c(t);
              (b(r), e.onCancel?.(r));
            }
          },
          continue: () => (t?.(), u),
          cancelRetry: () => {
            r = !0;
          },
          continueRetry: () => {
            r = !1;
          },
          canStart: h,
          start: () => (h() ? y() : m().then(y), u),
        };
      }
    },
    3592: (e, t, r) => {
      r.d(t, { X: () => a, k: () => l });
      var o = r(4653),
        n = r(9456),
        i = r(3445),
        s = r(9737),
        a = class extends s.k {
          #o;
          #n;
          #i;
          #s;
          #a;
          #l;
          #c;
          constructor(e) {
            (super(),
              (this.#c = !1),
              (this.#l = e.defaultOptions),
              this.setOptions(e.options),
              (this.observers = []),
              (this.#s = e.client),
              (this.#i = this.#s.getQueryCache()),
              (this.queryKey = e.queryKey),
              (this.queryHash = e.queryHash),
              (this.#o = c(this.options)),
              (this.state = e.state ?? this.#o),
              this.scheduleGc());
          }
          get meta() {
            return this.options.meta;
          }
          get promise() {
            return this.#a?.promise;
          }
          setOptions(e) {
            if (
              ((this.options = { ...this.#l, ...e }),
              this.updateGcTime(this.options.gcTime),
              this.state && void 0 === this.state.data)
            ) {
              let e = c(this.options);
              void 0 !== e.data &&
                (this.setData(e.data, { updatedAt: e.dataUpdatedAt, manual: !0 }), (this.#o = e));
            }
          }
          optionalRemove() {
            this.observers.length || "idle" !== this.state.fetchStatus || this.#i.remove(this);
          }
          setData(e, t) {
            let r = (0, o.pl)(this.state.data, e, this.options);
            return (
              this.#d({ data: r, type: "success", dataUpdatedAt: t?.updatedAt, manual: t?.manual }),
              r
            );
          }
          setState(e, t) {
            this.#d({ type: "setState", state: e, setStateOptions: t });
          }
          cancel(e) {
            let t = this.#a?.promise;
            return (this.#a?.cancel(e), t ? t.then(o.lQ).catch(o.lQ) : Promise.resolve());
          }
          destroy() {
            (super.destroy(), this.cancel({ silent: !0 }));
          }
          reset() {
            (this.destroy(), this.setState(this.#o));
          }
          isActive() {
            return this.observers.some((e) => !1 !== (0, o.Eh)(e.options.enabled, this));
          }
          isDisabled() {
            return this.getObserversCount() > 0
              ? !this.isActive()
              : this.options.queryFn === o.hT ||
                  this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
          }
          isStatic() {
            return (
              this.getObserversCount() > 0 &&
              this.observers.some((e) => "static" === (0, o.d2)(e.options.staleTime, this))
            );
          }
          isStale() {
            return this.getObserversCount() > 0
              ? this.observers.some((e) => e.getCurrentResult().isStale)
              : void 0 === this.state.data || this.state.isInvalidated;
          }
          isStaleByTime(e = 0) {
            return (
              void 0 === this.state.data ||
              ("static" !== e &&
                (!!this.state.isInvalidated || !(0, o.j3)(this.state.dataUpdatedAt, e)))
            );
          }
          onFocus() {
            let e = this.observers.find((e) => e.shouldFetchOnWindowFocus());
            (e?.refetch({ cancelRefetch: !1 }), this.#a?.continue());
          }
          onOnline() {
            let e = this.observers.find((e) => e.shouldFetchOnReconnect());
            (e?.refetch({ cancelRefetch: !1 }), this.#a?.continue());
          }
          addObserver(e) {
            this.observers.includes(e) ||
              (this.observers.push(e),
              this.clearGcTimeout(),
              this.#i.notify({ type: "observerAdded", query: this, observer: e }));
          }
          removeObserver(e) {
            this.observers.includes(e) &&
              ((this.observers = this.observers.filter((t) => t !== e)),
              this.observers.length ||
                (this.#a && (this.#c ? this.#a.cancel({ revert: !0 }) : this.#a.cancelRetry()),
                this.scheduleGc()),
              this.#i.notify({ type: "observerRemoved", query: this, observer: e }));
          }
          getObserversCount() {
            return this.observers.length;
          }
          invalidate() {
            this.state.isInvalidated || this.#d({ type: "invalidate" });
          }
          async fetch(e, t) {
            if ("idle" !== this.state.fetchStatus && this.#a?.status() !== "rejected") {
              if (void 0 !== this.state.data && t?.cancelRefetch) this.cancel({ silent: !0 });
              else if (this.#a) return (this.#a.continueRetry(), this.#a.promise);
            }
            if ((e && this.setOptions(e), !this.options.queryFn)) {
              let e = this.observers.find((e) => e.options.queryFn);
              e && this.setOptions(e.options);
            }
            let r = new AbortController(),
              n = (e) => {
                Object.defineProperty(e, "signal", {
                  enumerable: !0,
                  get: () => ((this.#c = !0), r.signal),
                });
              },
              s = () => {
                let e = (0, o.ZM)(this.options, t),
                  r = (() => {
                    let e = { client: this.#s, queryKey: this.queryKey, meta: this.meta };
                    return (n(e), e);
                  })();
                return ((this.#c = !1), this.options.persister)
                  ? this.options.persister(e, r, this)
                  : e(r);
              },
              a = (() => {
                let e = {
                  fetchOptions: t,
                  options: this.options,
                  queryKey: this.queryKey,
                  client: this.#s,
                  state: this.state,
                  fetchFn: s,
                };
                return (n(e), e);
              })();
            (this.options.behavior?.onFetch(a, this),
              (this.#n = this.state),
              ("idle" === this.state.fetchStatus ||
                this.state.fetchMeta !== a.fetchOptions?.meta) &&
                this.#d({ type: "fetch", meta: a.fetchOptions?.meta }),
              (this.#a = (0, i.II)({
                initialPromise: t?.initialPromise,
                fn: a.fetchFn,
                onCancel: (e) => {
                  (e instanceof i.cc &&
                    e.revert &&
                    this.setState({ ...this.#n, fetchStatus: "idle" }),
                    r.abort());
                },
                onFail: (e, t) => {
                  this.#d({ type: "failed", failureCount: e, error: t });
                },
                onPause: () => {
                  this.#d({ type: "pause" });
                },
                onContinue: () => {
                  this.#d({ type: "continue" });
                },
                retry: a.options.retry,
                retryDelay: a.options.retryDelay,
                networkMode: a.options.networkMode,
                canRun: () => !0,
              })));
            try {
              let e = await this.#a.start();
              if (void 0 === e) throw Error(`${this.queryHash} data is undefined`);
              return (
                this.setData(e),
                this.#i.config.onSuccess?.(e, this),
                this.#i.config.onSettled?.(e, this.state.error, this),
                e
              );
            } catch (e) {
              if (e instanceof i.cc) {
                if (e.silent) return this.#a.promise;
                else if (e.revert) {
                  if (void 0 === this.state.data) throw e;
                  return this.state.data;
                }
              }
              throw (
                this.#d({ type: "error", error: e }),
                this.#i.config.onError?.(e, this),
                this.#i.config.onSettled?.(this.state.data, e, this),
                e
              );
            } finally {
              this.scheduleGc();
            }
          }
          #d(e) {
            let t = (t) => {
              switch (e.type) {
                case "failed":
                  return { ...t, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
                case "pause":
                  return { ...t, fetchStatus: "paused" };
                case "continue":
                  return { ...t, fetchStatus: "fetching" };
                case "fetch":
                  return { ...t, ...l(t.data, this.options), fetchMeta: e.meta ?? null };
                case "success":
                  let r = {
                    ...t,
                    data: e.data,
                    dataUpdateCount: t.dataUpdateCount + 1,
                    dataUpdatedAt: e.dataUpdatedAt ?? Date.now(),
                    error: null,
                    isInvalidated: !1,
                    status: "success",
                    ...(!e.manual && {
                      fetchStatus: "idle",
                      fetchFailureCount: 0,
                      fetchFailureReason: null,
                    }),
                  };
                  return ((this.#n = e.manual ? r : void 0), r);
                case "error":
                  let o = e.error;
                  return {
                    ...t,
                    error: o,
                    errorUpdateCount: t.errorUpdateCount + 1,
                    errorUpdatedAt: Date.now(),
                    fetchFailureCount: t.fetchFailureCount + 1,
                    fetchFailureReason: o,
                    fetchStatus: "idle",
                    status: "error",
                  };
                case "invalidate":
                  return { ...t, isInvalidated: !0 };
                case "setState":
                  return { ...t, ...e.state };
              }
            };
            ((this.state = t(this.state)),
              n.jG.batch(() => {
                (this.observers.forEach((e) => {
                  e.onQueryUpdate();
                }),
                  this.#i.notify({ query: this, type: "updated", action: e }));
              }));
          }
        };
      function l(e, t) {
        return {
          fetchFailureCount: 0,
          fetchFailureReason: null,
          fetchStatus: (0, i.v_)(t.networkMode) ? "fetching" : "paused",
          ...(void 0 === e && { error: null, status: "pending" }),
        };
      }
      function c(e) {
        let t = "function" == typeof e.initialData ? e.initialData() : e.initialData,
          r = void 0 !== t,
          o = r
            ? "function" == typeof e.initialDataUpdatedAt
              ? e.initialDataUpdatedAt()
              : e.initialDataUpdatedAt
            : 0;
        return {
          data: t,
          dataUpdateCount: 0,
          dataUpdatedAt: r ? (o ?? Date.now()) : 0,
          error: null,
          errorUpdateCount: 0,
          errorUpdatedAt: 0,
          fetchFailureCount: 0,
          fetchFailureReason: null,
          fetchMeta: null,
          isInvalidated: !1,
          status: r ? "success" : "pending",
          fetchStatus: "idle",
        };
      }
    },
    3642: (e, t, r) => {
      r.d(t, { $: () => o });
      function o() {
        for (var e, t, r = 0, o = "", n = arguments.length; r < n; r++)
          (e = arguments[r]) &&
            (t = (function e(t) {
              var r,
                o,
                n = "";
              if ("string" == typeof t || "number" == typeof t) n += t;
              else if ("object" == typeof t)
                if (Array.isArray(t)) {
                  var i = t.length;
                  for (r = 0; r < i; r++) t[r] && (o = e(t[r])) && (n && (n += " "), (n += o));
                } else for (o in t) t[o] && (n && (n += " "), (n += o));
              return n;
            })(e)) &&
            (o && (o += " "), (o += t));
        return o;
      }
    },
    4653: (e, t, r) => {
      r.d(t, {
        Cp: () => b,
        EN: () => f,
        Eh: () => d,
        F$: () => h,
        GU: () => z,
        MK: () => u,
        S$: () => n,
        ZM: () => O,
        ZZ: () => j,
        Zw: () => s,
        d2: () => c,
        f8: () => y,
        gn: () => a,
        hT: () => C,
        j3: () => l,
        lQ: () => i,
        nJ: () => p,
        pl: () => k,
        y9: () => S,
        yy: () => x,
      });
      var o = r(5154),
        n = "undefined" == typeof window || "Deno" in globalThis;
      function i() {}
      function s(e, t) {
        return "function" == typeof e ? e(t) : e;
      }
      function a(e) {
        return "number" == typeof e && e >= 0 && e !== 1 / 0;
      }
      function l(e, t) {
        return Math.max(e + (t || 0) - Date.now(), 0);
      }
      function c(e, t) {
        return "function" == typeof e ? e(t) : e;
      }
      function d(e, t) {
        return "function" == typeof e ? e(t) : e;
      }
      function u(e, t) {
        let { type: r = "all", exact: o, fetchStatus: n, predicate: i, queryKey: s, stale: a } = e;
        if (s) {
          if (o) {
            if (t.queryHash !== h(s, t.options)) return !1;
          } else if (!b(t.queryKey, s)) return !1;
        }
        if ("all" !== r) {
          let e = t.isActive();
          if (("active" === r && !e) || ("inactive" === r && e)) return !1;
        }
        return (
          ("boolean" != typeof a || t.isStale() === a) &&
          (!n || n === t.state.fetchStatus) &&
          (!i || !!i(t))
        );
      }
      function p(e, t) {
        let { exact: r, status: o, predicate: n, mutationKey: i } = e;
        if (i) {
          if (!t.options.mutationKey) return !1;
          if (r) {
            if (f(t.options.mutationKey) !== f(i)) return !1;
          } else if (!b(t.options.mutationKey, i)) return !1;
        }
        return (!o || t.state.status === o) && (!n || !!n(t));
      }
      function h(e, t) {
        return (t?.queryKeyHashFn || f)(e);
      }
      function f(e) {
        return JSON.stringify(e, (e, t) =>
          v(t)
            ? Object.keys(t)
                .sort()
                .reduce((e, r) => ((e[r] = t[r]), e), {})
            : t
        );
      }
      function b(e, t) {
        return (
          e === t ||
          (typeof e == typeof t &&
            !!e &&
            !!t &&
            "object" == typeof e &&
            "object" == typeof t &&
            Object.keys(t).every((r) => b(e[r], t[r])))
        );
      }
      var m = Object.prototype.hasOwnProperty;
      function y(e, t) {
        if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
        for (let r in e) if (e[r] !== t[r]) return !1;
        return !0;
      }
      function g(e) {
        return Array.isArray(e) && e.length === Object.keys(e).length;
      }
      function v(e) {
        if (!w(e)) return !1;
        let t = e.constructor;
        if (void 0 === t) return !0;
        let r = t.prototype;
        return (
          !!w(r) &&
          !!r.hasOwnProperty("isPrototypeOf") &&
          Object.getPrototypeOf(e) === Object.prototype
        );
      }
      function w(e) {
        return "[object Object]" === Object.prototype.toString.call(e);
      }
      function x(e) {
        return new Promise((t) => {
          o.zs.setTimeout(t, e);
        });
      }
      function k(e, t, r) {
        return "function" == typeof r.structuralSharing
          ? r.structuralSharing(e, t)
          : !1 !== r.structuralSharing
            ? (function e(t, r) {
                if (t === r) return t;
                let o = g(t) && g(r);
                if (!o && !(v(t) && v(r))) return r;
                let n = (o ? t : Object.keys(t)).length,
                  i = o ? r : Object.keys(r),
                  s = i.length,
                  a = o ? Array(s) : {},
                  l = 0;
                for (let c = 0; c < s; c++) {
                  let s = o ? c : i[c],
                    d = t[s],
                    u = r[s];
                  if (d === u) {
                    ((a[s] = d), (o ? c < n : m.call(t, s)) && l++);
                    continue;
                  }
                  if (null === d || null === u || "object" != typeof d || "object" != typeof u) {
                    a[s] = u;
                    continue;
                  }
                  let p = e(d, u);
                  ((a[s] = p), p === d && l++);
                }
                return n === s && l === n ? t : a;
              })(e, t)
            : t;
      }
      function S(e, t, r = 0) {
        let o = [...e, t];
        return r && o.length > r ? o.slice(1) : o;
      }
      function j(e, t, r = 0) {
        let o = [t, ...e];
        return r && o.length > r ? o.slice(0, -1) : o;
      }
      var C = Symbol();
      function O(e, t) {
        return !e.queryFn && t?.initialPromise
          ? () => t.initialPromise
          : e.queryFn && e.queryFn !== C
            ? e.queryFn
            : () => Promise.reject(Error(`Missing queryFn: '${e.queryHash}'`));
      }
      function z(e, t) {
        return "function" == typeof e ? e(...t) : !!e;
      }
    },
    5154: (e, t, r) => {
      r.d(t, { Zq: () => i, zs: () => n });
      var o = {
          setTimeout: (e, t) => setTimeout(e, t),
          clearTimeout: (e) => clearTimeout(e),
          setInterval: (e, t) => setInterval(e, t),
          clearInterval: (e) => clearInterval(e),
        },
        n = new (class {
          #u = o;
          #p = !1;
          setTimeoutProvider(e) {
            this.#u = e;
          }
          setTimeout(e, t) {
            return this.#u.setTimeout(e, t);
          }
          clearTimeout(e) {
            this.#u.clearTimeout(e);
          }
          setInterval(e, t) {
            return this.#u.setInterval(e, t);
          }
          clearInterval(e) {
            this.#u.clearInterval(e);
          }
        })();
      function i(e) {
        setTimeout(e, 0);
      }
    },
    5231: (e, t, r) => {
      r.d(t, { Ht: () => a, jE: () => s });
      var o = r(4361),
        n = r(2541),
        i = o.createContext(void 0),
        s = (e) => {
          let t = o.useContext(i);
          if (e) return e;
          if (!t) throw Error("No QueryClient set, use QueryClientProvider to set one");
          return t;
        },
        a = (e) => {
          let { client: t, children: r } = e;
          return (
            o.useEffect(
              () => (
                t.mount(),
                () => {
                  t.unmount();
                }
              ),
              [t]
            ),
            (0, n.jsx)(i.Provider, { value: t, children: r })
          );
        };
    },
    5951: (e, t, r) => {
      r.d(t, { T: () => o });
      function o() {
        let e,
          t,
          r = new Promise((r, o) => {
            ((e = r), (t = o));
          });
        function o(e) {
          (Object.assign(r, e), delete r.resolve, delete r.reject);
        }
        return (
          (r.status = "pending"),
          r.catch(() => {}),
          (r.resolve = (t) => {
            (o({ status: "fulfilled", value: t }), e(t));
          }),
          (r.reject = (e) => {
            (o({ status: "rejected", reason: e }), t(e));
          }),
          r
        );
      }
    },
    7551: (e, t, r) => {
      r.d(t, { s: () => s, t: () => i });
      var o = r(4361);
      function n(e, t) {
        if ("function" == typeof e) return e(t);
        null != e && (e.current = t);
      }
      function i(...e) {
        return (t) => {
          let r = !1,
            o = e.map((e) => {
              let o = n(e, t);
              return (r || "function" != typeof o || (r = !0), o);
            });
          if (r)
            return () => {
              for (let t = 0; t < o.length; t++) {
                let r = o[t];
                "function" == typeof r ? r() : n(e[t], null);
              }
            };
        };
      }
      function s(...e) {
        return o.useCallback(i(...e), e);
      }
    },
    7836: (e, t, r) => {
      r.d(t, { F: () => s });
      var o = r(3642);
      let n = (e) => ("boolean" == typeof e ? `${e}` : 0 === e ? "0" : e),
        i = o.$,
        s = (e, t) => (r) => {
          var o;
          if ((null == t ? void 0 : t.variants) == null)
            return i(e, null == r ? void 0 : r.class, null == r ? void 0 : r.className);
          let { variants: s, defaultVariants: a } = t,
            l = Object.keys(s).map((e) => {
              let t = null == r ? void 0 : r[e],
                o = null == a ? void 0 : a[e];
              if (null === t) return null;
              let i = n(t) || n(o);
              return s[e][i];
            }),
            c =
              r &&
              Object.entries(r).reduce((e, t) => {
                let [r, o] = t;
                return (void 0 === o || (e[r] = o), e);
              }, {});
          return i(
            e,
            l,
            null == t || null == (o = t.compoundVariants)
              ? void 0
              : o.reduce((e, t) => {
                  let { class: r, className: o, ...n } = t;
                  return Object.entries(n).every((e) => {
                    let [t, r] = e;
                    return Array.isArray(r)
                      ? r.includes({ ...a, ...c }[t])
                      : { ...a, ...c }[t] === r;
                  })
                    ? [...e, r, o]
                    : e;
                }, []),
            null == r ? void 0 : r.class,
            null == r ? void 0 : r.className
          );
        };
    },
    9121: (e, t, r) => {
      r.d(t, { Q: () => o });
      var o = class {
        constructor() {
          ((this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this)));
        }
        subscribe(e) {
          return (
            this.listeners.add(e),
            this.onSubscribe(),
            () => {
              (this.listeners.delete(e), this.onUnsubscribe());
            }
          );
        }
        hasListeners() {
          return this.listeners.size > 0;
        }
        onSubscribe() {}
        onUnsubscribe() {}
      };
    },
    9456: (e, t, r) => {
      r.d(t, { jG: () => n });
      var o = r(5154).Zq,
        n = (function () {
          let e = [],
            t = 0,
            r = (e) => {
              e();
            },
            n = (e) => {
              e();
            },
            i = o,
            s = (o) => {
              t
                ? e.push(o)
                : i(() => {
                    r(o);
                  });
            };
          return {
            batch: (o) => {
              let s;
              t++;
              try {
                s = o();
              } finally {
                --t ||
                  (() => {
                    let t = e;
                    ((e = []),
                      t.length &&
                        i(() => {
                          n(() => {
                            t.forEach((e) => {
                              r(e);
                            });
                          });
                        }));
                  })();
              }
              return s;
            },
            batchCalls:
              (e) =>
              (...t) => {
                s(() => {
                  e(...t);
                });
              },
            schedule: s,
            setNotifyFunction: (e) => {
              r = e;
            },
            setBatchNotifyFunction: (e) => {
              n = e;
            },
            setScheduler: (e) => {
              i = e;
            },
          };
        })();
    },
    9591: (e, t, r) => {
      r.d(t, { m: () => i });
      var o = r(9121),
        n = r(4653),
        i = new (class extends o.Q {
          #h;
          #t;
          #r;
          constructor() {
            (super(),
              (this.#r = (e) => {
                if (!n.S$ && window.addEventListener) {
                  let t = () => e();
                  return (
                    window.addEventListener("visibilitychange", t, !1),
                    () => {
                      window.removeEventListener("visibilitychange", t);
                    }
                  );
                }
              }));
          }
          onSubscribe() {
            this.#t || this.setEventListener(this.#r);
          }
          onUnsubscribe() {
            this.hasListeners() || (this.#t?.(), (this.#t = void 0));
          }
          setEventListener(e) {
            ((this.#r = e),
              this.#t?.(),
              (this.#t = e((e) => {
                "boolean" == typeof e ? this.setFocused(e) : this.onFocus();
              })));
          }
          setFocused(e) {
            this.#h !== e && ((this.#h = e), this.onFocus());
          }
          onFocus() {
            let e = this.isFocused();
            this.listeners.forEach((t) => {
              t(e);
            });
          }
          isFocused() {
            return "boolean" == typeof this.#h
              ? this.#h
              : globalThis.document?.visibilityState !== "hidden";
          }
        })();
    },
    9737: (e, t, r) => {
      r.d(t, { k: () => i });
      var o = r(5154),
        n = r(4653),
        i = class {
          #f;
          destroy() {
            this.clearGcTimeout();
          }
          scheduleGc() {
            (this.clearGcTimeout(),
              (0, n.gn)(this.gcTime) &&
                (this.#f = o.zs.setTimeout(() => {
                  this.optionalRemove();
                }, this.gcTime)));
          }
          updateGcTime(e) {
            this.gcTime = Math.max(this.gcTime || 0, e ?? (n.S$ ? 1 / 0 : 3e5));
          }
          clearGcTimeout() {
            this.#f && (o.zs.clearTimeout(this.#f), (this.#f = void 0));
          }
        };
    },
  },
]);
