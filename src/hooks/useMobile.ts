import { useMediaQuery } from '../components/mui';

export function useMobile(size: string): boolean {
    return useMediaQuery((theme: unknown) => {
        const muiTheme = theme as {
            breakpoints: { down: (size: string) => string };
        };
        return muiTheme.breakpoints.down(size);
    });
}
