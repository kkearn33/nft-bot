"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog , DialogClose ,
  DialogContent ,
  DialogDescription ,
  DialogFooter ,
  DialogHeader ,
  DialogTitle ,
  DialogTrigger ,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import createBotWallets from "@/lib/BotWallets";
import { useEffect , useState } from "react";
import { toast } from "sonner";
import { BotWalletType } from "@/lib/thirdweb/types";


type Props = {
  count: number;
  setCount: (count: number) => void;
  botWallets: BotWalletType[];
  setbotWallets:(wallets: BotWalletType[]) => void;
}
const SettingDialog = ({count, setCount, botWallets, setbotWallets} : Props) => {

  const [updateCount, setUpdateCount] = useState(0);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] =  useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const onSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    let savedWalletCount = 0;

    const response0  = await fetch("/api/writeSetting",{
      method: "POST",
      body: JSON.stringify({ startTime: startTime, endTime: endTime, count: updateCount}),
      headers: { "Content-Type": "application/json" },
    });

    if(response0.ok) toast.success("Setting data saved");
    else {
      toast.error("Setting data saving failed. Please try again.");
      setIsSaving(false);
      return;
    }

    await fetch("/api/readWallets")
      .then((res) => res.json())
      .then((json) => savedWalletCount = json.length)
      .catch((err) => console.log("Error fetch data:",err));

    if(savedWalletCount < updateCount) {

      const wallets = await createBotWallets(updateCount-savedWalletCount);
      const response1  = await fetch("/api/writeWallets",{
        method: "POST",
        body: JSON.stringify(wallets),
        headers: { "Content-Type": "application/json" },
      });
      setbotWallets([...botWallets, ...wallets]);


      if(response1.ok) toast.success("Bot Wallets saved successfully.");
      else toast.error("Bot Wallets saving failed. Please try again.");
    }

    setCount(updateCount);
    setIsSaving(false);
    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={()=>setOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border border-black h-7 hover:bg-gray-400">Setting</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setting</DialogTitle>
          <DialogDescription>
            Make changes to Start time, End time here and Bot count. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Start Time
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              End Time
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Bot Count
            </Label>
            <Input
              id="botCount"
              type="number"
              defaultValue={count}
              onChange={(e) => setUpdateCount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={async ()=> await onSave()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

SettingDialog.displayName = "SettingDialog";
export default SettingDialog;