// import { type Pool } from "pg";
// import format from "pg-format";
// import { GENRES } from "../src/config/constants";
// import { ParsedTrack } from "../src/types";

/*
export const helpers = {
  createGenres: async function (pool: Pool, genres: typeof GENRES) {
    await pool.query(
      format(
        `INSERT INTO genre (genre_id, name) VALUES %L;`,
        genres.map(({ id, name }) => [id, name]),
      ),
    );
  },

  createTrack: async function (pool: Pool, newTrack: ParsedTrack) {
    const { track_id: trackId } = (
      await pool.query<{ track_id: number }>(
        `INSERT INTO track (title, year, duration, file_path) 
         VALUES ($1, $2, $3, $4) 
         RETURNING track_id`,
        [newTrack.title, newTrack.year, newTrack.duration, newTrack.filePath],
      )
    ).rows[0];

    for (const genreName of newTrack.genres) {
      const genre = [].find((valid) => valid.name === genreName)!;

      if (!genre) throw new Error("Genre name is not supported");

      await pool.query(
        `INSERT INTO track_genre (track_id, genre_id) 
         VALUES ($1::integer, $2::integer) 
         ON CONFLICT DO NOTHING;`,
        [trackId, genre.id],
      );
    }

    for (const artist of newTrack.artists) {
      let artistId: number | null = null;

      const response = await pool.query<{ artist_id: number }>(
        `INSERT INTO artist (name) VALUES ($1) 
         ON CONFLICT DO NOTHING 
         RETURNING artist_id`,
        [artist],
      );
      if (response.rowCount !== 0) {
        artistId = response.rows[0].artist_id;
      } else {
        const response = await pool.query<{ artist_id: number }>(
          `SELECT artist_id FROM artist WHERE name = $1;`,
          [artist],
        );
        artistId = response.rows[0].artist_id;
      }

      await pool.query(
        `INSERT INTO track_artist (track_id, artist_id) 
         VALUES ($1::integer, $2::integer) 
         ON CONFLICT DO NOTHING`,
        [trackId, artistId],
      );
    }
  },
};
*/
