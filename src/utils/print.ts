import type { Material, PrinterConfig } from "@/types/types";

// 生成ZPL打印指令
// 标签尺寸: 80mm × 60mm (203 DPI)
// 80mm = 640点, 60mm = 480点
export function generateZPL(material: Material): string {
  const qrCodeData = `${material.bucket_code || ""}|${material.batch_number || ""}|${material.pallet_code || ""}|${material.item_code || ""}`;

  const zpl = `
^XA
^PW640
^LL480

^FO20,20^GB600,440,2^FS

^FO30,35^CF0,28^FD料桶码^FS
^FO150,30^CF0,35^FD${material.bucket_code || ""}^FS

^FO30,80^CF0,28^FD料品批次^FS
^FO150,75^CF0,35^FD${material.batch_number || ""}^FS

^FO30,125^CF0,28^FD托盘码^FS
^FO150,120^CF0,35^FD${material.pallet_code || ""}^FS

^FO30,170^CF0,28^FD料品编码^FS
^FO150,165^CF0,35^FD${material.item_code || ""}^FS

^FO30,215^CF0,28^FD料品名称^FS
^FO150,210^CF0,35^FD石英砂^FS

^FO30,260^CF0,28^FD规格型号^FS
^FO150,255^CF0,35^FD${material.specification || ""}^FS

^FO450,80^BQN,2,8^FDQA,${qrCodeData}^FS

^FO200,400^CF0,40^FD圣宝鸿料桶标签^FS

^XZ
`;

  return zpl.trim();
}

// 下载ZPL文件
export function downloadZPL(zplData: string, filename: string) {
  const blob = new Blob([zplData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 批量生成ZPL并下载
export function batchDownloadZPL(materials: Material[]): string {
  let allZPL = "";
  
  for (const material of materials) {
    allZPL += generateZPL(material) + "\n\n";
  }
  
  return allZPL;
}

// 验证打印机配置是否完整
export function validatePrinterConfig(printerConfig: PrinterConfig): boolean {
  return !!(
    printerConfig.printer_ip &&
    printerConfig.printer_port &&
    printerConfig.printer_name
  );
}

// 生成打印说明文本
export function getPrintInstructions(printerConfig: PrinterConfig): string {
  return `
打印机配置信息：
- 打印机名称：${printerConfig.printer_name}
- 打印机类型：${printerConfig.printer_type}
- IP地址：${printerConfig.printer_ip}
- 端口：${printerConfig.printer_port}

由于浏览器安全限制（HTTPS 无法访问 HTTP 资源），请使用以下方法之一打印：

方法一：使用 Zebra Setup Utilities
1. 下载并安装 Zebra Setup Utilities
2. 打开软件，选择打印机
3. 点击 "Send File" 发送下载的 ZPL 文件

方法二：使用命令行（Windows）
copy /b 文件名.zpl \\\\${printerConfig.printer_ip}\\共享名

方法三：使用命令行（Linux/Mac）
cat 文件名.zpl | nc ${printerConfig.printer_ip} ${printerConfig.printer_port}

方法四：使用 Zebra Browser Print
1. 下载并安装 Zebra Browser Print 客户端
2. 运行服务后即可直接打印
  `.trim();
}
