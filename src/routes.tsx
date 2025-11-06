import QRCodePrintTool from './pages/QRCodePrintTool';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '二维码生成打印工具',
    path: '/',
    element: <QRCodePrintTool />
  }
];

export default routes;