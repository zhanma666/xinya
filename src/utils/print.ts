import type { Material, PrinterConfig } from "@/types/types";

// 生成ZPL打印指令
export function generateZPL(material: Material): string {
  const qrCodeData = `${material.bucket_code || ""}|${material.batch_number || ""}|${material.pallet_code || ""}|${material.item_code || ""}`;

  const zpl = `
^XA
^CF0,30
^FO50,50^FD圣宝鸿料桶标签^FS
^FO50,100^GB700,2,2^FS

^CF0,25
^FO50,130^FD料桶码:^FS
^FO200,130^FD${material.bucket_code || ""}^FS

^FO50,170^FD料品批次:^FS
^FO200,170^FD${material.batch_number || ""}^FS

^FO50,210^FD托盘码:^FS
^FO200,210^FD${material.pallet_code || ""}^FS

^FO50,250^FD料品编码:^FS
^FO200,250^FD${material.item_code || ""}^FS

^FO50,290^FD料品名称:^FS
^FO200,290^FD${material.item_name || ""}^FS

^FO50,330^FD规格型号:^FS
^FO200,330^FD${material.specification || ""}^FS

^FO500,130^BQN,2,6^FDQA,${qrCodeData}^FS

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

// 发送打印任务到打印机（注意：Web浏览器无法直接连接打印机）
export async function sendPrintJob(
  zplData: string,
  printerConfig: PrinterConfig
): Promise<boolean> {
  try {
    // 尝试通过HTTP发送（仅在特殊网络环境下可用）
    const response = await fetch(`http://${printerConfig.printer_ip}:${printerConfig.printer_port}`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: zplData,
    });

    return true;
  } catch (error) {
    console.error("直接打印失败:", error);
    throw new Error("浏览器安全限制无法直接连接打印机");
  }
}

// 批量生成ZPL并下载
export function batchDownloadZPL(materials: Material[]): string {
  let allZPL = "";
  
  for (const material of materials) {
    allZPL += generateZPL(material) + "\n\n";
  }
  
  return allZPL;
}

// 测试打印机连接（Web环境下无法真正测试）
export async function testPrinterConnection(printerConfig: PrinterConfig): Promise<boolean> {
  // Web浏览器无法直接测试打印机连接
  // 返回配置是否完整
  return !!(
    printerConfig.printer_ip &&
    printerConfig.printer_port &&
    printerConfig.printer_name
  );
}
