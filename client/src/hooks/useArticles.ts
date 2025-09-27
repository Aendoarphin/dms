import supabase from "@/util/supabase";
import { useState, useEffect } from "react";

export interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  email: string;
  publish_date: string;
  tags: string[];
  content: string;
}
// Gets a list of all articles
export default function useArticles(refresh: boolean) {
  const [articles, setArticles] = useState<
    Article[] | null
  >(null);

  useEffect(() => {
    // Fetch the array of articles here
    async function fetchArticles() {
      try {
        const response = await supabase
          .from("articles")
          .select("*"); // returns Article[]
        setArticles(
          response.data?.map((article) => article) || []
        );
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
    fetchArticles();
  }, [refresh]);

  return articles;
}
