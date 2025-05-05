# Backend Dockerfile example
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy the csproj file and restore dependencies
COPY ./Backend/*.csproj ./Backend/
RUN dotnet restore "./Backend/Backend.csproj"

# Copy the rest of the backend code
COPY ./Backend ./Backend/

WORKDIR /src/Backend

# Build the project
RUN dotnet build "Backend.csproj" -c Release -o /app/build

# Publish the project to the app folder
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

# Set the entry point for the application
ENTRYPOINT ["dotnet", "/app/publish/Backend.dll"]
