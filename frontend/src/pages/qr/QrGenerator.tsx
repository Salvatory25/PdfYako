import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Link as LinkIcon, Type, Wifi, Mail, MessageCircle, Smartphone, CheckCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';

type TabType = 'url' | 'text' | 'wifi' | 'email' | 'whatsapp';

const QrGenerator = () => {
  const [activeTab, setActiveTab] = useState<TabType>('url');
  
  // States for different input types
  const [urlInput, setUrlInput] = useState('https://pdfyako.app');
  const [textInput, setTextInput] = useState('');
  
  // WiFi state
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  
  // Email state
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // WhatsApp state
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');

  // Customization state
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(256);
  
  const [qrValue, setQrValue] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Generate QR string based on active tab
    let value = '';
    switch (activeTab) {
      case 'url':
        value = urlInput || 'https://example.com';
        break;
      case 'text':
        value = textInput || 'Enter some text';
        break;
      case 'wifi':
        value = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
        break;
      case 'email':
        value = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        break;
      case 'whatsapp':
        value = `https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`;
        break;
    }
    setQrValue(value);
  }, [activeTab, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, emailTo, emailSubject, emailBody, waPhone, waMessage]);

  const handleDownload = (format: 'png' | 'svg') => {
    if (format === 'png') {
      // Find the canvas element inside our container (qrcode.react renders canvas or svg based on component used)
      const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
      if (canvas) {
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `pdfyako-qr.${format}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } else {
      const svg = document.getElementById('qr-code-svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = `pdfyako-qr.${format}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  };

  const tabs = [
    { id: 'url', icon: LinkIcon, label: 'URL' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'wifi', icon: Wifi, label: 'WiFi' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Free QR Code Generator - Create Custom QR Codes Online" 
        description="Generate custom QR codes for URLs, WiFi networks, Email, and WhatsApp. Fast, free, and secure QR code creator with no watermarks." 
        url="https://pdfyako.com/tools/qr"
        keywords="qr code generator, create qr code, free qr code maker, wifi qr code, url qr code"
      />
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">QR Code Generator</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Create customized QR codes instantly without leaving your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-sm">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Forms */}
            <div className="space-y-6">
              {activeTab === 'url' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Website URL</label>
                  <input 
                    type="url" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {activeTab === 'text' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Text Content</label>
                  <textarea 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
                    placeholder="Enter your message here..."
                  />
                </div>
              )}

              {activeTab === 'wifi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Network Name (SSID)</label>
                    <input 
                      type="text" 
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <input 
                        type="password" 
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Encryption</label>
                      <select 
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium">Hidden Network</span>
                  </label>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input 
                      type="text" 
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea 
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'whatsapp' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number (with country code)</label>
                    <input 
                      type="tel" 
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. 1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                    <textarea 
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* Customization Options */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Foreground Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <span className="text-sm text-slate-500 uppercase">{fgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <span className="text-sm text-slate-500 uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 shadow-sm sticky top-24 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-6 w-full text-center">Live Preview</h3>
              
              <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center min-h-[300px] w-full">
                {/* We render both Canvas and SVG. Canvas is visible and used for PNG download, SVG is hidden and used for SVG download. */}
                <div className="relative">
                  <QRCodeCanvas 
                    id="qr-code-canvas"
                    value={qrValue} 
                    size={qrSize}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    includeMargin={true}
                    className="max-w-full h-auto"
                  />
                  <div className="hidden">
                    <QRCodeSVG 
                      id="qr-code-svg"
                      value={qrValue} 
                      size={qrSize}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full mt-6 space-y-3">
                <button 
                  onClick={() => handleDownload('png')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </button>
                <button 
                  onClick={() => handleDownload('svg')}
                  className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download SVG
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Placement */}
        <AdBanner slot="qr-generator-bottom" />

        {/* SEO Text Content */}
        <div className="mt-20 max-w-4xl mx-auto text-slate-600 dark:text-slate-400">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">How to Generate Custom QR Codes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Type className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Choose Content Type</h3>
              <p className="text-sm">Select whether you want to link to a website URL, share a WiFi password, write an email, or send a WhatsApp message.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Enter Your Details</h3>
              <p className="text-sm">Type in your information. The live preview will automatically update and generate your custom QR code instantly.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Download Code</h3>
              <p className="text-sm">Customize the colors if you'd like, then download your high-quality QR code in PNG or SVG format.</p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">A Free & Secure QR Code Maker</h2>
            <p className="mb-4">
              Pdfyako offers a completely free QR code generator that works directly in your web browser. This means your data (like your WiFi password or personal phone number) never leaves your device and is never sent to our servers.
            </p>
            <p>
              You can use these generated codes anywhere—on business cards, restaurant menus, event posters, or digital presentations. They do not expire and will always work for free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;
