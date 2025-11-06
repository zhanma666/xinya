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

// 发送打印任务到打印机
export async function sendPrintJob(
  zplData: string,
  printerConfig: PrinterConfig
): Promise<boolean> {
  try {
    const response = await fetch(`http://${printerConfig.printer_ip}:${printerConfig.printer_port}`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: zplData,
    });

    return response.ok;
  } catch (error) {
    console.error("打印失败:", error);
    throw new Error("无法连接到打印机，请检查打印机IP地址和网络连接");
  }
}

// 批量打印
export async function batchPrint(
  materials: Material[],
  printerConfig: PrinterConfig,
  onProgress?: (current: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < materials.length; i++) {
    try {
      const zpl = generateZPL(materials[i]);
      await sendPrintJob(zpl, printerConfig);
      success++;
    } catch (error) {
      console.error(`打印第 ${i + 1} 个标签失败:`, error);
      failed++;
    }

    if (onProgress) {
      onProgress(i + 1, materials.length);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return { success, failed };
}

// 测试打印机连接
export async function testPrinterConnection(printerConfig: PrinterConfig): Promise<boolean> {
  const testZPL = `
^XA
^FO50,50^CF0,40^FD打印机连接测试^FS
^FO50,100^CF0,30^FD测试时间: ${new Date().toLocaleString("zh-CN")}^FS
^XZ
`;

  try {
    await sendPrintJob(testZPL, printerConfig);
    return true;
  } catch (error) {
    return false;
  }
}
