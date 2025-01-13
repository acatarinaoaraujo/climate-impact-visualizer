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
