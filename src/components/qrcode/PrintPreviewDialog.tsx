import { useState } from "react";
import QRCodeDataUrl from "@/components/ui/qrcodedataurl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Download, Code } from "lucide-react";
import { toast } from "sonner";
import { generateZPL, downloadZPL } from "@/utils/print";
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
  const [activeTab, setActiveTab] = useState("preview");

  if (!material) return null;

  const qrCodeData = `${material.bucket_code || ""}|${material.batch_number || ""}|${material.pallet_code || ""}|${material.item_code || ""}`;
  const zplCode = generateZPL(material);

  const handleDownloadZPL = () => {
    const filename = `标签_${material.material_code}_${Date.now()}.zpl`;
    downloadZPL(zplCode, filename);
    toast.success("ZPL文件已下载");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            打印预览
          </DialogTitle>
          <DialogDescription>查看标签效果并下载ZPL文件</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">标签预览</TabsTrigger>
            <TabsTrigger value="zpl">ZPL代码</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
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
                      <span className="text-muted-foreground">石英砂</span>
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
          </TabsContent>

          <TabsContent value="zpl" className="mt-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Code className="h-4 w-4" />
                  ZPL打印代码
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(zplCode);
                    toast.success("ZPL代码已复制到剪贴板");
                  }}
                >
                  复制代码
                </Button>
              </div>
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto max-h-[400px]">
                <code>{zplCode}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadZPL}>
              <Download className="mr-2 h-4 w-4" />
              下载ZPL
            </Button>
            <Button onClick={onConfirmPrint}>
              <Printer className="mr-2 h-4 w-4" />
              发送打印
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
