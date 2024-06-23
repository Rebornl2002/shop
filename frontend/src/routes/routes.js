import config from '@/config';

//Layout
import { HeaderOnly } from '@/layouts';

//Page
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Product from '@/pages/Product';
import Upload from '@/pages/Upload';
import Search from '@/pages/Search';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.product + '/:id', component: Product },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
