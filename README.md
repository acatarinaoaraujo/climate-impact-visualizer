### Backend (ASP.NET) Setup:
Navigate to the Backend directory:

Access the project folder:
``bash
cd Backend
Restore Dependencies:

Ensure all required packages are installed:
``bash
dotnet restore
Build the Backend:

Compile the backend application:
``bash
dotnet build
Run the Backend:

Start the server:
``bash
dotnet run
The backend will be hosted at http://localhost:5085/weatherforecast/ by default (or a configured port).
Frontend (Angular) Setup:
Navigate to the ClientApp directory:

Enter the frontend project folder:
``bash
cd ClientApp
Install Dependencies:

Install all necessary Node.js packages:
``bash
npm install
Run the Frontend:

Start the Angular development server:
``bash
ng serve
The frontend will be available at http://localhost:4200.

Application Access:
Backend: The backend API can be accessed via http://localhost:5085/weatherforecast/.
Frontend: The frontend application can be accessed at http://localhost:4200.
Stopping Services:
Backend: Press Ctrl+C in the terminal where dotnet run is executing.
Frontend: Press Ctrl+C in the terminal where ng serve is running.


System Design:
Frontend (Angular)
Framework: Angular (TypeScript).
Charts & Visualizations: D3.js, Chart.js, or Highcharts.
State Management: NgRx (if needed for complex state).
Hosting: Netlify, AWS Amplify, or Azure Static Web Apps.
Backend (ASP.NET Core)
Framework: ASP.NET Core Web API.
Database:
Relational: PostgreSQL or MySQL (via Entity Framework).
NoSQL: MongoDB (via MongoDB C# driver, if needed).
Authentication: ASP.NET Identity or Azure AD (if needed).
API Integration: Fetch and cache data from World Bank and IMF APIs.
Cloud Hosting
Frontend Hosting: Azure Static Web Apps or AWS Amplify.
Backend Hosting: Azure App Service or AWS Elastic Beanstalk.
Database Hosting: Azure SQL Database or AWS RDS (PostgreSQL).
Data Pipeline
ETL Process: Schedule API data fetching using Hangfire or Azure Functions.
Data Storage: Store processed and aggregated data in the database.
CI/CD
Use GitHub Actions or Azure DevOps for automated builds and deployments.
This design leverages Angular’s UI strengths and ASP.NET’s robust backend for a scalable, maintainable dashboard.
