

# **Product Requirements Document (PRD): Mosque Finder**

# 

# **1\. Executive Summary**

**Mosque Finder** is a responsive web application designed to serve the Muslim community and travelers. It allows users to instantly find nearby mosques and accurate prayer times based on their geographical location. The application focuses on a "zero-configuration" experience—no signup or login is required.

### **1.1 Key Objectives**

* **Utility:** Combine mosque discovery and prayer timings in a single view.  
* **Performance:** Fast loading using a modern React build tool (Vite).  
* **Cost-Efficiency:** Utilize 100% free, public APIs without requiring credit cards.  
* **Portfolio Value:** Demonstrate proficiency in React Hooks, API integration (REST), and State Management.

## ---

**2\. Features & Scope**

### **In Scope (MVP)**

1. **Browser Geolocation:** Auto-detect user position.  
2. **Mosque Discovery:** Fetch and list mosques within a specific radius (e.g., 2km \- 5km).  
3. **Interactive Map:** Display user location and mosque pins on a free OSM (OpenStreetMap) interface.  
4. **Prayer Times:** Display today's prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for the active location.  
5. **Manual Search:** Allow users to type a city name to change the "Active Location."

## ---

**3\. Epics and User Stories**

### **Epic 1: Location & Context**

**Goal:** Establish where the user is to provide relevant data.

| ID | User Story | Priority |
| :---- | :---- | :---- |
| **US-1.1** | As a **visitor**, I want the browser to ask for my location permission so the app works automatically. | High |
| **US-1.2** | As a **visitor**, if I deny location, I want a clear "Default Location" (e.g., London or Mecca) or a prompt to search manually. | Medium |
| **US-1.3** | As a **visitor**, I want to see a visual indicator (like a "Locating..." spinner) while the app calculates my coordinates. | High |

### **Epic 2: Mosque Discovery (Map & List)**

**Goal:** Visualize mosque data clearly.

| ID | User Story | Priority |
| :---- | :---- | :---- |
| **US-2.1** | As a **visitor**, I want to see a split view (or toggle view on mobile) showing a list of mosques and a map. | High |
| **US-2.2** | As a **visitor**, I want to see pin markers on the map for every mosque found. | High |
| **US-2.3** | As a **visitor**, clicking a mosque in the list should highlight its pin on the map (and vice versa). | Medium |
| **US-2.4** | As a **visitor**, I want each list item to show the Mosque Name and Distance (e.g., "0.8 km away"). | High |

### **Epic 3: Prayer Times (New)**

**Goal:** Provide accurate daily prayer schedules.

| ID | User Story | Priority |
| :---- | :---- | :---- |
| **US-3.1** | As a **visitor**, I want to see a "Prayer Times" card that shows the timings for the **current date** and **current location**. | High |
| **US-3.2** | As a **visitor**, I want the "Next Prayer" to be highlighted visually (e.g., bolded or different color) so I know what's coming up. | Medium |
| **US-3.3** | As a **visitor**, I want the prayer times to update automatically if I search for a new city. | High |

### 

### **Epic 4: Search**

**Goal:** Allow looking up remote locations.

| ID | User Story | Priority |
| :---- | :---- | :---- |
| **US-4.1** | As a **visitor**, I want a search bar to type a city name (e.g., "Paris"). | High |
| **US-4.2** | As a **visitor**, submitting the search should move the map to that city and refresh both the Mosque List and Prayer Times. | High |

## ---

**4\. UI/UX Design Guidelines**

* **Theme:** Light mode by default. Clean whites and soft grays.  
* **Accent Color:** A modern Islamic Green (e.g., Teal: \#0F766E or Emerald: \#10B981).  
* **Typography:** Sans-serif (Inter or Roboto) for a tech-forward look.  
* **Responsiveness:**  
  * *Mobile:* Tabs at the bottom or top to switch between "Map", "List", and "Times".  
  * *Desktop:* Three-column layout or Sidebar (List/Times) \+ Main Content (Map).

## ---

**5\. Technical Implementation (The "Free" Stack)**

### **5.1 Architecture Diagram**

The app follows a client-side architecture where the browser communicates directly with public APIs.

### **5.2 Core Technologies**

* **Build Tool:** [Vite](https://vitejs.dev/) (Much faster/modern than Create-React-App).  
* **Framework:** React (Functional Components \+ Hooks).  
* **Styling:** Tailwind CSS (Utility-first for rapid UI dev).  
* **Icons:** lucide-react or react-icons (Free SVG icons).

### **5.3 APIs & Data Sources (Critical)**

* **1\. Map Rendering:** react-leaflet (Library) \+ **OpenStreetMap** (Tiles).  
  * *Cost:* Free.  
  * *Usage:* Renders the visual map.  
* **2\. Mosque Data:** **Overpass API** (OpenStreetMap Query Language).  
  * *Endpoint:* https://overpass-api.de/api/interpreter  
  * *Cost:* Free (Rate limited, do not spam requests).  
  * *Logic:* Query for nodes where amenity=place\_of\_worship AND religion=muslim.  
* **3\. Prayer Times:** **Aladhan API**.  
  * *Endpoint:* http://api.aladhan.com/v1/timings  
  * *Cost:* Free.  
  * *Logic:* Pass latitude, longitude, and method (calculation method).  
* **4\. Geocoding (Search):** **Nominatim API**.  
  * *Endpoint:* https://nominatim.openstreetmap.org/search  
  * *Cost:* Free.  
  * *Requirement:* You must provide a generic "User-Agent" header in your request identifying your app.

### **5.4 Data Models**

**Mosque Interface (TypeScript/Shape):**

JavaScript

interface Mosque {  
  id: number;  
  name: string;  
  lat: number;  
  lon: number;  
  distance?: string; // Calculated on client  
}

**Prayer Times Interface:**

JavaScript

interface PrayerTimes {  
  Fajr: string;  
  Dhuhr: string;  
  Asr: string;  
  Maghrib: string;  
  Isha: string;  
}

## ---

**6\. Acceptance Criteria (Definition of Done)**

### **Search & Location**

* \[ \] App loads and immediately requests browser location.  
* \[ \] If "Block Location" is clicked, app falls back to a default lat/long (e.g., London).  
* \[ \] Searching "Dubai" moves the map center to Dubai coordinates.

### **Prayer Times**

* \[ \] The API successfully fetches times for the current map center.  
* \[ \] Times are displayed in a readable format (e.g., 12:45 PM or 12:45).  
* \[ \] The UI highlights the *next* prayer based on current system time.

### **Map & Mosques**

* \[ \] At least 10 nearby mosques (if available) are shown on the map.  
* \[ \] Clicking a list item centers the map on that mosque.  
* \[ \] The map supports zooming and panning without breaking the UI.

## ---

**7\. Deployment Strategy**

* **Host:** Netlify (Both offer "Drag and Drop" deployment for free).  
* **Environment:** No .env secrets needed since all APIs used are public/open.

