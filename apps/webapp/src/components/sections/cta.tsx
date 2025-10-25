"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <Card className="card-premium shadow-premium">
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">Готовы начать инвестировать?</h2>
                <p className="text-xl text-muted-foreground">
                  Присоединяйтесь к тысячам пользователей, которые уже получают стабильную
                  доходность на нашей платформе
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Создать аккаунт
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Связаться с нами
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Безопасно</div>
                    <div className="text-sm text-muted-foreground">Аудит контрактов</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Быстро</div>
                    <div className="text-sm text-muted-foreground">Мгновенные транзакции</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Выгодно</div>
                    <div className="text-sm text-muted-foreground">До 36% годовых</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
