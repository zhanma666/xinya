import * as XLSX from "xlsx";
import type { Material, ExcelImportData } from "@/types/types";

// 导出Excel模板
export function downloadExcelTemplate() {
  const templateData = [
    {
      料桶码: "",
      料品批次: "",
      托盘码: "",
      料品编码: "",
      规格型号: "",
      料品批次编码规则: "供应商字母编号+批次号+流水号",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "物料数据模板");

  const colWidths = [
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
  ];
  ws["!cols"] = colWidths;

  XLSX.writeFile(wb, "物料数据导入模板.xlsx");
}

// 导入Excel数据
export async function importExcelFile(file: File): Promise<ExcelImportData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelImportData>(worksheet);

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("文件读取失败"));
    };

    reader.readAsBinaryString(file);
  });
}

// 导出物料数据为Excel
export function exportMaterialsToExcel(materials: Material[]) {
  const exportData = materials.map((m, index) => ({
    序号: index + 1,
    原材来料编号: m.material_code,
    物料编号: m.item_code || "",
    物料名称: m.item_name || "",
    打印顺序: m.print_order || "",
    规格型号: m.specification || "",
    托盘码: m.pallet_code || "",
    料桶码: m.bucket_code || "",
    料品状态: m.item_status,
    来料批次: m.batch_number || "",
    供应商名: m.supplier_name || "",
    料品批次编码规则: m.batch_rule || "",
    批次锁定: m.is_batch_locked ? "是" : "否",
    料桶锁定: m.is_bucket_locked ? "是" : "否",
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "物料数据");

  const colWidths = [
    { wch: 6 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
    { wch: 10 },
    { wch: 10 },
  ];
  ws["!cols"] = colWidths;

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `物料数据导出_${timestamp}.xlsx`);
}

// 将Excel导入数据转换为Material对象
export function convertExcelToMaterial(
  excelData: ExcelImportData,
  printOrder: number
): Omit<Material, "id" | "created_at" | "updated_at"> {
  const materialCode = `YCL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    material_code: materialCode,
    item_code: excelData.料品编码 || null,
    item_name: null,
    print_order: printOrder,
    specification: excelData.规格型号 || null,
    pallet_code: excelData.托盘码 || null,
    bucket_code: excelData.料桶码 || null,
    item_status: "正常",
    batch_number: excelData.料品批次 || null,
    supplier_name: null,
    batch_rule: excelData.料品批次编码规则 || null,
    is_batch_locked: false,
    is_bucket_locked: false,
  };
}
