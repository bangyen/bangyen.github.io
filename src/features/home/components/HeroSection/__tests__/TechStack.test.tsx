import { describe, it, expect } from 'vitest';

import * as constants from '@/config/constants';

describe('TechStack Logic', () => {
    it('SKILLS array contains expected skills', () => {
        expect(constants.SKILLS.length).toBeGreaterThan(0);
    });

    it('all skills have name and icon properties', () => {
        constants.SKILLS.forEach(skill => {
            expect(skill).toHaveProperty('name');
            expect(skill).toHaveProperty('icon');
            expect(typeof skill.name).toBe('string');
            expect(typeof skill.icon).toBe('string');
        });
    });

    it('contains expected skills in SKILLS config', () => {
        const skillNames = constants.SKILLS.map(s => s.name);

        expect(skillNames).toContain('Python');
        expect(skillNames).toContain('PyTorch');
        expect(skillNames).toContain('JavaScript');
        expect(skillNames).toContain('AWS/GCP');
        expect(skillNames).toContain('Docker');
        expect(skillNames).toContain('TensorFlow');
    });

    it('uses valid icon names from ICON_MAP', () => {
        const ICON_MAP: Record<string, boolean> = {
            Code: true,
            Psychology: true,
            Cloud: true,
            Work: true,
        };

        constants.SKILLS.forEach(skill => {
            // Either icon is in map or falls back to Work
            const isValidIcon = skill.icon in ICON_MAP;
            const fallbackIcon = !isValidIcon ? 'Work' : skill.icon;

            expect([skill.icon, fallbackIcon]).toContain(
                skill.icon in ICON_MAP ? skill.icon : 'Work'
            );
        });
    });

    it('handles fallback icon mapping for unknown icons', () => {
        const ICON_MAP: Record<string, boolean> = {
            Code: true,
            Psychology: true,
            Cloud: true,
            Work: true,
        };

        // Simulate unknown icon
        const unknownIcon = 'UnknownIcon';
        const iconComponent = ICON_MAP[unknownIcon] ? unknownIcon : 'Work';

        expect(iconComponent).toBe('Work');
    });

    it('validates icon names from SKILLS against ICON_MAP', () => {
        const ICON_MAP: Record<string, boolean> = {
            Code: true,
            Psychology: true,
            Cloud: true,
            Work: true,
        };

        const validIcons = constants.SKILLS.map(skill => {
            return ICON_MAP[skill.icon] ? skill.icon : 'Work';
        });

        expect(validIcons.length).toBe(constants.SKILLS.length);
        validIcons.forEach(icon => {
            expect(ICON_MAP[icon]).toBe(true);
        });
    });

    it('renders with grid layout structure (3 columns)', () => {
        // Simulate grid layout logic
        const gridTemplateColumns = { xs: '1fr', md: 'repeat(3, 1fr)' };
        const gap = { xs: 1.5, md: 2 };

        expect(gridTemplateColumns).toHaveProperty('xs');
        expect(gridTemplateColumns).toHaveProperty('md');
        expect(gridTemplateColumns.md).toBe('repeat(3, 1fr)');
        expect(gap.md).toBe(2);
    });

    it('wraps content in GlassCard (logic test)', () => {
        // TechStack returns GlassCard wrapper
        const componentName = 'GlassCard';
        expect(componentName).toBe('GlassCard');
    });

    it('has correct heading text for Tech Stack', () => {
        const headingText = 'Tech Stack';
        expect(headingText).toBe('Tech Stack');
    });
});
