import QRCodeDataUrl from "@/components/ui/qrcodedataurl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Material } from "@/types/types";

interface PrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
  onConfirmPrint: () => void;
}

export function PrintPreviewDialog({
  open,
  onOpenChange,
  material,
  onConfirmPrint,
}: PrintPreviewDialogProps) {
  if (!material) return null;

  const qrCodeData = `${material.bucket_code || ""}|${material.batch_number || ""}|${material.pallet_code || ""}|${material.item_code || ""}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            打印预览
          </DialogTitle>
          <DialogDescription>确认标签信息无误后点击打印</DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-6 bg-card">
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2">圣宝鸿料桶标签</h3>

              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium w-24">料桶码:</span>
                  <span className="text-muted-foreground">{material.bucket_code || "-"}</span>
                </div>

                <div className="flex">
                  <span className="font-medium w-24">料品批次:</span>
                  <span className="text-muted-foreground">{material.batch_number || "-"}</span>
                </div>

                <div className="flex">
                  <span className="font-medium w-24">托盘码:</span>
                  <span className="text-muted-foreground">{material.pallet_code || "-"}</span>
                </div>

                <div className="flex">
                  <span className="font-medium w-24">料品编码:</span>
                  <span className="text-muted-foreground">{material.item_code || "-"}</span>
                </div>

                <div className="flex">
                  <span className="font-medium w-24">料品名称:</span>
                  <span className="text-muted-foreground">{material.item_name || "-"}</span>
                </div>

                <div className="flex">
                  <span className="font-medium w-24">规格型号:</span>
                  <span className="text-muted-foreground">{material.specification || "-"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <QRCodeDataUrl text={qrCodeData} width={150} />
              <p className="text-xs text-muted-foreground mt-2">二维码</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onConfirmPrint}>
            <Printer className="mr-2 h-4 w-4" />
            确认打印
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
