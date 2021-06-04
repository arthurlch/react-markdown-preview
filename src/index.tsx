import React, { useImperativeHandle } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
// @ts-ignore
import slug from 'remark-slug';
// @ts-ignore
import headings from 'remark-autolink-headings'
import rehypeRaw from 'rehype-raw';
import rehypePrism from '@mapbox/rehype-prism';
import rehypeRewrite from 'rehype-rewrite';
import './styles/markdown.less';
import './styles/markdowncolor.less';

const rehypeRewriteHandle = (node: any, index: number, parent: any) => {
  if (node.type === 'element' && parent.type === 'root' && /h(1|2|3|4|5|6)/.test(node.tagName) && index !== 0) {
    const child = node.children && node.children[0] ? node.children[0] : null;
    if (child && child.properties && child.properties.ariaHidden === 'true') {
      child.properties = { class: 'anchor', ...child.properties };
      child.children = [
        {
          type: 'element',
          tagName: 'svg',
          properties: {
            class: 'octicon octicon-link',
            viewBox: '0 0 16 16',
            version: '1.1',
            width: '16',
            height: '16',
            ariaHidden: 'true',
          },
          children: [
            {
              type: 'element',
              tagName: 'path',
              properties: {
                fillRule: 'evenodd',
                d: 'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z',
              }
            }
          ]
        }
      ];
    }
  }
}

export type MarkdownPreviewProps = {
  className?: string;
  source?: string;
  style?: React.CSSProperties;
  warpperElement?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
} & Omit<ReactMarkdown.ReactMarkdownOptions, 'children'>;

export type MarkdownPreviewRef = {
  mdp: React.RefObject<HTMLDivElement>;
} & MarkdownPreviewProps;

export default React.forwardRef<MarkdownPreviewRef, MarkdownPreviewProps>((props, ref) => {
  const { className, source, style, onScroll, onMouseOver, warpperElement = {}, ...other  } = props || {};
  const mdp = React.createRef<HTMLDivElement>();
  useImperativeHandle(ref, () => ({ ...props, mdp }), [mdp, props]);

  const cls = `wmde-markdown wmde-markdown-color ${className || ''}`;
  return (
    <div ref={mdp} onScroll={onScroll} onMouseOver={onMouseOver} {...warpperElement} className={cls} style={style}>
      <ReactMarkdown
        {...other}
        plugins={[gfm, ...(other.plugins || [])]}
        rehypePlugins={[[rehypePrism, { ignoreMissing: true }], [rehypeRewrite, rehypeRewriteHandle], rehypeRaw, ...(other.rehypePlugins || [])]}
        remarkPlugins={[ slug, headings, ...(other.remarkPlugins || []) ]}
        children={source || ''}
      />
    </div>
  );
});
