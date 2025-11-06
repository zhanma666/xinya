import { supabase } from "./supabase";
import type { Material, PrinterConfig } from "@/types/types";

// 物料数据API
export const materialsApi = {
  // 获取所有物料（分页）
  async getAll(page = 1, pageSize = 50) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("materials")
      .select("*", { count: "exact" })
      .order("print_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      data: Array.isArray(data) ? data : [],
      total: count || 0,
    };
  },

  // 根据ID获取物料
  async getById(id: string) {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 搜索物料
  async search(keyword: string, page = 1, pageSize = 50) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("materials")
      .select("*", { count: "exact" })
      .or(
        `material_code.ilike.%${keyword}%,item_code.ilike.%${keyword}%,item_name.ilike.%${keyword}%,bucket_code.ilike.%${keyword}%,pallet_code.ilike.%${keyword}%`
      )
      .order("print_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      data: Array.isArray(data) ? data : [],
      total: count || 0,
    };
  },

  // 创建物料
  async create(material: Omit<Material, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("materials")
      .insert(material)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 批量创建物料
  async createBatch(materials: Omit<Material, "id" | "created_at" | "updated_at">[]) {
    const { data, error } = await supabase
      .from("materials")
      .insert(materials)
      .select();

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // 更新物料
  async update(id: string, material: Partial<Material>) {
    const { data, error } = await supabase
      .from("materials")
      .update(material)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 删除物料
  async delete(id: string) {
    const { error } = await supabase.from("materials").delete().eq("id", id);

    if (error) throw error;
  },

  // 批量删除物料
  async deleteBatch(ids: string[]) {
    const { error } = await supabase.from("materials").delete().in("id", ids);

    if (error) throw error;
  },

  // 锁定/解锁批次
  async toggleBatchLock(id: string, locked: boolean) {
    const { data, error } = await supabase
      .from("materials")
      .update({ is_batch_locked: locked })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 锁定/解锁料桶
  async toggleBucketLock(id: string, locked: boolean) {
    const { data, error } = await supabase
      .from("materials")
      .update({ is_bucket_locked: locked })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

// 打印机配置API
export const printerConfigApi = {
  // 获取所有打印机配置
  async getAll() {
    const { data, error } = await supabase
      .from("printer_config")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // 获取默认打印机
  async getDefault() {
    const { data, error } = await supabase
      .from("printer_config")
      .select("*")
      .eq("is_default", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 创建打印机配置
  async create(config: Omit<PrinterConfig, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("printer_config")
      .insert(config)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 更新打印机配置
  async update(id: string, config: Partial<PrinterConfig>) {
    const { data, error } = await supabase
      .from("printer_config")
      .update(config)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 设置默认打印机
  async setDefault(id: string) {
    await supabase.from("printer_config").update({ is_default: false }).neq("id", id);

    const { data, error } = await supabase
      .from("printer_config")
      .update({ is_default: true })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 删除打印机配置
  async delete(id: string) {
    const { error } = await supabase.from("printer_config").delete().eq("id", id);

    if (error) throw error;
  },
};
