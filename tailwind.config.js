/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            spacing: {
                header: '3.75rem',
                sidebar: '22.25rem',
                sidebarSmall: '4rem',
            },
            colors: {
                primary: colors.rose[500],
                subtext: colors.neutral[400],
            },
            boxShadow: {
                header: '0px 1px 1px rgb(0 0 0 / 12%)',
                nProgress: `0 0 10px ${colors.rose[500]}, 0 0 5px ${colors.rose[500]}`,
            },
            maxWidth: {
                sidebar: '22.25rem',
                sidebarSmall: '5rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        plugin(function ({ addUtilities, addComponents, theme }) {
            addComponents({
                '.app-container': {
                    width: '100%',
                    margin: '0 auto',
                    'max-width': '1472px',
                    padding: '0 1rem',
                },
                '.icon-20': {
                    width: '1.25rem',
                    height: '1.25rem',
                },
                '.icon-24': {
                    width: '1.5rem',
                    height: '1.5rem',
                },
                '.icon-16': {
                    width: '1rem',
                    height: '1rem',
                },
                '.form-input': {
                    'border-radius': '0.25rem',
                    'border-width': '2px',
                    'border-color': theme('colors.slate.300'),
                    'padding-top': '0.5rem',
                    'padding-bottom': '0.5rem',
                    'padding-left': '0.75rem',
                    'padding-right': '0.75rem',
                    outline: 'none',
                    width: '100%',

                    '&.error': {
                        'border-color': theme('colors.red.500'),

                        '&:focus': {
                            'border-color': theme('colors.red.500'),
                        },
                    },

                    '&:placeholder-shown': {
                        color: theme('colors.slate.400'),
                    },

                    '&:focus': {
                        'border-color': theme('colors.blue.500'),
                    },
                },
                '.form-label': {
                    'font-weight': '600',
                },
                '.input-group': {
                    display: 'flex',
                    'flex-direction': 'column',
                    gap: '0.5rem',
                },
                '.form-error': {
                    'font-size': '0.875rem',
                    color: theme('colors.red.500'),
                    'font-weight': '500',
                },
                '.link': {
                    color: theme('colors.rose.500'),
                    fontWeight: '500',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        'text-decoration': 'underline',
                    },
                },
            });
        }),
    ],
};
