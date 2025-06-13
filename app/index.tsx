import { Redirect } from 'expo-router';

export default function Index() {
  // For now, redirect to auth. In a real app, you'd check authentication state
  const isAuthenticated = false; // This would come from your auth context/state
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}