import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Printer, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { printerConfigApi } from "@/db/api";
import { validatePrinterConfig } from "@/utils/print";
import type { PrinterConfig } from "@/types/types";

const formSchema = z.object({
  printer_name: z.string().min(1, "请输入打印机名称"),
  printer_type: z.string().min(1, "请输入打印机类型"),
  printer_ip: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, "请输入有效的IP地址"),
  printer_port: z.number().min(1).max(65535, "端口号范围：1-65535"),
});

type FormValues = z.infer<typeof formSchema>;

interface PrinterConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigUpdated: () => void;
}

export function PrinterConfigDialog({
  open,
  onOpenChange,
  onConfigUpdated,
}: PrinterConfigDialogProps) {
  const [loading, setLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<PrinterConfig | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      printer_name: "ZDesigner ZD888-203dpi ZPL",
      printer_type: "斑马打印机",
      printer_ip: "172.16.5.199",
      printer_port: 9100,
    },
  });

  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open]);

  const loadConfig = async () => {
    try {
      const config = await printerConfigApi.getDefault();
      if (config) {
        setCurrentConfig(config);
        form.reset({
          printer_name: config.printer_name,
          printer_type: config.printer_type,
          printer_ip: config.printer_ip,
          printer_port: config.printer_port,
        });
      }
    } catch (error) {
      console.error("加载打印机配置失败:", error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (currentConfig) {
        await printerConfigApi.update(currentConfig.id, values);
        toast.success("打印机配置已更新");
      } else {
        const newConfig: Omit<PrinterConfig, "id" | "created_at" | "updated_at"> = {
          printer_name: values.printer_name,
          printer_type: values.printer_type,
          printer_ip: values.printer_ip,
          printer_port: values.printer_port,
          is_default: true,
        };
        await printerConfigApi.create(newConfig);
        toast.success("打印机配置已保存");
      }

      onConfigUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("保存打印机配置失败:", error);
      toast.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            打印机配置
          </DialogTitle>
          <DialogDescription>配置斑马打印机连接参数</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="printer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>打印机名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入打印机名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="printer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>打印机类型</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入打印机类型" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="printer_ip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>打印机IP地址</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：172.16.5.199" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="printer_port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>打印机端口</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="默认：9100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                由于浏览器安全限制（HTTPS 无法访问 HTTP 资源），Web 应用无法直接连接打印机。
                请使用"下载ZPL"功能，然后通过 Zebra Setup Utilities 或命令行工具发送到打印机。
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                保存配置
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
