export const getNavigationOptions = (title, backgroundColor, color) => ({
  title,
  headerStyle: {
    backgroundColor,
  },
  headerTitleStyle: {
    color,
  },
  headerTintColor: color,
});
