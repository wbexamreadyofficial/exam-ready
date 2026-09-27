import { mergeAttributes, Node } from '@tiptap/core';

/** A self-hosted <video> block — TipTap ships nothing for video, only the YouTube embed. */
export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, ...rest } = HTMLAttributes;
    return [
      'video',
      mergeAttributes(rest, { controls: 'true', style: 'max-width:100%;border-radius:0.5rem;' }),
      ['source', { src }],
    ];
  },
});
