import config from '@/config';

//Layout
import { HeaderOnly } from '@/layouts';

//Page
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Product from '@/pages/Product';
import Upload from '@/pages/Upload';
import DetailCart from '@/pages/DetailCart';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.product + '/:id', component: Product },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
];

const privateRoutes = [
    { path: config.routes.profile, component: Profile },
    { path: config.routes.detailCart, component: DetailCart },
];

export { publicRoutes, privateRoutes };
