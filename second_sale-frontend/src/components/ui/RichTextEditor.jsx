import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Image, AlignLeft, AlignCenter,
  AlignRight, Undo, Redo, Code, Eye, Edit3, RemoveFormatting
} from 'lucide-react';

export default function RichTextEditor({ value = '', onChange, placeholder = 'Start writing your content here...' }) {
  const editorRef = useRef(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setHtmlSource(value || '');
  }, [value]);

  const triggerChange = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      setHtmlSource(html);
      onChange?.(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const exec = (command, val = null) => {
    if (showHtml) return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    triggerChange();
  };

  const handleFormatBlock = (tag) => {
    if (showHtml) return;
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    triggerChange();
  };

  const handleInsertLink = () => {
    if (showHtml) return;
    const url = prompt('Enter web link URL (https://...):');
    if (url) {
      exec('createLink', url);
    }
  };

  const handleInsertImage = () => {
    if (showHtml) return;
    const url = prompt('Enter image URL (https://...):');
    if (url) {
      exec('insertImage', url);
    }
  };

  const handleHtmlSourceChange = (e) => {
    const val = e.target.value;
    setHtmlSource(val);
    onChange?.(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-blue-500 transition-all">
      {/* Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-1.5 flex flex-wrap items-center gap-1 text-slate-600">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => exec('undo')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Undo"
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('redo')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Redo"
        >
          <Redo size={15} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => handleFormatBlock('h1')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 font-bold border-none bg-transparent cursor-pointer transition-colors"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('h2')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 font-bold border-none bg-transparent cursor-pointer transition-colors"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('h3')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 font-bold border-none bg-transparent cursor-pointer transition-colors"
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('p')}
          className="px-2 py-1 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Paragraph text"
        >
          ¶ Text
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Formatting */}
        <button
          type="button"
          onClick={() => exec('bold')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Align Left"
        >
          <AlignLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Align Center"
        >
          <AlignCenter size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyRight')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Align Right"
        >
          <AlignRight size={15} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Bulleted List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('blockquote')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Quote Block"
        >
          <Quote size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('insertHorizontalRule')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Horizontal Divider"
        >
          <Minus size={15} />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Links & Images */}
        <button
          type="button"
          onClick={handleInsertLink}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-blue-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Insert Hyperlink"
        >
          <Link2 size={15} />
        </button>
        <button
          type="button"
          onClick={handleInsertImage}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-blue-600 border-none bg-transparent cursor-pointer transition-colors"
          title="Insert Image URL"
        >
          <Image size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 border-none bg-transparent cursor-pointer transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting size={15} />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowHtml(!showHtml)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-colors border cursor-pointer ${
              showHtml
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title="Toggle HTML code mode"
          >
            <Code size={13} />
            <span>{showHtml ? 'Visual' : 'HTML'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {showHtml ? (
        <textarea
          value={htmlSource}
          onChange={handleHtmlSourceChange}
          placeholder="Edit HTML raw markup..."
          rows={12}
          className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900 text-emerald-400 outline-none resize-y"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={triggerChange}
          onBlur={triggerChange}
          className="p-4 min-h-[260px] outline-none text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none focus:outline-none"
          data-placeholder={placeholder}
          style={{ minHeight: '240px' }}
        />
      )}
    </div>
  );
}
