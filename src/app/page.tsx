"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { createLabels, getLabels } from "@/lib/firebase/label";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  addCondition,
  addStamp,
  createExperiments,
  findExperimentId,
  getExperimentNames,
} from "@/lib/firebase/experiment";

enum Stepper {
  Input,
  Start,
  Finish,
}

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
};

export function InputWithLabel({ value, onChange, placeholder }: Props) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        value={value}
        onChange={onChange}
        id="ex-label"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function Home() {
  const [openExSelector, setOpenExSelector] = useState<boolean>(false);
  const [openLabelSelector, setOpenLabelSelector] = useState<boolean>(false);
  const [exSelectorValue, setExSelectorValue] = useState<string>("");
  const [labelSelectorValue, setLabelSelectorValue] = useState<string>("");

  const [label, setLabel] = useState<string>("");
  const [labels, setLabels] = useState<Label[]>([]);
  const [exId, setExId] = useState<string>("");
  const [exName, setExName] = useState<string>("");
  const [exNames, setExNames] = useState<string[]>([]);
  const [stepper, setStepper] = useState<Stepper>(Stepper.Input);
  const [stamps, setStamps] = useState<Date[]>([]);

  useEffect(() => {
    const f = async () => {
      const data = await getLabels();
      const exNames = await getExperimentNames();
      const labels = data.filter((item) => item.type === "condition");
      setLabels(labels);
      setExNames(exNames);
    };

    f();
  }, []);

  const onClickStartButton = async () => {
    const labelNames = labels.map((item) => item.name);
    if (!labelNames.includes(label)) {
      createLabels(label, "condition");
    }

    // 実験が存在していない場合は作成
    if (!exNames.includes(exName)) {
      createExperiments(exName, label);
    }
    const id = await findExperimentId(exName);
    await addCondition(id, label);

    setExId(id);
    setStepper(Stepper.Start);
  };

  const onClickStampButton = async () => {
    setStamps((prev) => {
      const curr = [...prev];
      curr.unshift(new Date());
      return curr;
    });

    await addStamp(exId, label);
  };

  const onClickEndButton = () => {
    setStepper(Stepper.Finish);
  };

  const onClickYesButton = () => {
    window.location.reload();
  };

  const onClickNoButton = () => {
    setStepper(Stepper.Start);
  };

  return (
    <div className="container mt-40 flex flex-col items-center space-y-8">
      {stepper === Stepper.Input && (
        <>
          <div className="flex w-full max-w-sm items-center align-middle space-x-2">
            <InputWithLabel
              placeholder="実験名"
              value={exName}
              onChange={(e) => setExName(e.target.value)}
            />
            <Popover open={openExSelector} onOpenChange={setOpenExSelector}>
              <PopoverTrigger asChild>
                <Button aria-expanded={openExSelector} role="combobox">
                  選択
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="search label..." className="h-9" />
                  <CommandEmpty>No label found.</CommandEmpty>
                  <CommandGroup>
                    {exNames.map((item, i) => (
                      <CommandItem
                        key={item + i}
                        value={item}
                        onSelect={(currentValue) => {
                          setExSelectorValue(
                            currentValue === exSelectorValue ? "" : currentValue
                          );
                          setExName(
                            currentValue === label ? label : currentValue
                          );
                          setOpenExSelector(false);
                        }}
                      >
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex w-full max-w-sm items-center align-middle space-x-2">
            <InputWithLabel
              placeholder="データラベル"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Popover
              open={openLabelSelector}
              onOpenChange={setOpenLabelSelector}
            >
              <PopoverTrigger asChild>
                <Button aria-expanded={openLabelSelector} role="combobox">
                  選択
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="search label..." className="h-9" />
                  <CommandEmpty>No label found.</CommandEmpty>
                  <CommandGroup>
                    {labels.map((item, i) => (
                      <CommandItem
                        key={item.name + i}
                        value={item.name}
                        onSelect={(currentValue) => {
                          setLabelSelectorValue(
                            currentValue === exSelectorValue ? "" : currentValue
                          );
                          setLabel(
                            currentValue === label ? label : currentValue
                          );
                          setOpenLabelSelector(false);
                        }}
                      >
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={onClickStartButton}
            disabled={exName === "" || label === ""}
          >
            実験開始
          </Button>
        </>
      )}

      {stepper === Stepper.Start && (
        <>
          <Label>
            {exName} : {label}
          </Label>
          <Button onClick={onClickStampButton}>スタンプ</Button>
          <Button onClick={onClickEndButton}>終了</Button>
          <Label>タイムスタンプ</Label>
          <ul>
            {stamps.map((item: Date, id) => (
              <li key={id}>{item.toLocaleString()}</li>
            ))}
          </ul>
          <Label>end</Label>
        </>
      )}

      {stepper === Stepper.Finish && (
        <>
          <Label>本当に終了しますか？</Label>
          <div className="flex space-x-2">
            <Button onClick={onClickYesButton}>はい</Button>
            <Button onClick={onClickNoButton}>いいえ</Button>
          </div>
        </>
      )}
    </div>
  );
}
