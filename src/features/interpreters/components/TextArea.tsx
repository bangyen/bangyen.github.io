import React, { useContext } from 'react';
import { TextField } from '../../../components/mui';
import { EditorContext } from '../EditorContext';
import { COLORS, SPACING } from '../../../config/theme';

export interface TextAreaProps {
    value?: string;
    readOnly?: boolean;
    infoLabel?: string;
    fillValue?: string;
    placeholder?: string;
    handleChange?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

export function TextArea({
    value,
    readOnly = false,
    infoLabel = 'Program code',
    fillValue = 'Hello, World!',
    placeholder,
    handleChange,
}: TextAreaProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) {
        throw new Error('TextArea must be used within EditorContext.Provider');
    }

    const { height } = editorContext;
    const rows = Math.floor(height / 32);

    const isControlled = value !== undefined && value !== null;
    const textFieldProps = isControlled
        ? {
              value: value || '',
              onChange: handleChange,
          }
        : {
              defaultValue: fillValue,
              onChange: handleChange,
          };

    return (
        <TextField
            variant="outlined"
            label={infoLabel}
            placeholder={placeholder}
            slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { readOnly },
            }}
            fullWidth
            multiline
            rows={rows}
            {...textFieldProps}
            sx={{
                '& .MuiInputBase-root': {
                    alignItems: 'flex-start',
                    backgroundColor: COLORS.surface.glass,
                    backdropFilter: 'blur(24px) saturate(180%)',
                    borderRadius: SPACING.borderRadius.md,
                    border: `1px solid ${COLORS.border.subtle}`,
                },
                '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    color: 'text.primary',
                    '&::placeholder': {
                        opacity: 0.6,
                        color: 'text.secondary',
                    },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.border.subtle,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.border.subtle,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                },
                '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.light',
                },
            }}
        />
    );
}
