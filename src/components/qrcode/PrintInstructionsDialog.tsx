import { Info, Download, Printer, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PrintInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrintInstructionsDialog({
  open,
  onOpenChange,
}: PrintInstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            打印使用说明
          </DialogTitle>
          <DialogDescription>
            如何使用本工具进行标签打印
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              由于浏览器安全限制，Web应用无法直接连接网络打印机。请使用以下方法之一进行打印。
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Download className="h-5 w-5 text-primary" />
                方法一：下载ZPL文件打印（推荐）
              </div>
              <ol className="text-sm space-y-2 ml-7 list-decimal">
                <li>点击"打印预览"查看标签内容</li>
                <li>点击"下载ZPL"按钮，保存ZPL文件到本地</li>
                <li>使用以下任一工具发送ZPL文件到打印机：</li>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Zebra Setup Utilities（官方工具）</li>
                  <li>ZebraDesigner（设计软件）</li>
                  <li>命令行工具：<code className="bg-muted px-1 py-0.5 rounded text-xs">copy /b file.zpl \\打印机IP\共享名</code></li>
                </ul>
              </ol>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Printer className="h-5 w-5 text-primary" />
                方法二：使用Zebra Browser Print
              </div>
              <ol className="text-sm space-y-2 ml-7 list-decimal">
                <li>下载并安装Zebra Browser Print客户端程序</li>
                <li>运行Browser Print服务</li>
                <li>在本工具中配置打印机</li>
                <li>直接点击打印按钮即可</li>
              </ol>
              <div className="text-xs text-muted-foreground ml-7">
                下载地址：<a 
                  href="https://www.zebra.com/us/en/support-downloads/software/printer-software/browser-print.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Zebra官网
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <FileText className="h-5 w-5 text-primary" />
                方法三：批量打印
              </div>
              <ol className="text-sm space-y-2 ml-7 list-decimal">
                <li>在列表中勾选需要打印的物料</li>
                <li>点击"批量下载ZPL"按钮</li>
                <li>使用打印工具批量发送到打印机</li>
              </ol>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">打印机配置信息</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• 打印机类型：斑马打印机（ZPL协议）</p>
              <p>• 默认端口：9100</p>
              <p>• 标签尺寸：根据打印机设置自动调整</p>
              <p>• 打印内容：二维码 + 物料信息</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              我知道了
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
