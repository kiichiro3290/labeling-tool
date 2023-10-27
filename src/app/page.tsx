"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function InputWithLabel() {
  const [label, setLabel] = useState<string>("");

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="label">label</Label>
      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        id="label"
        placeholder="データラベル"
      />
    </div>
  );
}

export default function Home() {
  const [counter, setCounter] = useState<number>(0);

  return (
    <div className="container mt-40 flex flex-col items-center space-y-8">
      <InputWithLabel />
      <Button onClick={() => setCounter((prev) => prev + 1)}>Start</Button>
      <Button onClick={() => setCounter((prev) => prev + 1)}>Click me</Button>
      {counter}
    </div>
  );
}
