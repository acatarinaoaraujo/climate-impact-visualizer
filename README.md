# 🌍 Climate Data Explorer (WIP)

A full-stack application built with **ASP.NET** and **Angular** that visualizes key climate indicators from the IMF Climate Change Dashboard. Users can explore trends related to energy transition, forestation, climate disasters, emissions, and projected economic loss due to climate change.

---

## Purpose

To help users—researchers, policymakers, and the public—understand a country’s progress on climate-related metrics through visualizations and explainable insights. This tool enables:

- Interactive globe-based navigation of country-level data.
- Dynamic graphs reflecting renewable energy adoption, environmental impact, and economic risks.
- Integration with an LLM (coming soon) for natural language explanations of trends.

---

## 📊 Data & Formulas

### 🌞 Renewable Energy

- **Years**: 2020 - 2023  
- **Unit**: Gigawatt-hours (GWh)

#### Energy Types

- 🔴 **Fossil Fuels (Non-Renewable)** — Orange → Red  
- ☀️ **Solar** — Yellow  
- 🌬️ **Wind** — Grey  
- 🌊 **Hydropower** — Blue  
- 🌱 **Bioenergy** — Green  

#### Key Formulas

**Rate of Change**  
\[
\text{Rate of Change} = \left( \frac{\text{Value}_N - \text{Value}_{N-1}}{\text{Value}_{N-1}} \right) \times 100
\]

**Renewable Ratio**  
\[
\text{Ratio} = \frac{X}{\sum \text{Energy Types}}
\]

#### Visualizations

- Time series of energy type for selected country  
- Pie chart of energy mix by year and country  

---

### 🌲 Forest and Carbon

- **Years**: 1992 - 2022  

#### Indicators

- Share of Forest Area (%)  
- Carbon Stocks in Forests (Million Tonnes)  
- Index of Forest Extent  

> 📝 *Example Insight:*  
> “In 1992, Brazil had 69.55% of its land covered by forest.”

#### Visualizations

- Time series of forest metrics over selected years  

---

### 🌪️ Climate Disasters

- **Years**: 1980 - 2024  

#### Indicators

- Drought  
- Flood  
- Landslide  
- Storm  
- Wildfire  

#### Visualizations

- Time series of disasters over years  
- Bar plot of disaster counts by type for a selected year  

---

### 🏭 Emissions

- **Years**: 1995 - 2021  

#### Indicators

- Production  
- Gross Imports  
- Gross Exports  
- Final Domestic Demand  

#### Visualizations

- Time series of emission metrics for selected countries  

---

### 💸 Income Loss

- **Years**: 2023 - 2040  

#### Indicators

- Acute Climate Damages  
- Business Confidence Losses  
- Chronic Climate Damages  
- Mitigation Policy Costs  
- Total GDP Risk  

#### Visualizations

- Forecasted time series of economic losses due to climate change  

---

## 📌 Roadmap

- ✅ Initial Angular frontend with globe view  
- ✅ ASP.NET backend fetching IMF data  
- 🔜 LLM integration for text-based insights  
- 🔜 PostgreSQL or MongoDB support for persistent storage  
- 🔜 Dockerized setup  
- 🔜 Additional visualizations and UI polish  


## How to Use

### Prerequisites

- [.NET 8+ SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- Angular CLI: `npm install -g @angular/cli`

### Run the App Locally

#### 1. Start the backend
```bash
cd Backend
dotnet run
```

#### 2. Start the frontend
```bash
cd ClientApp
ng serve
```

## Architecture Overview
Frontend (Angular) <--> Backend (ASP.NET Core API) <--> [Planned] Database (PostgreSQL) / LLM / Docker

### Frontend
Developed in Angular 17.
Interactive globe-based data visualizations using WebGL.
Sidebar filters for country, indicator, year, and data type.
Modal and chart components for detail views.

### Backend
ASP.NET Core REST API.
Fetches and processes IMF Climate data.
Rate of change calculation and share logic handled server-side.
Planned feature: integrate PostgreSQL for historical data caching.

### LLM Integration (Planned)
Integrate an open-source LLM (e.g., LLama.cpp or similar) to provide:
Summaries for selected country indicators.
Explainability and contextual information in natural language.

### Docker (Coming Soon)
Dockerfile for unified backend/frontend containerization.
Compose setup for local development and deployment.


## 🔌 Integrations
IMF Climate Data Portal
[Open-source LLM integration planned]
Docker (future setup)

## 📄 License
This project is for educational and demonstration purposes and is not affiliated with the IMF. 

