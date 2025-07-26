# Dark Mode Feature Implementation

## Overview
The Zuum platform now includes a comprehensive dark mode feature that provides users with a comfortable viewing experience in low-light conditions. The implementation uses Tailwind CSS's dark mode utilities and provides seamless switching between light and dark themes.

## Features

### 🌙 Dark Mode Toggle
- **Quick Toggle**: A dark mode toggle button is available in the main navigation bar
- **Settings Panel**: Detailed dark mode settings available in the Settings page
- **System Preference**: Automatically follows the user's system preference
- **Persistent Storage**: User preferences are saved in localStorage

### 🎨 Theme Options
1. **Light Mode**: Traditional light theme with white backgrounds
2. **Dark Mode**: Dark theme with gray backgrounds and light text
3. **System Default**: Automatically switches based on device settings

### 🔄 Automatic Switching
- Detects system color scheme preference
- Smooth transitions between themes
- Maintains user preference across sessions

## Implementation Details

### Core Components

#### 1. DarkModeContext (`src/contexts/DarkModeContext.jsx`)
- Manages dark mode state across the application
- Handles localStorage persistence
- Listens for system preference changes
- Provides `useDarkMode` hook for components

#### 2. DarkModeToggle (`src/components/DarkModeToggle.jsx`)
- Reusable toggle button component
- Supports different sizes (sm, md, lg)
- Shows sun/moon icons based on current state
- Accessible with proper ARIA labels

#### 3. DarkModeSettings (`src/components/DarkModeSettings.jsx`)
- Comprehensive settings panel
- Three theme options with visual indicators
- Detailed descriptions for each option
- Smooth animations and transitions

### Styling System

#### CSS Classes
- **Base Classes**: `dark:` prefix for dark mode variants
- **Component Classes**: Predefined classes for common components
- **Utility Classes**: Tailwind utilities with dark mode support

#### Color Palette
- **Backgrounds**: `bg-white` / `dark:bg-gray-900`
- **Surfaces**: `bg-gray-50` / `dark:bg-gray-800`
- **Text**: `text-gray-900` / `dark:text-gray-100`
- **Borders**: `border-gray-200` / `dark:border-gray-700`

### Updated Components

#### Navigation
- **Navbar**: Added dark mode toggle and updated styling
- **BottomNav**: Dark mode support for mobile navigation
- **Sidebar**: Updated with dark theme colors

#### Pages
- **Homepage**: Dark background support
- **Settings**: Comprehensive dark mode settings
- **Profile**: Dark theme for profile pages
- **Jet**: Updated with dark mode support

#### UI Elements
- **Modals**: Dark backdrop and content styling
- **Forms**: Input fields with dark mode support
- **Buttons**: Consistent styling across themes
- **Cards**: Dark backgrounds and borders

## Usage

### For Users
1. **Quick Toggle**: Click the sun/moon icon in the navigation bar
2. **Settings**: Go to Settings → Appearance to access detailed options
3. **System Default**: Choose "System Default" to follow device settings

### For Developers

#### Using the Dark Mode Hook
```jsx
import { useDarkMode } from '../contexts/DarkModeContext';

const MyComponent = () => {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useDarkMode();
  
  return (
    <div className={`bg-white dark:bg-gray-800 ${isDarkMode ? 'dark' : ''}`}>
      <button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>
  );
};
```

#### Adding Dark Mode to Components
```jsx
// Use dark: prefix for dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <h1 className="text-2xl font-bold">Title</h1>
  <p className="text-gray-600 dark:text-gray-300">Description</p>
</div>
```

#### Using Predefined Classes
```jsx
// Use the predefined classes from darkMode.css
<div className="card">
  <h2 className="text-lg font-semibold">Card Title</h2>
  <p>Card content</p>
</div>
```

## Technical Implementation

### Context Provider Setup
The `DarkModeProvider` is wrapped around the entire application in `App.jsx`:

```jsx
const App = () => (
  <DarkModeProvider>
    <AlertProvider>
      <AuthProvider>
        {/* Rest of the app */}
      </AuthProvider>
    </AlertProvider>
  </DarkModeProvider>
);
```

### CSS Import
Dark mode styles are imported in `index.css`:

```css
@import "tailwindcss";
@import "./styles/darkMode.css";
```

### localStorage Keys
- `darkMode`: Stores user preference (true/false/null for system)

### System Preference Detection
Uses `window.matchMedia('(prefers-color-scheme: dark)')` to detect system preference.

## Accessibility

### ARIA Labels
- Dark mode toggle includes proper ARIA labels
- Screen reader friendly descriptions
- Keyboard navigation support

### Color Contrast
- All dark mode colors meet WCAG contrast requirements
- High contrast ratios for readability
- Consistent color usage across components

## Browser Support

### Supported Browsers
- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

### Features
- CSS custom properties support
- localStorage support
- Media query support for system preference

## Future Enhancements

### Planned Features
1. **Custom Themes**: User-defined color schemes
2. **Auto-switching**: Time-based theme switching
3. **Animation Preferences**: Reduced motion support
4. **High Contrast Mode**: Enhanced accessibility

### Performance Optimizations
1. **CSS-in-JS**: Consider moving to CSS-in-JS for better performance
2. **Code Splitting**: Lazy load dark mode styles
3. **Caching**: Cache theme preferences for faster loading

## Troubleshooting

### Common Issues

#### Theme Not Persisting
- Check localStorage permissions
- Verify DarkModeProvider is properly wrapped
- Ensure context is not being reset

#### Styling Not Applied
- Verify `dark:` classes are used correctly
- Check if `darkMode.css` is imported
- Ensure Tailwind CSS is properly configured

#### System Preference Not Detected
- Check browser support for `prefers-color-scheme`
- Verify media query syntax
- Test with different system settings

### Debug Mode
Enable debug logging by adding to DarkModeContext:

```jsx
useEffect(() => {
  console.log('Dark mode changed:', isDarkMode);
}, [isDarkMode]);
```

## Contributing

When adding new components or updating existing ones:

1. **Always include dark mode variants**
2. **Use the predefined classes when possible**
3. **Test in both light and dark modes**
4. **Ensure accessibility compliance**
5. **Update this documentation**

## License

This dark mode implementation is part of the Zuum platform and follows the same licensing terms. 