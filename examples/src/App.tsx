import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Palette, Settings2 } from 'lucide-react';

function App() {
  const [text, setText] = useState('https://example.com');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);

  const handleDownload = () => {
    const svg = document.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 overflow-hidden">
      {/* 科技感背景装饰 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGgtNnYxMmgtNnYtNmgtNnYxMmgxMnYtNmg2djEyaC02di02aC02djEyaDZ2LTZoNnYxMmgtNnYtNmgtNnY2aC02di00MmgzNnY0MmgtNnYtNmgtNnYtNmg2di0xMnptLTYtNmgtMjR2LTZoMjR2NnoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
      
      {/* 光晕效果 */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-8 h-8 text-blue-300" />
            <h1 className="text-3xl font-bold text-white">二维码生成器</h1>
          </div>
          <p className="text-blue-200">创建自定义的二维码，支持颜色定制和大小调整</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                输入文本或URL
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-blue-200/50"
                placeholder="输入要生成二维码的内容"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Palette className="w-5 h-5 text-blue-300" />
                <label className="block text-sm font-medium text-blue-200">
                  二维码颜色
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-14 rounded cursor-pointer bg-transparent"
                />
              </div>

              <div className="flex items-center gap-4">
                <Settings2 className="w-5 h-5 text-blue-300" />
                <label className="block text-sm font-medium text-blue-200">
                  背景颜色
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-8 w-14 rounded cursor-pointer bg-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  二维码大小: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-blue-400"
                />
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Download className="w-5 h-5" />
              下载SVG
            </button>
          </div>

          <div className="flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-white/20">
              <QRCodeSVG
                value={text}
                size={size}
                fgColor={color}
                bgColor={bgColor}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;