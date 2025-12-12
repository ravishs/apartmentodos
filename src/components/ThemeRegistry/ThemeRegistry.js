'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

const theme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        // Use the Poppins variable defined by next/font in the global layout
        fontFamily: "var(--font-poppins), Arial, Helvetica, sans-serif",
    },
});

export default function ThemeRegistry({ children }) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
