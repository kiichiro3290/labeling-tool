"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { DropdownMenu } from "./ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { logout } from "@/lib/firebase/auth";

export function SiteHeader() {
  const user = useAuth();

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/">Labeling tool</Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>アカウント</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>アカウント</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user === null && (
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/login">ログイン</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/signup">アカウント作成</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
                {user && (
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={logout}>
                      ログアウト
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
