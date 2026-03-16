import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";

interface IProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLenght?: number;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  maxLenght = 100,
}: IProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (currentHTML !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const charCount = editor.getText().length;
  const isOverLimit = charCount > maxLenght;

  const tools = [
    {
      icon: <Bold size={16} />,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: <Italic size={16} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough size={16} />,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
    },
    {
      icon: <List size={16} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered size={16} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      <div className="border border-(--auth-glass-border) rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-(--auth-glass-border) bg-black/5 dark:bg-white/5">
          {tools.map((tool, i) => (
            <button
              key={i}
              type="button"
              onClick={tool.action}
              className={`p-2 rounded-lg transition-all ${
                tool.active
                  ? "bg-(--primary-color) text-white"
                  : "text-(--muted-color) hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        <div className="relative">
          <EditorContent
            editor={editor}
            className="min-h-[120px] p-3 text-(--text-primary) text-sm prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]"
          />
          {!editor.getText() && (
            <p className="absolute top-3 left-3 pointer-events-none text-(--muted-color) text-sm">
              {placeholder}
            </p>
          )}
        </div>
      </div>

      <p
        className={`text-xs text-right pr-1 ${isOverLimit ? "text-red-500" : "text-(--muted-color)"}`}
      >
        {charCount} / {maxLenght}
      </p>
    </div>
  );
};

export default RichTextEditor;
