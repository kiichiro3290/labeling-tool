"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogInPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("@test.com");
  const [password, setPassword] = useState<string>("");

  const onClickNewAccountButton = () => {
    createUser(email, password)
      .catch((e) => {
        console.error(e.code);
      })
      .finally(() => {
        console.log("success");
        // HOME画面へ遷移
        router.push("/");
      });
  };

  return (
    <div className="container mt-32 flex flex-col items-center space-y-8">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            email
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            password
          </Label>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="col-span-3"
          />
        </div>
        <Button onClick={onClickNewAccountButton}>アカウント作成</Button>
      </div>
    </div>
  );
}
