// Stripe Card theme
const appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: 'Sohne, system-ui, sans-serif',
    fontWeightNormal: '500',
    borderRadius: '8px',
    colorBackground: 'rgb(173, 173, 173, 0)',
    colorPrimary: '#EFC078',
    accessibleColorOnColorPrimary: '#1A1B25',
    colorText: 'black',
    colorTextSecondary: 'black',
    colorTextPlaceholder: '#e2e2e2',
    tabIconColor: 'white',
    logoColor: 'dark',
    border: 'none',
  },
  rules: {
    '.Input': {
      backgroundColor: 'white',
      border: '1px solid var(--colorPrimary)'
    }
  }
};

export { appearance }