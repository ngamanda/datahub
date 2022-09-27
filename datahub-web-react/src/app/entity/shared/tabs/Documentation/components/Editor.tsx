import React, { forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import {
    BlockquoteExtension,
    BoldExtension,
    BulletListExtension,
    CodeBlockExtension,
    CodeExtension,
    HeadingExtension,
    HistoryExtension,
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
import { EditorTheme } from './EditorTheme';

const Container = styled.div`
    .remirror-editor-wrapper {
        padding-top: 0;
    }

    .remirror-editor.ProseMirror {
        border: 0;
        box-shadow: none;
        line-height: 1.5;
        overflow-y: auto;
        font-size: var(--rmr-font-size-default);

        &:active,
        &:focus {
            box-shadow: none;
        }

        hr {
            margin: 2rem 0;
            border-color: rgba(0, 0, 0, 0.06);
        }
    }
`;

type EditorProps = {
    readonly?: boolean;
    content?: string;
    onChange?: (json: RemirrorJSON) => void;
};

function parseContent(content?: string) {
    try {
        if (!content) return undefined;
        return JSON.parse(content);
    } catch (e) {
        return content;
    }
}

export const Editor = forwardRef((props: EditorProps, ref) => {
    const { content, readonly, onChange } = props;
    const parsedContent = parseContent(content);

    const { manager, state, getContext } = useRemirror({
        extensions: () => [
            new BlockquoteExtension(),
            new BoldExtension(),
            new BulletListExtension(),
            new CodeBlockExtension(),
            new CodeExtension(),
            new HeadingExtension(),
            new HistoryExtension(),
            new HorizontalRuleExtension(),
            new ImageExtension({ enableResizing: !readonly }) as any,
            new ItalicExtension(),
            new LinkExtension({ autoLink: true }),
            new ListItemExtension(),
            new MarkdownExtension({ htmlSanitizer: DOMPurify.sanitize }),
            new OrderedListExtension(),
            new UnderlineExtension(),
            new StrikeExtension(),
            new TableExtension({ resizable: !readonly }),
        ],
        content: parsedContent,
        stringHandler: 'markdown',
    });

    useImperativeHandle(ref, () => getContext(), [getContext]);

    return (
        <Container>
            <AllStyledComponent>
                <ThemeProvider theme={EditorTheme}>
                    <Remirror editable={!readonly} manager={manager} initialContent={state}>
                        <EditorComponent />
                        <TableComponents
                            enableTableCellMenu={!readonly}
                            enableTableDeleteButton={!readonly}
                            enableTableDeleteRowColumnButton={!readonly}
                        />
                        {onChange && <OnChangeJSON onChange={onChange} />}
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </Container>
    );
});
