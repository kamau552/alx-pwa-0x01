import { MoviesProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", ["POST"]);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  try {
    const { year, page, genre } = request.body;
    const currentYear = new Date().getFullYear();

    // Build query parameters safely
    const query = new URLSearchParams({
      year: `${year || currentYear}`,
      sort: "year.decr",
      limit: "12",
      page: `${page}`,
    });

    if (genre) {
      query.append("genre", genre);
    }

    const url = `https://moviesdatabase.p.rapidapi.com/titles?${query.toString()}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.MOVIE_API_KEY!,
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    });

    if (!resp.ok) {
      const errorDetails = await resp.text();
      console.error("Failed to fetch movies. API response:", errorDetails);
      throw new Error("Failed to fetch movies");
    }

    const moviesResponse = await resp.json();
    const movies: MoviesProps[] = moviesResponse.results;

    return response.status(200).json({ movies });
  } catch (error) {
    console.error("API Route Error:", error);
    return response.status(500).json({ message: "Server error: Unable to fetch movies" });
  }
}
