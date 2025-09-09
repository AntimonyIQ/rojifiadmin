import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VirtualAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  account_id: string;
  processor: string;
}

interface Props {
  account: VirtualAccount;
}

export default function VirtualAccountCard({ account }: Props) {

  const handleCopy = () => {
    navigator.clipboard.writeText(account.account_number);

  };

  return (
    <Card className="p-4 space-y-3 border shadow-sm rounded-xl">
      <div className="text-sm font-semibold text-gray-500">
        {account.bank_name}
      </div>

      <div>
        <div className="text-lg font-bold">{account.account_name}</div>
        <div className="flex items-center gap-2 text-gray-800 text-base font-mono">
          {account.account_number}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="p-0 h-5 w-5"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        Processor: {account.processor}
      </div>
    </Card>
  );
}
