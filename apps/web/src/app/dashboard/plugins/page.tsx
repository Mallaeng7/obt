'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { useServerStore } from '../../../../stores/serverStore';
import { fetchAPI } from '../../../../lib/api';

const Editor = dynamic(() => import('@monaco-editor/react').then(mod => mod.Editor), { ssr: false });

export default function PluginsPage() {
  const [code, setCode] = useState('// Write your plugin code here...\n');
  const activeServerId = useServerStore(state => state.activeServerId);

  const handleDeploy = async () => {
    if (!activeServerId) return;
    await fetchAPI(`/servers/${activeServerId}/plugins`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Custom Plugin',
        description: 'Deployed from Studio',
        code: code,
        trigger: 'custom'
      })
    });
    alert('Plugin deployed successfully!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Plugin Studio</h1>
        <Button onClick={handleDeploy} variant="primary">Deploy Plugin</Button>
      </div>
      <Card>
        <CardContent className="h-[600px] p-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
