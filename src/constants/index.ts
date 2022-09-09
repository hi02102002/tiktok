export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    LOGIN: '/login',
    REGISTER: '/register',
    WISHLIST: '/wish-list',
    ADMIN: '/admin',
    FORGET_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    UPLOAD: '/upload',
};
export const ERROR_TOKEN = 'RefreshAccessTokenError';
export const NAVIGATION_HEADER = [
    {
        name: 'Home',
        link: ROUTES.HOME,
    },
    {
        name: 'Products',
        link: ROUTES.PRODUCTS,
    },
    {
        name: 'Admin',
        link: ROUTES.ADMIN,
    },
];
