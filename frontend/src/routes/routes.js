import config from '@/config';

// Page components
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Product from '@/pages/Product';
import DetailCart from '@/pages/DetailCart';
import Admin from '@/pages/Admin';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: `${config.routes.product}/:id`, component: Product },
];

const privateRoutes = [
    { path: config.routes.profile, component: Profile },
    { path: config.routes.detailCart, component: DetailCart },
];

const adminRoutes = [{ path: config.routes.admin, component: Admin }];

export { publicRoutes, privateRoutes, adminRoutes };
