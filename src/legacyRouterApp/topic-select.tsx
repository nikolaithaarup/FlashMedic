// app/topic-select.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { getTopicsForSubject } from "@/src/data/helpers"; // adjust path

export default function TopicSelectScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams<{ subject: string }>();

  const topics = useMemo(
    () => getTopicsForSubject(subject),
    [subject]
  );

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const allSelected = selectedTopics.length === topics.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics);
    }
  };

  const startQuiz = () => {
    // If no topics selected → treat as “all topics”
    const topicsParam =
      selectedTopics.length > 0 ? selectedTopics.join(",") : "";

    router.push({
      pathname: "/quiz",
      params: {
        subject,
        topics: topicsParam,
      },
    });
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        {subject}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        Vælg et eller flere emner
      </Text>

      <Pressable
        onPress={toggleAll}
        style={{
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          marginBottom: 8,
        }}
      >
        <Text>
          {allSelected ? "Fravælg alle" : "Vælg alle emner"}
        </Text>
      </Pressable>

      <FlatList
        data={topics}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const selected = selectedTopics.includes(item);
          return (
            <Pressable
              onPress={() => toggleTopic(item)}
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                marginBottom: 6,
                backgroundColor: selected ? "#d0f0ff" : "white",
              }}
            >
              <Text>{item}</Text>
              {selected && <Text>✅</Text>}
            </Pressable>
          );
        }}
      />

      <Pressable
        onPress={startQuiz}
        style={{
          padding: 14,
          borderRadius: 10,
          backgroundColor: "#007AFF",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Start quiz
        </Text>
      </Pressable>
    </View>
  );
}
