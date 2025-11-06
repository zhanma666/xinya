import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { materialsApi } from "@/db/api";
import type { Material } from "@/types/types";

const formSchema = z.object({
  material_code: z.string().min(1, "请输入原材来料编号"),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  print_order: z.number().optional(),
  specification: z.string().optional(),
  pallet_code: z.string().optional(),
  bucket_code: z.string().optional(),
  item_status: z.string(),
  batch_number: z.string().optional(),
  supplier_name: z.string().optional(),
  batch_rule: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MaterialEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
  onSuccess: () => void;
}

export function MaterialEditDialog({
  open,
  onOpenChange,
  material,
  onSuccess,
}: MaterialEditDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      material_code: "",
      item_code: "",
      item_name: "",
      print_order: 0,
      specification: "",
      pallet_code: "",
      bucket_code: "",
      item_status: "正常",
      batch_number: "",
      supplier_name: "",
      batch_rule: "",
    },
  });

  useEffect(() => {
    if (material && open) {
      form.reset({
        material_code: material.material_code,
        item_code: material.item_code || "",
        item_name: material.item_name || "",
        print_order: material.print_order || 0,
        specification: material.specification || "",
        pallet_code: material.pallet_code || "",
        bucket_code: material.bucket_code || "",
        item_status: material.item_status,
        batch_number: material.batch_number || "",
        supplier_name: material.supplier_name || "",
        batch_rule: material.batch_rule || "",
      });
    }
  }, [material, open, form]);

  const onSubmit = async (values: FormValues) => {
    if (!material) return;

    try {
      await materialsApi.update(material.id, values);
      toast.success("物料信息已更新");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("更新失败:", error);
      toast.error("更新失败，请重试");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            编辑物料信息
          </DialogTitle>
          <DialogDescription>修改物料的详细信息</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="material_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>原材来料编号</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>物料编号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入物料编号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>物料名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入物料名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="print_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>打印顺序</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="请输入打印顺序"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>规格型号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入规格型号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pallet_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>托盘码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入托盘码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bucket_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>料桶码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入料桶码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>料品状态</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="正常">正常</SelectItem>
                        <SelectItem value="待检">待检</SelectItem>
                        <SelectItem value="异常">异常</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>来料批次</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入来料批次" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>供应商名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入供应商名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="batch_rule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>料品批次编码规则</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：供应商字母编号+批次号+流水号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit">
                保存修改
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
