"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                <span className="text-gradient">USDX/Wexel</span>
                <br />
                <span className="text-foreground">Platform</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Децентрализованная платформа приёма ликвидности с поддержкой Solana и Tron,
                депозитов в USDT и механики буст-монет
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8" onClick={() => router.push("/pools")}>
                Начать инвестировать
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8"
                onClick={() =>
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
                }
              >
                Узнать больше
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">18%+</div>
                <div className="text-sm text-muted-foreground">APY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">60%</div>
                <div className="text-sm text-muted-foreground">LTV</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+5%</div>
                <div className="text-sm text-muted-foreground">Буст</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="card-premium shadow-premium">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Безопасность</h3>
                      <p className="text-sm text-muted-foreground">Мультисиг, timelock, аудит</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Zap className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Быстро</h3>
                      <p className="text-sm text-muted-foreground">Мгновенные транзакции</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Доходность</h3>
                      <p className="text-sm text-muted-foreground">До 36% годовых</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
