import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnotatorDashboardComponent } from './components/annotator-dashboard/annotator-dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MiscComponent } from './components/misc/misc.component';
import { PrimaryComponent } from './components/primary/primary.component';
import { RouterParamDemoComponent } from './components/router-param-demo/router-param-demo.component';
import { ProgrammaticallyRoutedComponent } from './components/programmatically-routed/programmatically-routed.component';


const routes: Routes = [
  {
    path : 'crisis-list',
    component : MiscComponent,
    outlet: 'specialRouterOutlet'
  },
  {
    path : 'crisis-list',
    component : PrimaryComponent,
    // outlet: 'primary'
  },
  { 
    path: 'dashboard', 
    component: AnnotatorDashboardComponent 
  },
  { 
    path: 'first/:nameParam', 
    component: RouterParamDemoComponent 
  },
  { 
    path: 'second/:nameParam', 
    component: RouterParamDemoComponent 
  },
  {
    path:'programmaticRoute/:id',
    component : ProgrammaticallyRoutedComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
    // component : MiscComponent,
    // outlet: 'specialRouterOutlet'
  },
  {
    path: '**',
    component :PageNotFoundComponent,
  }

  /* {
      path: 'foo',
      loadChildren: () =>
      import('./components/foo/foo.module').then(
        m => m.FooModule
      ),
      outlet: 'namedOutlet'
      } */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
