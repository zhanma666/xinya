import { useState } from "react";
import { Upload, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadExcelTemplate, importExcelFile, convertExcelToMaterial } from "@/utils/excel";
import { materialsApi } from "@/db/api";

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

export function ExcelImportDialog({
  open,
  onOpenChange,
  onImportSuccess,
}: ExcelImportDialogProps) {
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
    toast.success("模板下载成功");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("请选择Excel文件（.xlsx或.xls）");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("请先选择要导入的文件");
      return;
    }

    setImporting(true);
    try {
      const excelData = await importExcelFile(selectedFile);

      if (excelData.length === 0) {
        toast.error("Excel文件中没有数据");
        return;
      }

      const materials = excelData.map((data, index) =>
        convertExcelToMaterial(data, index + 1)
      );

      await materialsApi.createBatch(materials);

      toast.success(`成功导入 ${materials.length} 条物料数据`);
      onImportSuccess();
      onOpenChange(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("导入失败:", error);
      toast.error("导入失败，请检查Excel文件格式是否正确");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Excel数据导入
          </DialogTitle>
          <DialogDescription>
            下载模板填写数据后导入，支持批量添加物料信息
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium mb-1">选择Excel文件</p>
              <p className="text-xs text-muted-foreground">
                支持 .xlsx 和 .xls 格式
              </p>
            </div>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="excel-file-input"
            />

            <Button
              variant="outline"
              onClick={() => document.getElementById("excel-file-input")?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              选择文件
            </Button>

            {selectedFile && (
              <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
                已选择: {selectedFile.name}
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">导入说明：</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>请先下载Excel模板，按照模板格式填写数据</li>
              <li>必填字段：料桶码、料品批次、料品编码</li>
              <li>导入后系统会自动生成原材来料编号</li>
              <li>支持批量导入，一次可导入多条数据</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              下载模板
            </Button>

            <Button
              onClick={handleImport}
              disabled={!selectedFile || importing}
              className="flex-1"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  开始导入
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
