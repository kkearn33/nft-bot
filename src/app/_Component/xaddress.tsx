'use client'

import { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { FaCheck } from "react-icons/fa6";
import { useClipboardContext } from './ClipboradProvider';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const XAddress = ({ address}: {
  address: string,
}) => {
  const { copiedText, setCopiedText } = useClipboardContext();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsCopied(copiedText === address);
  }, [copiedText, address]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedText(address);
    } catch (err) {
      toast.error("Failed to copy the address");
    }
  };

  return (
    <div className={cn('cursor-pointer flex gap-2')} onClick={handleCopyToClipboard}>
      {isCopied ? <FaCheck className="text-green-1500 w-4 h-4" /> : <BiCopy className="w-4 h-4" />}
      <span>{address}</span>
    </div>
  );
};
