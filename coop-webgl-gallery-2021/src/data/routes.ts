export type Route = {
  readonly path: string;
  readonly title: string;
};

export interface Routes {
  readonly Home: Route;
  readonly About: Route;
  readonly ArtworkAlastair: Route;
}

const routes: Routes = {
  Home: {
    path: '/',
    title: 'Home'
  },
  About: {
    path: '/about/',
    title: 'About'
  },
  ArtworkAlastair: {
    path: '/artwork-alastair/',
    title: 'Alastair'
  }
};

export default routes;
