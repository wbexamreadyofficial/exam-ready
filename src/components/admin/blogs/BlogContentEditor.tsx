'use client';

import { useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { toast } from 'sonner';
import {
  Bold,
  Film,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/api/errors';
import { mediaApi } from '@/lib/api/media';
import { Video } from './tiptapVideoExtension';

interface BlogContentEditorProps {
  content: string;
  onChange: (html: string) => void;
}

/** Where the editor's inline images/videos render — no typography plugin installed, so it's styled by hand. */
const CONTENT_CLASSES =
  '[&_p]:my-2 [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-extrabold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-bold ' +
  '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 ' +
  '[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-border)] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[var(--color-muted-foreground)] ' +
  '[&_a]:text-[var(--color-primary)] [&_a]:underline [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-lg [&_video]:my-3 [&_video]:max-w-full [&_video]:rounded-lg [&_code]:rounded [&_code]:bg-[var(--color-muted)] [&_code]:px-1';

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-accent)]/15 disabled:pointer-events-none disabled:opacity-40',
        active && 'bg-[var(--color-accent)]/20 text-[var(--color-primary)]'
      )}
    >
      {children}
    </button>
  );
}

/**
 * Rich blog editor — text, images and self-hosted video in one flow, the way
 * WordPress/Ghost/Medium editors work. Images and video upload through the
 * shared ImageKit media endpoint and get inserted inline.
 */
export function BlogContentEditor({ content, onChange }: BlogContentEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<'image' | 'video' | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Video,
      Placeholder.configure({ placeholder: 'Write the blog content — add images and video from the toolbar…' }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn('min-h-[280px] px-4 py-3 focus:outline-none', CONTENT_CLASSES),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const uploadAndInsert = async (file: File, kind: 'image' | 'video') => {
    if (!editor) return;

    const isImage = kind === 'image' && file.type.startsWith('image/');
    const isVideo = kind === 'video' && file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      toast.error(kind === 'image' ? 'Please choose an image file' : 'Please choose a video file');
      return;
    }
    const maxMB = kind === 'image' ? 10 : 100;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`File must be ${maxMB}MB or smaller`);
      return;
    }

    setUploading(kind);
    try {
      const media = await mediaApi.upload(file, 'blog-content');
      if (kind === 'image') {
        editor.chain().focus().setImage({ src: media.url }).run();
      } else {
        editor.chain().focus().insertContent({ type: 'video', attrs: { src: media.url } }).run();
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, `Could not upload the ${kind}`));
    } finally {
      setUploading(null);
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previous ?? 'https://');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--color-border)] bg-[var(--color-muted)]/30 px-2 py-1.5">
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />

        <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive('link')} onClick={setLink}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />

        <ToolbarButton label="Insert image" disabled={uploading !== null} onClick={() => imageInputRef.current?.click()}>
          {uploading === 'image' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </ToolbarButton>
        <ToolbarButton label="Insert video" disabled={uploading !== null} onClick={() => videoInputRef.current?.click()}>
          {uploading === 'video' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
        </ToolbarButton>

        <span className="ml-auto flex items-center gap-0.5">
          <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
        </span>
      </div>

      <EditorContent editor={editor} data-lenis-prevent />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadAndInsert(file, 'image');
          event.target.value = '';
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadAndInsert(file, 'video');
          event.target.value = '';
        }}
      />
    </div>
  );
}
