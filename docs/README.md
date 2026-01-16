# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://www.miaoda.cn/projects/app-7d60dowzqhvl

# 二维码生成打印工具

专业的二维码生成和打印管理工具，支持批量处理、Excel数据导入导出，专为斑马打印机优化，适用于物料管理、库存标签等场景。

## ✨ 核心功能

### 📦 物料数据管理
- ✅ 完整的CRUD操作（创建、读取、更新、删除）
- ✅ 批量数据导入导出（Excel格式）
- ✅ 高级搜索和筛选功能
- ✅ 批次和料桶锁定管理
- ✅ 数据状态管理（正常、待检、异常）

### 🖨️ 打印功能
- ✅ 单个标签打印预览
- ✅ 批量标签生成
- ✅ ZPL代码查看和下载
- ✅ 斑马打印机ZPL协议支持
- ✅ 打印机配置管理

### 📊 二维码生成
- ✅ 自动生成包含物料信息的二维码
- ✅ 支持多种数据格式
- ✅ 高质量二维码输出
- ✅ 可自定义二维码内容

### 📁 Excel数据处理
- ✅ 标准模板导入
- ✅ 数据验证和错误提示
- ✅ 批量数据导出
- ✅ 支持大量数据处理

## 🎨 技术特点

### 前端技术栈
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先的CSS框架
- **shadcn/ui** - 高质量UI组件库
- **Vite** - 快速构建工具

### 后端技术
- **Supabase** - 云端数据库和后端服务
- **PostgreSQL** - 关系型数据库
- **Row Level Security** - 数据安全保护

### 核心库
- **xlsx** - Excel文件处理
- **qrcode** - 二维码生成
- **react-router-dom** - 路由管理
- **sonner** - 优雅的通知提示

## 📋 数据模型

### 物料表 (materials)
```sql
- id: UUID (主键)
- material_code: 原材来料编号
- item_code: 物料编号
- item_name: 物料名称
- print_order: 打印顺序
- specification: 规格型号
- pallet_code: 托盘码
- bucket_code: 料桶码
- item_status: 料品状态
- batch_number: 来料批次
- supplier_name: 供应商名
- is_batch_locked: 批次锁定状态
- is_bucket_locked: 料桶锁定状态
```

### 打印机配置表 (printer_config)
```sql
- id: UUID (主键)
- printer_name: 打印机名称
- printer_type: 打印机类型
- printer_ip: 打印机IP地址
- printer_port: 打印机端口
- is_default: 是否默认配置
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 或 npm

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
创建 `.env` 文件并配置：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 运行开发服务器
```bash
pnpm run dev
```

### 构建生产版本
```bash
pnpm run build
```

## 📖 使用说明

详细使用说明请参考 [用户指南](./user-guide.md)

### 基本工作流程

1. **导入数据**
   - 准备符合模板格式的Excel文件
   - 点击"导入"按钮上传文件
   - 系统自动解析并保存数据

2. **管理数据**
   - 使用搜索功能快速查找
   - 编辑或删除数据
   - 锁定重要批次或料桶

3. **打印标签**
   - 选择需要打印的物料
   - 预览标签效果
   - 下载ZPL文件
   - 使用打印工具发送到打印机

4. **导出数据**
   - 选择需要导出的数据
   - 点击"导出"按钮
   - 获取Excel文件

## 🖨️ 打印方案

### 方案一：下载ZPL文件（推荐）
1. 在系统中生成ZPL文件
2. 使用Zebra Setup Utilities或命令行工具发送到打印机
3. 适合批量打印和自动化场景

### 方案二：Zebra Browser Print
1. 安装Zebra Browser Print客户端
2. 配置打印机连接
3. 直接从浏览器打印
4. 适合交互式打印场景

## 🔒 安全特性

- ✅ 数据库Row Level Security (RLS)
- ✅ 环境变量保护敏感信息
- ✅ 输入验证和数据清洗
- ✅ 错误处理和用户友好提示

## 🎯 设计理念

### 用户体验
- 简洁直观的界面设计
- 清晰的操作流程
- 即时的反馈提示
- 响应式布局适配

### 性能优化
- 分页加载大量数据
- 懒加载和代码分割
- 优化的数据库查询
- 缓存策略

### 可维护性
- TypeScript类型安全
- 模块化组件设计
- 清晰的代码结构
- 完善的错误处理

## 📊 项目结构

```
src/
├── components/          # UI组件
│   ├── ui/             # shadcn/ui基础组件
│   └── qrcode/         # 业务组件
├── pages/              # 页面组件
├── db/                 # 数据库相关
│   ├── supabase.ts     # Supabase客户端
│   └── api.ts          # API封装
├── utils/              # 工具函数
│   ├── excel.ts        # Excel处理
│   └── print.ts        # 打印功能
├── types/              # TypeScript类型定义
└── routes.tsx          # 路由配置

supabase/
└── migrations/         # 数据库迁移文件

docs/
├── prd.md             # 产品需求文档
├── user-guide.md      # 用户指南
└── README.md          # 项目说明
```

## 🔧 配置说明

### 打印机配置
- **默认打印机**：ZDesigner ZD888-203dpi ZPL
- **默认IP**：172.16.5.199
- **默认端口**：9100
- **打印协议**：ZPL II
- **分辨率**：203 DPI

### 标签规格
- **标签尺寸**：80mm × 60mm
- **打印宽度**：640点 (80mm @ 203 DPI)
- **标签长度**：480点 (60mm @ 203 DPI)
- **打印模式**：撕离模式
- **介质类型**：间隙/缺口
- **料品名称**：固定为"石英砂"

## 🐛 已知限制

1. **浏览器打印限制**
   - Web应用无法直接连接网络打印机
   - 需要使用ZPL文件下载或Browser Print方案

2. **Excel格式要求**
   - 必须符合指定的模板格式
   - 列名必须完全匹配

3. **数据量限制**
   - 建议单次导入不超过1000条数据
   - 大量数据建议分批导入

## 📝 更新日志

### v1.0.0 (2025-01-06)
- ✅ 初始版本发布
- ✅ 完整的物料管理功能
- ✅ Excel导入导出
- ✅ ZPL打印支持
- ✅ 打印机配置管理
- ✅ 二维码生成
- ✅ 批量操作功能

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 📄 许可证

2025 二维码生成打印工具
