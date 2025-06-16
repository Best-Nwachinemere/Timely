
export const getGreeting = (name?: string | null): { title: string; subtitle: string } => {
  const hour = new Date().getHours();
  const displayName = name ? name.charAt(0).toUpperCase() + name.slice(1) : '';

  if (hour >= 5 && hour < 12) {
    return {
      title: `Good morning${displayName ? `, ${displayName}` : ''}!`,
      subtitle: "What's the plan for today? Let's get it organized."
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      title: `Good afternoon${displayName ? `, ${displayName}` : ''}!`,
      subtitle: "Keep the momentum going. You've got this."
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      title: `Good evening${displayName ? `, ${displayName}` : ''}.`,
      subtitle: "Time to wrap up the day or plan for tomorrow?"
    };
  }
  return {
    title: `Burning the midnight oil${displayName ? `, ${displayName}` : ''}?`,
    subtitle: "Late night focus session. Let's make it productive."
  };
};
