(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [974],
  {
    219: (e, s, t) => {
      "use strict";
      t.d(s, { Pools: () => h });
      var r = t(2541),
        l = t(7629),
        a = t(8104),
        i = t(6716),
        n = t(7126);
      t(4361);
      var d = t(7836),
        c = t(2117);
      let o = (0, d.F)(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          variants: {
            variant: {
              default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
              secondary:
                "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
              destructive:
                "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
              outline: "text-foreground",
              success: "border-transparent bg-green-500 text-white hover:bg-green-600",
              warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
              premium:
                "border-transparent bg-gradient-to-r from-gold-accent to-yellow-500 text-white hover:from-gold-accent/90 hover:to-yellow-500/90",
            },
          },
          defaultVariants: { variant: "default" },
        }
      );
      function x(e) {
        let { className: s, variant: t, ...l } = e;
        return (0, r.jsx)("div", { className: (0, c.cn)(o({ variant: t }), s), ...l });
      }
      var m = t(6036),
        u = t(6428),
        g = t(9191);
      function h() {
        let { data: e, isLoading: s } = (0, l.I)({ queryKey: ["pools"], queryFn: a.oJ.getAll });
        return s
          ? (0, r.jsx)("section", {
              className: "py-20",
              children: (0, r.jsxs)("div", {
                className: "container mx-auto px-4",
                children: [
                  (0, r.jsxs)("div", {
                    className: "text-center mb-16",
                    children: [
                      (0, r.jsx)("h2", {
                        className: "text-3xl lg:text-4xl font-bold mb-4",
                        children: "Доступные пулы",
                      }),
                      (0, r.jsx)("p", {
                        className: "text-xl text-muted-foreground",
                        children: "Выберите подходящий пул для инвестирования",
                      }),
                    ],
                  }),
                  (0, r.jsx)("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                    children: [void 0, void 0, void 0].map((e, s) =>
                      (0, r.jsxs)(
                        i.Zp,
                        {
                          className: "animate-pulse",
                          children: [
                            (0, r.jsxs)(i.aR, {
                              children: [
                                (0, r.jsx)("div", { className: "h-6 bg-muted rounded mb-2" }),
                                (0, r.jsx)("div", { className: "h-4 bg-muted rounded w-2/3" }),
                              ],
                            }),
                            (0, r.jsx)(i.Wu, {
                              children: (0, r.jsxs)("div", {
                                className: "space-y-3",
                                children: [
                                  (0, r.jsx)("div", { className: "h-4 bg-muted rounded" }),
                                  (0, r.jsx)("div", { className: "h-4 bg-muted rounded w-1/2" }),
                                  (0, r.jsx)("div", { className: "h-10 bg-muted rounded" }),
                                ],
                              }),
                            }),
                          ],
                        },
                        s
                      )
                    ),
                  }),
                ],
              }),
            })
          : (0, r.jsx)("section", {
              className: "py-20",
              children: (0, r.jsxs)("div", {
                className: "container mx-auto px-4",
                children: [
                  (0, r.jsxs)("div", {
                    className: "text-center mb-16",
                    children: [
                      (0, r.jsx)("h2", {
                        className: "text-3xl lg:text-4xl font-bold mb-4",
                        children: "Доступные пулы",
                      }),
                      (0, r.jsx)("p", {
                        className: "text-xl text-muted-foreground",
                        children: "Выберите подходящий пул для инвестирования",
                      }),
                    ],
                  }),
                  (0, r.jsx)("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                    children:
                      null == e
                        ? void 0
                        : e.map((e) =>
                            (0, r.jsxs)(
                              i.Zp,
                              {
                                className: "group hover:shadow-lg transition-all duration-300",
                                children: [
                                  (0, r.jsxs)(i.aR, {
                                    children: [
                                      (0, r.jsxs)("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                          (0, r.jsxs)(i.ZB, {
                                            className: "text-xl",
                                            children: ["Пул #", e.id],
                                          }),
                                          (0, r.jsxs)(x, {
                                            variant: "secondary",
                                            children: [e.lockMonths, " мес"],
                                          }),
                                        ],
                                      }),
                                      (0, r.jsxs)(i.BT, {
                                        children: ["Блокировка на ", e.lockMonths, " месяцев"],
                                      }),
                                    ],
                                  }),
                                  (0, r.jsxs)(i.Wu, {
                                    className: "space-y-4",
                                    children: [
                                      (0, r.jsxs)("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                          (0, r.jsxs)("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                              (0, r.jsx)(m.A, {
                                                className: "h-4 w-4 text-green-500",
                                              }),
                                              (0, r.jsx)("span", {
                                                className: "text-sm text-muted-foreground",
                                                children: "APY",
                                              }),
                                            ],
                                          }),
                                          (0, r.jsx)("span", {
                                            className: "text-2xl font-bold text-green-500",
                                            children: (0, c.Ee)(e.apyBaseBp / 100),
                                          }),
                                        ],
                                      }),
                                      (0, r.jsxs)("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                          (0, r.jsxs)("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                              (0, r.jsx)(u.A, {
                                                className: "h-4 w-4 text-blue-500",
                                              }),
                                              (0, r.jsx)("span", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Мин. депозит",
                                              }),
                                            ],
                                          }),
                                          (0, r.jsx)("span", {
                                            className: "font-semibold",
                                            children: (0, c.vv)(e.minDepositUsd),
                                          }),
                                        ],
                                      }),
                                      (0, r.jsxs)("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                          (0, r.jsxs)("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                              (0, r.jsx)(g.A, {
                                                className: "h-4 w-4 text-purple-500",
                                              }),
                                              (0, r.jsx)("span", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Буст",
                                              }),
                                            ],
                                          }),
                                          (0, r.jsxs)("span", {
                                            className: "font-semibold",
                                            children: ["до +", (0, c.Ee)(e.boostMaxBp / 100)],
                                          }),
                                        ],
                                      }),
                                      (0, r.jsxs)("div", {
                                        className: "pt-4 border-t",
                                        children: [
                                          (0, r.jsxs)("div", {
                                            className: "text-sm text-muted-foreground mb-2",
                                            children: [
                                              "Общая ликвидность: ",
                                              (0, c.vv)(e.totalLiquidity),
                                            ],
                                          }),
                                          (0, r.jsxs)("div", {
                                            className: "text-sm text-muted-foreground mb-4",
                                            children: ["Векселей: ", e.totalWexels],
                                          }),
                                          (0, r.jsx)(n.$, {
                                            className: "w-full",
                                            size: "lg",
                                            children: "Инвестировать",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              e.id
                            )
                          ),
                  }),
                ],
              }),
            });
      }
    },
    2117: (e, s, t) => {
      "use strict";
      t.d(s, { Ee: () => n, cn: () => a, vv: () => i });
      var r = t(3642),
        l = t(2307);
      function a() {
        for (var e = arguments.length, s = Array(e), t = 0; t < e; t++) s[t] = arguments[t];
        return (0, l.QP)((0, r.$)(s));
      }
      function i(e) {
        let s,
          t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "USD";
        return (
          (s = "bigint" == typeof e || "string" == typeof e ? Number(e) / 1e6 : e),
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: t,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(s)
        );
      }
      function n(e) {
        let s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
        return "".concat(e.toFixed(s), "%");
      }
    },
    3095: (e, s, t) => {
      (Promise.resolve().then(t.bind(t, 4830)),
        Promise.resolve().then(t.bind(t, 5269)),
        Promise.resolve().then(t.bind(t, 4536)),
        Promise.resolve().then(t.bind(t, 4949)),
        Promise.resolve().then(t.bind(t, 219)),
        Promise.resolve().then(t.bind(t, 7753)));
    },
    4536: (e, s, t) => {
      "use strict";
      t.d(s, { Hero: () => o });
      var r = t(2541),
        l = t(7126),
        a = t(6716),
        i = t(4411),
        n = t(5414),
        d = t(970),
        c = t(6036);
      function o() {
        return (0, r.jsx)("section", {
          className:
            "relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20",
          children: (0, r.jsx)("div", {
            className: "container mx-auto px-4",
            children: (0, r.jsxs)("div", {
              className: "grid lg:grid-cols-2 gap-12 items-center",
              children: [
                (0, r.jsxs)("div", {
                  className: "space-y-8",
                  children: [
                    (0, r.jsxs)("div", {
                      className: "space-y-4",
                      children: [
                        (0, r.jsxs)("h1", {
                          className: "text-4xl lg:text-6xl font-bold tracking-tight",
                          children: [
                            (0, r.jsx)("span", {
                              className: "text-gradient",
                              children: "USDX/Wexel",
                            }),
                            (0, r.jsx)("br", {}),
                            (0, r.jsx)("span", {
                              className: "text-foreground",
                              children: "Platform",
                            }),
                          ],
                        }),
                        (0, r.jsx)("p", {
                          className: "text-xl text-muted-foreground max-w-2xl",
                          children:
                            "Децентрализованная платформа приёма ликвидности с поддержкой Solana и Tron, депозитов в USDT и механики буст-монет",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "flex flex-col sm:flex-row gap-4",
                      children: [
                        (0, r.jsxs)(l.$, {
                          size: "lg",
                          className: "text-lg px-8",
                          children: [
                            "Начать инвестировать",
                            (0, r.jsx)(i.A, { className: "ml-2 h-5 w-5" }),
                          ],
                        }),
                        (0, r.jsx)(l.$, {
                          variant: "outline",
                          size: "lg",
                          className: "text-lg px-8",
                          children: "Узнать больше",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "grid grid-cols-3 gap-6 pt-8",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "text-center",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-2xl font-bold text-primary",
                              children: "18%+",
                            }),
                            (0, r.jsx)("div", {
                              className: "text-sm text-muted-foreground",
                              children: "APY",
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "text-center",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-2xl font-bold text-primary",
                              children: "60%",
                            }),
                            (0, r.jsx)("div", {
                              className: "text-sm text-muted-foreground",
                              children: "LTV",
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "text-center",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-2xl font-bold text-primary",
                              children: "+5%",
                            }),
                            (0, r.jsx)("div", {
                              className: "text-sm text-muted-foreground",
                              children: "Буст",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, r.jsx)("div", {
                  className: "relative",
                  children: (0, r.jsx)(a.Zp, {
                    className: "card-premium shadow-premium",
                    children: (0, r.jsx)(a.Wu, {
                      className: "p-8",
                      children: (0, r.jsxs)("div", {
                        className: "space-y-6",
                        children: [
                          (0, r.jsxs)("div", {
                            className: "flex items-center gap-3",
                            children: [
                              (0, r.jsx)("div", {
                                className: "p-2 bg-primary/10 rounded-lg",
                                children: (0, r.jsx)(n.A, { className: "h-6 w-6 text-primary" }),
                              }),
                              (0, r.jsxs)("div", {
                                children: [
                                  (0, r.jsx)("h3", {
                                    className: "font-semibold",
                                    children: "Безопасность",
                                  }),
                                  (0, r.jsx)("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Мультисиг, timelock, аудит",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, r.jsxs)("div", {
                            className: "flex items-center gap-3",
                            children: [
                              (0, r.jsx)("div", {
                                className: "p-2 bg-green-500/10 rounded-lg",
                                children: (0, r.jsx)(d.A, { className: "h-6 w-6 text-green-500" }),
                              }),
                              (0, r.jsxs)("div", {
                                children: [
                                  (0, r.jsx)("h3", {
                                    className: "font-semibold",
                                    children: "Быстро",
                                  }),
                                  (0, r.jsx)("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Мгновенные транзакции",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, r.jsxs)("div", {
                            className: "flex items-center gap-3",
                            children: [
                              (0, r.jsx)("div", {
                                className: "p-2 bg-blue-500/10 rounded-lg",
                                children: (0, r.jsx)(c.A, { className: "h-6 w-6 text-blue-500" }),
                              }),
                              (0, r.jsxs)("div", {
                                children: [
                                  (0, r.jsx)("h3", {
                                    className: "font-semibold",
                                    children: "Доходность",
                                  }),
                                  (0, r.jsx)("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "До 36% годовых",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  }),
                }),
              ],
            }),
          }),
        });
      }
    },
    4830: (e, s, t) => {
      "use strict";
      t.d(s, { CTA: () => o });
      var r = t(2541),
        l = t(7126),
        a = t(6716),
        i = t(4411),
        n = t(5414),
        d = t(970),
        c = t(6036);
      function o() {
        return (0, r.jsx)("section", {
          className: "py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10",
          children: (0, r.jsx)("div", {
            className: "container mx-auto px-4",
            children: (0, r.jsx)(a.Zp, {
              className: "card-premium shadow-premium",
              children: (0, r.jsx)(a.Wu, {
                className: "p-12 text-center",
                children: (0, r.jsxs)("div", {
                  className: "max-w-3xl mx-auto space-y-8",
                  children: [
                    (0, r.jsxs)("div", {
                      className: "space-y-4",
                      children: [
                        (0, r.jsx)("h2", {
                          className: "text-3xl lg:text-4xl font-bold",
                          children: "Готовы начать инвестировать?",
                        }),
                        (0, r.jsx)("p", {
                          className: "text-xl text-muted-foreground",
                          children:
                            "Присоединяйтесь к тысячам пользователей, которые уже получают стабильную доходность на нашей платформе",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "flex flex-col sm:flex-row gap-4 justify-center",
                      children: [
                        (0, r.jsxs)(l.$, {
                          size: "lg",
                          className: "text-lg px-8",
                          children: [
                            "Создать аккаунт",
                            (0, r.jsx)(i.A, { className: "ml-2 h-5 w-5" }),
                          ],
                        }),
                        (0, r.jsx)(l.$, {
                          variant: "outline",
                          size: "lg",
                          className: "text-lg px-8",
                          children: "Связаться с нами",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-6 pt-8",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "flex items-center gap-3",
                          children: [
                            (0, r.jsx)("div", {
                              className: "p-2 bg-green-500/10 rounded-lg",
                              children: (0, r.jsx)(n.A, { className: "h-5 w-5 text-green-500" }),
                            }),
                            (0, r.jsxs)("div", {
                              className: "text-left",
                              children: [
                                (0, r.jsx)("div", {
                                  className: "font-semibold",
                                  children: "Безопасно",
                                }),
                                (0, r.jsx)("div", {
                                  className: "text-sm text-muted-foreground",
                                  children: "Аудит контрактов",
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "flex items-center gap-3",
                          children: [
                            (0, r.jsx)("div", {
                              className: "p-2 bg-blue-500/10 rounded-lg",
                              children: (0, r.jsx)(d.A, { className: "h-5 w-5 text-blue-500" }),
                            }),
                            (0, r.jsxs)("div", {
                              className: "text-left",
                              children: [
                                (0, r.jsx)("div", {
                                  className: "font-semibold",
                                  children: "Быстро",
                                }),
                                (0, r.jsx)("div", {
                                  className: "text-sm text-muted-foreground",
                                  children: "Мгновенные транзакции",
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "flex items-center gap-3",
                          children: [
                            (0, r.jsx)("div", {
                              className: "p-2 bg-purple-500/10 rounded-lg",
                              children: (0, r.jsx)(c.A, { className: "h-5 w-5 text-purple-500" }),
                            }),
                            (0, r.jsxs)("div", {
                              className: "text-left",
                              children: [
                                (0, r.jsx)("div", {
                                  className: "font-semibold",
                                  children: "Выгодно",
                                }),
                                (0, r.jsx)("div", {
                                  className: "text-sm text-muted-foreground",
                                  children: "До 36% годовых",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            }),
          }),
        });
      }
    },
    4949: (e, s, t) => {
      "use strict";
      t.d(s, { HowItWorks: () => m });
      var r = t(2541),
        l = t(6716),
        a = t(2890),
        i = t(9255),
        n = t(970),
        d = t(8723),
        c = t(6428),
        o = t(6036);
      let x = [
        {
          step: "01",
          icon: a.A,
          title: "Подключите кошелёк",
          description: "Solana (Phantom, Solflare) или Tron (TronLink)",
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          step: "02",
          icon: i.A,
          title: "Разместите USDT",
          description: "Выберите пул с APY от 18% до 36%",
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        {
          step: "03",
          icon: n.A,
          title: "Добавьте буст",
          description: "До +5% APY при добавлении SPL-токенов",
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        },
        {
          step: "04",
          icon: d.A,
          title: "Получите NFT-вексель",
          description: "Уникальный токен с метаданными депозита",
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        {
          step: "05",
          icon: c.A,
          title: "Заложите (опционально)",
          description: "Получите 60% от стоимости в кредит",
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
        },
        {
          step: "06",
          icon: o.A,
          title: "Получайте доходность",
          description: "Ежедневные начисления и выплаты",
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
        },
      ];
      function m() {
        return (0, r.jsx)("section", {
          className: "py-20 bg-muted/30",
          children: (0, r.jsxs)("div", {
            className: "container mx-auto px-4",
            children: [
              (0, r.jsxs)("div", {
                className: "text-center mb-16",
                children: [
                  (0, r.jsx)("h2", {
                    className: "text-3xl lg:text-4xl font-bold mb-4",
                    children: "Как это работает",
                  }),
                  (0, r.jsx)("p", {
                    className: "text-xl text-muted-foreground max-w-3xl mx-auto",
                    children: "Простой процесс инвестирования в несколько шагов",
                  }),
                ],
              }),
              (0, r.jsx)("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                children: x.map((e, s) =>
                  (0, r.jsxs)(
                    l.Zp,
                    {
                      className: "group hover:shadow-lg transition-all duration-300 relative",
                      children: [
                        (0, r.jsxs)(l.aR, {
                          className: "text-center",
                          children: [
                            (0, r.jsxs)("div", {
                              className: "relative mb-4",
                              children: [
                                (0, r.jsx)("div", {
                                  className: "w-16 h-16 mx-auto rounded-full ".concat(
                                    e.bgColor,
                                    " flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                  ),
                                  children: (0, r.jsx)(e.icon, {
                                    className: "h-8 w-8 ".concat(e.color),
                                  }),
                                }),
                                (0, r.jsx)("div", {
                                  className:
                                    "absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold",
                                  children: e.step,
                                }),
                              ],
                            }),
                            (0, r.jsx)(l.ZB, { className: "text-xl", children: e.title }),
                          ],
                        }),
                        (0, r.jsx)(l.Wu, {
                          children: (0, r.jsx)(l.BT, {
                            className: "text-center text-base",
                            children: e.description,
                          }),
                        }),
                      ],
                    },
                    s
                  )
                ),
              }),
            ],
          }),
        });
      }
    },
    5269: (e, s, t) => {
      "use strict";
      t.d(s, { Features: () => g });
      var r = t(2541),
        l = t(6716),
        a = t(2890),
        i = t(9255),
        n = t(970),
        d = t(6145),
        c = t(6428),
        o = t(8156),
        x = t(5414),
        m = t(6036);
      let u = [
        {
          icon: a.A,
          title: "Мультичейн поддержка",
          description: "Solana (SPL/Anchor) и Tron (TRC‑20/TRC‑721/TVM)",
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        {
          icon: i.A,
          title: "Депозиты в USDT",
          description: "APY ≥18% с возможностью блокировки на 12-36 месяцев",
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        {
          icon: n.A,
          title: "Буст-монеты",
          description: "До +5% APY при добавлении SPL-токенов",
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        },
        {
          icon: d.A,
          title: "NFT-вексели",
          description: "Уникальные токены с метаданными депозита",
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          icon: c.A,
          title: "Залоговая система",
          description: "LTV 60% с перераспределением доходности",
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
        },
        {
          icon: o.A,
          title: "Маркетплейс",
          description: "Торговля векселями между пользователями",
          color: "text-cyan-500",
          bgColor: "bg-cyan-500/10",
        },
        {
          icon: x.A,
          title: "Безопасность",
          description: "Мультисиг, timelock, аудит контрактов",
          color: "text-red-500",
          bgColor: "bg-red-500/10",
        },
        {
          icon: m.A,
          title: "Высокая доходность",
          description: "До 36% годовых с возможностью буста",
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
        },
      ];
      function g() {
        return (0, r.jsx)("section", {
          className: "py-20",
          children: (0, r.jsxs)("div", {
            className: "container mx-auto px-4",
            children: [
              (0, r.jsxs)("div", {
                className: "text-center mb-16",
                children: [
                  (0, r.jsx)("h2", {
                    className: "text-3xl lg:text-4xl font-bold mb-4",
                    children: "Почему выбирают нас",
                  }),
                  (0, r.jsx)("p", {
                    className: "text-xl text-muted-foreground max-w-3xl mx-auto",
                    children:
                      "Современная DeFi платформа с уникальными возможностями и максимальной безопасностью для ваших инвестиций",
                  }),
                ],
              }),
              (0, r.jsx)("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                children: u.map((e, s) =>
                  (0, r.jsxs)(
                    l.Zp,
                    {
                      className: "group hover:shadow-lg transition-all duration-300",
                      children: [
                        (0, r.jsxs)(l.aR, {
                          className: "text-center",
                          children: [
                            (0, r.jsx)("div", {
                              className: "w-12 h-12 mx-auto mb-4 rounded-lg ".concat(
                                e.bgColor,
                                " flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                              ),
                              children: (0, r.jsx)(e.icon, {
                                className: "h-6 w-6 ".concat(e.color),
                              }),
                            }),
                            (0, r.jsx)(l.ZB, { className: "text-lg", children: e.title }),
                          ],
                        }),
                        (0, r.jsx)(l.Wu, {
                          children: (0, r.jsx)(l.BT, {
                            className: "text-center",
                            children: e.description,
                          }),
                        }),
                      ],
                    },
                    s
                  )
                ),
              }),
            ],
          }),
        });
      }
    },
    6716: (e, s, t) => {
      "use strict";
      t.d(s, { BT: () => c, Wu: () => o, ZB: () => d, Zp: () => i, aR: () => n });
      var r = t(2541),
        l = t(4361),
        a = t(2117);
      let i = l.forwardRef((e, s) => {
        let { className: t, ...l } = e;
        return (0, r.jsx)("div", {
          ref: s,
          className: (0, a.cn)("rounded-lg border bg-card text-card-foreground shadow-sm", t),
          ...l,
        });
      });
      i.displayName = "Card";
      let n = l.forwardRef((e, s) => {
        let { className: t, ...l } = e;
        return (0, r.jsx)("div", {
          ref: s,
          className: (0, a.cn)("flex flex-col space-y-1.5 p-6", t),
          ...l,
        });
      });
      n.displayName = "CardHeader";
      let d = l.forwardRef((e, s) => {
        let { className: t, ...l } = e;
        return (0, r.jsx)("h3", {
          ref: s,
          className: (0, a.cn)("text-2xl font-semibold leading-none tracking-tight", t),
          ...l,
        });
      });
      d.displayName = "CardTitle";
      let c = l.forwardRef((e, s) => {
        let { className: t, ...l } = e;
        return (0, r.jsx)("p", {
          ref: s,
          className: (0, a.cn)("text-sm text-muted-foreground", t),
          ...l,
        });
      });
      c.displayName = "CardDescription";
      let o = l.forwardRef((e, s) => {
        let { className: t, ...l } = e;
        return (0, r.jsx)("div", { ref: s, className: (0, a.cn)("p-6 pt-0", t), ...l });
      });
      ((o.displayName = "CardContent"),
        (l.forwardRef((e, s) => {
          let { className: t, ...l } = e;
          return (0, r.jsx)("div", {
            ref: s,
            className: (0, a.cn)("flex items-center p-6 pt-0", t),
            ...l,
          });
        }).displayName = "CardFooter"));
    },
    7126: (e, s, t) => {
      "use strict";
      t.d(s, { $: () => c });
      var r = t(2541),
        l = t(4361),
        a = t(357),
        i = t(7836),
        n = t(2117);
      let d = (0, i.F)(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            variants: {
              variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                success: "bg-green-600 text-white hover:bg-green-700",
                warning: "bg-yellow-600 text-white hover:bg-yellow-700",
                premium:
                  "bg-gradient-to-r from-gold-accent to-yellow-500 text-white hover:from-gold-accent/90 hover:to-yellow-500/90 shadow-premium",
              },
              size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                xl: "h-12 rounded-lg px-10 text-base",
                icon: "h-10 w-10",
              },
            },
            defaultVariants: { variant: "default", size: "default" },
          }
        ),
        c = l.forwardRef((e, s) => {
          let { className: t, variant: l, size: i, asChild: c = !1, ...o } = e,
            x = c ? a.DX : "button";
          return (0, r.jsx)(x, {
            className: (0, n.cn)(d({ variant: l, size: i, className: t })),
            ref: s,
            ...o,
          });
        });
      c.displayName = "Button";
    },
    7753: (e, s, t) => {
      "use strict";
      t.d(s, { Stats: () => n });
      var r = t(2541),
        l = t(7629),
        a = t(8104),
        i = t(2117);
      function n() {
        let { data: e, isLoading: s } = (0, l.I)({
          queryKey: ["pools", "stats"],
          queryFn: a.oJ.getStats,
        });
        return s
          ? (0, r.jsx)("section", {
              className: "py-16 bg-muted/30",
              children: (0, r.jsx)("div", {
                className: "container mx-auto px-4",
                children: (0, r.jsx)("div", {
                  className: "grid grid-cols-1 md:grid-cols-4 gap-8",
                  children: [void 0, void 0, void 0, void 0].map((e, s) =>
                    (0, r.jsxs)(
                      "div",
                      {
                        className: "text-center",
                        children: [
                          (0, r.jsx)("div", {
                            className: "h-8 bg-muted rounded animate-pulse mb-2",
                          }),
                          (0, r.jsx)("div", { className: "h-4 bg-muted rounded animate-pulse" }),
                        ],
                      },
                      s
                    )
                  ),
                }),
              }),
            })
          : (0, r.jsx)("section", {
              className: "py-16 bg-muted/30",
              children: (0, r.jsx)("div", {
                className: "container mx-auto px-4",
                children: (0, r.jsxs)("div", {
                  className: "grid grid-cols-1 md:grid-cols-4 gap-8",
                  children: [
                    (0, r.jsxs)("div", {
                      className: "text-center",
                      children: [
                        (0, r.jsx)("div", {
                          className: "text-3xl font-bold text-primary mb-2",
                          children: (null == e ? void 0 : e.totalPools) || 0,
                        }),
                        (0, r.jsx)("div", {
                          className: "text-muted-foreground",
                          children: "Активных пулов",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "text-center",
                      children: [
                        (0, r.jsx)("div", {
                          className: "text-3xl font-bold text-primary mb-2",
                          children: (0, i.vv)((null == e ? void 0 : e.totalLiquidity) || 0),
                        }),
                        (0, r.jsx)("div", {
                          className: "text-muted-foreground",
                          children: "Общая ликвидность",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "text-center",
                      children: [
                        (0, r.jsx)("div", {
                          className: "text-3xl font-bold text-primary mb-2",
                          children: (null == e ? void 0 : e.totalWexels) || 0,
                        }),
                        (0, r.jsx)("div", {
                          className: "text-muted-foreground",
                          children: "Выпущено векселей",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "text-center",
                      children: [
                        (0, r.jsx)("div", {
                          className: "text-3xl font-bold text-primary mb-2",
                          children: (null == e ? void 0 : e.totalUsers) || 0,
                        }),
                        (0, r.jsx)("div", {
                          className: "text-muted-foreground",
                          children: "Пользователей",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            });
      }
    },
    8104: (e, s, t) => {
      "use strict";
      t.d(s, { oJ: () => l });
      let r = t(6836).A.create({
        baseURL: "http://localhost:3001",
        headers: { "Content-Type": "application/json" },
      });
      (r.interceptors.request.use((e) => {
        let s = localStorage.getItem("access_token");
        return (s && (e.headers.Authorization = "Bearer ".concat(s)), e);
      }),
        r.interceptors.response.use(
          (e) => e,
          (e) => {
            var s;
            return (
              (null == (s = e.response) ? void 0 : s.status) === 401 &&
                (localStorage.removeItem("access_token"), (window.location.href = "/login")),
              Promise.reject(e)
            );
          }
        ));
      let l = {
        getAll: () => r.get("/pools").then((e) => e.data),
        getById: (e) => r.get("/pools/".concat(e)).then((e) => e.data),
        getStats: () => r.get("/pools/stats").then((e) => e.data),
        create: (e) => r.post("/pools", e).then((e) => e.data),
        update: (e, s) => r.patch("/pools/".concat(e), s).then((e) => e.data),
      };
    },
  },
  (e) => {
    (e.O(0, [829, 456, 422, 487, 358], () => e((e.s = 3095))), (_N_E = e.O()));
  },
]);
