# project-images-for-website/

Drop all project photos in this folder and push to GitHub.  
The website picks them up automatically via jsDelivr CDN.

---

## Required filenames (case-sensitive, must match exactly)

| Filename | Used by |
|---|---|
| `desktop version banner.webp` | Mini Farmhouse — hero & carousel |
| `mobile version banner.webp` | Mini Farmhouse — alternate exterior |
| `front elevation.webp` | Mini Farmhouse + Shanti Villa — elevation |
| `Main elevation.webp` | Mini Farmhouse + Shanti Villa — main elevation |
| `side elevation.webp` | Mini Farmhouse + Shanti Villa — side elevation |
| `living room lobby.webp` | Mini Farmhouse + Urban Apartment — living lobby |
| `living area.webp` | Mini Farmhouse + Urban Apartment — living area |
| `Kitchen Area.webp` | Mini Farmhouse + Urban Apartment + Shanti Villa — kitchen |
| `Kitchen.webp` | Mini Farmhouse + Urban Apartment — kitchen detail |
| `kitchen and common washroom.webp` | Mini Farmhouse — kitchen & utility |
| `Master bedroom design.webp` | Mini Farmhouse + Urban Apartment + Shanti Villa — master bedroom |
| `Master washroom.webp` | Mini Farmhouse + Urban Apartment + Shanti Villa — washroom |
| `foyer area.webp` | Mini Farmhouse + DLF Crest — foyer |
| `lobby area.webp` | Mini Farmhouse — lobby |
| `Daughter's Bedroom.webp` | Mini Farmhouse + Shanti Villa — bedroom |
| `Main lobby area design.webp` | Restaurant Udaipur — main lobby |
| `dance floor area.webp` | Restaurant Udaipur + Hashtag — dance floor |
| `bar area.webp` | Restaurant Udaipur + Hashtag — bar |
| `main dining area.webp` | Restaurant Udaipur + Hashtag — dining |
| `dining area.webp` | Restaurant Udaipur + Hashtag — dining area |
| `Live kitchen Counter.webp` | Restaurant Udaipur + Hashtag — live kitchen |
| `seating area design - restaurant.webp` | Restaurant Udaipur + Hashtag — seating |
| `handwash - restaurant.webp` | Restaurant Udaipur + Hashtag — washroom |
| `washroom area.webp` | Restaurant Udaipur + Hashtag — washroom |
| `Studio Workspace.webp` | Studio Workspace — main floor |
| `Workstation Area.webp` | Studio Workspace — workstation zone |
| `Conference Room.webp` | Studio Workspace — conference room |
| `Cafeteria Area.webp` | Studio Workspace — cafeteria |
| `Entrance area.webp` | Studio Workspace — entrance |

**Total: 29 images**

---

## Project → image mapping

### Mini Farmhouse (Delhi · Residential · 4,800 sqft)
Cover: `desktop version banner.webp`  
Gallery (in order):
1. `desktop version banner.webp`
2. `Main elevation.webp`
3. `side elevation.webp`
4. `front elevation.webp`
5. `living room lobby.webp`
6. `living area.webp`
7. `foyer area.webp`
8. `lobby area.webp`
9. `Kitchen Area.webp`
10. `Kitchen.webp`
11. `kitchen and common washroom.webp`
12. `Master bedroom design.webp`
13. `Master washroom.webp`
14. `Daughter's Bedroom.webp`
15. `mobile version banner.webp`

### Restaurant (Udaipur · Hospitality · 2,200 sqft)
Cover: `Main lobby area design.webp`  
Gallery: `Main lobby area design.webp`, `dance floor area.webp`, `bar area.webp`, `main dining area.webp`, `dining area.webp`, `Live kitchen Counter.webp`, `seating area design - restaurant.webp`, `handwash - restaurant.webp`, `washroom area.webp`

### Studio Workspace (Gurgaon · Commercial · 3,200 sqft)
Cover: `Studio Workspace.webp`  
Gallery: `Studio Workspace.webp`, `Workstation Area.webp`, `Conference Room.webp`, `Cafeteria Area.webp`, `Entrance area.webp`

### Urban Apartment (Dehradun · Residential · 1,800 sqft)
Cover: `living room lobby.webp`  
Gallery: `living room lobby.webp`, `living area.webp`, `Master bedroom design.webp`, `Master washroom.webp`, `Kitchen.webp`, `Kitchen Area.webp`

### Shanti Villa (Delhi · Residential · 8,000 sqft)
Cover: `Master bedroom design.webp`  
Gallery: `Master bedroom design.webp`, `front elevation.webp`, `Main elevation.webp`, `side elevation.webp`, `foyer area.webp`, `Daughter's Bedroom.webp`, `Master washroom.webp`, `Kitchen Area.webp`

### Hashtag Restaurant (Noida · Hospitality · 1,600 sqft)
Cover: `bar area.webp`  
Gallery: `bar area.webp`, `dance floor area.webp`, `main dining area.webp`, `dining area.webp`, `Live kitchen Counter.webp`, `handwash - restaurant.webp`, `seating area design - restaurant.webp`, `washroom area.webp`

---

## How to add a new project

1. Upload images to this folder (`project-images-for-website/`)
2. Open `project.html` — find the `PROJECTS` array in the `<script>` block
3. Copy any existing project object and update:
   - `id` — URL slug (e.g. `"my-new-villa"` → opens at `/project/my-new-villa`)
   - `name`, `location`, `area`, `typology`, `description`, `editorial`
   - `cover` — filename of the hero image
   - `images` — ordered array of all image filenames
4. Add captions to the `CAPTIONS` object at the top of the script
5. Do the same in `projects.html` to show the project in the grid/index
6. Push to GitHub — images load automatically via CDN

---

## Image URL format

All images are served via jsDelivr CDN (not raw GitHub):

```
https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/[filename]
```

Spaces in filenames are automatically encoded. No need to rename files.

---

## Files in this repo

| File | Purpose |
|---|---|
| `index.html` | Main website (home, about, services, etc.) |
| `projects.html` | Projects index + detail sub-views |
| `project.html` | Immersive single-project landing page |
| `vercel.json` | URL routing configuration |
| `project-images-for-website/` | All project images (this folder) |
