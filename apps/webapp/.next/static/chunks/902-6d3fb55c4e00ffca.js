(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [902],
  {
    109: (e, t, r) => {
      "use strict";
      r.d(t, { E: () => v });
      var n = r(4653),
        i = r(3592),
        s = r(9456),
        a = r(9121),
        o = class extends a.Q {
          constructor(e = {}) {
            (super(), (this.config = e), (this.#e = new Map()));
          }
          #e;
          build(e, t, r) {
            let s = t.queryKey,
              a = t.queryHash ?? (0, n.F$)(s, t),
              o = this.get(a);
            return (
              o ||
                ((o = new i.X({
                  client: e,
                  queryKey: s,
                  queryHash: a,
                  options: e.defaultQueryOptions(t),
                  state: r,
                  defaultOptions: e.getQueryDefaults(s),
                })),
                this.add(o)),
              o
            );
          }
          add(e) {
            this.#e.has(e.queryHash) ||
              (this.#e.set(e.queryHash, e), this.notify({ type: "added", query: e }));
          }
          remove(e) {
            let t = this.#e.get(e.queryHash);
            t &&
              (e.destroy(),
              t === e && this.#e.delete(e.queryHash),
              this.notify({ type: "removed", query: e }));
          }
          clear() {
            s.jG.batch(() => {
              this.getAll().forEach((e) => {
                this.remove(e);
              });
            });
          }
          get(e) {
            return this.#e.get(e);
          }
          getAll() {
            return [...this.#e.values()];
          }
          find(e) {
            let t = { exact: !0, ...e };
            return this.getAll().find((e) => (0, n.MK)(t, e));
          }
          findAll(e = {}) {
            let t = this.getAll();
            return Object.keys(e).length > 0 ? t.filter((t) => (0, n.MK)(e, t)) : t;
          }
          notify(e) {
            s.jG.batch(() => {
              this.listeners.forEach((t) => {
                t(e);
              });
            });
          }
          onFocus() {
            s.jG.batch(() => {
              this.getAll().forEach((e) => {
                e.onFocus();
              });
            });
          }
          onOnline() {
            s.jG.batch(() => {
              this.getAll().forEach((e) => {
                e.onOnline();
              });
            });
          }
        },
        u = r(9737),
        l = r(3445),
        c = class extends u.k {
          #t;
          #r;
          #n;
          #i;
          constructor(e) {
            (super(),
              (this.#t = e.client),
              (this.mutationId = e.mutationId),
              (this.#n = e.mutationCache),
              (this.#r = []),
              (this.state = e.state || {
                context: void 0,
                data: void 0,
                error: null,
                failureCount: 0,
                failureReason: null,
                isPaused: !1,
                status: "idle",
                variables: void 0,
                submittedAt: 0,
              }),
              this.setOptions(e.options),
              this.scheduleGc());
          }
          setOptions(e) {
            ((this.options = e), this.updateGcTime(this.options.gcTime));
          }
          get meta() {
            return this.options.meta;
          }
          addObserver(e) {
            this.#r.includes(e) ||
              (this.#r.push(e),
              this.clearGcTimeout(),
              this.#n.notify({ type: "observerAdded", mutation: this, observer: e }));
          }
          removeObserver(e) {
            ((this.#r = this.#r.filter((t) => t !== e)),
              this.scheduleGc(),
              this.#n.notify({ type: "observerRemoved", mutation: this, observer: e }));
          }
          optionalRemove() {
            this.#r.length ||
              ("pending" === this.state.status ? this.scheduleGc() : this.#n.remove(this));
          }
          continue() {
            return this.#i?.continue() ?? this.execute(this.state.variables);
          }
          async execute(e) {
            let t = () => {
                this.#s({ type: "continue" });
              },
              r = {
                client: this.#t,
                meta: this.options.meta,
                mutationKey: this.options.mutationKey,
              };
            this.#i = (0, l.II)({
              fn: () =>
                this.options.mutationFn
                  ? this.options.mutationFn(e, r)
                  : Promise.reject(Error("No mutationFn found")),
              onFail: (e, t) => {
                this.#s({ type: "failed", failureCount: e, error: t });
              },
              onPause: () => {
                this.#s({ type: "pause" });
              },
              onContinue: t,
              retry: this.options.retry ?? 0,
              retryDelay: this.options.retryDelay,
              networkMode: this.options.networkMode,
              canRun: () => this.#n.canRun(this),
            });
            let n = "pending" === this.state.status,
              i = !this.#i.canStart();
            try {
              if (n) t();
              else {
                (this.#s({ type: "pending", variables: e, isPaused: i }),
                  await this.#n.config.onMutate?.(e, this, r));
                let t = await this.options.onMutate?.(e, r);
                t !== this.state.context &&
                  this.#s({ type: "pending", context: t, variables: e, isPaused: i });
              }
              let s = await this.#i.start();
              return (
                await this.#n.config.onSuccess?.(s, e, this.state.context, this, r),
                await this.options.onSuccess?.(s, e, this.state.context, r),
                await this.#n.config.onSettled?.(
                  s,
                  null,
                  this.state.variables,
                  this.state.context,
                  this,
                  r
                ),
                await this.options.onSettled?.(s, null, e, this.state.context, r),
                this.#s({ type: "success", data: s }),
                s
              );
            } catch (t) {
              try {
                throw (
                  await this.#n.config.onError?.(t, e, this.state.context, this, r),
                  await this.options.onError?.(t, e, this.state.context, r),
                  await this.#n.config.onSettled?.(
                    void 0,
                    t,
                    this.state.variables,
                    this.state.context,
                    this,
                    r
                  ),
                  await this.options.onSettled?.(void 0, t, e, this.state.context, r),
                  t
                );
              } finally {
                this.#s({ type: "error", error: t });
              }
            } finally {
              this.#n.runNext(this);
            }
          }
          #s(e) {
            ((this.state = ((t) => {
              switch (e.type) {
                case "failed":
                  return { ...t, failureCount: e.failureCount, failureReason: e.error };
                case "pause":
                  return { ...t, isPaused: !0 };
                case "continue":
                  return { ...t, isPaused: !1 };
                case "pending":
                  return {
                    ...t,
                    context: e.context,
                    data: void 0,
                    failureCount: 0,
                    failureReason: null,
                    error: null,
                    isPaused: e.isPaused,
                    status: "pending",
                    variables: e.variables,
                    submittedAt: Date.now(),
                  };
                case "success":
                  return {
                    ...t,
                    data: e.data,
                    failureCount: 0,
                    failureReason: null,
                    error: null,
                    status: "success",
                    isPaused: !1,
                  };
                case "error":
                  return {
                    ...t,
                    data: void 0,
                    error: e.error,
                    failureCount: t.failureCount + 1,
                    failureReason: e.error,
                    isPaused: !1,
                    status: "error",
                  };
              }
            })(this.state)),
              s.jG.batch(() => {
                (this.#r.forEach((t) => {
                  t.onMutationUpdate(e);
                }),
                  this.#n.notify({ mutation: this, type: "updated", action: e }));
              }));
          }
        },
        d = class extends a.Q {
          constructor(e = {}) {
            (super(),
              (this.config = e),
              (this.#a = new Set()),
              (this.#o = new Map()),
              (this.#u = 0));
          }
          #a;
          #o;
          #u;
          build(e, t, r) {
            let n = new c({
              client: e,
              mutationCache: this,
              mutationId: ++this.#u,
              options: e.defaultMutationOptions(t),
              state: r,
            });
            return (this.add(n), n);
          }
          add(e) {
            this.#a.add(e);
            let t = h(e);
            if ("string" == typeof t) {
              let r = this.#o.get(t);
              r ? r.push(e) : this.#o.set(t, [e]);
            }
            this.notify({ type: "added", mutation: e });
          }
          remove(e) {
            if (this.#a.delete(e)) {
              let t = h(e);
              if ("string" == typeof t) {
                let r = this.#o.get(t);
                if (r)
                  if (r.length > 1) {
                    let t = r.indexOf(e);
                    -1 !== t && r.splice(t, 1);
                  } else r[0] === e && this.#o.delete(t);
              }
            }
            this.notify({ type: "removed", mutation: e });
          }
          canRun(e) {
            let t = h(e);
            if ("string" != typeof t) return !0;
            {
              let r = this.#o.get(t),
                n = r?.find((e) => "pending" === e.state.status);
              return !n || n === e;
            }
          }
          runNext(e) {
            let t = h(e);
            if ("string" != typeof t) return Promise.resolve();
            {
              let r = this.#o.get(t)?.find((t) => t !== e && t.state.isPaused);
              return r?.continue() ?? Promise.resolve();
            }
          }
          clear() {
            s.jG.batch(() => {
              (this.#a.forEach((e) => {
                this.notify({ type: "removed", mutation: e });
              }),
                this.#a.clear(),
                this.#o.clear());
            });
          }
          getAll() {
            return Array.from(this.#a);
          }
          find(e) {
            let t = { exact: !0, ...e };
            return this.getAll().find((e) => (0, n.nJ)(t, e));
          }
          findAll(e = {}) {
            return this.getAll().filter((t) => (0, n.nJ)(e, t));
          }
          notify(e) {
            s.jG.batch(() => {
              this.listeners.forEach((t) => {
                t(e);
              });
            });
          }
          resumePausedMutations() {
            let e = this.getAll().filter((e) => e.state.isPaused);
            return s.jG.batch(() => Promise.all(e.map((e) => e.continue().catch(n.lQ))));
          }
        };
      function h(e) {
        return e.options.scope?.id;
      }
      var f = r(9591),
        p = r(2462);
      function m(e) {
        return {
          onFetch: (t, r) => {
            let i = t.options,
              s = t.fetchOptions?.meta?.fetchMore?.direction,
              a = t.state.data?.pages || [],
              o = t.state.data?.pageParams || [],
              u = { pages: [], pageParams: [] },
              l = 0,
              c = async () => {
                let r = !1,
                  c = (0, n.ZM)(t.options, t.fetchOptions),
                  d = async (e, i, s) => {
                    if (r) return Promise.reject();
                    if (null == i && e.pages.length) return Promise.resolve(e);
                    let a = (() => {
                        let e = {
                          client: t.client,
                          queryKey: t.queryKey,
                          pageParam: i,
                          direction: s ? "backward" : "forward",
                          meta: t.options.meta,
                        };
                        return (
                          Object.defineProperty(e, "signal", {
                            enumerable: !0,
                            get: () => (
                              t.signal.aborted
                                ? (r = !0)
                                : t.signal.addEventListener("abort", () => {
                                    r = !0;
                                  }),
                              t.signal
                            ),
                          }),
                          e
                        );
                      })(),
                      o = await c(a),
                      { maxPages: u } = t.options,
                      l = s ? n.ZZ : n.y9;
                    return { pages: l(e.pages, o, u), pageParams: l(e.pageParams, i, u) };
                  };
                if (s && a.length) {
                  let e = "backward" === s,
                    t = { pages: a, pageParams: o },
                    r = (
                      e
                        ? function (e, { pages: t, pageParams: r }) {
                            return t.length > 0
                              ? e.getPreviousPageParam?.(t[0], t, r[0], r)
                              : void 0;
                          }
                        : y
                    )(i, t);
                  u = await d(t, r, e);
                } else {
                  let t = e ?? a.length;
                  do {
                    let e = 0 === l ? (o[0] ?? i.initialPageParam) : y(i, u);
                    if (l > 0 && null == e) break;
                    ((u = await d(u, e)), l++);
                  } while (l < t);
                }
                return u;
              };
            t.options.persister
              ? (t.fetchFn = () =>
                  t.options.persister?.(
                    c,
                    {
                      client: t.client,
                      queryKey: t.queryKey,
                      meta: t.options.meta,
                      signal: t.signal,
                    },
                    r
                  ))
              : (t.fetchFn = c);
          },
        };
      }
      function y(e, { pages: t, pageParams: r }) {
        let n = t.length - 1;
        return t.length > 0 ? e.getNextPageParam(t[n], t, r[n], r) : void 0;
      }
      var v = class {
        #l;
        #n;
        #c;
        #d;
        #h;
        #f;
        #p;
        #m;
        constructor(e = {}) {
          ((this.#l = e.queryCache || new o()),
            (this.#n = e.mutationCache || new d()),
            (this.#c = e.defaultOptions || {}),
            (this.#d = new Map()),
            (this.#h = new Map()),
            (this.#f = 0));
        }
        mount() {
          (this.#f++,
            1 === this.#f &&
              ((this.#p = f.m.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#l.onFocus());
              })),
              (this.#m = p.t.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#l.onOnline());
              }))));
        }
        unmount() {
          (this.#f--,
            0 === this.#f && (this.#p?.(), (this.#p = void 0), this.#m?.(), (this.#m = void 0)));
        }
        isFetching(e) {
          return this.#l.findAll({ ...e, fetchStatus: "fetching" }).length;
        }
        isMutating(e) {
          return this.#n.findAll({ ...e, status: "pending" }).length;
        }
        getQueryData(e) {
          let t = this.defaultQueryOptions({ queryKey: e });
          return this.#l.get(t.queryHash)?.state.data;
        }
        ensureQueryData(e) {
          let t = this.defaultQueryOptions(e),
            r = this.#l.build(this, t),
            i = r.state.data;
          return void 0 === i
            ? this.fetchQuery(e)
            : (e.revalidateIfStale &&
                r.isStaleByTime((0, n.d2)(t.staleTime, r)) &&
                this.prefetchQuery(t),
              Promise.resolve(i));
        }
        getQueriesData(e) {
          return this.#l.findAll(e).map(({ queryKey: e, state: t }) => [e, t.data]);
        }
        setQueryData(e, t, r) {
          let i = this.defaultQueryOptions({ queryKey: e }),
            s = this.#l.get(i.queryHash),
            a = s?.state.data,
            o = (0, n.Zw)(t, a);
          if (void 0 !== o) return this.#l.build(this, i).setData(o, { ...r, manual: !0 });
        }
        setQueriesData(e, t, r) {
          return s.jG.batch(() =>
            this.#l.findAll(e).map(({ queryKey: e }) => [e, this.setQueryData(e, t, r)])
          );
        }
        getQueryState(e) {
          let t = this.defaultQueryOptions({ queryKey: e });
          return this.#l.get(t.queryHash)?.state;
        }
        removeQueries(e) {
          let t = this.#l;
          s.jG.batch(() => {
            t.findAll(e).forEach((e) => {
              t.remove(e);
            });
          });
        }
        resetQueries(e, t) {
          let r = this.#l;
          return s.jG.batch(
            () => (
              r.findAll(e).forEach((e) => {
                e.reset();
              }),
              this.refetchQueries({ type: "active", ...e }, t)
            )
          );
        }
        cancelQueries(e, t = {}) {
          let r = { revert: !0, ...t };
          return Promise.all(s.jG.batch(() => this.#l.findAll(e).map((e) => e.cancel(r))))
            .then(n.lQ)
            .catch(n.lQ);
        }
        invalidateQueries(e, t = {}) {
          return s.jG.batch(() =>
            (this.#l.findAll(e).forEach((e) => {
              e.invalidate();
            }),
            e?.refetchType === "none")
              ? Promise.resolve()
              : this.refetchQueries({ ...e, type: e?.refetchType ?? e?.type ?? "active" }, t)
          );
        }
        refetchQueries(e, t = {}) {
          let r = { ...t, cancelRefetch: t.cancelRefetch ?? !0 };
          return Promise.all(
            s.jG.batch(() =>
              this.#l
                .findAll(e)
                .filter((e) => !e.isDisabled() && !e.isStatic())
                .map((e) => {
                  let t = e.fetch(void 0, r);
                  return (
                    r.throwOnError || (t = t.catch(n.lQ)),
                    "paused" === e.state.fetchStatus ? Promise.resolve() : t
                  );
                })
            )
          ).then(n.lQ);
        }
        fetchQuery(e) {
          let t = this.defaultQueryOptions(e);
          void 0 === t.retry && (t.retry = !1);
          let r = this.#l.build(this, t);
          return r.isStaleByTime((0, n.d2)(t.staleTime, r))
            ? r.fetch(t)
            : Promise.resolve(r.state.data);
        }
        prefetchQuery(e) {
          return this.fetchQuery(e).then(n.lQ).catch(n.lQ);
        }
        fetchInfiniteQuery(e) {
          return ((e.behavior = m(e.pages)), this.fetchQuery(e));
        }
        prefetchInfiniteQuery(e) {
          return this.fetchInfiniteQuery(e).then(n.lQ).catch(n.lQ);
        }
        ensureInfiniteQueryData(e) {
          return ((e.behavior = m(e.pages)), this.ensureQueryData(e));
        }
        resumePausedMutations() {
          return p.t.isOnline() ? this.#n.resumePausedMutations() : Promise.resolve();
        }
        getQueryCache() {
          return this.#l;
        }
        getMutationCache() {
          return this.#n;
        }
        getDefaultOptions() {
          return this.#c;
        }
        setDefaultOptions(e) {
          this.#c = e;
        }
        setQueryDefaults(e, t) {
          this.#d.set((0, n.EN)(e), { queryKey: e, defaultOptions: t });
        }
        getQueryDefaults(e) {
          let t = [...this.#d.values()],
            r = {};
          return (
            t.forEach((t) => {
              (0, n.Cp)(e, t.queryKey) && Object.assign(r, t.defaultOptions);
            }),
            r
          );
        }
        setMutationDefaults(e, t) {
          this.#h.set((0, n.EN)(e), { mutationKey: e, defaultOptions: t });
        }
        getMutationDefaults(e) {
          let t = [...this.#h.values()],
            r = {};
          return (
            t.forEach((t) => {
              (0, n.Cp)(e, t.mutationKey) && Object.assign(r, t.defaultOptions);
            }),
            r
          );
        }
        defaultQueryOptions(e) {
          if (e._defaulted) return e;
          let t = {
            ...this.#c.queries,
            ...this.getQueryDefaults(e.queryKey),
            ...e,
            _defaulted: !0,
          };
          return (
            t.queryHash || (t.queryHash = (0, n.F$)(t.queryKey, t)),
            void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = "always" !== t.networkMode),
            void 0 === t.throwOnError && (t.throwOnError = !!t.suspense),
            !t.networkMode && t.persister && (t.networkMode = "offlineFirst"),
            t.queryFn === n.hT && (t.enabled = !1),
            t
          );
        }
        defaultMutationOptions(e) {
          return e?._defaulted
            ? e
            : {
                ...this.#c.mutations,
                ...(e?.mutationKey && this.getMutationDefaults(e.mutationKey)),
                ...e,
                _defaulted: !0,
              };
        }
        clear() {
          (this.#l.clear(), this.#n.clear());
        }
      };
    },
    3181: (e, t, r) => {
      "use strict";
      r.d(t, { A: () => n });
      let n = (0, r(1323).A)("X", [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
      ]);
    },
    3242: (e, t, r) => {
      "use strict";
      r.d(t, { E: () => n });
      var n = function () {
        return null;
      };
    },
    4665: (e) => {
      e.exports = {
        style: { fontFamily: "'Inter', 'Inter Fallback'", fontStyle: "normal" },
        className: "__className_f367f3",
      };
    },
    8381: (e, t, r) => {
      "use strict";
      r.d(t, {
        rc: () => ew,
        bm: () => eg,
        VY: () => ev,
        Kq: () => ef,
        bL: () => em,
        hE: () => ey,
        LM: () => ep,
      });
      var n,
        i,
        s = r(4361),
        a = r.t(s, 2),
        o = r(6892);
      function u(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
        return function (n) {
          if ((e?.(n), !1 === r || !n.defaultPrevented)) return t?.(n);
        };
      }
      "undefined" != typeof window && window.document && window.document.createElement;
      var l = r(7551);
      function c(e, t, r) {
        if (!t.has(e)) throw TypeError("attempted to " + r + " private field on non-instance");
        return t.get(e);
      }
      function d(e, t) {
        var r = c(e, t, "get");
        return r.get ? r.get.call(e) : r.value;
      }
      function h(e, t, r) {
        var n = c(e, t, "set");
        if (n.set) n.set.call(e, r);
        else {
          if (!n.writable) throw TypeError("attempted to set read only private field");
          n.value = r;
        }
        return r;
      }
      var f = r(2541);
      function p(e, t = []) {
        let r = [],
          n = () => {
            let t = r.map((e) => s.createContext(e));
            return function (r) {
              let n = r?.[e] || t;
              return s.useMemo(() => ({ [`__scope${e}`]: { ...r, [e]: n } }), [r, n]);
            };
          };
        return (
          (n.scopeName = e),
          [
            function (t, n) {
              let i = s.createContext(n),
                a = r.length;
              r = [...r, n];
              let o = (t) => {
                let { scope: r, children: n, ...o } = t,
                  u = r?.[e]?.[a] || i,
                  l = s.useMemo(() => o, Object.values(o));
                return (0, f.jsx)(u.Provider, { value: l, children: n });
              };
              return (
                (o.displayName = t + "Provider"),
                [
                  o,
                  function (r, o) {
                    let u = o?.[e]?.[a] || i,
                      l = s.useContext(u);
                    if (l) return l;
                    if (void 0 !== n) return n;
                    throw Error(`\`${r}\` must be used within \`${t}\``);
                  },
                ]
              );
            },
            (function (...e) {
              let t = e[0];
              if (1 === e.length) return t;
              let r = () => {
                let r = e.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
                return function (e) {
                  let n = r.reduce((t, { useScope: r, scopeName: n }) => {
                    let i = r(e)[`__scope${n}`];
                    return { ...t, ...i };
                  }, {});
                  return s.useMemo(() => ({ [`__scope${t.scopeName}`]: n }), [n]);
                };
              };
              return ((r.scopeName = t.scopeName), r);
            })(n, ...t),
          ]
        );
      }
      var m = r(357),
        y = new WeakMap();
      function v(e, t) {
        if ("at" in Array.prototype) return Array.prototype.at.call(e, t);
        let r = (function (e, t) {
          let r = e.length,
            n = w(t),
            i = n >= 0 ? n : r + n;
          return i < 0 || i >= r ? -1 : i;
        })(e, t);
        return -1 === r ? void 0 : e[r];
      }
      function w(e) {
        return e != e || 0 === e ? 0 : Math.trunc(e);
      }
      ((n = new WeakMap()),
        class e extends Map {
          set(e, t) {
            return (
              y.get(this) &&
                (this.has(e) ? (d(this, n)[d(this, n).indexOf(e)] = e) : d(this, n).push(e)),
              super.set(e, t),
              this
            );
          }
          insert(e, t, r) {
            let i,
              s = this.has(t),
              a = d(this, n).length,
              o = w(e),
              u = o >= 0 ? o : a + o,
              l = u < 0 || u >= a ? -1 : u;
            if (l === this.size || (s && l === this.size - 1) || -1 === l)
              return (this.set(t, r), this);
            let c = this.size + +!s;
            o < 0 && u++;
            let h = [...d(this, n)],
              f = !1;
            for (let e = u; e < c; e++)
              if (u === e) {
                let n = h[e];
                (h[e] === t && (n = h[e + 1]),
                  s && this.delete(t),
                  (i = this.get(n)),
                  this.set(t, r));
              } else {
                f || h[e - 1] !== t || (f = !0);
                let r = h[f ? e : e - 1],
                  n = i;
                ((i = this.get(r)), this.delete(r), this.set(r, n));
              }
            return this;
          }
          with(t, r, n) {
            let i = new e(this);
            return (i.insert(t, r, n), i);
          }
          before(e) {
            let t = d(this, n).indexOf(e) - 1;
            if (!(t < 0)) return this.entryAt(t);
          }
          setBefore(e, t, r) {
            let i = d(this, n).indexOf(e);
            return -1 === i ? this : this.insert(i, t, r);
          }
          after(e) {
            let t = d(this, n).indexOf(e);
            if (-1 !== (t = -1 === t || t === this.size - 1 ? -1 : t + 1)) return this.entryAt(t);
          }
          setAfter(e, t, r) {
            let i = d(this, n).indexOf(e);
            return -1 === i ? this : this.insert(i + 1, t, r);
          }
          first() {
            return this.entryAt(0);
          }
          last() {
            return this.entryAt(-1);
          }
          clear() {
            return (h(this, n, []), super.clear());
          }
          delete(e) {
            let t = super.delete(e);
            return (t && d(this, n).splice(d(this, n).indexOf(e), 1), t);
          }
          deleteAt(e) {
            let t = this.keyAt(e);
            return void 0 !== t && this.delete(t);
          }
          at(e) {
            let t = v(d(this, n), e);
            if (void 0 !== t) return this.get(t);
          }
          entryAt(e) {
            let t = v(d(this, n), e);
            if (void 0 !== t) return [t, this.get(t)];
          }
          indexOf(e) {
            return d(this, n).indexOf(e);
          }
          keyAt(e) {
            return v(d(this, n), e);
          }
          from(e, t) {
            let r = this.indexOf(e);
            if (-1 === r) return;
            let n = r + t;
            return (n < 0 && (n = 0), n >= this.size && (n = this.size - 1), this.at(n));
          }
          keyFrom(e, t) {
            let r = this.indexOf(e);
            if (-1 === r) return;
            let n = r + t;
            return (n < 0 && (n = 0), n >= this.size && (n = this.size - 1), this.keyAt(n));
          }
          find(e, t) {
            let r = 0;
            for (let n of this) {
              if (Reflect.apply(e, t, [n, r, this])) return n;
              r++;
            }
          }
          findIndex(e, t) {
            let r = 0;
            for (let n of this) {
              if (Reflect.apply(e, t, [n, r, this])) return r;
              r++;
            }
            return -1;
          }
          filter(t, r) {
            let n = [],
              i = 0;
            for (let e of this) (Reflect.apply(t, r, [e, i, this]) && n.push(e), i++);
            return new e(n);
          }
          map(t, r) {
            let n = [],
              i = 0;
            for (let e of this) (n.push([e[0], Reflect.apply(t, r, [e, i, this])]), i++);
            return new e(n);
          }
          reduce() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            let [n, i] = t,
              s = 0,
              a = null != i ? i : this.at(0);
            for (let e of this)
              ((a = 0 === s && 1 === t.length ? e : Reflect.apply(n, this, [a, e, s, this])), s++);
            return a;
          }
          reduceRight() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            let [n, i] = t,
              s = null != i ? i : this.at(-1);
            for (let e = this.size - 1; e >= 0; e--) {
              let r = this.at(e);
              s =
                e === this.size - 1 && 1 === t.length ? r : Reflect.apply(n, this, [s, r, e, this]);
            }
            return s;
          }
          toSorted(t) {
            return new e([...this.entries()].sort(t));
          }
          toReversed() {
            let t = new e();
            for (let e = this.size - 1; e >= 0; e--) {
              let r = this.keyAt(e),
                n = this.get(r);
              t.set(r, n);
            }
            return t;
          }
          toSpliced() {
            for (var t = arguments.length, r = Array(t), n = 0; n < t; n++) r[n] = arguments[n];
            let i = [...this.entries()];
            return (i.splice(...r), new e(i));
          }
          slice(t, r) {
            let n = new e(),
              i = this.size - 1;
            if (void 0 === t) return n;
            (t < 0 && (t += this.size), void 0 !== r && r > 0 && (i = r - 1));
            for (let e = t; e <= i; e++) {
              let t = this.keyAt(e),
                r = this.get(t);
              n.set(t, r);
            }
            return n;
          }
          every(e, t) {
            let r = 0;
            for (let n of this) {
              if (!Reflect.apply(e, t, [n, r, this])) return !1;
              r++;
            }
            return !0;
          }
          some(e, t) {
            let r = 0;
            for (let n of this) {
              if (Reflect.apply(e, t, [n, r, this])) return !0;
              r++;
            }
            return !1;
          }
          constructor(e) {
            (super(e),
              (function (e, t, r) {
                if (t.has(e))
                  throw TypeError("Cannot initialize the same private elements twice on an object");
                t.set(e, r);
              })(this, n, { writable: !0, value: void 0 }),
              h(this, n, [...super.keys()]),
              y.set(this, !0));
          }
        });
      var g = [
        "a",
        "button",
        "div",
        "form",
        "h2",
        "h3",
        "img",
        "input",
        "label",
        "li",
        "nav",
        "ol",
        "p",
        "select",
        "span",
        "svg",
        "ul",
      ].reduce((e, t) => {
        let r = (0, m.TL)(`Primitive.${t}`),
          n = s.forwardRef((e, n) => {
            let { asChild: i, ...s } = e;
            return (
              "undefined" != typeof window && (window[Symbol.for("radix-ui")] = !0),
              (0, f.jsx)(i ? r : t, { ...s, ref: n })
            );
          });
        return ((n.displayName = `Primitive.${t}`), { ...e, [t]: n });
      }, {});
      function b(e, t) {
        e && o.flushSync(() => e.dispatchEvent(t));
      }
      function E(e) {
        let t = s.useRef(e);
        return (
          s.useEffect(() => {
            t.current = e;
          }),
          s.useMemo(
            () =>
              (...e) =>
                t.current?.(...e),
            []
          )
        );
      }
      var C = "dismissableLayer.update",
        x = s.createContext({
          layers: new Set(),
          layersWithOutsidePointerEventsDisabled: new Set(),
          branches: new Set(),
        }),
        P = s.forwardRef((e, t) => {
          var r, n;
          let {
              disableOutsidePointerEvents: a = !1,
              onEscapeKeyDown: o,
              onPointerDownOutside: c,
              onFocusOutside: d,
              onInteractOutside: h,
              onDismiss: p,
              ...m
            } = e,
            y = s.useContext(x),
            [v, w] = s.useState(null),
            b =
              null != (n = null == v ? void 0 : v.ownerDocument)
                ? n
                : null == (r = globalThis)
                  ? void 0
                  : r.document,
            [, P] = s.useState({}),
            T = (0, l.s)(t, (e) => w(e)),
            D = Array.from(y.layers),
            [A] = [...y.layersWithOutsidePointerEventsDisabled].slice(-1),
            N = D.indexOf(A),
            M = v ? D.indexOf(v) : -1,
            S = y.layersWithOutsidePointerEventsDisabled.size > 0,
            j = M >= N,
            L = (function (e) {
              var t;
              let r =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : null == (t = globalThis)
                      ? void 0
                      : t.document,
                n = E(e),
                i = s.useRef(!1),
                a = s.useRef(() => {});
              return (
                s.useEffect(() => {
                  let e = (e) => {
                      if (e.target && !i.current) {
                        let t = function () {
                            R("dismissableLayer.pointerDownOutside", n, i, { discrete: !0 });
                          },
                          i = { originalEvent: e };
                        "touch" === e.pointerType
                          ? (r.removeEventListener("click", a.current),
                            (a.current = t),
                            r.addEventListener("click", a.current, { once: !0 }))
                          : t();
                      } else r.removeEventListener("click", a.current);
                      i.current = !1;
                    },
                    t = window.setTimeout(() => {
                      r.addEventListener("pointerdown", e);
                    }, 0);
                  return () => {
                    (window.clearTimeout(t),
                      r.removeEventListener("pointerdown", e),
                      r.removeEventListener("click", a.current));
                  };
                }, [r, n]),
                { onPointerDownCapture: () => (i.current = !0) }
              );
            })((e) => {
              let t = e.target,
                r = [...y.branches].some((e) => e.contains(t));
              j &&
                !r &&
                (null == c || c(e), null == h || h(e), e.defaultPrevented || null == p || p());
            }, b),
            q = (function (e) {
              var t;
              let r =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : null == (t = globalThis)
                      ? void 0
                      : t.document,
                n = E(e),
                i = s.useRef(!1);
              return (
                s.useEffect(() => {
                  let e = (e) => {
                    e.target &&
                      !i.current &&
                      R("dismissableLayer.focusOutside", n, { originalEvent: e }, { discrete: !1 });
                  };
                  return (
                    r.addEventListener("focusin", e),
                    () => r.removeEventListener("focusin", e)
                  );
                }, [r, n]),
                { onFocusCapture: () => (i.current = !0), onBlurCapture: () => (i.current = !1) }
              );
            })((e) => {
              let t = e.target;
              ![...y.branches].some((e) => e.contains(t)) &&
                (null == d || d(e), null == h || h(e), e.defaultPrevented || null == p || p());
            }, b);
          return (
            !(function (e, t = globalThis?.document) {
              let r = E(e);
              s.useEffect(() => {
                let e = (e) => {
                  "Escape" === e.key && r(e);
                };
                return (
                  t.addEventListener("keydown", e, { capture: !0 }),
                  () => t.removeEventListener("keydown", e, { capture: !0 })
                );
              }, [r, t]);
            })((e) => {
              M === y.layers.size - 1 &&
                (null == o || o(e), !e.defaultPrevented && p && (e.preventDefault(), p()));
            }, b),
            s.useEffect(() => {
              if (v)
                return (
                  a &&
                    (0 === y.layersWithOutsidePointerEventsDisabled.size &&
                      ((i = b.body.style.pointerEvents), (b.body.style.pointerEvents = "none")),
                    y.layersWithOutsidePointerEventsDisabled.add(v)),
                  y.layers.add(v),
                  O(),
                  () => {
                    a &&
                      1 === y.layersWithOutsidePointerEventsDisabled.size &&
                      (b.body.style.pointerEvents = i);
                  }
                );
            }, [v, b, a, y]),
            s.useEffect(
              () => () => {
                v && (y.layers.delete(v), y.layersWithOutsidePointerEventsDisabled.delete(v), O());
              },
              [v, y]
            ),
            s.useEffect(() => {
              let e = () => P({});
              return (document.addEventListener(C, e), () => document.removeEventListener(C, e));
            }, []),
            (0, f.jsx)(g.div, {
              ...m,
              ref: T,
              style: { pointerEvents: S ? (j ? "auto" : "none") : void 0, ...e.style },
              onFocusCapture: u(e.onFocusCapture, q.onFocusCapture),
              onBlurCapture: u(e.onBlurCapture, q.onBlurCapture),
              onPointerDownCapture: u(e.onPointerDownCapture, L.onPointerDownCapture),
            })
          );
        });
      P.displayName = "DismissableLayer";
      var T = s.forwardRef((e, t) => {
        let r = s.useContext(x),
          n = s.useRef(null),
          i = (0, l.s)(t, n);
        return (
          s.useEffect(() => {
            let e = n.current;
            if (e)
              return (
                r.branches.add(e),
                () => {
                  r.branches.delete(e);
                }
              );
          }, [r.branches]),
          (0, f.jsx)(g.div, { ...e, ref: i })
        );
      });
      function O() {
        let e = new CustomEvent(C);
        document.dispatchEvent(e);
      }
      function R(e, t, r, n) {
        let { discrete: i } = n,
          s = r.originalEvent.target,
          a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
        (t && s.addEventListener(e, t, { once: !0 }), i ? b(s, a) : s.dispatchEvent(a));
      }
      T.displayName = "DismissableLayerBranch";
      var D = globalThis?.document ? s.useLayoutEffect : () => {},
        A = s.forwardRef((e, t) => {
          var r, n;
          let { container: i, ...a } = e,
            [u, l] = s.useState(!1);
          D(() => l(!0), []);
          let c =
            i || (u && (null == (n = globalThis) || null == (r = n.document) ? void 0 : r.body));
          return c ? o.createPortal((0, f.jsx)(g.div, { ...a, ref: t }), c) : null;
        });
      A.displayName = "Portal";
      var N = (e) => {
        let { present: t, children: r } = e,
          n = (function (e) {
            var t, r;
            let [n, i] = s.useState(),
              a = s.useRef(null),
              o = s.useRef(e),
              u = s.useRef("none"),
              [l, c] =
                ((t = e ? "mounted" : "unmounted"),
                (r = {
                  mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
                  unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
                  unmounted: { MOUNT: "mounted" },
                }),
                s.useReducer((e, t) => {
                  let n = r[e][t];
                  return null != n ? n : e;
                }, t));
            return (
              s.useEffect(() => {
                let e = M(a.current);
                u.current = "mounted" === l ? e : "none";
              }, [l]),
              D(() => {
                let t = a.current,
                  r = o.current;
                if (r !== e) {
                  let n = u.current,
                    i = M(t);
                  (e
                    ? c("MOUNT")
                    : "none" === i || (null == t ? void 0 : t.display) === "none"
                      ? c("UNMOUNT")
                      : r && n !== i
                        ? c("ANIMATION_OUT")
                        : c("UNMOUNT"),
                    (o.current = e));
                }
              }, [e, c]),
              D(() => {
                if (n) {
                  var e;
                  let t,
                    r = null != (e = n.ownerDocument.defaultView) ? e : window,
                    i = (e) => {
                      let i = M(a.current).includes(CSS.escape(e.animationName));
                      if (e.target === n && i && (c("ANIMATION_END"), !o.current)) {
                        let e = n.style.animationFillMode;
                        ((n.style.animationFillMode = "forwards"),
                          (t = r.setTimeout(() => {
                            "forwards" === n.style.animationFillMode &&
                              (n.style.animationFillMode = e);
                          })));
                      }
                    },
                    s = (e) => {
                      e.target === n && (u.current = M(a.current));
                    };
                  return (
                    n.addEventListener("animationstart", s),
                    n.addEventListener("animationcancel", i),
                    n.addEventListener("animationend", i),
                    () => {
                      (r.clearTimeout(t),
                        n.removeEventListener("animationstart", s),
                        n.removeEventListener("animationcancel", i),
                        n.removeEventListener("animationend", i));
                    }
                  );
                }
                c("ANIMATION_END");
              }, [n, c]),
              {
                isPresent: ["mounted", "unmountSuspended"].includes(l),
                ref: s.useCallback((e) => {
                  ((a.current = e ? getComputedStyle(e) : null), i(e));
                }, []),
              }
            );
          })(t),
          i = "function" == typeof r ? r({ present: n.isPresent }) : s.Children.only(r),
          a = (0, l.s)(
            n.ref,
            (function (e) {
              var t, r;
              let n =
                  null == (t = Object.getOwnPropertyDescriptor(e.props, "ref")) ? void 0 : t.get,
                i = n && "isReactWarning" in n && n.isReactWarning;
              return i
                ? e.ref
                : (i =
                      (n =
                        null == (r = Object.getOwnPropertyDescriptor(e, "ref")) ? void 0 : r.get) &&
                      "isReactWarning" in n &&
                      n.isReactWarning)
                  ? e.props.ref
                  : e.props.ref || e.ref;
            })(i)
          );
        return "function" == typeof r || n.isPresent ? s.cloneElement(i, { ref: a }) : null;
      };
      function M(e) {
        return (null == e ? void 0 : e.animationName) || "none";
      }
      N.displayName = "Presence";
      var S = a[" useInsertionEffect ".trim().toString()] || D;
      Symbol("RADIX:SYNC_STATE");
      var j = Object.freeze({
          position: "absolute",
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          wordWrap: "normal",
        }),
        L = s.forwardRef((e, t) =>
          (0, f.jsx)(g.span, { ...e, ref: t, style: { ...j, ...e.style } })
        );
      L.displayName = "VisuallyHidden";
      var q = "ToastProvider",
        [k, F, I] = (function (e) {
          let t = e + "CollectionProvider",
            [r, n] = p(t),
            [i, a] = r(t, { collectionRef: { current: null }, itemMap: new Map() }),
            o = (e) => {
              let { scope: t, children: r } = e,
                n = s.useRef(null),
                a = s.useRef(new Map()).current;
              return (0, f.jsx)(i, { scope: t, itemMap: a, collectionRef: n, children: r });
            };
          o.displayName = t;
          let u = e + "CollectionSlot",
            c = (0, m.TL)(u),
            d = s.forwardRef((e, t) => {
              let { scope: r, children: n } = e,
                i = a(u, r),
                s = (0, l.s)(t, i.collectionRef);
              return (0, f.jsx)(c, { ref: s, children: n });
            });
          d.displayName = u;
          let h = e + "CollectionItemSlot",
            y = "data-radix-collection-item",
            v = (0, m.TL)(h),
            w = s.forwardRef((e, t) => {
              let { scope: r, children: n, ...i } = e,
                o = s.useRef(null),
                u = (0, l.s)(t, o),
                c = a(h, r);
              return (
                s.useEffect(
                  () => (c.itemMap.set(o, { ref: o, ...i }), () => void c.itemMap.delete(o))
                ),
                (0, f.jsx)(v, { ...{ [y]: "" }, ref: u, children: n })
              );
            });
          return (
            (w.displayName = h),
            [
              { Provider: o, Slot: d, ItemSlot: w },
              function (t) {
                let r = a(e + "CollectionConsumer", t);
                return s.useCallback(() => {
                  let e = r.collectionRef.current;
                  if (!e) return [];
                  let t = Array.from(e.querySelectorAll("[".concat(y, "]")));
                  return Array.from(r.itemMap.values()).sort(
                    (e, r) => t.indexOf(e.ref.current) - t.indexOf(r.ref.current)
                  );
                }, [r.collectionRef, r.itemMap]);
              },
              n,
            ]
          );
        })("Toast"),
        [Q, K] = p("Toast", [I]),
        [_, z] = Q(q),
        G = (e) => {
          let {
              __scopeToast: t,
              label: r = "Notification",
              duration: n = 5e3,
              swipeDirection: i = "right",
              swipeThreshold: a = 50,
              children: o,
            } = e,
            [u, l] = s.useState(null),
            [c, d] = s.useState(0),
            h = s.useRef(!1),
            p = s.useRef(!1);
          return (
            r.trim() ||
              console.error(
                "Invalid prop `label` supplied to `".concat(q, "`. Expected non-empty `string`.")
              ),
            (0, f.jsx)(k.Provider, {
              scope: t,
              children: (0, f.jsx)(_, {
                scope: t,
                label: r,
                duration: n,
                swipeDirection: i,
                swipeThreshold: a,
                toastCount: c,
                viewport: u,
                onViewportChange: l,
                onToastAdd: s.useCallback(() => d((e) => e + 1), []),
                onToastRemove: s.useCallback(() => d((e) => e - 1), []),
                isFocusedToastEscapeKeyDownRef: h,
                isClosePausedRef: p,
                children: o,
              }),
            })
          );
        };
      G.displayName = q;
      var W = "ToastViewport",
        U = ["F8"],
        H = "toast.viewportPause",
        $ = "toast.viewportResume",
        B = s.forwardRef((e, t) => {
          let { __scopeToast: r, hotkey: n = U, label: i = "Notifications ({hotkey})", ...a } = e,
            o = z(W, r),
            u = F(r),
            c = s.useRef(null),
            d = s.useRef(null),
            h = s.useRef(null),
            p = s.useRef(null),
            m = (0, l.s)(t, p, o.onViewportChange),
            y = n.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
            v = o.toastCount > 0;
          (s.useEffect(() => {
            let e = (e) => {
              var t;
              0 !== n.length &&
                n.every((t) => e[t] || e.code === t) &&
                (null == (t = p.current) || t.focus());
            };
            return (
              document.addEventListener("keydown", e),
              () => document.removeEventListener("keydown", e)
            );
          }, [n]),
            s.useEffect(() => {
              let e = c.current,
                t = p.current;
              if (v && e && t) {
                let r = () => {
                    if (!o.isClosePausedRef.current) {
                      let e = new CustomEvent(H);
                      (t.dispatchEvent(e), (o.isClosePausedRef.current = !0));
                    }
                  },
                  n = () => {
                    if (o.isClosePausedRef.current) {
                      let e = new CustomEvent($);
                      (t.dispatchEvent(e), (o.isClosePausedRef.current = !1));
                    }
                  },
                  i = (t) => {
                    e.contains(t.relatedTarget) || n();
                  },
                  s = () => {
                    e.contains(document.activeElement) || n();
                  };
                return (
                  e.addEventListener("focusin", r),
                  e.addEventListener("focusout", i),
                  e.addEventListener("pointermove", r),
                  e.addEventListener("pointerleave", s),
                  window.addEventListener("blur", r),
                  window.addEventListener("focus", n),
                  () => {
                    (e.removeEventListener("focusin", r),
                      e.removeEventListener("focusout", i),
                      e.removeEventListener("pointermove", r),
                      e.removeEventListener("pointerleave", s),
                      window.removeEventListener("blur", r),
                      window.removeEventListener("focus", n));
                  }
                );
              }
            }, [v, o.isClosePausedRef]));
          let w = s.useCallback(
            (e) => {
              let { tabbingDirection: t } = e,
                r = u().map((e) => {
                  let r = e.ref.current,
                    n = [
                      r,
                      ...(function (e) {
                        let t = [],
                          r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
                            acceptNode: (e) => {
                              let t = "INPUT" === e.tagName && "hidden" === e.type;
                              return e.disabled || e.hidden || t
                                ? NodeFilter.FILTER_SKIP
                                : e.tabIndex >= 0
                                  ? NodeFilter.FILTER_ACCEPT
                                  : NodeFilter.FILTER_SKIP;
                            },
                          });
                        for (; r.nextNode(); ) t.push(r.currentNode);
                        return t;
                      })(r),
                    ];
                  return "forwards" === t ? n : n.reverse();
                });
              return ("forwards" === t ? r.reverse() : r).flat();
            },
            [u]
          );
          return (
            s.useEffect(() => {
              let e = p.current;
              if (e) {
                let t = (t) => {
                  let r = t.altKey || t.ctrlKey || t.metaKey;
                  if ("Tab" === t.key && !r) {
                    var n, i, s;
                    let r = document.activeElement,
                      a = t.shiftKey;
                    if (t.target === e && a) {
                      null == (n = d.current) || n.focus();
                      return;
                    }
                    let o = w({ tabbingDirection: a ? "backwards" : "forwards" }),
                      u = o.findIndex((e) => e === r);
                    eh(o.slice(u + 1))
                      ? t.preventDefault()
                      : a
                        ? null == (i = d.current) || i.focus()
                        : null == (s = h.current) || s.focus();
                  }
                };
                return (
                  e.addEventListener("keydown", t),
                  () => e.removeEventListener("keydown", t)
                );
              }
            }, [u, w]),
            (0, f.jsxs)(T, {
              ref: c,
              role: "region",
              "aria-label": i.replace("{hotkey}", y),
              tabIndex: -1,
              style: { pointerEvents: v ? void 0 : "none" },
              children: [
                v &&
                  (0, f.jsx)(X, {
                    ref: d,
                    onFocusFromOutsideViewport: () => {
                      eh(w({ tabbingDirection: "forwards" }));
                    },
                  }),
                (0, f.jsx)(k.Slot, {
                  scope: r,
                  children: (0, f.jsx)(g.ol, { tabIndex: -1, ...a, ref: m }),
                }),
                v &&
                  (0, f.jsx)(X, {
                    ref: h,
                    onFocusFromOutsideViewport: () => {
                      eh(w({ tabbingDirection: "backwards" }));
                    },
                  }),
              ],
            })
          );
        });
      B.displayName = W;
      var V = "ToastFocusProxy",
        X = s.forwardRef((e, t) => {
          let { __scopeToast: r, onFocusFromOutsideViewport: n, ...i } = e,
            s = z(V, r);
          return (0, f.jsx)(L, {
            tabIndex: 0,
            ...i,
            ref: t,
            style: { position: "fixed" },
            onFocus: (e) => {
              var t;
              let r = e.relatedTarget;
              (null == (t = s.viewport) ? void 0 : t.contains(r)) || n();
            },
          });
        });
      X.displayName = V;
      var Y = "Toast",
        Z = s.forwardRef((e, t) => {
          let { forceMount: r, open: n, defaultOpen: i, onOpenChange: a, ...o } = e,
            [l, c] = (function ({ prop: e, defaultProp: t, onChange: r = () => {}, caller: n }) {
              let [i, a, o] = (function ({ defaultProp: e, onChange: t }) {
                  let [r, n] = s.useState(e),
                    i = s.useRef(r),
                    a = s.useRef(t);
                  return (
                    S(() => {
                      a.current = t;
                    }, [t]),
                    s.useEffect(() => {
                      i.current !== r && (a.current?.(r), (i.current = r));
                    }, [r, i]),
                    [r, n, a]
                  );
                })({ defaultProp: t, onChange: r }),
                u = void 0 !== e,
                l = u ? e : i;
              {
                let t = s.useRef(void 0 !== e);
                s.useEffect(() => {
                  let e = t.current;
                  if (e !== u) {
                    let t = u ? "controlled" : "uncontrolled";
                    console.warn(
                      `${n} is changing from ${e ? "controlled" : "uncontrolled"} to ${t}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
                    );
                  }
                  t.current = u;
                }, [u, n]);
              }
              return [
                l,
                s.useCallback(
                  (t) => {
                    if (u) {
                      let r = "function" == typeof t ? t(e) : t;
                      r !== e && o.current?.(r);
                    } else a(t);
                  },
                  [u, e, a, o]
                ),
              ];
            })({ prop: n, defaultProp: null == i || i, onChange: a, caller: Y });
          return (0, f.jsx)(N, {
            present: r || l,
            children: (0, f.jsx)(et, {
              open: l,
              ...o,
              ref: t,
              onClose: () => c(!1),
              onPause: E(e.onPause),
              onResume: E(e.onResume),
              onSwipeStart: u(e.onSwipeStart, (e) => {
                e.currentTarget.setAttribute("data-swipe", "start");
              }),
              onSwipeMove: u(e.onSwipeMove, (e) => {
                let { x: t, y: r } = e.detail.delta;
                (e.currentTarget.setAttribute("data-swipe", "move"),
                  e.currentTarget.style.setProperty(
                    "--radix-toast-swipe-move-x",
                    "".concat(t, "px")
                  ),
                  e.currentTarget.style.setProperty(
                    "--radix-toast-swipe-move-y",
                    "".concat(r, "px")
                  ));
              }),
              onSwipeCancel: u(e.onSwipeCancel, (e) => {
                (e.currentTarget.setAttribute("data-swipe", "cancel"),
                  e.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
                  e.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
                  e.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"),
                  e.currentTarget.style.removeProperty("--radix-toast-swipe-end-y"));
              }),
              onSwipeEnd: u(e.onSwipeEnd, (e) => {
                let { x: t, y: r } = e.detail.delta;
                (e.currentTarget.setAttribute("data-swipe", "end"),
                  e.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
                  e.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
                  e.currentTarget.style.setProperty(
                    "--radix-toast-swipe-end-x",
                    "".concat(t, "px")
                  ),
                  e.currentTarget.style.setProperty(
                    "--radix-toast-swipe-end-y",
                    "".concat(r, "px")
                  ),
                  c(!1));
              }),
            }),
          });
        });
      Z.displayName = Y;
      var [J, ee] = Q(Y, { onClose() {} }),
        et = s.forwardRef((e, t) => {
          let {
              __scopeToast: r,
              type: n = "foreground",
              duration: i,
              open: a,
              onClose: c,
              onEscapeKeyDown: d,
              onPause: h,
              onResume: p,
              onSwipeStart: m,
              onSwipeMove: y,
              onSwipeCancel: v,
              onSwipeEnd: w,
              ...b
            } = e,
            C = z(Y, r),
            [x, T] = s.useState(null),
            O = (0, l.s)(t, (e) => T(e)),
            R = s.useRef(null),
            D = s.useRef(null),
            A = i || C.duration,
            N = s.useRef(0),
            M = s.useRef(A),
            S = s.useRef(0),
            { onToastAdd: j, onToastRemove: L } = C,
            q = E(() => {
              var e;
              ((null == x ? void 0 : x.contains(document.activeElement)) &&
                (null == (e = C.viewport) || e.focus()),
                c());
            }),
            F = s.useCallback(
              (e) => {
                e &&
                  e !== 1 / 0 &&
                  (window.clearTimeout(S.current),
                  (N.current = new Date().getTime()),
                  (S.current = window.setTimeout(q, e)));
              },
              [q]
            );
          (s.useEffect(() => {
            let e = C.viewport;
            if (e) {
              let t = () => {
                  (F(M.current), null == p || p());
                },
                r = () => {
                  let e = new Date().getTime() - N.current;
                  ((M.current = M.current - e), window.clearTimeout(S.current), null == h || h());
                };
              return (
                e.addEventListener(H, r),
                e.addEventListener($, t),
                () => {
                  (e.removeEventListener(H, r), e.removeEventListener($, t));
                }
              );
            }
          }, [C.viewport, A, h, p, F]),
            s.useEffect(() => {
              a && !C.isClosePausedRef.current && F(A);
            }, [a, A, C.isClosePausedRef, F]),
            s.useEffect(() => (j(), () => L()), [j, L]));
          let I = s.useMemo(
            () =>
              x
                ? (function e(t) {
                    let r = [];
                    return (
                      Array.from(t.childNodes).forEach((t) => {
                        var n;
                        if (
                          (t.nodeType === t.TEXT_NODE && t.textContent && r.push(t.textContent),
                          (n = t).nodeType === n.ELEMENT_NODE)
                        ) {
                          let n = t.ariaHidden || t.hidden || "none" === t.style.display,
                            i = "" === t.dataset.radixToastAnnounceExclude;
                          if (!n)
                            if (i) {
                              let e = t.dataset.radixToastAnnounceAlt;
                              e && r.push(e);
                            } else r.push(...e(t));
                        }
                      }),
                      r
                    );
                  })(x)
                : null,
            [x]
          );
          return C.viewport
            ? (0, f.jsxs)(f.Fragment, {
                children: [
                  I &&
                    (0, f.jsx)(er, {
                      __scopeToast: r,
                      role: "status",
                      "aria-live": "foreground" === n ? "assertive" : "polite",
                      children: I,
                    }),
                  (0, f.jsx)(J, {
                    scope: r,
                    onClose: q,
                    children: o.createPortal(
                      (0, f.jsx)(k.ItemSlot, {
                        scope: r,
                        children: (0, f.jsx)(P, {
                          asChild: !0,
                          onEscapeKeyDown: u(d, () => {
                            (C.isFocusedToastEscapeKeyDownRef.current || q(),
                              (C.isFocusedToastEscapeKeyDownRef.current = !1));
                          }),
                          children: (0, f.jsx)(g.li, {
                            tabIndex: 0,
                            "data-state": a ? "open" : "closed",
                            "data-swipe-direction": C.swipeDirection,
                            ...b,
                            ref: O,
                            style: { userSelect: "none", touchAction: "none", ...e.style },
                            onKeyDown: u(e.onKeyDown, (e) => {
                              "Escape" === e.key &&
                                (null == d || d(e.nativeEvent),
                                e.nativeEvent.defaultPrevented ||
                                  ((C.isFocusedToastEscapeKeyDownRef.current = !0), q()));
                            }),
                            onPointerDown: u(e.onPointerDown, (e) => {
                              0 === e.button && (R.current = { x: e.clientX, y: e.clientY });
                            }),
                            onPointerMove: u(e.onPointerMove, (e) => {
                              if (!R.current) return;
                              let t = e.clientX - R.current.x,
                                r = e.clientY - R.current.y,
                                n = !!D.current,
                                i = ["left", "right"].includes(C.swipeDirection),
                                s = ["left", "up"].includes(C.swipeDirection) ? Math.min : Math.max,
                                a = i ? s(0, t) : 0,
                                o = i ? 0 : s(0, r),
                                u = "touch" === e.pointerType ? 10 : 2,
                                l = { x: a, y: o },
                                c = { originalEvent: e, delta: l };
                              n
                                ? ((D.current = l), ec("toast.swipeMove", y, c, { discrete: !1 }))
                                : ed(l, C.swipeDirection, u)
                                  ? ((D.current = l),
                                    ec("toast.swipeStart", m, c, { discrete: !1 }),
                                    e.target.setPointerCapture(e.pointerId))
                                  : (Math.abs(t) > u || Math.abs(r) > u) && (R.current = null);
                            }),
                            onPointerUp: u(e.onPointerUp, (e) => {
                              let t = D.current,
                                r = e.target;
                              if (
                                (r.hasPointerCapture(e.pointerId) &&
                                  r.releasePointerCapture(e.pointerId),
                                (D.current = null),
                                (R.current = null),
                                t)
                              ) {
                                let r = e.currentTarget,
                                  n = { originalEvent: e, delta: t };
                                (ed(t, C.swipeDirection, C.swipeThreshold)
                                  ? ec("toast.swipeEnd", w, n, { discrete: !0 })
                                  : ec("toast.swipeCancel", v, n, { discrete: !0 }),
                                  r.addEventListener("click", (e) => e.preventDefault(), {
                                    once: !0,
                                  }));
                              }
                            }),
                          }),
                        }),
                      }),
                      C.viewport
                    ),
                  }),
                ],
              })
            : null;
        }),
        er = (e) => {
          let { __scopeToast: t, children: r, ...n } = e,
            i = z(Y, t),
            [a, o] = s.useState(!1),
            [u, l] = s.useState(!1);
          return (
            (function () {
              let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : () => {},
                t = E(e);
              D(() => {
                let e = 0,
                  r = 0;
                return (
                  (e = window.requestAnimationFrame(() => (r = window.requestAnimationFrame(t)))),
                  () => {
                    (window.cancelAnimationFrame(e), window.cancelAnimationFrame(r));
                  }
                );
              }, [t]);
            })(() => o(!0)),
            s.useEffect(() => {
              let e = window.setTimeout(() => l(!0), 1e3);
              return () => window.clearTimeout(e);
            }, []),
            u
              ? null
              : (0, f.jsx)(A, {
                  asChild: !0,
                  children: (0, f.jsx)(L, {
                    ...n,
                    children: a && (0, f.jsxs)(f.Fragment, { children: [i.label, " ", r] }),
                  }),
                })
          );
        },
        en = s.forwardRef((e, t) => {
          let { __scopeToast: r, ...n } = e;
          return (0, f.jsx)(g.div, { ...n, ref: t });
        });
      en.displayName = "ToastTitle";
      var ei = s.forwardRef((e, t) => {
        let { __scopeToast: r, ...n } = e;
        return (0, f.jsx)(g.div, { ...n, ref: t });
      });
      ei.displayName = "ToastDescription";
      var es = "ToastAction",
        ea = s.forwardRef((e, t) => {
          let { altText: r, ...n } = e;
          return r.trim()
            ? (0, f.jsx)(el, {
                altText: r,
                asChild: !0,
                children: (0, f.jsx)(eu, { ...n, ref: t }),
              })
            : (console.error(
                "Invalid prop `altText` supplied to `".concat(es, "`. Expected non-empty `string`.")
              ),
              null);
        });
      ea.displayName = es;
      var eo = "ToastClose",
        eu = s.forwardRef((e, t) => {
          let { __scopeToast: r, ...n } = e,
            i = ee(eo, r);
          return (0, f.jsx)(el, {
            asChild: !0,
            children: (0, f.jsx)(g.button, {
              type: "button",
              ...n,
              ref: t,
              onClick: u(e.onClick, i.onClose),
            }),
          });
        });
      eu.displayName = eo;
      var el = s.forwardRef((e, t) => {
        let { __scopeToast: r, altText: n, ...i } = e;
        return (0, f.jsx)(g.div, {
          "data-radix-toast-announce-exclude": "",
          "data-radix-toast-announce-alt": n || void 0,
          ...i,
          ref: t,
        });
      });
      function ec(e, t, r, n) {
        let { discrete: i } = n,
          s = r.originalEvent.currentTarget,
          a = new CustomEvent(e, { bubbles: !0, cancelable: !0, detail: r });
        (t && s.addEventListener(e, t, { once: !0 }), i ? b(s, a) : s.dispatchEvent(a));
      }
      var ed = function (e, t) {
        let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
          n = Math.abs(e.x),
          i = Math.abs(e.y),
          s = n > i;
        return "left" === t || "right" === t ? s && n > r : !s && i > r;
      };
      function eh(e) {
        let t = document.activeElement;
        return e.some((e) => e === t || (e.focus(), document.activeElement !== t));
      }
      var ef = G,
        ep = B,
        em = Z,
        ey = en,
        ev = ei,
        ew = ea,
        eg = eu;
    },
  },
]);
