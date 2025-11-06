import { useState, useEffect } from "react";
import {
  Printer,
  Settings,
  Upload,
  Download,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Search,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PrinterConfigDialog } from "@/components/qrcode/PrinterConfigDialog";
import { PrintPreviewDialog } from "@/components/qrcode/PrintPreviewDialog";
import { ExcelImportDialog } from "@/components/qrcode/ExcelImportDialog";
import { MaterialEditDialog } from "@/components/qrcode/MaterialEditDialog";
import { materialsApi, printerConfigApi } from "@/db/api";
import { exportMaterialsToExcel } from "@/utils/excel";
import { generateZPL, sendPrintJob, batchPrint } from "@/utils/print";
import type { Material, PrinterConfig } from "@/types/types";

export default function QRCodePrintTool() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig | null>(null);

  const [showPrinterConfig, setShowPrinterConfig] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showMaterialEdit, setShowMaterialEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);

  useEffect(() => {
    loadMaterials();
    loadPrinterConfig();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const result = await materialsApi.getAll(1, 1000);
      setMaterials(result.data);
    } catch (error) {
      console.error("加载物料数据失败:", error);
      toast.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const loadPrinterConfig = async () => {
    try {
      const config = await printerConfigApi.getDefault();
      setPrinterConfig(config);
    } catch (error) {
      console.error("加载打印机配置失败:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadMaterials();
      return;
    }

    setLoading(true);
    try {
      const result = await materialsApi.search(searchKeyword, 1, 1000);
      setMaterials(result.data);
    } catch (error) {
      console.error("搜索失败:", error);
      toast.error("搜索失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(materials.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const handleEdit = () => {
    if (selectedIds.length !== 1) {
      toast.error("请选择一条数据进行编辑");
      return;
    }
    const material = materials.find((m) => m.id === selectedIds[0]);
    if (material) {
      setCurrentMaterial(material);
      setShowMaterialEdit(true);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请先选择要删除的数据");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await materialsApi.deleteBatch(selectedIds);
      toast.success(`成功删除 ${selectedIds.length} 条数据`);
      setSelectedIds([]);
      loadMaterials();
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  const handlePrintOne = (material: Material) => {
    setCurrentMaterial(material);
    setShowPrintPreview(true);
  };

  const handleConfirmPrint = async () => {
    if (!currentMaterial || !printerConfig) {
      toast.error("打印机未配置");
      return;
    }

    try {
      const zpl = generateZPL(currentMaterial);
      await sendPrintJob(zpl, printerConfig);
      toast.success("打印任务已发送");
      setShowPrintPreview(false);
    } catch (error) {
      console.error("打印失败:", error);
      toast.error("打印失败，请检查打印机连接");
    }
  };

  const handleBatchPrint = async () => {
    if (selectedIds.length === 0) {
      toast.error("请先选择要打印的数据");
      return;
    }

    if (!printerConfig) {
      toast.error("打印机未配置");
      return;
    }

    const selectedMaterials = materials.filter((m) => selectedIds.includes(m.id));

    try {
      const result = await batchPrint(selectedMaterials, printerConfig, (current, total) => {
        toast.loading(`正在打印 ${current}/${total}...`);
      });

      toast.success(`批量打印完成！成功：${result.success}，失败：${result.failed}`);
    } catch (error) {
      console.error("批量打印失败:", error);
      toast.error("批量打印失败");
    }
  };

  const handleToggleBatchLock = async (material: Material) => {
    try {
      await materialsApi.toggleBatchLock(material.id, !material.is_batch_locked);
      toast.success(material.is_batch_locked ? "批次已解锁" : "批次已锁定");
      loadMaterials();
    } catch (error) {
      console.error("操作失败:", error);
      toast.error("操作失败");
    }
  };

  const handleToggleBucketLock = async (material: Material) => {
    try {
      await materialsApi.toggleBucketLock(material.id, !material.is_bucket_locked);
      toast.success(material.is_bucket_locked ? "料桶已解锁" : "料桶已锁定");
      loadMaterials();
    } catch (error) {
      console.error("操作失败:", error);
      toast.error("操作失败");
    }
  };

  const handleExport = () => {
    if (materials.length === 0) {
      toast.error("没有数据可导出");
      return;
    }

    const exportData = selectedIds.length > 0
      ? materials.filter((m) => selectedIds.includes(m.id))
      : materials;

    exportMaterialsToExcel(exportData);
    toast.success("导出成功");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">二维码生成打印工具</h1>
            <p className="text-muted-foreground mt-1">物料管理与标签打印系统</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowPrinterConfig(true)}>
              <Settings className="mr-2 h-4 w-4" />
              打印机配置
            </Button>
            {printerConfig && (
              <Badge variant="outline" className="text-xs">
                {printerConfig.printer_ip}
              </Badge>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="搜索物料编号、名称、料桶码、托盘码..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-md"
              />
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                查询
              </Button>
              <Button variant="outline" onClick={loadMaterials}>
                <RefreshCw className="mr-2 h-4 w-4" />
                刷新
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleEdit}
              disabled={selectedIds.length !== 1}
            >
              <Edit className="mr-2 h-4 w-4" />
              修改
            </Button>

            <Button variant="outline" onClick={handleDelete} disabled={selectedIds.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>

            <Button onClick={handleBatchPrint} disabled={selectedIds.length === 0}>
              <Printer className="mr-2 h-4 w-4" />
              条码打印
            </Button>

            <Button variant="outline" onClick={() => setShowExcelImport(true)}>
              <Upload className="mr-2 h-4 w-4" />
              导入
            </Button>

            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>

            <div className="ml-auto text-sm text-muted-foreground">
              已选择 {selectedIds.length} / {materials.length} 条
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === materials.length && materials.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>原材来料编号</TableHead>
                  <TableHead>物料编号</TableHead>
                  <TableHead>物料名称</TableHead>
                  <TableHead className="text-center">打印顺序</TableHead>
                  <TableHead>规格型号</TableHead>
                  <TableHead>托盘码</TableHead>
                  <TableHead>料桶码</TableHead>
                  <TableHead className="text-center">料品状态</TableHead>
                  <TableHead>来料批次</TableHead>
                  <TableHead>供应商名</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : materials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      暂无数据，请导入Excel文件
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(material.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(material.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {material.material_code}
                      </TableCell>
                      <TableCell>{material.item_code || "-"}</TableCell>
                      <TableCell>{material.item_name || "-"}</TableCell>
                      <TableCell className="text-center">{material.print_order || "-"}</TableCell>
                      <TableCell>{material.specification || "-"}</TableCell>
                      <TableCell>{material.pallet_code || "-"}</TableCell>
                      <TableCell>{material.bucket_code || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            material.item_status === "正常"
                              ? "default"
                              : material.item_status === "待检"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {material.item_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {material.batch_number || "-"}
                          {material.is_batch_locked && (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{material.supplier_name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePrintOne(material)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleBatchLock(material)}
                          >
                            {material.is_batch_locked ? (
                              <Unlock className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <PrinterConfigDialog
        open={showPrinterConfig}
        onOpenChange={setShowPrinterConfig}
        onConfigUpdated={loadPrinterConfig}
      />

      <PrintPreviewDialog
        open={showPrintPreview}
        onOpenChange={setShowPrintPreview}
        material={currentMaterial}
        onConfirmPrint={handleConfirmPrint}
      />

      <ExcelImportDialog
        open={showExcelImport}
        onOpenChange={setShowExcelImport}
        onImportSuccess={loadMaterials}
      />

      <MaterialEditDialog
        open={showMaterialEdit}
        onOpenChange={setShowMaterialEdit}
        material={currentMaterial}
        onSuccess={loadMaterials}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除选中的 {selectedIds.length} 条数据吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
