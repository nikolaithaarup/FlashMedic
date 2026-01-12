import { useRouter } from "expo-router";
import { useWeeklyLock } from "../../src/features/weekly/useWeeklyLock";
import WeeklyHomeScreen from "../../src/features/weekly/WeeklyHomeScreen";

export default function WeeklyIndex() {
  const router = useRouter();
  const lock = useWeeklyLock();

  return (
    <WeeklyHomeScreen
      headingFont={40}
      subtitleFont={20}
      buttonFont={18}
      weeklyMcqLocked={lock.weeklyMcqLocked}
      weeklyMatchLocked={lock.weeklyMatchLocked}
      weeklyWordLocked={lock.weeklyWordLocked}
      onBackToHome={() => router.back()}
      onOpenMcq={() => router.push("/weekly/mcq")}
      onOpenMatch={() => router.push("/weekly/match")}
      onOpenWord={() => router.push("/weekly/word")}
    />
  );
}
