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
import { useAuth } from "@/context/auth";

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

function InputWithLabel({ value, onChange, placeholder }: Props) {
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
  const user = useAuth();

  // 実験名の登録
  const [exId, setExId] = useState<string>("");
  const [exName, setExName] = useState<string>("");
  const [exNames, setExNames] = useState<string[]>([]);
  const [openExSelector, setOpenExSelector] = useState<boolean>(false);
  const [exSelectorValue, setExSelectorValue] = useState<string>("");

  // データラベルの登録
  const [labelSelectorValue, setLabelSelectorValue] = useState<string>("");
  const [openLabelSelector, setOpenLabelSelector] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [labels, setLabels] = useState<Label[]>([]);

  // 状態の登録
  const [state, setState] = useState<string>("");
  const [stateList, setStateList] = useState<string[]>([]);

  // ステッパー
  const [stepper, setStepper] = useState<Stepper>(Stepper.Input);

  // タイムスタンプ
  type StampState = { time: Date; state: string };
  const [stamps, setStamps] = useState<StampState[]>([]);

  useEffect(() => {
    const f = async () => {
      if (!user?.id) return;

      const data = await getLabels(user.id);
      const exNames = await getExperimentNames(user?.id);
      const labels = data.filter((item) => item.type === "condition");
      setLabels(labels);
      setExNames(exNames);
    };

    f();
  }, [user?.id]);

  const onClickStartButton = async () => {
    if (!user?.id) return;

    const labelNames = labels.map((item) => item.name);
    if (!labelNames.includes(label)) {
      createLabels(user.id, label, "condition");
    }

    // 実験が存在していない場合は作成
    if (!exNames.includes(exName)) {
      createExperiments(user?.id, exName);
    }
    const id = await findExperimentId(exName, user.id);
    await addCondition(id, label);

    setExId(id);
    setStepper(Stepper.Start);
  };

  const onClickStampButton = async (state: string) => {
    if (!user?.id) return;

    setStamps((prev) => {
      const curr = [...prev];
      const data = {
        time: new Date(),
        state,
      };
      curr.unshift(data);
      return curr;
    });

    await addStamp(exId, user.id, label, state);
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
                            currentValue === labelSelectorValue
                              ? ""
                              : currentValue
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

          <div className="flex w-full max-w-sm items-center align-middle space-x-2">
            <InputWithLabel
              placeholder="状態"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <Button
              disabled={state === ""}
              onClick={() => {
                setStateList((prev) => {
                  const curr = [...prev];
                  curr.push(state);
                  return curr;
                });
                setState("");
              }}
            >
              追加
            </Button>
          </div>

          <h1 className="my-0 py-0">状態一覧</h1>
          <div className="flex w-full max-w-sm">
            {stateList.length === 0 ? (
              "状態を追加してください"
            ) : (
              <ol type="1">
                {stateList.map((item, id) => (
                  <li key={id}>・{item}</li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex space-x-8">
            <Button
              onClick={() => {
                setExName("");
                setLabel("");
                setState("");
                setStateList([]);
              }}
              className="bg-blue-500"
            >
              リセット
            </Button>
            <Button
              onClick={onClickStartButton}
              disabled={exName === "" || label === "" || stateList.length === 0}
            >
              実験開始
            </Button>
          </div>
        </>
      )}

      {stepper === Stepper.Start && (
        <>
          <Label>
            {exName} : {label}
          </Label>
          {stateList.map((item, id) => (
            <Button key={id} onClick={() => onClickStampButton(item)}>
              {id + 1}：{item}
            </Button>
          ))}
          <Button onClick={onClickEndButton} className="bg-red-500">
            終了
          </Button>
          <Label>タイムスタンプ</Label>
          <ul>
            {stamps.map((item: StampState, id) => (
              <li key={id}>
                {item.state}：{item.time.toLocaleString()}
              </li>
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
