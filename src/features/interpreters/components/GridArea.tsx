import React, { useContext, useMemo } from 'react';
import { EditorContext } from '../EditorContext';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { Text } from './Text';
import { COLORS, SPACING } from '../../../config/theme';

export interface GridAreaProps {
    handleClick: (pos: number) => () => void;
    chooseColor: (pos: number) => string;
    options: string[];
    rows: number;
    cols: number;
}

export function GridArea({
    handleClick,
    chooseColor,
    options,
    rows,
    cols,
}: GridAreaProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) {
        throw new Error('GridArea must be used within EditorContext.Provider');
    }

    const { size } = editorContext;

    const cellStyles = useMemo(
        () => ({
            primary: {
                bg: COLORS.surface.glass,
                text: COLORS.primary.main,
                border: `1px solid ${COLORS.primary.main}`,
                hover: COLORS.interactive.selected,
            },
            info: {
                bg: COLORS.interactive.focus,
                text: COLORS.text.primary,
                border: `1px solid ${COLORS.primary.main}`,
                hover: COLORS.interactive.hover,
            },
            secondary: {
                bg: COLORS.surface.glass,
                text: COLORS.text.secondary,
                border: `1px solid ${COLORS.border.subtle}`,
                hover: COLORS.interactive.selected,
            },
        }),
        []
    );

    const getCellStyles = useMemo(
        () => (color: string) => {
            return (
                (cellStyles as Record<string, typeof cellStyles.secondary>)[
                    color
                ] || cellStyles.secondary
            );
        },
        [cellStyles]
    );

    const cellProps = (row: number, col: number) => {
        const pos = cols * row + col;
        const color = chooseColor(pos);
        const value = options[pos] || ' ';

        const cellStyle = getCellStyles(color);

        return {
            color: cellStyle.text,
            backgroundColor: cellStyle.bg,
            onClick: handleClick(pos),
            children: <Text text={value} />,
            sx: {
                borderRadius: SPACING.borderRadius.md,
                border: cellStyle.border,
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(24px) saturate(180%)',
                '&:hover': {
                    backgroundColor: cellStyle.hover,
                },
            },
        };
    };

    return (
        <CustomGrid cellProps={cellProps} size={size} rows={rows} cols={cols} />
    );
}
