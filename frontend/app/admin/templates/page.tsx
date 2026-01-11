'use client';

import { useState, useEffect } from 'react';
import { getTemplateTexts, updateTemplateText, TemplateText } from '@/lib/api';

export default function AdminTemplatesPage() {
  const [texts, setTexts] = useState<TemplateText[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   document.title = 'Custom template'
  // }, [])
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      document.title = 'Custom template';
    }, 0);
  }


  useEffect(() => {
    loadTexts();
  }, []);

  const loadTexts = async () => {
    const data = await getTemplateTexts();
    setTexts(data);
  };

  const startEdit = (text: TemplateText) => {
    setEditingId(text.id);
    setEditValue(text.value);
  };

  const saveEdit = async (id: number) => {
    setLoading(true);
    await updateTemplateText(id, editValue);
    await loadTexts();
    setEditingId(null);
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const groupedTexts = texts.reduce((acc, text) => {
    if (!acc[text.category]) acc[text.category] = [];
    acc[text.category].push(text);
    return acc;
  }, {} as Record<string, TemplateText[]>);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Édition des Templates</h1>
      
      {['page1', 'page2', 'page3'].map(category => (
        <div key={category} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
          
          <div className="space-y-4">
            {groupedTexts[category]?.map(text => (
              <div key={text.id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-600 font-mono">{text.key}</span>
                  {editingId !== text.id && (
                    <button
                      onClick={() => startEdit(text)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Modifier
                    </button>
                  )}
                </div>
                
                {editingId === text.id ? (
                  <div>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={editValue.split('\n').length + 1}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit(text.id)}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={loading}
                        className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-gray-800">{text.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}