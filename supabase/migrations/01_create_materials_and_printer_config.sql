/*
# 创建物料管理和打印机配置表

## 1. 新建表

### materials（物料表）
- `id` (uuid, 主键, 默认生成)
- `material_code` (text, 原材来料编号, 唯一)
- `item_code` (text, 物料编号)
- `item_name` (text, 物料名称)
- `print_order` (integer, 打印顺序)
- `specification` (text, 规格型号)
- `pallet_code` (text, 托盘码)
- `bucket_code` (text, 料桶码)
- `item_status` (text, 料品状态, 默认'正常')
- `batch_number` (text, 来料批次)
- `supplier_name` (text, 供应商名)
- `batch_rule` (text, 料品批次编码规则)
- `is_batch_locked` (boolean, 批次是否锁定, 默认false)
- `is_bucket_locked` (boolean, 料桶是否锁定, 默认false)
- `created_at` (timestamptz, 创建时间, 默认now())
- `updated_at` (timestamptz, 更新时间, 默认now())

### printer_config（打印机配置表）
- `id` (uuid, 主键, 默认生成)
- `printer_name` (text, 打印机名称)
- `printer_type` (text, 打印机类型)
- `printer_ip` (text, 打印机IP地址)
- `printer_port` (integer, 打印机端口, 默认9100)
- `is_default` (boolean, 是否默认打印机, 默认false)
- `created_at` (timestamptz, 创建时间, 默认now())
- `updated_at` (timestamptz, 更新时间, 默认now())

## 2. 安全策略
- 不启用RLS，允许所有用户访问和修改数据（工具型应用）

## 3. 索引
- materials表：material_code唯一索引
- materials表：batch_number索引（用于批次查询）
- printer_config表：is_default索引（快速查找默认打印机）

## 4. 初始数据
- 插入默认打印机配置
*/

-- 创建物料表
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_code text UNIQUE NOT NULL,
  item_code text,
  item_name text,
  print_order integer,
  specification text,
  pallet_code text,
  bucket_code text,
  item_status text DEFAULT '正常',
  batch_number text,
  supplier_name text,
  batch_rule text,
  is_batch_locked boolean DEFAULT false,
  is_bucket_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建打印机配置表
CREATE TABLE IF NOT EXISTS printer_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  printer_name text NOT NULL,
  printer_type text NOT NULL,
  printer_ip text NOT NULL,
  printer_port integer DEFAULT 9100,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_materials_batch_number ON materials(batch_number);
CREATE INDEX IF NOT EXISTS idx_printer_config_default ON printer_config(is_default);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为materials表添加更新时间触发器
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 为printer_config表添加更新时间触发器
CREATE TRIGGER update_printer_config_updated_at
  BEFORE UPDATE ON printer_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 插入默认打印机配置
INSERT INTO printer_config (printer_name, printer_type, printer_ip, printer_port, is_default)
VALUES ('ZDesigner ZD888-203dpi ZPL', '斑马打印机', '172.16.5.199', 9100, true)
ON CONFLICT DO NOTHING;
