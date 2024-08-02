import config from '@/config';

//Page
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Product from '@/pages/Product';
import DetailCart from '@/pages/DetailCart';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.product + '/:id', component: Product },
];

const privateRoutes = [
    { path: config.routes.profile, component: Profile },
    { path: config.routes.detailCart, component: DetailCart },
];

export { publicRoutes, privateRoutes };
