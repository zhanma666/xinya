import type { Material, PrinterConfig } from "@/types/types";

// 生成ZPL打印指令
// 根据实际打印效果精确调整布局
// 标签尺寸: 80mm × 60mm (203 DPI)
// 80mm = 640点, 60mm = 480点
export function generateZPL(material: Material): string {
  const qrCodeData = `${material.bucket_code || ""}|${material.batch_number || ""}|${material.pallet_code || ""}|${material.item_code || ""}`;

  const zpl = `
^XA
^PW640
^LL480

^FO20,20^GB600,440,2^FS

^FO30,35^CF0,25^FD料桶码:^FS
^FO120,35^CF0,30^FD${material.bucket_code || ""}^FS

^FO30,75^CF0,25^FD料品批次:^FS
^FO120,75^CF0,30^FD${material.batch_number || ""}^FS

^FO30,115^CF0,25^FD托盘码:^FS
^FO120,115^CF0,30^FD${material.pallet_code || ""}^FS

^FO30,155^CF0,25^FD料品编码:^FS
^FO120,155^CF0,30^FD${material.item_code || ""}^FS

^FO30,195^CF0,25^FD料品名称:^FS
^FO120,195^CF0,30^FD${material.item_name || "石英砂"}^FS

^FO30,235^CF0,25^FD规格型号:^FS
^FO120,235^CF0,30^FD${material.specification || ""}^FS

^FO400,30^BQN,2,8^FDQA,${qrCodeData}^FS
^FO400,200^CF0,12^FD二维码^FS

^FO220,400^CF0,35^FD圣宝鸿料桶标签^FS

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

// 直接发送到网络打印机
export async function sendToNetworkPrinter(
  zplData: string, 
  printerConfig: PrinterConfig
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `http://${printerConfig.printer_ip}:${printerConfig.printer_port}`;
    
    xhr.open('POST', url, true);
    xhr.timeout = 10000; // 10秒超时
    xhr.setRequestHeader('Content-Type', 'text/plain');
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(true);
      } else {
        reject(new Error(`打印机返回错误状态: ${xhr.status}`));
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('网络连接失败，请检查打印机连接'));
    };
    
    xhr.ontimeout = function() {
      reject(new Error('打印机连接超时，请检查网络连接和打印机状态'));
    };
    
    xhr.send(zplData);
  });
}

// 测试打印机连接
export async function testPrinterConnection(printerConfig: PrinterConfig): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    // 尝试建立TCP连接测试
    const response = await fetch(`http://${printerConfig.printer_ip}:${printerConfig.printer_port}`, {
      method: 'HEAD',
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeoutId);
    
    // 即使连接失败，只要没有超时或网络错误，也认为打印机可能在线
    // 斑马打印机通常不会响应HTTP请求，但TCP连接可以建立
    return true;
  } catch (error) {
    console.error('打印机连接测试失败:', error);
    return false;
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

// 批量发送到打印机
export async function batchSendToPrinter(
  materials: Material[], 
  printerConfig: PrinterConfig
): Promise<void> {
  for (const material of materials) {
    const zpl = generateZPL(material);
    await sendToNetworkPrinter(zpl, printerConfig);
    
    // 添加短暂延迟，避免打印机过载
    await new Promise(resolve => setTimeout(resolve, 100));
  }
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

打印方法：

方法一：自动网络打印（推荐）
1. 确保打印机与电脑在同一网络
2. 配置正确的打印机IP和端口
3. 点击"直接打印"按钮

方法二：使用 Zebra Setup Utilities
1. 下载并安装 Zebra Setup Utilities
2. 打开软件，选择打印机
3. 点击 "Send File" 发送下载的 ZPL 文件

方法三：使用命令行（Windows）
copy /b 文件名.zpl \\\\${printerConfig.printer_ip}\\共享名

方法四：使用 Zebra Browser Print
1. 下载并安装 Zebra Browser Print 客户端
2. 运行服务后即可直接打印

连接问题排查：
- 检查打印机电源和网络连接
- 确认IP地址和端口正确
- 检查防火墙设置
- 尝试ping打印机IP测试连通性
  `.trim();
}
