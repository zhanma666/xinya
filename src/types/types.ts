// 物料数据类型
export interface Material {
  id: string;
  material_code: string;
  item_code: string | null;
  item_name: string | null;
  print_order: number | null;
  specification: string | null;
  pallet_code: string | null;
  bucket_code: string | null;
  item_status: string;
  batch_number: string | null;
  supplier_name: string | null;
  batch_rule: string | null;
  is_batch_locked: boolean;
  is_bucket_locked: boolean;
  created_at: string;
  updated_at: string;
}

// 打印机配置类型
export interface PrinterConfig {
  id: string;
  printer_name: string;
  printer_type: string;
  printer_ip: string;
  printer_port: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Excel导入数据类型
export interface ExcelImportData {
  料桶码?: string;
  料品批次?: string;
  托盘码?: string;
  料品编码?: string;
  规格型号?: string;
  料品批次编码规则?: string;
}

// 打印标签数据类型
export interface PrintLabelData {
  bucket_code: string;
  batch_number: string;
  pallet_code: string;
  item_code: string;
  item_name: string;
  specification: string;
}
