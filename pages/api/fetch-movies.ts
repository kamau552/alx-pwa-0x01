import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { page = 1, year, genre } = req.body;

    const query = new URLSearchParams({
      apikey: process.env.OMDB_API_KEY!,
      s: genre && genre !== "All" ? genre : "movie", // fallback search term
      y: year || "",
      page: `${page}`,
      type: "movie"
    });

    const url = `https://www.omdbapi.com/?${query.toString()}`;

    const resp = await fetch(url);
    const data = await resp.json();

    if (data.Response === "False") {
      return res.status(404).json({ movies: [], message: data.Error });
    }

    interface OmdbMovie {
      Title: string;
      Year: string;
      Poster: string;
      imdbID?: string;
      Type?: string;
      // Add other known OMDb fields here if needed
    }

    const movies = (data.Search as OmdbMovie[]).map((movie) => ({
      titleText: { text: movie.Title },
      primaryImage: { url: movie.Poster !== "N/A" ? movie.Poster : "/fallback.jpg" },
      releaseYear: { year: Number(movie.Year) },
    }));

    return res.status(200).json({ movies });

  } catch (error) {
    console.error("OMDb API error:", error);
    return res.status(500).json({ message: "Failed to fetch movies" });
  }
}
