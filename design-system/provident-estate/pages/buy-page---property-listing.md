# Buy Page - Property Listing Design System

> **PROJECT:** Provident Estate
> **Generated:** 2026-08-06 10:45:00
> **Page Type:** Property Listing (Buy Page)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Design Tokens

### Color Palette
| Element               | Hex       | RGB           | HSL               | Tailwind Class       |
|-----------------------|-----------|---------------|-------------------|----------------------|
| Primary Background    | #FFFFFF   | 255,255,255   | 0°,0%,100%        | bg-white             |
| Secondary Background  | #F8F9FA   | 248,249,250   | 210°,16%,98%      | bg-gray-50           |
| Card Background       | #FFFFFF   | 255,255,255   | 0°,0%,100%        | bg-white             |
| Text Primary          | #1A1A1A   | 26,26,26      | 0°,0%,10%         | text-gray-900        |
| Text Secondary        | #6B7280   | 107,114,128   | 220°,8%,46%       | text-gray-500        |
| Text Tertiary         | #9CA3AF   | 156,163,175   | 216°,12%,65%      | text-gray-400        |
| Border Color          | #E5E7EB   | 229,231,235   | 220°,14%,91%      | border-gray-200      |
| Accent Color          | #0F766E   | 15,118,110    | 174°,77%,26%      | text-teal-700        |
| Price Color           | #111827   | 17,24,39      | 220°,40%,11%      | text-gray-900        |
| Star Rating           | #F59E0B   | 245,158,11    | 43°,92%,50%       | text-amber-500       |
| Shadow                | #000000   | 0,0,0         | 0°,0%,0%          | --                   |
| Shadow Opacity        | 0.08      | --            | --                | shadow-sm            |

### Typography
| Element               | Font Family       | Size (px/rem) | Weight | Line Height | Tailwind Class       |
|-----------------------|-------------------|---------------|--------|-------------|----------------------|
| Heading (H1)          | Cinzel            | 32px/2rem     | 600    | 1.2         | text-2xl font-semibold |
| Heading (H2)          | Cinzel            | 24px/1.5rem   | 500    | 1.3         | text-xl font-medium   |
| Heading (H3)          | Cinzel            | 20px/1.25rem  | 500    | 1.4         | text-lg font-medium   |
| Body Text             | Josefin Sans      | 16px/1rem     | 400    | 1.5         | text-base             |
| Meta Text             | Josefin Sans      | 14px/0.875rem | 300    | 1.4         | text-sm               |
| Price Text            | Cinzel            | 20px/1.25rem  | 600    | 1.3         | text-lg font-semibold |
| Button Text           | Josefin Sans      | 16px/1rem     | 500    | 1.5         | text-base font-medium |

### Spacing System
| Element               | Size (px/rem) | Tailwind Class       |
|-----------------------|---------------|----------------------|
| Section Padding (Y)   | 64px/4rem     | py-16                |
| Section Padding (X)   | 24px/1.5rem   | px-6                 |
| Card Padding          | 24px/1.5rem   | p-6                  |
| Card Gap              | 24px/1.5rem   | gap-6                |
| Grid Gap              | 24px/1.5rem   | gap-6                |
| Button Padding (Y)    | 12px/0.75rem  | py-3                 |
| Button Padding (X)    | 24px/1.5rem   | px-6                 |
| Border Radius         | 8px/0.5rem    | rounded-lg           |

### Shadows
| Element               | Tailwind Class       | Custom Value                     |
|-----------------------|----------------------|----------------------------------|
| Card Shadow           | shadow-sm            | 0 1px 2px 0 rgba(0,0,0,0.08)      |
| Hover Shadow          | shadow-md            | 0 4px 6px -1px rgba(0,0,0,0.1)   |

### Breakpoints
| Breakpoint            | Min-Width (px) | Tailwind Class       |
|-----------------------|----------------|----------------------|
| Mobile                | 375            | --                   |
| Tablet                | 768            | md:                  |
| Desktop               | 1024           | lg:                  |
| Large Desktop         | 1280           | xl:                  |
| Extra Large           | 1536           | 2xl:                 |

---

## Component Specifications

### Property Card
```html
<div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
  <!-- Image Container -->
  <div class="relative">
    <img src="property-image.webp" alt="Property image" class="w-full h-48 object-cover" loading="lazy">
    <div class="absolute top-3 left-3 flex gap-2">
      <span class="bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">Featured</span>
      <span class="bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">Verified</span>
    </div>
    <button class="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
    </button>
  </div>
  
  <!-- Content -->
  <div class="p-6">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-medium text-gray-900">Modern 2BR Apartment</h3>
      <span class="text-lg font-semibold text-gray-900">AED 2,500,000</span>
    </div>
    
    <p class="text-sm text-gray-500 mb-4">Downtown Dubai • Apartment</p>
    
    <div class="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-200 pt-4">
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <span>4.8 (12)</span>
      </div>
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span>Downtown</span>
      </div>
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span>2</span>
      </div>
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"></path>
        </svg>
        <span>1,250 sqft</span>
      </div>
    </div>
  </div>
</div>
```

### Filter Bar
```html
<div class="bg-white border-b border-gray-200 sticky top-0 z-10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <span>3,151 listings</span>
        <button class="p-1 hover:bg-gray-100 rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
        </button>
      </div>
      
      <div class="flex items-center gap-4 flex-wrap justify-center">
        <select class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          <option>Property Type</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Townhouse</option>
        </select>
        
        <select class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          <option>Price</option>
          <option>Low to High</option>
          <option>High to Low</option>
        </select>
        
        <select class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          <option>Beds</option>
          <option>Studio</option>
          <option>1+</option>
          <option>2+</option>
          <option>3+</option>
        </select>
        
        <select class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          <option>Size</option>
          <option>500+ sqft</option>
          <option>1000+ sqft</option>
          <option>2000+ sqft</option>
        </select>
        
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <span>Filters</span>
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <button class="p-2 hover:bg-gray-100 rounded">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
        </button>
        <button class="p-2 hover:bg-gray-100 rounded">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
```

### Sort & View Options
```html
<div class="flex items-center justify-between py-4">
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600">Sort:</span>
    <select class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
      <option>Most Recent</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
      <option>Size: Small to Large</option>
    </select>
  </div>
  
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600">Map</span>
    <button class="p-2 bg-gray-100 rounded hover:bg-gray-200">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
      </svg>
    </button>
    <button class="p-2 bg-teal-700 text-white rounded hover:bg-teal-800">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
      </svg>
    </button>
  </div>
</div>
```

### Property Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Property Card Component (repeated) -->
  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <!-- Card Content -->
  </div>
  <!-- More cards -->
</div>
```

### Pagination
```html
<div class="flex items-center justify-between py-8">
  <div class="flex items-center gap-2 text-sm text-gray-600">
    <span>Showing</span>
    <select class="border border-gray-300 rounded px-2 py-1">
      <option>12</option>
      <option>24</option>
      <option>48</option>
    </select>
    <span>of 3,151</span>
  </div>
  
  <div class="flex items-center gap-2">
    <button class="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">Previous</button>
    <button class="px-3 py-1 rounded border bg-teal-700 text-white">1</button>
    <button class="px-3 py-1 rounded border hover:bg-gray-50">2</button>
    <button class="px-3 py-1 rounded border hover:bg-gray-50">3</button>
    <span class="px-3 py-1">...</span>
    <button class="px-3 py-1 rounded border hover:bg-gray-50">Next</button>
  </div>
</div>
```

---

## Responsive Behavior

### Mobile (375px - 767px)
- **Grid:** 1 column
- **Card Image Height:** 200px (h-48)
- **Filter Bar:** Stacked vertically, full-width dropdowns
- **Typography:** Base font size 14px (text-sm)
- **Spacing:** Reduced padding (py-2 px-4)

### Tablet (768px - 1023px)
- **Grid:** 2 columns (md:grid-cols-2)
- **Card Image Height:** 240px (h-60)
- **Filter Bar:** Horizontal layout with stacked filters
- **Typography:** Base font size 16px (text-base)

### Desktop (1024px+)
- **Grid:** 3 columns (lg:grid-cols-3)
- **Card Image Height:** 288px (h-72)
- **Filter Bar:** Horizontal layout, full filter visibility
- **Max Width:** 1200px (max-w-7xl)

---

## Interaction States

### Hover States
| Element               | State Change                                                                 |
|-----------------------|------------------------------------------------------------------------------|
| Property Card         | Shadow increases (shadow-md), subtle scale (transform scale-102)            |
| Buttons               | Background color change (hover:bg-gray-100), cursor-pointer                  |
| Links                 | Text color change (hover:text-teal-600), underline                          |
| Filter Dropdowns      | Border color change (focus:ring-2 focus:ring-teal-500 focus:border-teal-500) |

### Focus States
- All interactive elements: 2px solid outline with teal-500 (focus:ring-2 focus:ring-teal-500)

### Active States
- Buttons: Slightly darker background (active:bg-gray-200)

---

## Anti-Patterns (Avoid)

1. **Unoptimized Images**
   - ❌ Full-size images without compression
   - ❌ Missing `loading="lazy"` attribute
   - ❌ No WebP format
   - ✅ Use optimized WebP images with `loading="lazy"`

2. **Inconsistent Spacing**
   - ❌ Arbitrary padding/margin values
   - ❌ Misaligned elements
   - ✅ Use the defined spacing system (4px increments)

3. **Poor Typography Hierarchy**
   - ❌ Multiple font sizes for the same element
   - ❌ Inconsistent line heights
   - ✅ Follow the typography table strictly

4. **Missing Accessibility**
   - ❌ Low contrast text
   - ❌ Missing alt text for images
   - ❌ No focus states
   - ✅ Ensure 4.5:1 contrast ratio, add alt text, implement focus states

5. **Non-Responsive Layouts**
   - ❌ Fixed widths
   - ❌ Horizontal scrolling on mobile
   - ✅ Use responsive grid and flexible containers

6. **Overuse of Animations**
   - ❌ Multiple bounce animations
   - ❌ Slow transitions (>300ms)
   - ✅ Limit to subtle hover effects (200-250ms)

7. **Inconsistent Card Design**
   - ❌ Different shadow intensities
   - ❌ Varying border radii
   - ✅ Use consistent shadow-sm and rounded-lg

8. **Missing Visual Feedback**
   - ❌ No hover/focus states
   - ❌ No loading indicators
   - ✅ Implement hover/focus states and loading states

---

## Performance Optimizations

1. **Image Optimization**
   - Use WebP format with appropriate compression
   - Implement `loading="lazy"` for all images
   - Set explicit width/height attributes

2. **Code Splitting**
   - Load non-critical CSS asynchronously
   - Use dynamic imports for interactive components

3. **Font Loading**
   - Preload critical fonts (Cinzel, Josefin Sans)
   - Use `font-display: swap` to prevent FOIT

4. **Critical CSS**
   - Inline critical CSS for above-the-fold content
   - Load non-critical CSS asynchronously

5. **JavaScript**
   - Defer non-critical JavaScript
   - Use Intersection Observer for lazy loading components

---

## Implementation Notes

1. **Tailwind Configuration**
   Extend Tailwind config to include custom colors and fonts:
   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           teal: {
             700: '#0F766E',
           },
         },
         fontFamily: {
           cinzel: ['Cinzel', 'serif'],
           josefin: ['Josefin Sans', 'sans-serif'],
         },
       },
     },
   }
   ```

2. **CSS Custom Properties**
   Define custom properties for consistent theming:
   ```css
   :root {
     --color-primary: 15 118 110;
     --color-text: 26 26 26;
     --color-border: 229 231 235;
     --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
     --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
   }
   ```

3. **Responsive Breakpoints**
   Use Tailwind's responsive prefixes:
   - `sm:` (640px)
   - `md:` (768px)
   - `lg:` (1024px)
   - `xl:` (1280px)
   - `2xl:` (1536px)

4. **Dark Mode Support**
   Implement dark mode variants:
   ```html
   <div class="bg-white dark:bg-gray-800">
     <!-- Content -->
   </div>
   ```
