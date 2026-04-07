import { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, value, title }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      className="p-2 rounded hover:bg-gray-100 transition-colors"
      title={title}
    >
      <Icon className="w-4 h-4 text-gray-600" />
    </button>
  );

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${isFocused ? 'border-[#4353FF] ring-2 ring-[#4353FF]/20' : 'border-gray-200'}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <ToolbarButton icon={Undo} command="undo" title="Undo" />
          <ToolbarButton icon={Redo} command="redo" title="Redo" />
        </div>
        
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={Bold} command="bold" title="Bold" />
          <ToolbarButton icon={Italic} command="italic" title="Italic" />
          <ToolbarButton icon={Underline} command="underline" title="Underline" />
        </div>
        
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={Heading1} command="formatBlock" value="H1" title="Heading 1" />
          <ToolbarButton icon={Heading2} command="formatBlock" value="H2" title="Heading 2" />
        </div>
        
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
          <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
        </div>
        
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
        </div>
        
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={Quote} command="formatBlock" value="BLOCKQUOTE" title="Quote" />
          <ToolbarButton icon={Code} command="formatBlock" value="PRE" title="Code Block" />
        </div>
        
        <div className="flex items-center gap-1 pl-2">
          <button
            type="button"
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[300px] p-4 outline-none prose prose-sm max-w-none"
        style={{ minHeight: '300px' }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      {/* Character Count */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-right">
        {value?.replace(/<[^>]*>/g, '').length || 0} characters
      </div>
    </div>
  );
};

export default RichTextEditor;
