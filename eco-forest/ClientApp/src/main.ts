import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(withFetch())  // Enable fetch for HttpClient
  ]
})
  .catch((err) => console.error(err));
