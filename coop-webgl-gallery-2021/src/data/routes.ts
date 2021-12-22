export type Route = {
  readonly path: string;
  readonly title: string;
};

export interface Routes {
  readonly Home: Route;
  readonly About: Route;
  readonly ArtworkAlastair: Route;
  readonly ArtworkAlex: Route;
  readonly ArtworkAngela: Route;
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
  },
  ArtworkAlex: {
    path: '/artwork-alex/',
    title: 'Alex'
  },
  ArtworkAngela: {
    path: './artwork-angela/',
    title: 'Angela'
  }
};

export default routes;
