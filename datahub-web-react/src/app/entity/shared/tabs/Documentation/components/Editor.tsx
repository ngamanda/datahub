import React, { forwardRef, useImperativeHandle } from 'react';
import {
    BlockquoteExtension,
    BoldExtension,
    BulletListExtension,
    CodeBlockExtension,
    CodeExtension,
    HeadingExtension,
    HorizontalRuleExtension,
    ImageExtension,
    ItalicExtension,
    LinkExtension,
    ListItemExtension,
    MarkdownExtension,
    OrderedListExtension,
    StrikeExtension,
    UnderlineExtension,
} from 'remirror/extensions';
import {
    EditorComponent,
    OnChangeJSON,
    Remirror,
    TableComponents,
    TableExtension,
    ThemeProvider,
    useRemirror,
} from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/styled-components';
import type { RemirrorJSON } from '@remirror/core';

import 'remirror/styles/all.css';

type EditorProps = {
    editable?: boolean;
    content?: string;
    onChange?: (json: RemirrorJSON) => void;
};

export const Editor = forwardRef((props: EditorProps, ref) => {
    const { manager, state, getContext } = useRemirror({
        extensions: () => [
            new BlockquoteExtension(),
            new BoldExtension(),
            new BulletListExtension(),
            new CodeBlockExtension(),
            new CodeExtension(),
            new HeadingExtension(),
            new HorizontalRuleExtension(),
            new ImageExtension({ enableResizing: true }) as any,
            new ItalicExtension(),
            new LinkExtension({ autoLink: true }),
            new ListItemExtension(),
            new MarkdownExtension(),
            new OrderedListExtension(),
            new UnderlineExtension(),
            new StrikeExtension(),
            new TableExtension(),
        ],
        content: props?.content,
        stringHandler: 'markdown',
    });

    useImperativeHandle(ref, () => getContext(), [getContext]);

    return (
        <div className="remirror-theme">
            <AllStyledComponent>
                <ThemeProvider>
                    <Remirror editable={props?.editable} manager={manager} initialContent={props?.content || state}>
                        <EditorComponent />
                        <TableComponents enableTableCellMenu />
                        {props?.onChange && <OnChangeJSON onChange={props.onChange} />}
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </div>
    );
});
