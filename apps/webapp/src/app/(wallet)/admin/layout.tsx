"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  Database,
  Activity,
  Settings,
  Users,
  FileText,
  LogOut,
  Shield,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Дашборд", href: "/admin", icon: Home },
    { name: "Пулы", href: "/admin/pools", icon: Database },
    { name: "Оракулы", href: "/admin/oracles", icon: Activity },
    { name: "Пользователи", href: "/admin/users", icon: Users },
    { name: "Векселя", href: "/admin/wexels", icon: FileText },
    { name: "Настройки", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Wexel Admin</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-white bg-gray-800"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.href)
                          ? "text-white bg-gray-800"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                <div className="pt-4">
                  <Button
                    className="w-full text-gray-300 hover:text-white"
                    variant="ghost"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
