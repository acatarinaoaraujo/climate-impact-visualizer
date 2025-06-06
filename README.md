## 🌍 Climate Data Explorer (WIP)

A full-stack application built with **ASP.NET** and **Angular** that visualizes key climate indicators from the IMF Climate Change Dashboard. Users can explore trends related to energy transition, forestation, climate disasters, emissions, and projected economic loss due to climate change.

---

## Purpose

To help users understand a country’s progress on climate-related metrics through visualizations and explainable insights. This tool enables:

- Interactive globe-based navigation of country-level data.
- Dynamic graphs reflecting renewable energy adoption, environmental impact, and economic risks.
- Integration with an LLM for natural language explanations of trends.

---

## 📌 Roadmap

- ✅ Initial Angular frontend with Three.JS Globe.gl view  
- ✅ ASP.NET backend fetching IMF data  
- ✅ LLM (Mistral 7b) integration for text-based insights  
- 🔜 PostgreSQL or MongoDB support for persistent storage
- ✅ Additional visualizations and UI polish  

---

## Data & Formulas

#### Key Formulas

**Rate of Change**  
`Rate of Change = ((Value at year N - Value at year N-1) / Value at year N-1) × 100`

### [Renewable Energy](https://climatedata.imf.org/pages/transition-to-low-carbon-economy#tr3) 

- **Unit**: Gigawatt-hours (GWh)

#### Energy Types

- **Fossil Fuels (Non-Renewable)** 
- **Solar**
- **Wind**  
- **Hydropower**  
- **Bioenergy**
---

### [Forest and Carbon](https://climatedata.imf.org/pages/mitigation#mi6)

#### Indicators

- Share of Forest Area (%)  
- Carbon Stocks in Forests (Million Tonnes)  
- Index of Forest Extent  
---

### [Climate Disasters](https://climatedata.imf.org/datasets/b13b69ee0dde43a99c811f592af4e821_0/about)

#### Indicators

- Drought  
- Flood  
- Landslide  
- Storm  
- Wildfire  
---

### [Emissions](https://climatedata.imf.org/datasets/7ba962035bb548bb9893add2b5491896/explore  )

#### Indicators

- Production  
- Gross Imports  
- Gross Exports  
- Final Domestic Demand  
---

### [Income Loss](https://climatedata.imf.org/datasets/b0fe73a0430b47a6bb2723e5ac3231ff/explore)

#### Indicators

- Acute Climate Damages  
- Business Confidence Losses  
- Chronic Climate Damages  
- Mitigation Policy Costs  
- Total GDP Risk  
---

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
Frontend (Angular) <--> Backend (ASP.NET Core API) <--> [Planned] Database (PostgreSQL) / LLM 

### Frontend
Developed in Angular 17.
Interactive globe-based data visualizations using ThreeJS Globe.gl.
Sidebar filters for country, indicator, year, and data type.
Modal and chart components for detail views.

### Backend
ASP.NET Core REST API.
Fetches and processes [IMF Climate](https://climatedata.imf.org/) data.
Rate of change calculation and share logic handled server-side.
Planned feature: integrate PostgreSQL for historical data caching.

### LLM Integration
Integrated an open-source LLM (Mistral 7B) using OpenRouter to provide:
Summaries for selected country indicators.
Explainability and contextual information in natural language.

## 📄 License
This project is for educational and demonstration purposes and is not affiliated with the IMF. 

